"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { User } from "@/types";

export interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

export function UserProfile({ user, onLogout }: UserProfileProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 rounded-md bg-discord-darkest px-2 py-1.5">
        <div
          className="flex items-center space-x-2 mr-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm">
            <div className="font-medium text-discord-text-normal truncate max-w-[100px]">
              {user.name}
            </div>
            <div className="text-xs text-discord-text-muted">Online</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="rounded p-1.5 hover:bg-discord-danger-bg transition-colors cursor-pointer group"
          aria-label="Logout"
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <LogOut className="h-4 w-4 text-discord-text-muted group-hover:text-discord-danger transition-colors" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 rounded-md bg-black px-3 py-2 text-sm text-white shadow-lg"
          >
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-gray-300">{user.email}</div>
            <div className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 bg-black" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
