"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

export interface AuthSessionStatusProps {
  status?: string | null;
  className?: string;
}

export function AuthSessionStatus({ status, className }: AuthSessionStatusProps) {
  if (!status) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        <div className="flex items-center font-medium text-sm text-green-600">
          <CheckCircle className="w-4 h-4 mr-2" />
          {status}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}