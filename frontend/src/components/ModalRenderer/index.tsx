"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useConfirmModal } from "@/contexts/ConfirmModalContext";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export function ModalRenderer() {
  const { confirmConfig, hideConfirm } = useConfirmModal();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleConfirm = async () => {
    if (!confirmConfig) return;

    setIsLoading(true);
    try {
      await confirmConfig.onConfirm();
      hideConfirm();
    } catch (error) {
      console.error("Modal confirm error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (confirmConfig?.onCancel) {
      confirmConfig.onCancel();
    }
    hideConfirm();
  };

  if (!mounted) return null;

  return createPortal(
    <ConfirmDialog
      isOpen={!!confirmConfig}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={confirmConfig?.title || ""}
      message={confirmConfig?.message || ""}
      confirmText={confirmConfig?.confirmText}
      cancelText={confirmConfig?.cancelText}
      variant={confirmConfig?.variant}
      isLoading={isLoading}
    />,
    document.body
  );
}
