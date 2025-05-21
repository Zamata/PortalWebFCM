'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { authState } = useAuth();
  const router = useRouter();

  // Cargar usuario si no está cargado ya
  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      router.push('/login');
    }
  }, [authState.isAuthenticated, authState.isLoading, router]);

  // Verificar rol de administrador
  useEffect(() => {
    if (authState.user && !authState.user.roles.some(role => role.name === 'admin')) {
      // Si no es admin, redirigir a una página de acceso denegado
      router.push('/access-denied');
    }
  }, [authState.user, router]);

  if (authState.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}