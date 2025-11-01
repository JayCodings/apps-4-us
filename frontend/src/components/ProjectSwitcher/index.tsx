"use client";

import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useActionModal } from "@/hooks/useActionModal";
import { Hash, LayoutDashboard } from "lucide-react";
import type { Project, User } from "@/types";

export interface ProjectSwitcherProps {
  projects: Project[];
  user: User;
  onProjectSelect: (project: Project) => void;
}

export function ProjectSwitcher({ projects, user, onProjectSelect }: ProjectSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { openAction } = useActionModal();
  const canCreateProject = user.permissions.can.createProject.allowed;
  const createProjectMessage = user.permissions.can.createProject.message;

  const handleAddProject = () => {
    if (canCreateProject) {
      openAction("create-project");
    }
  };

  const isDashboardActive = pathname?.startsWith("/dashboard");

  // Extract project ID from URL path
  const activeProjectIdFromUrl = pathname?.match(/\/projects\/([^/]+)/)?.[1];

  return (
    <div className="w-[72px] min-w-[72px] max-w-[72px] bg-discord-darker flex flex-col items-center pb-3 space-y-2 overflow-y-auto overflow-x-hidden">
      {/* Dashboard Icon */}
      <DashboardIcon
        isActive={isDashboardActive}
        onClick={() => router.push("/dashboard")}
      />

      {/* Divider */}
      <div className="w-10 h-[1px] bg-discord-dark" />

      {/* Project Icons */}
      {projects.map((project) => (
        <ProjectIcon
          key={project.id}
          project={project}
          isActive={activeProjectIdFromUrl === project.id}
          onClick={() => onProjectSelect(project)}
        />
      ))}
      <motion.button
        onClick={handleAddProject}
        disabled={!canCreateProject}
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#323339] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={canCreateProject ? { backgroundColor: "#23A55A", scale: 0.9 } : {}}
        whileTap={canCreateProject ? { backgroundColor: "#1E8E4F", scale: 0.9 } : {}}
        transition={{ duration: 0.15 }}
        aria-label="Add new project"
      >
        <span className={`text-xl text-green-500 transition-colors ${canCreateProject ? "hover:text-white" : ""}`}>+</span>
      </motion.button>
    </div>
  );
}

interface DashboardIconProps {
  isActive: boolean;
  onClick: () => void;
}

function DashboardIcon({ isActive, onClick }: DashboardIconProps) {
  return (
    <button
      onClick={onClick}
      className="relative group cursor-pointer"
      aria-label="Go to Dashboard"
    >
      <motion.div
        className="w-10 h-10 rounded-lg flex items-center justify-center bg-discord-dark"
        animate={{
          backgroundColor: isActive ? "#5865F2" : "#323339"
        }}
        whileHover={{
          backgroundColor: "#5865F2",
          scale: 0.9
        }}
        whileTap={{
          backgroundColor: "#4752C4",
          scale: 0.9
        }}
        transition={{ duration: 0.15 }}
      >
        <LayoutDashboard className="w-5 h-5 text-white" />
      </motion.div>

      {/* Active indicator - white border on left */}
      {isActive && (
        <div
          className="absolute left-0 top-1/2 w-1 h-12 bg-white rounded-r-full"
          style={{ transform: "translate(-15px, -50%)" }}
        />
      )}

      {/* Tooltip */}
      <div className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-sm rounded-md whitespace-nowrap pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        Dashboard
      </div>
    </button>
  );
}

interface ProjectIconProps {
  project: Project;
  isActive: boolean;
  onClick: () => void;
}

function ProjectIcon({ project, isActive, onClick }: ProjectIconProps) {
  return (
    <button
      onClick={onClick}
      className="relative group cursor-pointer"
      aria-label={`Switch to ${project.name}`}
    >
      <motion.div
        className="w-10 h-10 rounded-lg flex items-center justify-center bg-discord-dark"
        animate={{
          backgroundColor: isActive ? "#5865F2" : "#323339"
        }}
        whileHover={{
          backgroundColor: "#5865F2",
          scale: 0.9
        }}
        whileTap={{
          backgroundColor: "#4752C4",
          scale: 0.9
        }}
        transition={{ duration: 0.15 }}
      >
        <Hash className="w-5 h-5 text-white" />
      </motion.div>

      {/* Active indicator - white border on left */}
      {isActive && (
        <div
          className="absolute left-0 top-1/2 w-1 h-12 bg-white rounded-r-full"
          style={{ transform: "translate(-15px, -50%)" }}
        />
      )}

      {/* Tooltip */}
      <div className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-sm rounded-md whitespace-nowrap pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {project.name}
      </div>
    </button>
  );
}
