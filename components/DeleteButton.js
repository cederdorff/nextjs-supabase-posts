"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { duration, ease } from "@/lib/motion";

// Client Component because it has state: Is the user about to delete the post?
// "Delete" in the confirmation submits the surrounding form, which calls the Server Action.
export default function DeleteButton() {
  const [confirming, setConfirming] = useState(false);

  const transition = { duration: duration.base, ease: ease.out };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {confirming ? (
        <motion.div
          key="confirm"
          className="confirm"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={transition}
        >
          <span>Delete this post?</span>
          <button type="submit" className="button button-danger-solid">
            Delete
          </button>
          {/* Keyboard users land on Cancel – the safe choice */}
          <button type="button" className="button" onClick={() => setConfirming(false)} autoFocus>
            Cancel
          </button>
        </motion.div>
      ) : (
        <motion.button
          key="delete"
          type="button"
          className="button button-danger"
          onClick={() => setConfirming(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          Delete
        </motion.button>
      )}
    </AnimatePresence>
  );
}
