'use server';

import { revalidatePath } from 'next/cache';
import { getServerClient } from '@/graphql/client';

// ─── Resuelve links cortos de Google Maps (maps.app.goo.gl) ──────────────────
// CORS bloquea esto en el browser — debe correr server-side
export async function resolveMapsShortLinkAction(
  shortUrl: string
): Promise<{ resolvedUrl: string } | { error: string }> {
  try {
    const res = await fetch(shortUrl, { method: 'HEAD', redirect: 'follow' });
    return { resolvedUrl: res.url };
  } catch {
    return { error: 'No se pudo resolver el link' };
  }
}

// ─── Calcula distancia por ruta real via Distance Matrix API ─────────────────
// CORS bloquea la Distance Matrix API desde el browser — corre server-side
export async function calcDrivingDistanceAction(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<{ km: number } | { error: string }> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return { error: 'API key no configurada' };
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&key=${key}&language=es`
    );
    const data = await res.json();
    const element = data?.rows?.[0]?.elements?.[0];
    if (element?.status === 'OK' && element?.distance?.value) {
      const km = Math.round((element.distance.value / 1000) * 10) / 10;
      return { km };
    }
    return { error: element?.status ?? data?.status ?? 'UNKNOWN' };
  } catch {
    return { error: 'NETWORK_ERROR' };
  }
}

const CREATE_DELIVERY_ORDER = `
  mutation createDeliveryOrder($input: DeliveryOrderInput!) {
    createDeliveryOrder(input: $input) {
      id
      order_number
    }
  }
`;

export interface CreateOrderActionState {
  error?: string;
  redirectTo?: string;
}

export async function createOrderAction(
  negocio_slug: string,
  _prevState: CreateOrderActionState | null,
  formData: FormData
): Promise<CreateOrderActionState> {
  const recipient_name = (formData.get('recipient_name') as string)?.trim();
  const recipient_phone = (formData.get('recipient_phone') as string)?.trim();
  const recipient_address = (formData.get('recipient_address') as string)?.trim();
  const distance_km_raw = formData.get('distance_km') as string;
  const product_payment_method = (formData.get('product_payment_method') as string) || 'cash';
  const product_amount_raw = formData.get('product_amount') as string;
  const notes_raw = (formData.get('notes') as string)?.trim();
  const shipping_paid_by = (formData.get('shipping_paid_by') as string) || 'client';
  const recipient_lat_raw = formData.get('recipient_lat') as string;
  const recipient_lng_raw = formData.get('recipient_lng') as string;
  const branch_id_raw = (formData.get('branch_id') as string) || undefined;

  if (!recipient_name || !recipient_phone || !recipient_address) {
    return { error: 'Los datos del destinatario son obligatorios.' };
  }

  const distance_km = parseFloat(distance_km_raw);
  if (!distance_km_raw || isNaN(distance_km) || distance_km <= 0) {
    return { error: 'Ingresa una distancia válida mayor a 0 km.' };
  }

  const product_amount =
    product_amount_raw && product_amount_raw.trim() !== ''
      ? parseFloat(product_amount_raw)
      : undefined;

  if (product_amount !== undefined && (isNaN(product_amount) || product_amount < 0)) {
    return { error: 'El monto del producto debe ser un número positivo.' };
  }

  const input: Record<string, unknown> = {
    recipient_name,
    recipient_phone,
    recipient_address,
    distance_km,
    shipping_paid_by,
    product_payment_method,
  };

  if (product_amount !== undefined) {
    input.product_amount = product_amount;
  }

  if (notes_raw) {
    input.notes = notes_raw;
  }

  if (recipient_lat_raw && recipient_lat_raw.trim() !== '') {
    const recipient_lat = parseFloat(recipient_lat_raw);
    if (!isNaN(recipient_lat)) input.recipient_lat = recipient_lat;
  }

  if (recipient_lng_raw && recipient_lng_raw.trim() !== '') {
    const recipient_lng = parseFloat(recipient_lng_raw);
    if (!isNaN(recipient_lng)) input.recipient_lng = recipient_lng;
  }

  if (branch_id_raw && branch_id_raw.trim() !== '') {
    input.branch_id = branch_id_raw.trim();
  }

  let client;
  try {
    client = await getServerClient();
  } catch {
    return { error: 'Error al conectar con el servidor. Intenta de nuevo.' };
  }

  try {
    await client.request<{ createDeliveryOrder: { id: string; order_number: string } }>(
      CREATE_DELIVERY_ORDER,
      { input }
    );
  } catch (err: unknown) {
    const gqlErr = err as { response?: { errors?: { message: string }[] } };
    const raw = gqlErr?.response?.errors?.[0]?.message ?? '';

    if (raw.includes('facturación') || raw.includes('SUBSCRIPTION')) {
      return { error: 'Tu suscripción tiene un problema. Revisa la configuración de tu cuenta.' };
    }
    if (raw.includes('LIMIT_EXCEEDED')) {
      return { error: 'Has alcanzado el límite de pedidos de tu plan.' };
    }
    if (raw.includes('FEATURE_NOT_AVAILABLE')) {
      return { error: 'Esta función no está disponible en tu plan actual.' };
    }

    return {
      error: raw || 'No se pudo crear el pedido. Intenta de nuevo.',
    };
  }

  return { redirectTo: `/${negocio_slug}/pedidos` };
}

const CONFIRM_PRODUCT_PAYMENT = `
  mutation ConfirmProductPayment($order_id: ID!) {
    confirmProductPayment(order_id: $order_id) {
      id
      product_payment_status
    }
  }
`;

export interface ConfirmTransferActionResult {
  error?: string;
}

export async function confirmTransferAction(
  orderId: string,
  negocio_slug: string
): Promise<ConfirmTransferActionResult> {
  let client;
  try {
    client = await getServerClient();
  } catch {
    return { error: 'Error al conectar con el servidor. Intenta de nuevo.' };
  }

  try {
    await client.request<{ confirmProductPayment: { id: string; product_payment_status: string } }>(
      CONFIRM_PRODUCT_PAYMENT,
      { order_id: orderId }
    );
  } catch (err: unknown) {
    const gqlErr = err as { response?: { errors?: { message: string }[] } };
    const raw = gqlErr?.response?.errors?.[0]?.message ?? '';

    if (raw.includes('no confirmado') || raw.includes('ya fue confirmado')) {
      return { error: 'El pago ya fue confirmado anteriormente.' };
    }
    if (raw.includes('transferencia')) {
      return { error: 'Este pedido no usa pago por transferencia.' };
    }
    if (raw.includes('Acceso denegado')) {
      return { error: 'No tienes permiso para confirmar este pago.' };
    }

    return { error: raw || 'No se pudo confirmar el pago. Intenta de nuevo.' };
  }

  revalidatePath(`/${negocio_slug}/pedidos`);
  return {};
}
