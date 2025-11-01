"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { useActionModalContext } from "@/contexts/ActionModalContext";

export function ActionModalRenderer() {
  const { currentAction } = useActionModalContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {currentAction && <div key="action-modal">{currentAction.content}</div>}
    </AnimatePresence>,
    document.body
  );
}
