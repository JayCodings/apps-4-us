"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Globe } from "lucide-react";
import type { WebhookResponseType } from "@/types/webhook";

interface Step1TypeSelectionProps {
  onSelect: (type: WebhookResponseType, name: string) => void;
}

export function Step1TypeSelection({ onSelect }: Step1TypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<WebhookResponseType | null>(null);
  const [name, setName] = useState("");

  const types = [
    {
      type: "static" as WebhookResponseType,
      icon: FileText,
      title: "Static Response",
      description: "Return predefined status codes, headers and body content",
    },
    {
      type: "proxy" as WebhookResponseType,
      icon: Globe,
      title: "Proxy Response",
      description: "Forward requests to another URL and return its response",
    },
  ];

  const handleSubmit = () => {
    if (selectedType && name.trim().length >= 3) {
      onSelect(selectedType, name.trim());
    }
  };

  const isValid = selectedType !== null && name.trim().length >= 3;

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-discord-text-normal mb-2">
          Choose Response Type
        </h2>
        <p className="text-discord-text-muted">
          Select how you want your webhook to respond
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {types.map((typeOption) => {
          const Icon = typeOption.icon;
          const isSelected = selectedType === typeOption.type;

          return (
            <motion.button
              key={typeOption.type}
              initial={false}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(typeOption.type)}
              className={`relative group text-left p-6 bg-discord-darker rounded-2xl border-2 transition-all ${
                isSelected
                  ? "border-indigo-500/50"
                  : "border-discord-dark hover:border-indigo-500/30"
              }`}
            >
              <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-indigo-500/30 mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-8 h-8 text-indigo-400" />
              </div>

              <h3 className="text-xl font-semibold text-discord-text-normal mb-2">
                {typeOption.title}
              </h3>
              <p className="text-sm text-discord-text-muted leading-relaxed">
                {typeOption.description}
              </p>

              {isSelected && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-discord-text-muted mb-2">
          Response Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Success Response"
          className="w-full px-4 py-2 bg-discord-input border border-discord-dark rounded-md text-discord-text-normal focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          autoFocus={!!selectedType}
        />
        {name.trim().length > 0 && name.trim().length < 3 && (
          <p className="text-xs text-red-400 mt-1">
            Name must be at least 3 characters
          </p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-purple-600 transition-all active:scale-[0.98] shadow-lg hover:shadow-xl"
      >
        Continue
      </button>
    </div>
  );
}
