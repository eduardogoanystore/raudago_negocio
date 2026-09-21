import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/negocio/login', '/negocio/registro', '/negocio/login-nip', '/negocio/aceptar-invitacion'];

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
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const hasValidToken = token && !isTokenExpired(token);

  // Autenticado visitando login/registro → redirigir al dispatcher
  if (hasValidToken && isPublic) {
    return NextResponse.redirect(new URL('/negocio/', request.url));
  }

  // No autenticado intentando acceder a ruta protegida
  if (!hasValidToken && !isPublic && pathname.startsWith('/negocio/')) {
    const accountId = request.cookies.get('business_account_id')?.value;
    if (accountId) {
      const nipUrl = new URL('/negocio/login-nip', request.url);
      nipUrl.searchParams.set('id', accountId);
      const response = NextResponse.redirect(nipUrl);
      response.cookies.delete('business_id');
      return response;
    }
    const loginUrl = new URL('/negocio/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('business_id');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/negocio/:path*'],
};
