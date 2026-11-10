"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { cardVariants } from "@/lib/motion";

// A Link that Motion can animate
const MotionLink = motion.create(Link);

// Client Component because hover and tap happen in the browser.
// The content of the card (children) is still rendered on the server.
export default function AnimatedCard({ href, className, variant = "b", children }) {
  // Reduced motion turned on? Then use the minimal version: no movement, only feedback
  const shouldReduceMotion = useReducedMotion();
  const chosen = shouldReduceMotion ? "a" : variant;
  const { hover, tap, transition } = cardVariants[chosen] ?? cardVariants.b;

  return (
    <MotionLink
      href={href}
      className={className}
      whileHover={hover}
      whileFocus={hover}
      whileTap={tap}
      transition={transition}
    >
      {children}
    </MotionLink>
  );
}
