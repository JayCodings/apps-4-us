"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { User, Project } from "@/types";
import { getAllProjectTypes, getProjectTypeConfig } from "@/config/projectTypes";
import { Lock, AlertTriangle } from "lucide-react";

interface Step1TypeSelectionProps {
  user: User;
  projects: Project[];
  onSelectType: (type: string) => void;
}

export function Step1TypeSelection({ user, projects, onSelectType }: Step1TypeSelectionProps) {
  const availableTypes = useMemo(() => {
    return user.features.map((feature) => {
      const config = getProjectTypeConfig(feature.feature);
      if (!config) return null;

      const maxProjects = feature.context?.["max-projects"] ?? Infinity;
      const currentCount = projects.filter(
        (p) => p.type === feature.feature && p.role === "owner"
      ).length;
      const isLimitReached = currentCount >= maxProjects;

      return {
        ...config,
        currentCount,
        maxProjects,
        isLimitReached
      };
    }).filter((type) => type !== null);
  }, [user.features, projects]);

  if (availableTypes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex p-6 bg-discord-darker rounded-full mb-4">
          <Lock className="w-12 h-12 text-discord-text-muted" />
        </div>
        <h3 className="text-2xl font-semibold text-discord-text-normal mb-2">
          No Project Types Available
        </h3>
        <p className="text-discord-text-muted">
          Contact support to enable project types for your account.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-discord-text-normal mb-2">
          Choose Your Project Type
        </h2>
        <p className="text-discord-text-muted">
          Select the type of project you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableTypes.map((type, index) => {
          if (!type) return null;

          const Icon = type.icon;

          return (
            <motion.button
              key={type.type}
              initial={false}
              whileHover={{ scale: type.isLimitReached ? 1 : 1.02 }}
              whileTap={{ scale: type.isLimitReached ? 1 : 0.98 }}
              onClick={() => !type.isLimitReached && onSelectType(type.type)}
              disabled={type.isLimitReached}
              style={{ cursor: type.isLimitReached ? 'not-allowed' : 'pointer' }}
              className="relative group text-left p-6 bg-discord-darker rounded-2xl border-2 border-discord-dark hover:border-indigo-500/50 disabled:hover:border-discord-dark transition-all disabled:opacity-60"
            >
              {/* Limit Badge */}
              <div className="absolute top-4 right-4">
                <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                  type.isLimitReached
                    ? "bg-red-500/20 text-red-400"
                    : "bg-green-500/20 text-green-400"
                }`}>
                  {type.isLimitReached && <AlertTriangle className="w-3 h-3" />}
                  {type.currentCount} / {type.maxProjects === Infinity ? "∞" : type.maxProjects}
                  {type.isLimitReached && <span className="ml-1">- Limit reached</span>}
                </span>
              </div>

              {/* Icon */}
              <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-indigo-500/30 mb-4 group-hover:scale-110 group-disabled:group-hover:scale-100 transition-transform">
                <Icon className="w-8 h-8 text-indigo-400" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-discord-text-normal mb-2">
                {type.name}
              </h3>
              <p className="text-sm text-discord-text-muted leading-relaxed">
                {type.shortDescription}
              </p>

              {/* Hover Effect */}
              {!type.isLimitReached && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
