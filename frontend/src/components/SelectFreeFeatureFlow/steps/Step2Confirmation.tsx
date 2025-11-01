"use client";

import { motion } from "framer-motion";
import { getProjectTypeConfig } from "@/config/projectTypes";
import { AlertTriangle, Info, Lightbulb, CheckCircle2 } from "lucide-react";

interface Step2ConfirmationProps {
  selectedType: string;
  onConfirm: () => void;
  isLoading: boolean;
}

export function Step2Confirmation({ selectedType, onConfirm, isLoading }: Step2ConfirmationProps) {
  const config = getProjectTypeConfig(selectedType);

  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-discord-text-normal mb-2">
          Confirm Your Selection
        </h2>
        <p className="text-discord-text-muted">
          Please review the details before confirming
        </p>
      </div>

      {/* Selected Feature Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border-2 border-green-500/30"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
            <Icon className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-discord-text-normal">
              {config.name}
            </h3>
            <span className="inline-block mt-1 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              FREE TIER
            </span>
          </div>
        </div>
        <p className="text-discord-text-muted">
          {config.shortDescription}
        </p>
      </motion.div>

      {/* Important Information */}
      <div className="space-y-3">
        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
        >
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-400 mb-1">Important</p>
            <p className="text-sm text-discord-text-muted">
              This choice <strong>cannot be changed later</strong>. Choose carefully!
            </p>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
        >
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-400 mb-1">Free Tier Limits</p>
            <p className="text-sm text-discord-text-muted">
              You can create <strong>1 project</strong> with this type as a free user.
            </p>
          </div>
        </motion.div>

        {/* Upgrade Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl"
        >
          <Lightbulb className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-purple-400 mb-1">Future Upgrades</p>
            <p className="text-sm text-discord-text-muted">
              You can purchase additional project types and slots anytime to expand your capabilities.
            </p>
          </div>
        </motion.div>
      </div>

      {/* What You Get */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 bg-discord-darker rounded-xl border border-discord-dark"
      >
        <h4 className="font-semibold text-discord-text-normal mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          What You Get
        </h4>
        <ul className="space-y-2 text-sm text-discord-text-muted">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Full access to {config.name} features
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Create 1 project of this type
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            All standard features included
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
