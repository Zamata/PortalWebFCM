import apiClient from '@/lib/api';

export const userService = {
  // Obtener estadísticas del dashboard
  getAdminDashboard: async () => {
    try {
      const response = await apiClient.get('/users/admin/dashboard');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error al obtener dashboard' };
    }
  },

  // Listar todos los usuarios
  listUsers: async () => {
    try {
      const response = await apiClient.get('/users/admin/users');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error al listar usuarios' };
    }
  },

  // Activar un usuario
  activateUser: async (userId: number) => {
    try {
      const response = await apiClient.put(`/users/admin/users/${userId}/activate`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error al activar usuario' };
    }
  },

  // Desactivar un usuario
  deactivateUser: async (userId: number) => {
    try {
      const response = await apiClient.put(`/users/admin/users/${userId}/deactivate`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error al desactivar usuario' };
    }
  },

  // Actualizar perfil
  updateProfile: async (data: { email?: string; currentPassword?: string; newPassword?: string }) => {
    try {
      const response = await apiClient.put('/users/profile', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error al actualizar perfil' };
    }
  }
};