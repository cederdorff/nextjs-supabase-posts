"use client";

import { AnimatePresence, motion } from "motion/react";
import { useFormStatus } from "react-dom";
import { duration, ease } from "@/lib/motion";

// Client Component because it shows the state of the form while it is sent.
// pending is true while the Server Action is running.
export default function SubmitButton({ children, pendingText }) {
  const { pending } = useFormStatus();

  return (
    <motion.button
      type="submit"
      disabled={pending}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: duration.fast }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={pending ? "pending" : "idle"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: duration.fast, ease: ease.out }}
          style={{ display: "inline-block" }}
        >
          {pending ? pendingText : children}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
