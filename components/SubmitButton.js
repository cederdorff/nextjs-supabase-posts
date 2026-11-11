"use client";
import { motion } from "motion/react";
import { useFormStatus } from "react-dom";

// pending is true while the form is being saved
export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <motion.button type="submit" disabled={pending} whileTap={{ scale: 0.97 }}>
      {pending ? "Saving …" : "Save"}
    </motion.button>
  );
}
