"use client";

import { useMemo } from "react";
import { useProjectContext } from "@/contexts/ProjectContext";
import { useSlidePanel } from "@/hooks/useSlidePanel";
import { useSlidePanelRegistry } from "@/hooks/useSlidePanelRegistry";
import { ManageProjectPanel } from "@/components/ManageProjectPanel";
import { Edit } from "lucide-react";

export default function ProjectOverview() {
  const { project } = useProjectContext();
  const { open } = useSlidePanel();

  const panels = useMemo(
    () =>
      project
        ? {
            manage: {
              title: "Manage Project",
              content: <ManageProjectPanel project={project} />,
            },
          }
        : {},
    [project?.id]
  );

  useSlidePanelRegistry(panels);

  if (!project) {
    return null;
  }

  const canUpdate = project.permissions?.can?.update?.allowed ?? false;

  return (
    <div className="p-6">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-discord-text-normal">
              Project Overview
            </h1>
            <p className="text-discord-text-muted mt-1">
              View your project details and settings
            </p>
          </div>

          {canUpdate && (
            <button
              onClick={() => open("manage")}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Edit className="w-4 h-4" />
              Manage Project
            </button>
          )}
        </div>

        <div className="bg-discord-card rounded-lg p-6 border border-discord-dark">
          <h2 className="text-xl font-semibold text-discord-text-normal mb-4">
            Project Properties
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-discord-text-muted mb-1">
                Name
              </label>
              <p className="text-discord-text-normal">{project.name}</p>
            </div>

            {project.description && (
              <div>
                <label className="block text-sm font-medium text-discord-text-muted mb-1">
                  Description
                </label>
                <p className="text-discord-text-normal">{project.description}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-discord-text-muted mb-1">
                Your Role
              </label>
              <p className="text-discord-text-normal capitalize">{project.role}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-discord-text-muted mb-1">
                Project ID
              </label>
              <p className="text-discord-text-normal font-mono text-sm">{project.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-discord-text-muted mb-1">
                Created At
              </label>
              <p className="text-discord-text-normal">
                {new Date(project.created_at).toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-discord-text-muted mb-1">
                Last Updated
              </label>
              <p className="text-discord-text-normal">
                {new Date(project.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
