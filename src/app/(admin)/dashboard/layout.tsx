'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../_components/AuthProvider';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
    
    if (!loading && user && !user.roles?.includes('admin')) {
      router.push('/unauthorized');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="admin-layout">
      <nav>{/* Tu barra de navegación admin aquí */}</nav>
      <main>{children}</main>
    </div>
  );
}