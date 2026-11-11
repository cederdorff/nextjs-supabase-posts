"use client";
import { motion } from "motion/react";

// The same card as in nextjs-motion: lifts on hover, pressed down on tap
export default function LiftCard({ children }) {
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
      {children}
    </motion.div>
  );
}
