/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'scontent.cdninstagram.com',
      'scontent-iad3-1.cdninstagram.com',
      'scontent-iad3-2.cdninstagram.com',
      'graph.instagram.com',
      'instagram.com',
      'scontent.xx.fbcdn.net',
      'graph.facebook.com',
      'platform-lookaside.fbsbx.com',
      'cdninstagram.com'
    ],
  },
  allowedDevOrigins: ['*.ngrok-free.app', '*.vercel.app'],
  redirects: [
    { "source": "http://instagram-integration-three.vercel.app/:path*", "destination": "https://instagram-integration-three.vercel.app/:path*", "permanent": true }
  ]
};

export default nextConfig;
