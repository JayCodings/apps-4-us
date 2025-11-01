import { useState, useCallback } from "react";
import axios from "@/lib/axios";
import { LoadingStateEnum } from "@/types";
import type { ApiErrorResponse } from "@/types";

export function useEmailVerification() {
  const [status, setStatus] = useState<LoadingStateEnum>(LoadingStateEnum.Idle);
  const [message, setMessage] = useState<string | null>(null);

  const resendEmailVerification = useCallback(async () => {
    setStatus(LoadingStateEnum.Loading);
    setMessage(null);

    try {
      const response = await axios.post("/api/email/verification-notification");
      setMessage(response.data.status);
      setStatus(LoadingStateEnum.Success);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      setMessage(apiError.response?.data?.message || "Failed to resend verification email");
      setStatus(LoadingStateEnum.Error);
    }
  }, []);

  const verifyEmail = useCallback(async (url: string) => {
    setStatus(LoadingStateEnum.Loading);

    try {
      await axios.get(url);
      setStatus(LoadingStateEnum.Success);
      return true;
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      setMessage(apiError.response?.data?.message || "Verification failed");
      setStatus(LoadingStateEnum.Error);
      return false;
    }
  }, []);

  return {
    resendEmailVerification,
    verifyEmail,
    status,
    message,
    isLoading: status === LoadingStateEnum.Loading,
  };
}