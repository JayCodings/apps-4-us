"use client";

import { useMemo } from "react";
import { useActionModalRegistry } from "@/hooks/useActionModalRegistry";
import { CreateProjectModal } from "@/components/CreateProjectModal";

export function ActionModalRegistrar() {
  const actionModals = useMemo(
    () => ({
      "create-project": {
        content: <CreateProjectModal />,
      },
    }),
    []
  );

  useActionModalRegistry(actionModals);

  return null;
}
