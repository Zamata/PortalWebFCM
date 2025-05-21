export interface Role {
  id: number;
  name: 'admin' | 'fiscalizador';
  description: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
  lastLogin?: string;
  lastLoginIp?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data?: User;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  fiscalizadores: number;
  admins: number;
}