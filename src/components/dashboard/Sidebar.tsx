'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Usuarios',
      href: '/dashboard/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'Configuración',
      href: '/dashboard/settings',
      icon: <Settings className="h-5 w-5" />,
    }
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
      <div className="h-16 flex items-center px-6 border-b border-gray-700">
        <h1 className="text-xl font-semibold">FISCAMOTO</h1>
      </div>
      
      <nav className="flex-1 pt-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white",
                  pathname === item.href && "bg-gray-700 text-white"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-gray-300 hover:text-white w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}