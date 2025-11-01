"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

export interface MenuSection {
  id: string;
  label?: string;
  items: MenuItem[];
}

interface MenuRegistry {
  [sectionId: string]: MenuSection;
}

interface SubMenuContextValue {
  sections: MenuSection[];
  title: string | null;
  registerItems: (sections: MenuRegistry) => void;
  unregisterItems: (sectionIds: string[]) => void;
  setTitle: (title: string | null) => void;
}

const SubMenuContext = createContext<SubMenuContextValue | undefined>(undefined);

export function SubMenuProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<MenuRegistry>({});
  const [title, setTitle] = useState<string | null>(null);

  const registerItems = useCallback((sections: MenuRegistry) => {
    setRegistry((prev) => {
      const hasChanged = Object.keys(sections).some(
        (key) => !prev[key] || prev[key] !== sections[key]
      );
      return hasChanged ? { ...prev, ...sections } : prev;
    });
  }, []);

  const unregisterItems = useCallback((sectionIds: string[]) => {
    setRegistry((prev) => {
      const hasItems = sectionIds.some((id) => prev[id]);
      if (!hasItems) return prev;

      const next = { ...prev };
      sectionIds.forEach((id) => delete next[id]);
      return next;
    });
  }, []);

  const sections = Object.values(registry);

  return (
    <SubMenuContext.Provider value={{ sections, title, registerItems, unregisterItems, setTitle }}>
      {children}
    </SubMenuContext.Provider>
  );
}

export function useSubMenuContext() {
  const context = useContext(SubMenuContext);
  if (!context) {
    throw new Error("useSubMenuContext must be used within SubMenuProvider");
  }
  return context;
}
