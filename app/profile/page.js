import { redirect } from "next/navigation";
import UserBadge from "@/components/UserBadge";
import { getCurrentProfile } from "@/lib/auth";
import { signOut } from "@/lib/actions";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  // Your row from users: id, name, title, image and role
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Profile</h1>
      <UserBadge user={profile} />
      <p>Email: {profile.mail}</p>
      <p>User id: {profile.id}</p>
      <form action={signOut} className="form">
        <button type="submit">Log out</button>
      </form>
    </main>
  );
}
