import { forbidden, redirect, unauthorized } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";
import UserBadge from "@/components/UserBadge";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

export const metadata = {
  title: "Admin",
};

async function deletePost(formData) {
  "use server";

  const profile = await getCurrentProfile();

  if (profile?.role !== "admin") {
    forbidden();
  }

  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", formData.get("id"));

  redirect("/admin");
}

export default async function AdminPage() {
  const profile = await getCurrentProfile();

  // Not logged in: 401 and unauthorized.js
  if (!profile) {
    unauthorized();
  }

  // Logged in, but not admin: 403 and forbidden.js
  if (profile.role !== "admin") {
    forbidden();
  }

  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*, user:users(name, title, image)")
    .order("created_at", { ascending: false });

  return (
    <main>
      <h1>Admin</h1>
      <p>All {posts.length} posts. As admin you can delete any of them.</p>
      <ul className={styles.list}>
        {posts.map((post) => (
          <li key={post.id} className={styles.item}>
            <UserBadge user={post.user} />
            <p className={styles.caption}>{post.caption}</p>
            <form action={deletePost}>
              <input type="hidden" name="id" value={post.id} />
              <DeleteButton />
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
