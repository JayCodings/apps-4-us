"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { useSlidePanel } from "@/hooks/useSlidePanel";
import { useConfirmModal } from "@/contexts/ConfirmModalContext";
import { useToast } from "@/contexts/ToastContext";
import type { Project } from "@/types";

interface ManageProjectPanelProps {
  project: Project;
}

export function ManageProjectPanel({ project }: ManageProjectPanelProps) {
  const router = useRouter();
  const { updateProject, deleteProject } = useProjects();
  const { close } = useSlidePanel();
  const { showConfirm } = useConfirmModal();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(project.name);
    setDescription(project.description || "");
  }, [project]);

  const canUpdate = project.permissions?.can?.update?.allowed ?? false;
  const canDelete = project.permissions?.can?.delete?.allowed ?? false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await updateProject(project.id, { name, description: description || undefined });
      showToast("Project updated successfully", "success");
      close();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    showConfirm({
      title: "Delete Project",
      message: `Are you sure you want to delete "${project.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteProject(project.id);
          showToast("Project deleted successfully", "success");
          close();
          router.replace("/dashboard");
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || "Failed to delete project. Please try again.";
          showToast(errorMessage, "error");
        }
      },
    });
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-discord-text-normal mb-2">
          Update Project
        </h1>
        <p className="text-discord-text-muted mb-6">
          Update your project details
        </p>

        {!canUpdate && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-md p-4">
            <p className="text-red-400">
              {project.permissions?.can?.update?.message || "You don't have permission to edit this project."}
            </p>
          </div>
        )}

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
              disabled={!canUpdate}
              className="w-full px-4 py-2 bg-discord-darker border border-discord-dark rounded-md text-discord-text-normal focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="My Awesome Project"
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
              disabled={!canUpdate}
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

          <button
            type="submit"
            disabled={isLoading || !name.trim() || !canUpdate}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {canDelete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-8 pt-8 border-t border-discord-dark"
          >
            <h2 className="text-xl font-bold text-discord-text-normal mb-2">
              Danger Zone
            </h2>
            <p className="text-discord-text-muted mb-4">
              Once you delete a project, there is no going back. Please be certain.
            </p>

            <button
              type="button"
              onClick={handleDeleteClick}
              className="px-6 py-3 bg-red-600/10 text-red-400 border border-red-600/50 rounded-md font-medium hover:bg-red-600/20 transition-all active:scale-95 cursor-pointer"
            >
              Delete Project
            </button>
          </motion.div>
        )}

        {!canDelete && canUpdate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-8 pt-8 border-t border-discord-dark"
          >
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-md p-4">
              <p className="text-yellow-400 text-sm">
                {project.permissions?.can?.delete?.message || "You don't have permission to delete this project."}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
