import AnimatedCard from "@/components/AnimatedCard";
import UserBadge from "@/components/UserBadge";
import styles from "./PostCard.module.css";

export default function PostCard({ post, variant }) {
  return (
    <AnimatedCard href={`/posts/${post.id}`} className={styles.card} variant={variant}>
      <div className={styles.header}>
        <UserBadge user={post.user} />
      </div>
      <img src={post.image} alt={post.caption} className={styles.image} />
      <div className={styles.body}>
        <p>{post.caption}</p>
      </div>
    </AnimatedCard>
  );
}
