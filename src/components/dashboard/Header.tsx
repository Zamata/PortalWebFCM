'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { authState } = useAuth();
  const user = authState.user;

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Panel de Administración
        </h2>
        
        {user && (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
