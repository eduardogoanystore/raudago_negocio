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
const AUTH_ONLY_PATHS = [
  '/login',
  '/registro',
  '/login-nip',
  '/aceptar-invitacion',
];

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
  const token = request.cookies.get('businessToken')?.value;
  const hasValidToken = token && !isTokenExpired(token);

  const isAuthOnly = AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p));
  const isOpen = OPEN_PATHS.some((p) => pathname.startsWith(p));
  const isPublic = isAuthOnly || isOpen;

  // Rutas abiertas: pasar siempre
  if (isOpen) return NextResponse.next();

  // Autenticado visitando login/registro → redirigir al dispatcher
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
