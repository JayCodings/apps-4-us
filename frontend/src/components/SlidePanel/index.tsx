"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useSlidePanel } from "@/hooks/useSlidePanel";
import { ReactNode } from "react";

interface SlidePanelProps {
  title: string;
  children: ReactNode;
}

export function SlidePanel({ title, children }: SlidePanelProps) {
  const { close } = useSlidePanel();

  return (
    <motion.div
      initial={{ x: "100%", opacity: 1 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 1 }}
      transition={{
        type: "tween",
        duration: 0.3
      }}
      style={{
        willChange: "transform",
        transform: "translate3d(0, 0, 0)"
      }}
      className="absolute inset-0 w-full bg-discord-darkest z-40 flex flex-col"
    >
      <div className="h-12 px-4 flex items-center gap-3 bg-discord-darkest border-t border-l border-discord-dark shrink-0">
        <button
          onClick={close}
          className="p-1 hover:bg-discord-hover rounded transition-colors"
          aria-label="Close panel"
        >
          <ArrowLeft className="w-5 h-5 text-discord-text-normal" />
        </button>
        <h2 className="font-semibold text-discord-text-normal">{title}</h2>
      </div>

      <div className="flex-1 overflow-y-auto bg-discord-darkest border-discord-dark border-t border-l">
        {children}
      </div>
    </motion.div>
  );
}
