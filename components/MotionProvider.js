"use client";

import { MotionConfig } from "motion/react";

// reducedMotion="user": When the user has turned on reduced motion in the
// operating system, Motion skips movement (transform) but keeps fades (opacity).
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
