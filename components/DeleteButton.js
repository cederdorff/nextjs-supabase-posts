"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// The same pattern as Message in nextjs-motion: a question slides in – and out again.
// "Yes, delete" submits the surrounding form, which calls the Server Action.
export default function DeleteButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" className="button button-danger" onClick={() => setIsOpen(!isOpen)}>
        Delete
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="confirm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <span>Delete this post?</span>
            <button type="submit" className="button button-danger-solid">
              Yes, delete
            </button>
            <button type="button" className="button" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
