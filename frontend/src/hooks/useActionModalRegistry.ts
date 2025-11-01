import { useEffect } from "react";
import { useActionModalContext } from "@/contexts/ActionModalContext";
import type { ActionModalConfig } from "@/contexts/ActionModalContext";

export function useActionModalRegistry(actions: Record<string, ActionModalConfig>) {
  const { registerActions, unregisterActions } = useActionModalContext();

  useEffect(() => {
    registerActions(actions);

    return () => {
      unregisterActions(Object.keys(actions));
    };
  }, [actions, registerActions, unregisterActions]);
}
