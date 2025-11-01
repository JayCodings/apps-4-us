"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, ArrowRight, Home } from "lucide-react";
import { getProjectTypeConfig } from "@/config/projectTypes";

interface Step3SuccessProps {
  selectedType: string;
  onCreateProject: () => void;
  onBackToDashboard: () => void;
}

export function Step3Success({ selectedType, onCreateProject, onBackToDashboard }: Step3SuccessProps) {
  const config = getProjectTypeConfig(selectedType);

  if (!config) return null;

  const Icon = config.icon;

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
            Type Successfully Selected!
          </h2>
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
        <p className="text-lg text-discord-text-muted">
          Enjoy using your new feature
        </p>
      </motion.div>

      {/* Feature Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-md mx-auto p-6 bg-discord-darker rounded-2xl border border-green-500/30 space-y-4"
      >
        {/* Feature Badge */}
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
            <Icon className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-semibold text-discord-text-normal">
              {config.name}
            </h3>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              FREE TIER
            </span>
          </div>
        </div>

        {/* Limits */}
        <div className="pt-4 border-t border-discord-dark">
          <div className="flex items-center justify-between text-sm">
            <span className="text-discord-text-muted">Project Limit</span>
            <span className="font-semibold text-green-400">1 Project</span>
          </div>
        </div>
      </motion.div>

      {/* Info Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        <p className="text-discord-text-normal font-medium mb-2">
          What would you like to do next?
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
      >
        <button
          onClick={onBackToDashboard}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-discord-darker border-2 border-discord-dark text-discord-text-normal rounded-xl font-medium hover:border-indigo-500/50 transition-all active:scale-[0.98] group"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Back to Dashboard
        </button>
        <button
          onClick={onCreateProject}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all active:scale-[0.98] shadow-lg hover:shadow-xl group"
        >
          Start Your First Project
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
