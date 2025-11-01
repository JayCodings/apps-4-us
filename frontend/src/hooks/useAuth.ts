import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import axios from "@/lib/axios";
import type { User, ApiErrorResponse } from "@/types";

interface UseAuthOptions {
  middleware?: "guest" | "auth";
  redirectIfAuthenticated?: string;
}

export function useAuth({
  middleware,
  redirectIfAuthenticated
}: UseAuthOptions = {}) {
  const router = useRouter();
  const redirectingRef = useRef(false);

  const { data: user, error, mutate } = useSWR<User>(
    "/api/user",
    () =>
      axios
        .get("/api/user")
        .then((res) => res.data)
        .catch((error) => {
          if (error.response?.status !== 409) throw error;
          router.replace("/verify-email");
        }),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      shouldRetryOnError: false,
    }
  );

  const csrf = useCallback(() => axios.get("/sanctum/csrf-cookie"), []);

  const logout = useCallback(async () => {
    await axios.post("/api/logout");
    mutate(undefined);
    window.location.pathname = "/";
  }, [mutate]);

  const checkAuth = useCallback(() => {
    if (redirectingRef.current) return;

    const isLoading = !user && !error;
    if (isLoading) return;

    if (middleware === "guest" && redirectIfAuthenticated && user) {
      redirectingRef.current = true;
      router.replace(redirectIfAuthenticated);
      return;
    }

    if (window.location.pathname === "/verify-email" && user?.email_verified_at) {
      redirectingRef.current = true;
      router.replace(redirectIfAuthenticated ?? "/dashboard");
      return;
    }

    if (middleware === "auth" && !user) {
      redirectingRef.current = true;
      router.replace("/");
      return;
    }
  }, [middleware, redirectIfAuthenticated, user, error, router]);

  useEffect(() => {
    if (middleware) {
      checkAuth();
    }
  }, [middleware, checkAuth]);

  return {
    user,
    csrf,
    logout,
    checkAuth,
    isLoading: !user && !error,
    isAuthenticated: !!user,
  };
}