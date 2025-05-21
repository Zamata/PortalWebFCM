import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
        has: [
          {
            type: 'header',
            key: 'cookie',
            value: '(?<cookie>.*)'
          }
        ]
      },
      {
        source: '/admin/dashboard',
        destination: '/dashboard'
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',  // Aplica a todas las rutas
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: frontendUrl
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cookie'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
