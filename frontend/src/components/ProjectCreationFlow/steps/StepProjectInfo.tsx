"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, AlignLeft } from "lucide-react";

interface StepProjectInfoProps {
  projectType: string;
  onSubmit: (data: { name: string; description?: string }) => void;
  isLoading: boolean;
}

export function StepProjectInfo({ projectType, onSubmit, isLoading }: StepProjectInfoProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    if (name.length > 255) {
      setError("Project name must be less than 255 characters");
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-discord-text-normal mb-2">
          Project Details
        </h2>
        <p className="text-discord-text-muted">
          Give your project a name and description
        </p>
      </div>

      {/* Project Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-discord-text-normal mb-2 flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Project Name *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={255}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-discord-darker border-2 border-discord-dark rounded-xl text-discord-text-normal focus:outline-none focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-discord-text-muted"
          placeholder="e.g., My Awesome Webhook Project"
          autoFocus
        />
        <p className="mt-2 text-xs text-discord-text-muted">
          {name.length} / 255 characters
        </p>
      </div>

      {/* Project Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-discord-text-normal mb-2 flex items-center gap-2"
        >
          <AlignLeft className="w-4 h-4" />
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-discord-darker border-2 border-discord-dark rounded-xl text-discord-text-normal focus:outline-none focus:border-indigo-500 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-discord-text-muted"
          placeholder="A brief description of your project and its purpose..."
        />
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl"
        >
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
        <p className="text-sm text-discord-text-muted text-center">
          You can always change these details later in your project settings
        </p>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading || !name.trim()}
        initial={false}
        whileHover={{ scale: isLoading || !name.trim() ? 1 : 1.02 }}
        whileTap={{ scale: isLoading || !name.trim() ? 1 : 0.98 }}
        className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
      >
        {isLoading ? "Creating Project..." : "Create Project"}
      </motion.button>
    </form>
  );
}
