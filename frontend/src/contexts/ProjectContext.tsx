"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Project } from "@/types";

interface ProjectContextType {
  project: Project | null;
  setProject: (project: Project | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ProjectContext.Provider value={{ project, setProject, isLoading, setIsLoading }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
}
