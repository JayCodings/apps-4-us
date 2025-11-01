import useSWR, { mutate as globalMutate } from "swr";
import { useCallback } from "react";
import axios from "@/lib/axios";
import type { Project } from "@/types";

interface CreateProjectData {
  name: string;
  description?: string;
}

interface UpdateProjectData {
  name: string;
  description?: string;
}

export function useProjects() {
  const { data: projects, error, mutate } = useSWR<Project[]>("/api/projects", () =>
    axios.get("/api/projects").then((res) => res.data)
  );

  const createProject = useCallback(
    async (data: CreateProjectData) => {
      const response = await axios.post("/api/projects", data);
      await mutate();
      await globalMutate("/api/user");
      return response.data;
    },
    [mutate]
  );

  const updateProject = useCallback(
    async (id: string, data: UpdateProjectData) => {
      const response = await axios.put(`/api/projects/${id}`, data);
      await mutate();
      return response.data;
    },
    [mutate]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      await mutate(
        async (currentProjects) => {
          await axios.delete(`/api/projects/${id}`);
          return currentProjects?.filter((p) => p.id !== id);
        },
        {
          optimisticData: (currentProjects) =>
            currentProjects?.filter((p) => p.id !== id),
          rollbackOnError: true,
          revalidate: false,
        }
      );
      await globalMutate("/api/user");
    },
    [mutate]
  );

  const getProject = useCallback(async (id: string) => {
    const response = await axios.get(`/api/projects/${id}`);
    return response.data;
  }, []);

  return {
    projects,
    isLoading: !projects && !error,
    error,
    createProject,
    updateProject,
    deleteProject,
    getProject,
  };
}
