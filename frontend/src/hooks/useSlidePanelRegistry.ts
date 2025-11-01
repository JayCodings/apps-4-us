import { useEffect, useRef } from "react";
import { useSlidePanelContext, type PanelConfig } from "@/contexts/SlidePanelContext";

export function useSlidePanelRegistry(panels: { [panelId: string]: PanelConfig }) {
  const { registerPanels, unregisterPanels } = useSlidePanelContext();
  const panelIdsRef = useRef<string[]>([]);

  useEffect(() => {
    const panelIds = Object.keys(panels);
    panelIdsRef.current = panelIds;

    if (panelIds.length > 0) {
      registerPanels(panels);
    }

    return () => {
      if (panelIdsRef.current.length > 0) {
        unregisterPanels(panelIdsRef.current);
      }
    };
  }, [panels, registerPanels, unregisterPanels]);
}
