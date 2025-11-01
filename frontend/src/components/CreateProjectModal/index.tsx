"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useProjects } from "@/hooks/useProjects";
import { useActionModalContext } from "@/contexts/ActionModalContext";
import { useToast } from "@/contexts/ToastContext";
import { X } from "lucide-react";

export function CreateProjectModal() {
  const router = useRouter();
  const { createProject } = useProjects();
  const { closeAction } = useActionModalContext();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const project = await createProject({ name, description: description || undefined });
      showToast("Project created successfully", "success");
      closeAction();
      router.push(`/projects/${project.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      closeAction();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        closeAction();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isLoading, closeAction]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-discord-card rounded-lg p-8 border border-discord-dark w-full max-w-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-discord-text-muted hover:text-discord-text-normal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <h1 className="text-3xl font-bold text-discord-text-normal mb-2">
          Create New Project
        </h1>
        <p className="text-discord-text-muted mb-8">
          Set up a new project to organize your webhooks
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-discord-text-normal mb-2"
            >
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
              className="w-full px-4 py-2 bg-discord-darker border border-discord-dark rounded-md text-discord-text-normal focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="My Awesome Project"
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-discord-text-normal mb-2"
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-discord-darker border border-discord-dark rounded-md text-discord-text-normal focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="A brief description of your project..."
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/50 rounded-md"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-discord-darker text-discord-text-normal rounded-md font-medium hover:bg-discord-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {isLoading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
