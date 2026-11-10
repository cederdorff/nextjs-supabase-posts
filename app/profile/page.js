import { redirect } from "next/navigation";
import UserBadge from "@/components/UserBadge";
import { getCurrentProfile } from "@/lib/auth";
import { signOut } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Profile",
};

async function updateProfile(formData) {
  "use server";

  // A Server Action is its own request, so we check the user again
  const currentUser = await getCurrentProfile();

  if (!currentUser) {
    redirect("/login");
  }

  // .eq("id", currentUser.id): only your own row – never an id from the form
  // In Post App: fetch(`${url}/users?id=eq.${currentUser.id}`, { method: "PATCH", body: JSON.stringify(user) })
  const supabase = await createClient();
  await supabase
    .from("users")
    .update({
      name: formData.get("name").trim(),
      title: formData.get("title").trim(),
      image: formData.get("image").trim(),
    })
    .eq("id", currentUser.id);

  redirect("/profile");
}

export default async function ProfilePage() {
  // Your row from users: name, title, image and role
  const currentUser = await getCurrentProfile();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Profile</h1>
      <UserBadge user={currentUser} />

      <form action={updateProfile} className="form">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" defaultValue={currentUser.name} required />

        <label htmlFor="title">Title</label>
        <input id="title" name="title" placeholder="Student" defaultValue={currentUser.title ?? ""} />

        <label htmlFor="image">Image URL</label>
        <input id="image" name="image" type="url" placeholder="https://..." defaultValue={currentUser.image ?? ""} />

        <button type="submit">Save</button>
      </form>

      <p>Email: {currentUser.mail}</p>
      <p>User id: {currentUser.id}</p>
      <form action={signOut} className="form">
        <button type="submit">Log out</button>
      </form>
    </main>
  );
}
