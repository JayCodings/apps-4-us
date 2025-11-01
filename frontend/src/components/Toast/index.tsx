"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToastVariant } from "@/types";

export interface ToastProps {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onDismiss: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const variantStyles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
};

export function Toast({
  id,
  message,
  variant = "info",
  duration = 5000,
  onDismiss,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const Icon = iconMap[variant];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.5 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className={cn(
          "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg",
          variantStyles[variant]
        )}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start p-4">
          <div className="flex-shrink-0">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={() => onDismiss(id)}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    variant: ToastVariant;
  }>;
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] flex items-end px-4 py-6 sm:items-start sm:p-6"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              {...toast}
              onDismiss={onDismiss}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}