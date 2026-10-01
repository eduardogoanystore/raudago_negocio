import { NextRequest, NextResponse } from 'next/server';

// Slugs reservados que NO corresponden a un portal de negocio
const RESERVED_SLUGS = new Set([
  'login',
  'login-nip',
  'registro',
  'aceptar-invitacion',
  'exito',
  'planes',
  'verificar-email',
  'verificar-email-negocio',
  'repartidores',
  'terminos',
  'privacidad',
  'cancelacion',
  'codigo-conducta',
  'api',
  '_next',
]);

// Rutas solo para no autenticados: si hay sesión válida se redirige al dispatcher
// Nota: /registro/sucursal y /registro/plan son continuación del onboarding (accesibles con token)
const AUTH_ONLY_PATHS = [
  '/login',
  '/login-nip',
  '/aceptar-invitacion',
];

// Exactas: solo /registro exacto bloquea si ya hay sesión
const AUTH_ONLY_EXACT = ['/registro'];

// Rutas públicas para cualquiera (con o sin sesión): no se redirige
const OPEN_PATHS = [
  '/exito',
  '/planes',
  '/verificar-email',
  '/verificar-email-negocio',
];

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return !payload.exp || payload.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') ?? '';
  const isPortalDomain = hostname.startsWith('negocio.') || hostname.startsWith('negocios.');
  const token = request.cookies.get('businessToken')?.value;
  const hasValidToken = token && !isTokenExpired(token);

  const isAuthOnly =
    AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p)) ||
    AUTH_ONLY_EXACT.some((p) => pathname === p);
  const isOpen = OPEN_PATHS.some((p) => pathname.startsWith(p));

  // En dominio del portal (negocio.raudago.com):
  // / sin token → redirect a /login
  // / con token → dejar pasar (dispatcher buscará el slug)
  if (isPortalDomain && pathname === '/') {
    if (!hasValidToken) {
      const accountId = request.cookies.get('business_account_id')?.value;
      if (accountId) {
        const nipUrl = new URL('/login-nip', request.url);
        nipUrl.searchParams.set('id', accountId);
        return NextResponse.redirect(nipUrl);
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Rutas abiertas: pasar siempre
  if (isOpen) return NextResponse.next();

  // Autenticado visitando /registro exacto → continuar donde se quedó en el onboarding
  if (hasValidToken && AUTH_ONLY_EXACT.some((p) => pathname === p)) {
    const step = request.cookies.get('onboarding_step')?.value;
    if (step === 'sucursal') {
      const dest = new URL('/registro/sucursal', request.url);
      // Preservar plan/interval si vienen del landing
      request.nextUrl.searchParams.forEach((v, k) => dest.searchParams.set(k, v));
      return NextResponse.redirect(dest);
    }
    if (step === 'plan') {
      const dest = new URL('/registro/plan', request.url);
      request.nextUrl.searchParams.forEach((v, k) => dest.searchParams.set(k, v));
      return NextResponse.redirect(dest);
    }
    // Sin step pendiente → ya completó onboarding, ir al portal
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Autenticado visitando login → redirigir al dispatcher
  if (hasValidToken && isAuthOnly) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // No autenticado intentando acceder a ruta protegida de auth
  if (!hasValidToken && isAuthOnly) {
    return NextResponse.next();
  }

  // Ruta dinámica de negocio: /:slug donde slug NO está reservado
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length >= 1 && !RESERVED_SLUGS.has(segments[0])) {
    // Es un portal de negocio — requiere auth
    if (!hasValidToken) {
      const accountId = request.cookies.get('business_account_id')?.value;
      if (accountId) {
        const nipUrl = new URL('/login-nip', request.url);
        nipUrl.searchParams.set('id', accountId);
        const response = NextResponse.redirect(nipUrl);
        response.cookies.delete('business_id');
        return response;
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('business_id');
      return response;
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
