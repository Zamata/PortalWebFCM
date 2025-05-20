// src/app/_lib/types.ts
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  fiscalizadores: number;
  admins: number;
  // Agrega otros campos que devuelva tu API
}

export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  isActive?: boolean;
}

export interface ApiListResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}