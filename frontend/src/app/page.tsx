"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { InputError } from "@/components/InputError";
import { Label } from "@/components/Label";
import { AuthCard } from "@/components/AuthCard";
import { AuthSessionStatus } from "@/components/AuthSessionStatus";
import { useLogin } from "@/hooks/useLogin";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const { login, errors, isLoading } = useLogin();
  const { checkAuth } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    const reset = searchParams.get("reset");
    if (reset && reset.length > 0) {
      setStatus(atob(reset));
    } else {
      setStatus(null);
    }
  }, [searchParams, checkAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({
      email,
      password,
      remember,
    });
  };

  return (
    <AuthCard>
      <AuthSessionStatus status={status} className="mb-4" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-discord-text-normal mb-6">Sign in to your account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" required className="text-discord-text-normal">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoFocus
              autoComplete="username"
              error={!!errors.email}
              className="mt-1 bg-discord-input text-discord-text-normal border-discord-light"
            />
            <InputError message={errors.email} />
          </div>

          <div>
            <Label htmlFor="password" required className="text-discord-text-normal">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              error={!!errors.password}
              className="mt-1 bg-discord-input text-discord-text-normal border-discord-light"
            />
            <InputError message={errors.password} />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-discord-light text-discord-blurple shadow-sm focus:ring-discord-blurple bg-discord-input"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="ml-2 text-sm text-discord-text-muted">Remember me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-sm text-discord-text-link hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-discord-blurple hover:bg-discord-blurple-hover"
            isLoading={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="w-full border-t border-discord-light" />

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-sm text-discord-text-muted">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-discord-text-link hover:underline transition-colors"
              >
                Sign up here
              </Link>
            </span>
          </motion.div>
        </div>
      </motion.div>
    </AuthCard>
  );
}