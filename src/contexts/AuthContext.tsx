'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/authService';
import { AuthState, User } from '@/types/auth';

interface AuthContextType {
  authState: AuthState;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  const router = useRouter();
  const pathname = usePathname();

  const refreshAuth = useCallback(async () => {
    if (pathname === '/login') {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { success, data: user, message } = await authService.getProfile();
      
      if (success && user) {
        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: message || 'Error de autenticación',
        });
        if (pathname !== '/login') {
          router.push('/login');
        }
      }
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: 'Error al verificar autenticación',
      });
      if (pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [pathname, router]);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = async (credentials: { username: string; password: string }) => {
    console.log('Iniciando proceso de login...');
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { success, data: user, message } = await authService.login(credentials);
      console.log('Resultado del login:', { success, user: user ? 'Usuario recibido' : 'No hay usuario', message });
      
      if (success && user) {
        // Intentar obtener el perfil inmediatamente después del login
        try {
          const profileResult = await authService.getProfile();
          console.log('Resultado del perfil después del login:', profileResult);
          
          if (profileResult.success && profileResult.data) {
            setAuthState({
              isAuthenticated: true,
              user: profileResult.data,
              isLoading: false,
              error: null,
            });
            
            // Esperar un momento para asegurar que las cookies se establezcan
            console.log('Redirigiendo a dashboard...');
            setTimeout(() => {
              router.push('/admin/dashboard');
            }, 500);
          } else {
            throw new Error(profileResult.message || 'Error al obtener perfil después del login');
          }
        } catch (profileError: any) {
          console.error('Error al obtener perfil después del login:', profileError);
          throw new Error('Error al verificar la sesión');
        }
      } else {
        console.error('Login fallido:', message);
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: message || 'Credenciales inválidas',
        }));
      }
    } catch (error: any) {
      console.error('Error en el proceso de login:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error.message || 'Error al iniciar sesión',
      });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
      router.push('/login');
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Error al cerrar sesión',
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};