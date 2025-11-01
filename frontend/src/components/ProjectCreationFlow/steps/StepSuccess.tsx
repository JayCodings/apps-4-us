"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import type { Project } from "@/types";
import { getProjectTypeConfig } from "@/config/projectTypes";

interface StepSuccessProps {
  project: Project;
  onNavigateToProject: () => void;
}

export function StepSuccess({ project, onNavigateToProject }: StepSuccessProps) {
  const projectTypeConfig = getProjectTypeConfig(project.type);
  const Icon = projectTypeConfig?.icon;

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
            Project Created!
          </h2>
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
        <p className="text-lg text-discord-text-muted">
          Your project is ready to use
        </p>
      </motion.div>

      {/* Project Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-md mx-auto p-6 bg-discord-darker rounded-2xl border border-discord-dark space-y-4"
      >
        {/* Project Type Badge */}
        {Icon && projectTypeConfig && (
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30">
              <Icon className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-sm font-medium text-discord-text-muted">
              {projectTypeConfig.name}
            </span>
          </div>
        )}

        {/* Project Name */}
        <div>
          <h3 className="text-2xl font-semibold text-discord-text-normal">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-sm text-discord-text-muted mt-2">
              {project.description}
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t border-discord-dark flex items-center justify-between text-sm">
          <span className="text-discord-text-muted">Project ID</span>
          <code className="px-2 py-1 bg-discord-card rounded font-mono text-xs text-discord-text-normal">
            {project.id.slice(0, 8)}...
          </code>
        </div>
      </motion.div>

      {/* Action Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={onNavigateToProject}
        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-[0.98] shadow-lg hover:shadow-xl group"
      >
        Go to Project
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </motion.button>

      {/* Additional Info */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-discord-text-muted"
      >
        You can access this project anytime from your dashboard
      </motion.p>
    </div>
  );
}
