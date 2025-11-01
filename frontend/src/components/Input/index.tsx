"use client";

import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<HTMLMotionProps<"input">, "ref" | "style" | "type"> {
  error?: boolean;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <motion.input
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        type={type}
        className={cn(
          "block w-full rounded-md border px-3 py-2 text-sm transition-colors duration-200",
          "focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-500 focus:border-red-500"
            : "border-transparent focus:border-discord-text-link",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";