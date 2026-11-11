"use client";
import { MotionConfig } from "motion/react";

// reducedMotion="user": removes movement, keeps fades
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
