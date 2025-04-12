import { NextResponse } from 'next/server';

export function middleware(req) {
  // Get the request headers
  const response = NextResponse.next();

  // Add CORS headers to all API responses
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', '*'); // In production, you'd want to restrict this
  response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  return response;
}

// Only apply this middleware to API routes
export const config = {
  matcher: '/api/:path*',
};