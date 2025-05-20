'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '../../_lib/api';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await api.post('/api/auth/signin', {
        username: credentials.username,
        password: credentials.password,
        platform: 'web' // Asegúrate de incluir esto
      });

      console.log('Login response:', response); // Para depuración
      
      if (response.success) {
        router.push('/admin/dashboard');
      } else {
        setError(response.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Usuario:</label>
          <input
            className="w-full p-2 border rounded"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}