import { createClient } from "@/lib/supabase/server";

// Returns the logged-in user, or null if no one is logged in.
// getClaims() checks the access token in the cookie, so it's safe to use on the server.
// The user's id is in user.sub, and the email is in user.email.
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  return data?.claims ?? null;
}
