"use client";

import { AnimatePresence } from "framer-motion";
import { useSlidePanelContext } from "@/contexts/SlidePanelContext";
import { SlidePanel } from "@/components/SlidePanel";

export function SlidePanelRenderer() {
  const { currentPanel } = useSlidePanelContext();

  return (
    <AnimatePresence mode="wait">
      {currentPanel && (
        <SlidePanel key="slide-panel" title={currentPanel.title}>
          {currentPanel.content}
        </SlidePanel>
      )}
    </AnimatePresence>
  );
}
