import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Next.js runs proxy.js before every request that matches the matcher.
// Before Next.js 16 the file was called middleware.js.
// If the access token has expired, Supabase refreshes the session,
// and the new cookies are sent to both the page and the browser.
export async function proxy(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          // The page reads the new cookies from the request
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });

          // The browser saves the new cookies from the response
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );

          // A response with a session must never be cached and shown to someone else
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  // Don't write code between createServerClient and getClaims().
  // getClaims() is what refreshes the session when the access token has expired.
  await supabase.auth.getClaims();

  return response;
}

export const config = {
  matcher: [
    // Every path except static files and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
