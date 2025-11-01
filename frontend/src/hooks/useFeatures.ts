import { useCallback } from "react";
import { mutate as globalMutate } from "swr";
import axios from "@/lib/axios";

export function useFeatures() {
  const assignFreeFeature = useCallback(async (feature: string, revalidate: boolean = true) => {
    const response = await axios.post("/api/user/features", { feature });
    if (revalidate) {
      await globalMutate("/api/user");
    }
    return response.data;
  }, []);

  return {
    assignFreeFeature,
  };
}
