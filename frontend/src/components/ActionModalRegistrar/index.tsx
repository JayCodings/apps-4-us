"use client";

import { useMemo } from "react";
import { useActionModalRegistry } from "@/hooks/useActionModalRegistry";
import { ProjectCreationFlow } from "@/components/ProjectCreationFlow";
import { SelectFreeFeatureFlow } from "@/components/SelectFreeFeatureFlow";
import { useActionModalContext } from "@/contexts/ActionModalContext";
import { useAuth } from "@/hooks/useAuth";

export function ActionModalRegistrar() {
  const { closeAction } = useActionModalContext();
  const { user } = useAuth();

  const actionModals = useMemo(
    () => ({
      "create-project": {
        content: user && user.features.length === 0
          ? <SelectFreeFeatureFlow onClose={closeAction} />
          : <ProjectCreationFlow onClose={closeAction} />,
      },
    }),
    [closeAction, user]
  );

  useActionModalRegistry(actionModals);

  return null;
}
