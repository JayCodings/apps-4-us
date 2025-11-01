import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import axios from "@/lib/axios";
import { LoadingStateEnum } from "@/types";
import type { RegisterData, ApiErrorResponse, ValidationError, User } from "@/types";

export function useRegister() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [errors, setErrors] = useState<ValidationError>({});
  const [status, setStatus] = useState<LoadingStateEnum>(LoadingStateEnum.Idle);

  const register = useCallback(async (data: RegisterData) => {
    setErrors({});
    setStatus(LoadingStateEnum.Loading);

    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post<User>("/api/register", data);

      await mutate("/api/user", response.data, false);

      router.push("/dashboard");
    } catch (error) {
      const apiError = error as ApiErrorResponse;

      if (apiError.response?.status === 409) {
        const userData = apiError.response.data as unknown as User;

        await mutate("/api/user", userData, false);

        router.push("/verify-email");
        return;
      }

      if (apiError.response?.data?.errors) {
        setErrors(apiError.response.data.errors);
      }
      setStatus(LoadingStateEnum.Error);
    }
  }, [router, mutate]);

  return {
    register,
    errors,
    isLoading: status === LoadingStateEnum.Loading,
    status,
    clearErrors: () => setErrors({}),
  };
}