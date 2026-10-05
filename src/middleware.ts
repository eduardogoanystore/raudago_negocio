import { NextRequest, NextResponse } from 'next/server';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return !payload.exp || payload.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

function portalHost(requestHost: string): string {
  // localhost:XXXX  →  negocio.localhost:XXXX
  // raudago.com     →  negocio.raudago.com
  if (requestHost.startsWith('localhost') || requestHost.match(/^127\.0\.0\.1/)) {
    return `negocio.${requestHost}`;
  }
  const base = requestHost.replace(/^www\./, '');
  return `negocio.${base}`;
}

function rootHost(requestHost: string): string {
  // negocio.localhost:XXXX  →  localhost:XXXX
  // negocio.raudago.com     →  raudago.com
  return requestHost.replace(/^negocio\./, '').replace(/^negocios\./, '');
}

// ─── Rutas públicas (solo dominio raíz) ───────────────────────────────────────

const PUBLIC_PATHS = [
  '/',
  '/terminos',
  '/privacidad',
  '/cancelacion',
  '/codigo-conducta',
  '/politicas-internas',
  '/repartidores',
];

function isPublicPath(pathname: string): boolean {
  if (pathname === '/') return true;
  return PUBLIC_PATHS.some((p) => p !== '/' && pathname.startsWith(p));
}

// ─── Rutas del portal (solo subdominio negocio.) ──────────────────────────────

// Rutas que no requieren auth en el portal
const PORTAL_AUTH_FREE = [
  '/login',
  '/login-nip',
  '/registro',
  '/aceptar-invitacion',
  '/exito',
  '/planes',
  '/verificar-email',
  '/verificar-email-negocio',
];

function isPortalAuthFree(pathname: string): boolean {
  return PORTAL_AUTH_FREE.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

// Slugs reservados (no son portales de negocio)
const RESERVED_SLUGS = new Set([
  'login', 'login-nip', 'registro', 'aceptar-invitacion', 'exito',
  'planes', 'verificar-email', 'verificar-email-negocio', 'repartidores',
  'terminos', 'privacidad', 'cancelacion', 'codigo-conducta',
  'politicas-internas', 'api', '_next',
]);

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') ?? '';
  const isPortalDomain = host.startsWith('negocio.') || host.startsWith('negocios.');
  const token = request.cookies.get('businessToken')?.value;
  const hasValidToken = !!token && !isTokenExpired(token);
  console.log(`[MW] ${host} ${pathname} | token=${token ? 'yes' : 'NO'} valid=${hasValidToken}`);

  // ── Dominio raíz ────────────────────────────────────────────────────────────
  if (!isPortalDomain) {
    // Ruta pública → pasar
    if (isPublicPath(pathname)) return NextResponse.next();

    // Cualquier ruta no pública en el dominio raíz → redirect al portal
    const dest = new URL(request.url);
    dest.host = portalHost(host);
    return NextResponse.redirect(dest);
  }

  // ── Subdominio portal (negocio.*) ────────────────────────────────────────────

  // Rutas públicas del landing que lleguen al portal → redirect al dominio raíz
  if (isPublicPath(pathname) && pathname !== '/') {
    const dest = new URL(request.url);
    dest.host = rootHost(host);
    return NextResponse.redirect(dest);
  }

  // Rutas sin auth requerida → pasar siempre
  if (isPortalAuthFree(pathname)) {
    // Autenticado visitando login → dispatcher
    // /login-nip is allowed even with a valid token — it doubles as the lock screen
    if (hasValidToken && (pathname === '/login' || pathname === '/aceptar-invitacion')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Autenticado visitando /registro exacto → retomar onboarding
    if (hasValidToken && pathname === '/registro') {
      const step = request.cookies.get('onboarding_step')?.value;
      if (step === 'sucursal') {
        const dest = new URL('/registro/sucursal', request.url);
        request.nextUrl.searchParams.forEach((v, k) => dest.searchParams.set(k, v));
        return NextResponse.redirect(dest);
      }
      if (step === 'plan') {
        const dest = new URL('/registro/plan', request.url);
        request.nextUrl.searchParams.forEach((v, k) => dest.searchParams.set(k, v));
        return NextResponse.redirect(dest);
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  // / en portal → dispatcher (requiere auth)
  if (pathname === '/') {
    if (!hasValidToken) {
      const accountId = request.cookies.get('business_account_id')?.value;
      if (accountId) {
        const nipUrl = new URL('/login-nip', request.url);
        nipUrl.searchParams.set('id', accountId);
        return NextResponse.redirect(nipUrl);
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Redirigir directo al slug si está en cookie
    const slug = request.cookies.get('business_slug')?.value;
    if (slug) {
      return NextResponse.redirect(new URL(`/${slug}/`, request.url));
    }
    // Sin slug en cookie → dispatcher se encarga (app/(auth)/page.tsx)
    return NextResponse.next();
  }

  // Rutas de portal de negocio /:slug/... → requieren auth
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length >= 1 && !RESERVED_SLUGS.has(segments[0])) {
    if (!hasValidToken) {
      const accountId = request.cookies.get('business_account_id')?.value;
      if (accountId) {
        const nipUrl = new URL('/login-nip', request.url);
        nipUrl.searchParams.set('id', accountId);
        const res = NextResponse.redirect(nipUrl);
        res.cookies.delete('business_id');
        return res;
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete('business_id');
      return res;
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|images/|api|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.ico|.*\\.webp).*)',
  ],
};
