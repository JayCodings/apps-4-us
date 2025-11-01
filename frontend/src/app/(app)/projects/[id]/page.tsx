"use client";

import {useParams, useRouter} from "next/navigation";
import { useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { useProjectContext } from "@/contexts/ProjectContext";
import { useSlidePanelRegistry } from "@/hooks/useSlidePanelRegistry";
import { useSubMenuRegistry } from "@/hooks/useSubMenuRegistry";
import { useSlidePanel } from "@/hooks/useSlidePanel";
import { ManageProjectPanel } from "@/components/ManageProjectPanel";
import { Loading } from "@/components/Loading";
import { Edit, LayoutDashboard } from "lucide-react";

export default function ProjectOverview() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { user } = useAuth({ middleware: "auth" });
  const { projects, getProject } = useProjects();
  const { project, setProject, setIsLoading } = useProjectContext();
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

  const menuSections = useMemo(
    () =>
      project
        ? {
            main: {
              id: "main",
              items: [
                {
                  id: "overview",
                  label: "Overview",
                  icon: LayoutDashboard,
                  path: `/projects/${project.id}`,
                },
              ],
            },
          }
        : {},
    [project?.id]
  );

  useSlidePanelRegistry(panels);
  useSubMenuRegistry(menuSections);

  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      if (!projectId) return;

      const cachedProject = projects?.find((p) => p.id === projectId);

      if (projects && !cachedProject) {
        router.replace("/dashboard");
        return;
      }

      if (cachedProject && isMounted) {
        setProject(cachedProject);
      }

      if (project?.id !== projectId && isMounted) {
        setIsLoading(true);
      }

      try {
        const loadedProject = await getProject(projectId);
        if (isMounted) {
          setProject(loadedProject);
        }
      } catch (error: any) {
        if (!isMounted) return;

        if (error.response?.status === 404) {
          router.replace("/dashboard");
          return;
        }
        console.error("Failed to load project:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [projectId, projects, getProject, setProject, setIsLoading, project?.id, router]);

  if (!user) {
    return null;
  }

  if (!project) {
    return <Loading fullScreen message="Loading project..." />;
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
