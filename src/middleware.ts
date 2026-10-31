import { NextRequest, NextResponse } from 'next/server';

// Fast path only: sends visitors without a session cookie to /login while keeping the
// query (e.g. ?idea=...). Each page then verifies the cookie signature (and role) server-side.
export function middleware(req: NextRequest) {
  if (req.cookies.has('audira_session')) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.search = `?next=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/studio/:path*', '/admin/:path*'] };
