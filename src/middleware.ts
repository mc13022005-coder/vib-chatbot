import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Tạm thời bỏ qua Supabase auth để chạy được dự án
  // Khi có Supabase URL & Key thật, uncomment dòng dưới:
  // return await updateSession(request)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
