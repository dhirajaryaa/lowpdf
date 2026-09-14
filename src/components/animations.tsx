"use client";

import { type ReactNode, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

interface AnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function BlurIn({ children, className = "", delay = 0 }: AnimationProps) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  if (reduce || !mounted) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: "blur(10px)", y: 14 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
  y = 16,
  hover = false,
}: AnimationProps & { y?: number; hover?: boolean }) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  if (reduce || !mounted) {
    return hover ? (
      <div className={`${className} transition-transform duration-200 hover:-translate-y-1`}>
        {children}
      </div>
    ) : (
      <div className={className}>{children}</div>
    );
  }
  const variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, delay, ease: "easeOut" as const },
    },
    hovered: { y: -4, transition: { duration: 0.2, ease: "easeOut" as const } },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      whileHover={hover ? "hovered" : undefined}
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}