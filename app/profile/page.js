import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/lib/actions";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  // A Server Component: the check runs on the server, before any HTML is sent
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
      <p>User id: {user.sub}</p>
      <form action={signOut} className="form">
        <button type="submit">Log out</button>
      </form>
    </main>
  );
}
