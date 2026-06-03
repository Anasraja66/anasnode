"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface TypewriterProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  once?: boolean;
}

export function Typewriter({ 
  text, 
  className = "", 
  delay = 0, 
  speed = 0.05,
  once = false 
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false });
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        setIsTyping(true);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    } else {
      setDisplayText("");
      setIsTyping(false);
      setIsDeleting(false);
    }
  }, [isInView, delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (!isDeleting && displayText.length < text.length) {
      // Typing
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, speed * 1000);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && displayText.length === text.length && !once) {
      // Finished typing, wait before deleting
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayText.length > 0) {
      // Deleting
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length - 1));
      }, speed * 500); // Delete faster
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayText.length === 0) {
      // Finished deleting, wait before typing again
      setIsDeleting(false);
      const timeout = setTimeout(() => {
        // Just triggers the next cycle
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isTyping, isDeleting, displayText, text, speed, once]);

  return (
    <span ref={containerRef} className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="inline-block w-[2px] h-[0.8em] bg-current ml-1 align-middle"
      />
    </span>
  );
}
