"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export interface ActionModalConfig {
  content: ReactNode;
}

interface ActionModalRegistry {
  [actionId: string]: ActionModalConfig;
}

interface ActionModalContextValue {
  currentActionId: string | null;
  currentAction: ActionModalConfig | null;
  registerActions: (actions: ActionModalRegistry) => void;
  unregisterActions: (actionIds: string[]) => void;
  openAction: (actionId: string) => void;
  closeAction: () => void;
  isOpen: (actionId: string) => boolean;
}

const ActionModalContext = createContext<ActionModalContextValue | undefined>(undefined);

export function ActionModalProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [registry, setRegistry] = useState<ActionModalRegistry>({});
  const [currentActionId, setCurrentActionId] = useState<string | null>(null);

  const registerActions = useCallback((actions: ActionModalRegistry) => {
    setRegistry((prev) => ({ ...prev, ...actions }));
  }, []);

  const unregisterActions = useCallback((actionIds: string[]) => {
    setRegistry((prev) => {
      const next = { ...prev };
      actionIds.forEach((id) => delete next[id]);
      return next;
    });
  }, []);

  const openAction = useCallback((actionId: string) => {
    if (!registry[actionId]) {
      console.warn(`Action "${actionId}" is not registered`);
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("action", actionId);
    window.history.pushState({}, "", url.toString());
    setCurrentActionId(actionId);
  }, [registry]);

  const closeAction = useCallback(() => {
    const url = new URL(window.location.href);
    const hadActionParam = url.searchParams.has("action");

    if (hadActionParam && window.history.length > 1) {
      window.history.back();
    } else {
      url.searchParams.delete("action");
      window.history.replaceState({}, "", url.toString());
      setCurrentActionId(null);
    }
  }, []);

  const isOpen = useCallback((actionId: string) => {
    return currentActionId === actionId;
  }, [currentActionId]);

  useEffect(() => {
    const actionParam = searchParams.get("action");

    if (actionParam) {
      if (registry[actionParam]) {
        setCurrentActionId(actionParam);
      } else {
        const hasRegistryItems = Object.keys(registry).length > 0;
        if (hasRegistryItems) {
          const url = new URL(window.location.href);
          url.searchParams.delete("action");
          window.history.replaceState({}, "", url.toString());
        }
        setCurrentActionId(null);
      }
    } else {
      setCurrentActionId(null);
    }
  }, [searchParams, registry]);

  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href);
      const actionParam = url.searchParams.get("action");

      if (actionParam && registry[actionParam]) {
        setCurrentActionId(actionParam);
      } else {
        setCurrentActionId(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [registry]);

  useEffect(() => {
    setCurrentActionId(null);
  }, [pathname]);

  const currentAction = currentActionId ? registry[currentActionId] : null;

  return (
    <ActionModalContext.Provider
      value={{
        currentActionId,
        currentAction,
        registerActions,
        unregisterActions,
        openAction,
        closeAction,
        isOpen,
      }}
    >
      {children}
    </ActionModalContext.Provider>
  );
}

export function useActionModalContext() {
  const context = useContext(ActionModalContext);
  if (!context) {
    throw new Error("useActionModalContext must be used within ActionModalProvider");
  }
  return context;
}
