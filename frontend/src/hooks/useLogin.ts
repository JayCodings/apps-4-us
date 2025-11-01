import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import axios from "@/lib/axios";
import { LoadingStateEnum } from "@/types";
import type { LoginData, ApiErrorResponse, ValidationError } from "@/types";

export function useLogin() {
  const router = useRouter();
  const [errors, setErrors] = useState<ValidationError>({});
  const [status, setStatus] = useState<LoadingStateEnum>(LoadingStateEnum.Idle);

  const login = useCallback(async (data: LoginData) => {
    setErrors({});
    setStatus(LoadingStateEnum.Loading);

    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post("/api/login", data);

      // Login response now contains user data - populate SWR cache
      mutate("/api/user", response.data, false);

      setStatus(LoadingStateEnum.Success);
      router.push("/dashboard");
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      if (apiError.response?.data?.errors) {
        setErrors(apiError.response.data.errors);
      }
      setStatus(LoadingStateEnum.Error);
    }
  }, [router]);

  return {
    login,
    errors,
    isLoading: status === LoadingStateEnum.Loading,
    status,
    clearErrors: () => setErrors({}),
  };
}