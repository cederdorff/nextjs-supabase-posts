"use server";

// "use server" at the top of the file: every exported function is a Server Action.
// signOut lives here, because both the profile page and AuthStatus use it.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/");
}
