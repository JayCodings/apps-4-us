"use client";

import { ApplicationLogo } from "@/components/ApplicationLogo";
import Link from "next/link";
import { motion } from "framer-motion";

export interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-discord-primary"
    >
      <div>
        <Link href="/" className="block">
          <ApplicationLogo className="w-20 h-20 fill-current text-discord-blurple" />
        </Link>
      </div>

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="w-full sm:max-w-md mt-6 px-6 py-8 bg-discord-card overflow-hidden sm:rounded-lg"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}