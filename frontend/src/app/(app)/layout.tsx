"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { DiscordLayout } from "@/components/DiscordLayout";
import { Loading } from "@/components/Loading";
import { ModalRenderer } from "@/components/ModalRenderer";
import { ActionModalRenderer } from "@/components/ActionModalRenderer";
import { ActionModalRegistrar } from "@/components/ActionModalRegistrar";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { SlidePanelProvider } from "@/contexts/SlidePanelContext";
import { SubMenuProvider } from "@/contexts/SubMenuContext";
import { ConfirmModalProvider } from "@/contexts/ConfirmModalContext";
import { ActionModalProvider } from "@/contexts/ActionModalContext";
import type { Project } from "@/types";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth({ middleware: "auth" });
  const { projects, isLoading: projectsLoading } = useProjects();

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/dashboard/settings") return "Settings";
    if (pathname?.includes("/projects/")) return "Overview";
    return "Page";
  };

  if (isLoading) {
    return <Loading fullScreen message="Loading user data..." />;
  }

  if (!user) {
    return <Loading fullScreen message="Redirecting to login..." />;
  }

  if (projectsLoading) {
    return <Loading fullScreen message="Loading projects..." />;
  }

  const handleProjectSelect = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <ConfirmModalProvider>
      <ActionModalProvider>
        <ActionModalRegistrar />
        <SlidePanelProvider>
          <SubMenuProvider>
            <ProjectProvider>
              <DiscordLayout
                user={user}
                projects={projects || []}
                onLogout={logout}
                onProjectSelect={handleProjectSelect}
                pageTitle={getPageTitle()}
              >
                {children}
              </DiscordLayout>
            </ProjectProvider>
          </SubMenuProvider>
        </SlidePanelProvider>
        <ActionModalRenderer />
      </ActionModalProvider>
      <ModalRenderer />
    </ConfirmModalProvider>
  );
}

export default AppLayout;