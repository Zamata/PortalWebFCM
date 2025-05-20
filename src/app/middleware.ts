import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedRoutes = ['/admin'];

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const authToken = request.cookies.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
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