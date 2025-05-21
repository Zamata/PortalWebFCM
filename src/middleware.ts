import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Rutas públicas
  const publicPaths = ['/login', '/api/auth'];
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Verificar autenticación para rutas protegidas
  if (!authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verificar token con el backend
    const verifyUrl = new URL('/api/users/profile', process.env.NEXT_PUBLIC_API_URL);
    const verifyRes = await fetch(verifyUrl.toString(), {
      headers: {
        'Cookie': `auth_token=${authToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!verifyRes.ok) {
      throw new Error('No autorizado');
    }

    const user = await verifyRes.json();

    // Verificar rol de administrador para rutas de admin
    if (pathname.startsWith('/dashboard') && !user.roles.includes('admin')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)',
  ],
};