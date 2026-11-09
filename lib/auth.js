import { createClient } from "@/lib/supabase/server";

// Returns the logged-in user, or null if no one is logged in.
// getClaims() checks the access token in the cookie, so it's safe to use on the server.
// The user's id is in user.sub, and the email is in user.email.
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  return data?.claims ?? null;
}

// Returns the logged-in user's row from the users table, or null if no one is logged in.
// The row has the same id as the login, so we find it with user.sub.
export async function getCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase.from("users").select("*").eq("id", user.sub).maybeSingle();

  // Logged in, but no row in users: the row was not created at sign up
  if (!data) {
    throw new Error(`No row in users with id ${user.sub}. Run supabase/setup.sql again.`);
  }

  return data;
}
