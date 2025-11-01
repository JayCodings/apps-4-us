"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ConfirmModalContextValue {
  showConfirm: (config: ConfirmConfig) => void;
  hideConfirm: () => void;
  confirmConfig: ConfirmConfig | null;
}

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

const ConfirmModalContext = createContext<ConfirmModalContextValue | undefined>(undefined);

export function ConfirmModalProvider({ children }: { children: ReactNode }) {
  const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig | null>(null);

  const showConfirm = useCallback((config: ConfirmConfig) => {
    setConfirmConfig(config);
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmConfig(null);
  }, []);

  return (
    <ConfirmModalContext.Provider value={{ showConfirm, hideConfirm, confirmConfig }}>
      {children}
    </ConfirmModalContext.Provider>
  );
}

export function useConfirmModal() {
  const context = useContext(ConfirmModalContext);
  if (!context) {
    throw new Error("useConfirmModal must be used within ConfirmModalProvider");
  }
  return context;
}
