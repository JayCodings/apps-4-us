"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: {
      icon: "text-red-500",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      icon: "text-yellow-500",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      icon: "text-blue-500",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-discord-card rounded-lg p-6 border border-discord-dark max-w-md w-full pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 ${styles.icon}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-discord-text-normal mb-2">
                    {title}
                  </h3>
                  <p className="text-discord-text-muted text-sm mb-6">
                    {message}
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={onClose}
                      disabled={isLoading}
                      className="px-4 py-2 bg-discord-darker text-discord-text-normal rounded-md font-medium hover:bg-discord-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {cancelText}
                    </button>
                    <button
                      onClick={onConfirm}
                      disabled={isLoading}
                      className={`px-4 py-2 text-white rounded-md font-medium ${styles.button} disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95`}
                    >
                      {isLoading ? "Processing..." : confirmText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
