"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export interface PanelConfig {
  title: string;
  content: ReactNode;
}

interface PanelRegistry {
  [panelId: string]: PanelConfig;
}

interface SlidePanelContextValue {
  currentPanelId: string | null;
  currentPanel: PanelConfig | null;
  registerPanels: (panels: PanelRegistry) => void;
  unregisterPanels: (panelIds: string[]) => void;
  open: (panelId: string) => void;
  close: () => void;
  isOpen: (panelId: string) => boolean;
}

const SlidePanelContext = createContext<SlidePanelContextValue | undefined>(undefined);

export function SlidePanelProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [registry, setRegistry] = useState<PanelRegistry>({});
  const [currentPanelId, setCurrentPanelId] = useState<string | null>(null);

  const registerPanels = useCallback((panels: PanelRegistry) => {
    setRegistry((prev) => ({ ...prev, ...panels }));
  }, []);

  const unregisterPanels = useCallback((panelIds: string[]) => {
    setRegistry((prev) => {
      const next = { ...prev };
      panelIds.forEach((id) => delete next[id]);
      return next;
    });
  }, []);

  const open = useCallback((panelId: string) => {
    if (!registry[panelId]) {
      console.warn(`Panel "${panelId}" is not registered`);
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("panel", panelId);
    window.history.pushState({}, "", url.toString());
    setCurrentPanelId(panelId);
  }, [registry]);

  const close = useCallback(() => {
    const url = new URL(window.location.href);
    const hadPanelParam = url.searchParams.has("panel");

    if (hadPanelParam && window.history.length > 1) {
      window.history.back();
    } else {
      url.searchParams.delete("panel");
      window.history.replaceState({}, "", url.toString());
      setCurrentPanelId(null);
    }
  }, []);

  const isOpen = useCallback((panelId: string) => {
    return currentPanelId === panelId;
  }, [currentPanelId]);

  useEffect(() => {
    const panelParam = searchParams.get("panel");

    if (panelParam) {
      if (registry[panelParam]) {
        setCurrentPanelId(panelParam);
      } else {
        const hasRegistryItems = Object.keys(registry).length > 0;
        if (hasRegistryItems) {
          const url = new URL(window.location.href);
          url.searchParams.delete("panel");
          window.history.replaceState({}, "", url.toString());
        }
        setCurrentPanelId(null);
      }
    } else {
      setCurrentPanelId(null);
    }
  }, [searchParams, registry]);

  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href);
      const panelParam = url.searchParams.get("panel");

      if (panelParam && registry[panelParam]) {
        setCurrentPanelId(panelParam);
      } else {
        setCurrentPanelId(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [registry]);

  useEffect(() => {
    setCurrentPanelId(null);
  }, [pathname]);

  const currentPanel = currentPanelId ? registry[currentPanelId] : null;

  return (
    <SlidePanelContext.Provider
      value={{
        currentPanelId,
        currentPanel,
        registerPanels,
        unregisterPanels,
        open,
        close,
        isOpen,
      }}
    >
      {children}
    </SlidePanelContext.Provider>
  );
}

export function useSlidePanelContext() {
  const context = useContext(SlidePanelContext);
  if (!context) {
    throw new Error("useSlidePanelContext must be used within SlidePanelProvider");
  }
  return context;
}
