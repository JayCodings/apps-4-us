import { useEffect, useRef } from "react";
import { useSubMenuContext, type MenuSection } from "@/contexts/SubMenuContext";

export function useSubMenuRegistry(sections: { [sectionId: string]: MenuSection }) {
  const { registerItems, unregisterItems } = useSubMenuContext();
  const sectionIdsRef = useRef<string[]>([]);

  useEffect(() => {
    const sectionIds = Object.keys(sections);
    sectionIdsRef.current = sectionIds;

    if (sectionIds.length > 0) {
      registerItems(sections);
    }

    return () => {
      if (sectionIdsRef.current.length > 0) {
        unregisterItems(sectionIdsRef.current);
      }
    };
  }, [sections, registerItems, unregisterItems]);
}
