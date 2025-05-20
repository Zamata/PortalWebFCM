'use client';
import { useAuth } from '../../_components/AuthProvider';
import { api } from '../../_lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardStats } from '../../_lib/types'; // Importa la interfaz

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null); // Especifica el tipo
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const loadStats = async () => {
      try {
        const response = await api.get('/api/users/admin/dashboard');
        setStats(response.data); // Asegúrate que response.data coincide con DashboardStats
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Error al cargar el dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user, router]);

  if (!user) return null;
  if (loading) return <div>Cargando dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return <div>No hay datos disponibles</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Administrador</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Usuarios Totales</h3>
          <p className="text-3xl">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Usuarios Activos</h3>
          <p className="text-3xl">{stats.activeUsers}</p>
        </div>
        {/* Agrega más estadísticas según tu API */}
      </div>
    </div>
  );
}