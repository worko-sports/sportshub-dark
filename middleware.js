import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Simple in-memory rate limiter (Note: This resets on server restart/redeploy)
// For production, use Redis (e.g., Vercel KV or Upstash)
const rateLimitMap = new Map();

export async function middleware(req) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const limit = 100; // Limit to 100 requests per minute
  const windowMs = 60 * 1000;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 0, lastReset: Date.now() });
  }

  const ipData = rateLimitMap.get(ip);

  if (Date.now() - ipData.lastReset > windowMs) {
    ipData.count = 0;
    ipData.lastReset = Date.now();
  }

  if (ipData.count >= limit) {
    return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  ipData.count += 1;

  const res = NextResponse.next();

  // Add security headers
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://lumberjack-cx.razorpay.com https://api.razorpay.com;"
  );

  // Protected Routes Logic
  const protectedPaths = ['/host'];
  const path = req.nextUrl.pathname;

  if (protectedPaths.some((prefix) => path.startsWith(prefix))) {
    const token = req.cookies.get('token')?.value;
    const nextAuthToken = req.cookies.get('next-auth.session-token')?.value || req.cookies.get('__Secure-next-auth.session-token')?.value;

    if (!token && !nextAuthToken) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Optional: Verify JWT if using custom token
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
        await jwtVerify(token, secret);
      } catch (err) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
