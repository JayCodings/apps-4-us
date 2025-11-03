"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { useProjectContext } from "@/contexts/ProjectContext";
import { useSubMenuRegistry } from "@/hooks/useSubMenuRegistry";
import { Loading } from "@/components/Loading";
import { LayoutDashboard, Webhook, Activity } from "lucide-react";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { user } = useAuth({ middleware: "auth" });
  const { projects, getProject } = useProjects();
  const { project, setProject, setIsLoading } = useProjectContext();

  const menuSections = useMemo(() => {
    if (!project) return {};

    const mainItems = [
      {
        id: "overview",
        label: "Overview",
        icon: LayoutDashboard,
        path: `/projects/${project.id}`,
      },
    ];

    if (project.type === 'webhook-proxy') {
      mainItems.push(
        {
          id: "my-webhooks",
          label: "My Webhooks",
          icon: Webhook,
          path: `/projects/${project.id}/webhooks`,
        },
        {
          id: "webhook-logs",
          label: "Webhook Logs",
          icon: Activity,
          path: `/projects/${project.id}/webhooks/logs`,
        }
      );
    }

    return {
      main: {
        id: "main",
        items: mainItems,
      },
    };
  }, [project?.id, project?.type]);

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

  return <>{children}</>;
}
