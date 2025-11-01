import { useSlidePanelContext } from "@/contexts/SlidePanelContext";

export function useSlidePanel() {
  const { open, close, isOpen } = useSlidePanelContext();

  return {
    open,
    close,
    isOpen,
  };
}
