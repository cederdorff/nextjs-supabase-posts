// Motion tokens – the same names and values as in app/globals.css and in Figma.
// Motion uses seconds, CSS uses milliseconds.
export const duration = {
  fast: 0.15, // hover and tap: direct feedback
  base: 0.25, // elements that come and go
};

export const ease = {
  out: [0.22, 1, 0.36, 1], // fast start, soft landing
};

// Three versions of the same microinteraction – from minimal to expressive.
// Try them on the home page: /?variant=a, /?variant=b or /?variant=c
export const cardVariants = {
  a: {
    hover: {},
    tap: { scale: 0.99 },
    transition: { duration: duration.fast },
  },
  b: {
    hover: { y: -4 },
    tap: { scale: 0.98 },
    transition: { duration: duration.fast, ease: ease.out },
  },
  c: {
    hover: { y: -8, rotate: -1 },
    tap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 15 },
  },
};
