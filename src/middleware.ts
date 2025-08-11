import { NextRequest, NextResponse } from 'next/server';

// Rotas públicas (não exigem autenticação)
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/calculator',
  '/favicon.ico',
  '/_next',
  '/api',
  '/manifest.json',
  '/robots.txt',
];

// Email do admin autorizado
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@exemplo.com';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permitir acesso a rotas públicas
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Verifica se o usuário está autenticado (cookie simples)
  const authCookie = req.cookies.get('upsure_auth');
  if (!authCookie) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // (Opcional) Validar o valor do cookie (ex: JWT, email, etc)
  // Aqui, apenas verifica se o valor é igual ao email do admin
  if (authCookie.value !== ADMIN_EMAIL) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/bet-paste', '/history', '/new-bet'],
};
