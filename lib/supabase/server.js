import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// The Supabase client for the server: Server Components and Server Actions.
// It reads the session from the cookies in the request.
// Create a new client every time you need it – never share one between requests.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components can't write cookies.
            // That's fine, because proxy.js refreshes the session.
          }
        },
      },
    },
  );
}
