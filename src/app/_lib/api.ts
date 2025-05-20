// src/app/_lib/api.ts
interface ApiOptions {
  headers?: Record<string, string>;
  [key: string]: any;
}

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  // Agrega otros campos que siempre estén en tu respuesta API
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = {
  async get<T = any>(url: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
    const res = await fetch(`${API_URL}${url}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return handleResponse(res);
  },

  async post<T = any>(url: string, data: any, options: ApiOptions = {}): Promise<ApiResponse<T>> {
    const res = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(res);
  },

  async put<T = any>(url: string, data: any, options: ApiOptions = {}): Promise<ApiResponse<T>> {
    const res = await fetch(`${API_URL}${url}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(res);
  },

  async delete<T = any>(url: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
    const res = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return handleResponse(res);
  },
};

async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Error en la solicitud');
  }
  return res.json();
}