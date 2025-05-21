import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../types/auth';

// Configuración base de axios
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor de solicitudes
apiClient.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

// Interceptor de respuestas
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';
    
    if (!isLoginPage) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const redirectUrl = error.response.status === 401
            ? `/login?redirect=${encodeURIComponent(currentPath)}`
            : '/login?error=unauthorized';
            
          window.location.href = redirectUrl;
        }
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return apiClient.get<ApiResponse<T>>(url, config);
  },

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return apiClient.post<ApiResponse<T>>(url, data, config);
  },

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return apiClient.put<ApiResponse<T>>(url, data, config);
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return apiClient.delete<ApiResponse<T>>(url, config);
  },
};

export default apiClient;