import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import type { ResetPasswordData, ApiErrorResponse, ValidationError } from "@/types";

export function usePasswordReset() {
  const router = useRouter();
  const [errors, setErrors] = useState<ValidationError>({});
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const forgotPassword = useCallback(async (email: string) => {
    setErrors({});
    setStatus(null);
    setLoading(true);

    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post("/api/forgot-password", { email });
      setStatus(response.data.status);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      if (apiError.response?.data?.errors) {
        setErrors(apiError.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (data: ResetPasswordData) => {
    setErrors({});
    setStatus(null);
    setLoading(true);

    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post("/api/reset-password", data);
      setStatus(response.data.status);
      router.push("/");
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      if (apiError.response?.data?.errors) {
        setErrors(apiError.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  return {
    forgotPassword,
    resetPassword,
    errors,
    status,
    isLoading: loading,
    clearErrors: () => setErrors({}),
  };
}