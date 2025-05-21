import { api } from '@/lib/api';
import { LoginCredentials, LoginResponse, User } from '@/types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<User>('/auth/signin', {
        ...credentials,
        platform: 'web'
      });

      // Ya no necesitamos verificar cookies explícitamente
      // Las cookies serán manejadas automáticamente por el navegador
      if (!response.data.success) {
        return {
          success: false,
          message: response.data.message || 'Error en el inicio de sesión'
        };
      }

      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Error en login:', error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión'
      };
    }
  },

  logout: async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.post('/auth/signout');
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cerrar sesión'
      };
    }
  },

  getProfile: async (): Promise<{ success: boolean; data?: User; message?: string }> => {
    try {
      const response = await api.get<User>('/users/profile');

      if (!response.data.success) {
        return {
          success: false,
          message: response.data.message || 'Error al obtener perfil'
        };
      }

      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Error al obtener perfil:', error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener perfil'
      };
    }
  },

  verifyAuth: async (): Promise<{ isAuthenticated: boolean; user?: User }> => {
    try {
      const response = await api.get<User>('/users/profile');
      return {
        isAuthenticated: response.data.success,
        user: response.data.data
      };
    } catch (error) {
      return {
        isAuthenticated: false
      };
    }
  }
};