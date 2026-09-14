import type { ReactNode } from "react";
import { cn } from "cn";

export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto flex w-full max-w-5xl", className)}>{children}</div>;
}