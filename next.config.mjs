/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'scontent.cdninstagram.com',
      'scontent-iad3-1.cdninstagram.com',
      'scontent-iad3-2.cdninstagram.com',
      'graph.instagram.com',
      'instagram.com'
    ],
  },
  allowedDevOrigins: ['*.ngrok-free.app'],
};

export default nextConfig;
