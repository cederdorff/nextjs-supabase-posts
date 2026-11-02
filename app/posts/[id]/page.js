import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";
import UserBadge from "@/components/UserBadge";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

export default async function PostDetailPage({ params }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*, user:users(name, title, image)")
    .eq("id", id)
    .maybeSingle();

  // No post with that id: show not-found.js
  if (!post) {
    notFound();
  }

  // Is the logged-in user the one who wrote the post?
  const user = await getCurrentUser();
  const isOwner = user?.sub === post.user_id;

  async function deletePost() {
    "use server";

    // Hiding the button is not enough – the Server Action checks again
    const user = await getCurrentUser();

    if (user?.sub !== post.user_id) {
      redirect(`/posts/${id}`);
    }

    const supabase = await createClient();
    await supabase.from("posts").delete().eq("id", id);

    redirect("/");
  }

  return (
    <main>
      <article className={styles.post}>
        <img src={post.image} alt={post.caption} className={styles.image} />
        <div className={styles.body}>
          <UserBadge user={post.user} />
          <p className={styles.caption}>{post.caption}</p>
          <p className={styles.meta}>
            Post #{post.id} · {new Date(post.created_at).toLocaleDateString("da-DK")}
          </p>
          {isOwner && (
            <form action={deletePost} className={styles.actions}>
              <Link href={`/posts/${post.id}/update`} className="button">
                Edit
              </Link>
              <DeleteButton />
            </form>
          )}
        </div>
      </article>
    </main>
  );
}
