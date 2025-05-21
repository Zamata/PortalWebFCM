import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth_token')?.value;
  const protectedRoutes = ['/admin'];

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    

    if (!authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

    try {
      // Verificar el token con el backend
      const verifyUrl = new URL('/api/users/profile', process.env.NEXT_PUBLIC_API_URL);
      const verifyRes = await fetch(verifyUrl, {
        headers: { 'Cookie': `auth_token=${authToken}` },
        credentials: 'include'
      });

      if (!verifyRes.ok) {
        throw new Error('Token inválido');
      }

      const user = await verifyRes.json();
      
      if (!user.roles.includes('admin')) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)',
  ],
};