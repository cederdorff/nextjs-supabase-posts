"use client";
import Link from "next/link";
import { motion } from "motion/react";
import UserBadge from "@/components/UserBadge";
import styles from "./PostCard.module.css";

// Client Component because hover and tap happen in the browser.
// Lifts on hover and is pressed down on tap – like the card in nextjs-motion.
// tabIndex={-1}: the link inside gets keyboard focus – not the motion.div around it
export default function PostCard({ post }) {
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.25 }} tabIndex={-1}>
      <Link href={`/posts/${post.id}`} className={styles.card}>
        <div className={styles.header}>
          <UserBadge user={post.user} />
        </div>
        <img src={post.image} alt={post.caption} className={styles.image} />
        <div className={styles.body}>
          <p>{post.caption}</p>
        </div>
      </Link>
    </motion.div>
  );
}
