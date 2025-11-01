"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

export interface InputErrorProps {
  message?: string | string[];
  className?: string;
}

export function InputError({ message, className }: InputErrorProps) {
  if (!message) return null;

  const messages = Array.isArray(message) ? message : [message];

  return (
    <AnimatePresence>
      {messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className={className}
        >
          {messages.map((msg, index) => (
            <p
              key={`${msg}-${index}`}
              className="mt-1 flex items-center text-sm text-red-600"
            >
              <AlertCircle className="mr-1 h-3 w-3" />
              {msg}
            </p>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}