import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Sign up",
};

// A Server Action: "use server" makes it run on the server,
// even though the form in the browser calls it
async function signUp(formData) {
  "use server";

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  // options.data is saved as raw_user_meta_data on the user in auth.users.
  // The trigger in Supabase reads the name from there.
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });

  // Something went wrong: back to the form with ?error=true in the URL
  if (error) {
    redirect("/signup?error=true");
  }

  redirect("/profile");
}

export default async function SignUpPage({ searchParams }) {
  // ?error=true is set by signUp when Supabase says no
  const { error } = await searchParams;

  // Already logged in? Then there is nothing to do here
  const user = await getCurrentUser();

  if (user) {
    redirect("/profile");
  }

  return (
    <main>
      <h1>Sign up</h1>
      {error && (
        <p className="form-error" role="alert">
          Could not sign up. Maybe the email is already in use.
        </p>
      )}
      <form action={signUp} className="form">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Your name" autoComplete="name" required />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="At least 6 characters"
          autoComplete="new-password"
          minLength={6}
          required
        />

        <button type="submit">Sign up</button>
      </form>
      <p>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </main>
  );
}
