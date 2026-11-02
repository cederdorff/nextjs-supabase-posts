import PostCard from "@/components/PostCard";
import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

export default async function HomePage() {
  // One query: every post with the user who wrote it, like select=*,user:users(*) in Post App
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*, user:users(name, title, image)")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (
    <main>
      <section className={styles.intro}>
        <h1>Explore the latest posts</h1>
        <p>{posts.length} posts from the users table in Supabase.</p>
      </section>

      <section className={styles.grid}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </main>
  );
}
