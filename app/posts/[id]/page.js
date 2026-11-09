import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";
import UserBadge from "@/components/UserBadge";
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

  async function deletePost() {
    "use server";

    // In Post App: fetch(`${url}/posts?id=eq.${id}`, { method: "DELETE" })
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
            {new Date(post.createdAt).toLocaleDateString("da-DK")}
          </p>
          <form action={deletePost} className={styles.actions}>
            <Link href={`/posts/${post.id}/update`} className="button">
              Edit
            </Link>
            <DeleteButton />
          </form>
        </div>
      </article>
    </main>
  );
}
