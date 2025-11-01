"use client";

import { ProjectSwitcher } from "@/components/ProjectSwitcher";
import { SubMenu } from "@/components/SubMenu";
import { UserProfile } from "@/components/UserProfile";
import { PageHeader } from "@/components/PageHeader";
import { ResizeHandle } from "@/components/ResizeHandle";
import { SlidePanelRenderer } from "@/components/SlidePanelRenderer";
import { useProjectContext } from "@/contexts/ProjectContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import type { User, Project } from "@/types";

export interface DiscordLayoutProps {
  children: React.ReactNode;
  user: User;
  projects: Project[];
  onLogout: () => void;
  onProjectSelect: (project: Project) => void;
  pageTitle?: string;
}

const MIN_MENU_WIDTH = 140;
const MAX_MENU_WIDTH = 340;
const DEFAULT_MENU_WIDTH = 240;
const STORAGE_KEY = "discord-layout-menu-width";

export function DiscordLayout({
  children,
  user,
  projects,
  onLogout,
  onProjectSelect,
  pageTitle,
}: DiscordLayoutProps) {
  const pathname = usePathname();
  const { project: contextProject } = useProjectContext();
  const isDashboard = pathname === "/dashboard";
  const currentProject = isDashboard ? null : contextProject;
  const [menuWidth, setMenuWidth] = useState(DEFAULT_MENU_WIDTH);
  const dragStartWidthRef = useRef(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const savedWidth = localStorage.getItem(STORAGE_KEY);
    if (savedWidth) {
      const width = parseInt(savedWidth, 10);
      if (width >= MIN_MENU_WIDTH && width <= MAX_MENU_WIDTH) {
        setMenuWidth(width);
      }
    }
  }, []);

  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname]);

  const handleDragStart = () => {
    dragStartWidthRef.current = menuWidth;
    return menuWidth;
  };

  const handleResize = (deltaX: number) => {
    const newWidth = dragStartWidthRef.current + deltaX;
    const constrainedWidth = Math.min(Math.max(newWidth, MIN_MENU_WIDTH), MAX_MENU_WIDTH);
    setMenuWidth(constrainedWidth);
  };

  const handleResizeEnd = () => {
    localStorage.setItem(STORAGE_KEY, menuWidth.toString());
  };

  return (
    <div className="h-screen flex flex-col bg-discord-dark text-discord-text-normal">
      {/* Page Header - Full Width */}
      <PageHeader
        title={process.env.NEXT_PUBLIC_APP_NAME || "Webhook Proxy"}
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden bg-discord-darker relative">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <>
            <div className="flex flex-col">
              <div className="flex-1 flex overflow-hidden">
                <ProjectSwitcher
                  projects={projects}
                  user={user}
                  onProjectSelect={onProjectSelect}
                />
                <SubMenu
                  project={currentProject}
                  width={menuWidth}
                />
              </div>
              <div className="px-2 pb-2 border-discord-dark bg-discord-darker">
                <UserProfile
                  user={user}
                  onLogout={onLogout}
                />
              </div>
            </div>

            <ResizeHandle
              onDragStart={handleDragStart}
              onDrag={handleResize}
              onDragEnd={handleResizeEnd}
            />
          </>
        )}

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobile && isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/50 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="absolute inset-y-0 left-0 z-50 flex flex-col bg-discord-darker"
              >
                <div className="flex-1 flex overflow-hidden">
                  <ProjectSwitcher
                    projects={projects}
                    user={user}
                    onProjectSelect={(project) => {
                      onProjectSelect(project);
                      setIsMobileMenuOpen(false);
                    }}
                  />
                  <SubMenu
                    project={currentProject}
                    width={300}
                    disableAnimation={true}
                    onNavigate={() => setIsMobileMenuOpen(false)}
                  />
                </div>
                <div className="px-2 pb-2 border-discord-dark bg-discord-darker">
                  <UserProfile
                    user={user}
                    onLogout={onLogout}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-discord-dark overflow-hidden relative">
          {pageTitle && (
            <div className="h-12 px-4 flex items-center gap-3 bg-discord-darker border-t border-l border-discord-dark">
              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-1 hover:bg-discord-hover rounded transition-colors"
                  aria-label="Toggle menu"
                >
                  <Menu className="w-5 h-5 text-discord-text-normal" />
                </button>
              )}
              <h2 className="font-semibold text-discord-text-normal">
                {pageTitle}
              </h2>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          <SlidePanelRenderer />
        </main>
      </div>
    </div>
  );
}
