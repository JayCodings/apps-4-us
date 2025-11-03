"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import type { WebhookResponse } from "@/types/webhook";

interface Step3SuccessProps {
  response: WebhookResponse;
  onActivate: () => void;
  onClose: () => void;
  isActivating: boolean;
}

export function Step3Success({ response, onActivate, onClose, isActivating }: Step3SuccessProps) {
  return (
    <div className="text-center space-y-8 py-8">
      {/* Success Icon with Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="inline-flex relative"
      >
        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full border-2 border-green-500/30">
          <CheckCircle2 className="w-20 h-20 text-green-400" />
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-4xl font-bold text-discord-text-normal">
            Response Created!
          </h2>
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
        <p className="text-lg text-discord-text-muted">
          Your webhook response is ready to use
        </p>
      </motion.div>

      {/* Response Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-md mx-auto p-6 bg-discord-darker rounded-2xl border border-discord-dark space-y-4"
      >
        {/* Response Name */}
        <div>
          <h3 className="text-2xl font-semibold text-discord-text-normal">
            {response.name}
          </h3>
        </div>

        {/* Type Badge */}
        <div className="flex items-center justify-center gap-3">
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-sm rounded-full font-medium border border-indigo-500/30">
            {response.type.toUpperCase()}
          </span>
        </div>

        {/* Configuration Summary */}
        <div className="pt-4 border-t border-discord-dark space-y-2 text-sm">
          {response.type === "static" && (
            <>
              {response.status_code && (
                <div className="flex items-center justify-between">
                  <span className="text-discord-text-muted">Status Code</span>
                  <code className="px-2 py-1 bg-discord-card rounded font-mono text-discord-text-normal">
                    {response.status_code}
                  </code>
                </div>
              )}
              {response.headers && Object.keys(response.headers).length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-discord-text-muted">Headers</span>
                  <span className="text-discord-text-normal">
                    {Object.keys(response.headers).length} header(s)
                  </span>
                </div>
              )}
            </>
          )}
          {response.type === "proxy" && response.proxy_url && (
            <div>
              <span className="text-discord-text-muted block mb-1">Proxy URL</span>
              <code className="block px-2 py-1 bg-discord-card rounded font-mono text-xs text-discord-text-normal break-all">
                {response.proxy_url}
              </code>
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-3"
      >
        <button
          onClick={onActivate}
          disabled={isActivating}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isActivating ? "Activating..." : "Activate Response"}
        </button>
        <button
          onClick={onClose}
          className="px-8 py-3 bg-discord-darker text-discord-text-normal rounded-xl font-medium hover:bg-discord-hover transition-all active:scale-[0.98]"
        >
          Back to Responses
        </button>
      </motion.div>

      {/* Additional Info */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-discord-text-muted"
      >
        You can manage this response anytime from the webhook settings
      </motion.p>
    </div>
  );
}
