import PostCard from "@/components/PostCard";
import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

export default async function HomePage({ searchParams }) {
  // Try the three versions of the card: /?variant=a, /?variant=b or /?variant=c
  const { variant } = await searchParams;

  // Every post with the user who wrote it.
  // In Post App: fetch(`${url}/posts?select=*,user:users(*)&order=createdAt.desc`)
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*, user:users(name, title, image)")
    .order("createdAt", { ascending: false });

  if (error) {
    throw error;
  }

  return (
    <main>
      <section className={styles.intro}>
        <h1>Explore the latest posts</h1>
        <p>{posts.length} posts – each with the user who made it.</p>
      </section>

      <section className={styles.grid}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} variant={variant} />
        ))}
      </section>
    </main>
  );
}
