"use client";

import { motion } from "framer-motion";
import { getAllProjectTypes } from "@/config/projectTypes";
import { Gift, Sparkles } from "lucide-react";

interface Step1FeatureSelectionProps {
  onSelectType: (type: string) => void;
}

export function Step1FeatureSelection({ onSelectType }: Step1FeatureSelectionProps) {
  const availableTypes = getAllProjectTypes();

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30 mb-4">
          <Gift className="w-10 h-10 text-green-400" />
        </div>

        <h2 className="text-3xl font-bold text-discord-text-normal mb-2 flex items-center justify-center gap-2">
          Choose Your Free Project Type
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </h2>
        <p className="text-discord-text-muted">
          Select one project type to get started for free
        </p>
      </div>

      {/* Info Box */}
      <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <p className="text-sm text-blue-400 text-center">
          ℹ️ You can create <strong>1 project</strong> with your chosen type. Additional features can be purchased later.
        </p>
      </div>

      {/* Project Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableTypes.map((type, index) => {
          const Icon = type.icon;

          return (
            <motion.button
              key={type.type}
              initial={false}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectType(type.type)}
              className="relative group text-left p-6 bg-discord-darker rounded-2xl border-2 border-discord-dark hover:border-green-500/50 transition-all cursor-pointer"
            >
              {/* FREE Badge */}
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                  FREE
                </span>
              </div>

              {/* Icon */}
              <div className="inline-flex p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30 mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-8 h-8 text-green-400" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-discord-text-normal mb-2">
                {type.name}
              </h3>
              <p className="text-sm text-discord-text-muted leading-relaxed">
                {type.shortDescription}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
