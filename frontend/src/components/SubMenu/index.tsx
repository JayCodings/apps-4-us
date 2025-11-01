"use client";

import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useSubMenuContext } from "@/contexts/SubMenuContext";
import type { Project } from "@/types";

export interface SubMenuProps {
  project: Project | null;
  width?: number;
  disableAnimation?: boolean;
  onNavigate?: () => void;
}

export function SubMenu({ project, width, onNavigate }: SubMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { sections, title } = useSubMenuContext();

  const hasFixedWidth = width !== undefined;
  const style = hasFixedWidth
    ? { width, transition: "width 0.1s linear" }
    : {};

  const hasSections = sections.length > 0;
  const displayTitle = project?.name || title;

  return (
    <div
      style={style}
      className={`bg-discord-darker flex flex-col border-l border-t border-discord-dark rounded-tl-lg ${
        !hasFixedWidth ? "flex-1" : ""
      }`}
    >
      {/* Header - always show if we have a title */}
      <div className="h-12 px-4 flex items-center border-b border-discord-dark overflow-hidden">
        <AnimatePresence mode="wait">
          {displayTitle && (
            <motion.h2
              key={displayTitle}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="font-semibold text-discord-text-normal truncate"
            >
              {displayTitle}
            </motion.h2>
          )}
        </AnimatePresence>
      </div>

      {/* Menu - show if sections exist */}
      {hasSections && (
        <div className="flex-1 overflow-y-auto p-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={sections.map((s) => s.id).join("-")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {sections.map((section) => (
                <div key={section.id} className="mb-4 last:mb-0">
                  {section.label && (
                    <div className="px-2 py-1 text-xs font-semibold text-discord-text-muted uppercase tracking-wider">
                      {section.label}
                    </div>
                  )}
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const isActive = pathname === item.path;
                      const Icon = item.icon;

                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => {
                            router.push(item.path);
                            onNavigate?.();
                          }}
                          animate={{
                            backgroundColor: isActive ? "#404249" : "#2c2d32"
                          }}
                          whileHover={!isActive ? { backgroundColor: "#404249", color :  "#F2F3F5"} : {}}
                          whileTap={!isActive ? { backgroundColor: "#35373C"} : {}}
                          transition={{ duration: 0.15 }}
                          style={isActive ? { backgroundColor: "#35373C", color :  "#F2F3F5" } : {}}
                          className={`w-full px-2 py-1.5 flex items-center rounded cursor-pointer ${
                            isActive
                              ? "text-discord-text-normal"
                              : "text-discord-text-muted"
                          }`}
                        >
                          <Icon className="w-5 h-5 mr-2" />
                          <span className="text-sm">{item.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
