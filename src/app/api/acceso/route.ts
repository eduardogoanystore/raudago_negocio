import { NextRequest, NextResponse } from 'next/server';

// ─── Rate limit en memoria (por proceso) ─────────────────────────────────────
// Suficiente para el volumen actual. Si escala a múltiples instancias, migrar a Redis.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hora

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ─── Mapeo ref → Canal de origen ─────────────────────────────────────────────
const REF_MAP: [string[], string][] = [
  [['estado-whatsapp'], 'Estado de WhatsApp'],
  [['whatsapp'], 'WhatsApp'],
  [['volante', 'puerta', 'visita'], 'Venta directa'],
  [['referido'], 'Referido'],
  [['grupo'], 'Grupos FB/WhatsApp'],
  [['meta', 'fb-ads'], 'Meta Ads'],
  [['ig', 'instagram', 'tiktok'], 'Instagram/TikTok'],
  [['plaza', 'alianza'], 'Partnership'],
  [['evento'], 'Evento'],
];

function mapRefToCanal(ref: string): string {
  const lower = ref.toLowerCase();
  for (const [prefixes, canal] of REF_MAP) {
    if (prefixes.some((p) => lower.startsWith(p))) return canal;
  }
  return 'Otro';
}

// ─── Normalizar teléfono ──────────────────────────────────────────────────────
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+52${digits}`;
  if (digits.length === 12 && digits.startsWith('52')) return `+${digits}`;
  return null;
}

// ─── POST /api/acceso ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Espera un momento e inténtalo de nuevo.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
  }

  // ── Honeypot ────────────────────────────────────────────────────────────────
  if (body.website) {
    // Bot detectado — responder ok sin guardar nada
    return NextResponse.json({ ok: true });
  }

  // ── Validación ──────────────────────────────────────────────────────────────
  const nombre = String(body.nombre ?? '').trim();
  const giro = String(body.giro ?? '').trim();
  const telefonoRaw = String(body.telefono ?? '').trim();
  const zona = String(body.zona ?? '').trim();
  const pedidosRaw = body.pedidos;
  const comoEntrega = String(body.comoEntrega ?? '').trim().slice(0, 500);
  const ref = String(body.ref ?? 'directo').trim().slice(0, 100) || 'directo';

  const errors: string[] = [];
  if (!nombre) errors.push('Nombre del negocio requerido.');
  if (!giro) errors.push('Giro requerido.');
  if (!zona) errors.push('Colonia o zona requerida.');

  const telefono = normalizePhone(telefonoRaw);
  if (!telefono) errors.push('Teléfono inválido. Ingresa 10 dígitos mexicanos.');

  const pedidos = Number(pedidosRaw);
  if (!Number.isInteger(pedidos) || pedidos < 0) {
    errors.push('Pedidos al día debe ser un número entero mayor o igual a 0.');
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(' ') }, { status: 422 });
  }

  // ── Notion ──────────────────────────────────────────────────────────────────
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  if (!NOTION_TOKEN) {
    console.error('[acceso] NOTION_TOKEN no configurado');
    return NextResponse.json(
      { error: 'Error de configuración del servidor.' },
      { status: 500 }
    );
  }

  const canal = mapRefToCanal(ref);

  const notionBody = {
    parent: { database_id: '0291e239e45d4d58af863336eb25d614' },
    properties: {
      'Nombre': {
        title: [{ text: { content: nombre } }],
      },
      'Giro del negocio': {
        rich_text: [{ text: { content: giro } }],
      },
      'Teléfono': {
        phone_number: telefono,
      },
      'Zona': {
        rich_text: [{ text: { content: zona } }],
      },
      'Pedidos al día': {
        number: pedidos,
      },
      ...(comoEntrega
        ? { '¿Cómo haces hoy tus entregas?': { rich_text: [{ text: { content: comoEntrega } }] } }
        : {}),
      'Nivel': {
        select: { name: '3 · Solicitó acceso' },
      },
      'Audiencia': {
        select: { name: 'Negocio RaudaGo' },
      },
      'Cohorte': {
        select: { name: 'Lista de espera' },
      },
      'Venture': {
        relation: [{ id: '3f73e0a8-451b-81f7-a080-f066c35c6aab' }],
      },
      'Ref': {
        rich_text: [{ text: { content: ref } }],
      },
      'Canal de origen': {
        select: { name: canal },
      },
    },
  };

  try {
    const notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify(notionBody),
    });

    if (!notionRes.ok) {
      const errText = await notionRes.text();
      console.error('[acceso] Notion error:', notionRes.status, errText);
      return NextResponse.json(
        { error: 'No pudimos guardar tu registro. Intenta de nuevo.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[acceso] fetch error:', err);
    return NextResponse.json(
      { error: 'Error de conexión. Intenta de nuevo.' },
      { status: 502 }
    );
  }
}
