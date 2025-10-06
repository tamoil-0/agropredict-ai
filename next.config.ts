/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ ignora errores de ESLint en el deploy
  },
};

export default nextConfig;
