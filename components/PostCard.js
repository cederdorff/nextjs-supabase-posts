import Link from "next/link";
import UserBadge from "@/components/UserBadge";
import styles from "./PostCard.module.css";

export default function PostCard({ post }) {
  return (
    <Link href={`/posts/${post.id}`} className={styles.card}>
      <img src={post.image} alt={post.caption} className={styles.image} />
      <div className={styles.body}>
        <UserBadge user={post.user} />
        <p>{post.caption}</p>
      </div>
    </Link>
  );
}
