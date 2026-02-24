// Example minimal Typewriter
import React, { useState, useEffect } from "react";

const Typewriter = ({ texts, gradient }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), 1000);
      return;
    }
    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, deleting ? 50 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting, texts]);

  const style = gradient
    ? {
        background: "linear-gradient(to right,#14b8a6,#06b6d4)",
        WebkitBackgroundClip: "text",
        color: "transparent",
      }
    : {};

  return (
    <span style={style}>{texts[index].substring(0, subIndex)}</span>
  );
};

export default Typewriter;