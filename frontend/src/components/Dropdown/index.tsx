"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

export interface DropdownProps {
  children: React.ReactNode;
  align?: "left" | "right";
  width?: "48";
  contentClasses?: string;
  trigger: React.ReactNode;
}

export function Dropdown({
  children,
  align = "right",
  width = "48",
  contentClasses = "bg-white",
  trigger,
}: DropdownProps) {
  const alignmentClasses = align === "left" ? "left-0" : "right-0";
  const widthClasses = width === "48" ? "w-48" : "";

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Fragment}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex cursor-pointer"
        >
          {trigger}
        </motion.div>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            "absolute z-50 mt-2 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
            alignmentClasses,
            widthClasses,
            contentClasses
          )}
        >
          <div className="py-1">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export interface DropdownLinkProps {
  href: string;
  children: React.ReactNode;
  method?: "get" | "post";
  as?: "a" | "button";
  className?: string;
  onClick?: () => void;
}

export function DropdownLink({
  href,
  children,
  method = "get",
  as = "a",
  className,
  onClick,
}: DropdownLinkProps) {
  return (
    <Menu.Item>
      {({ active }) => {
        if (method !== "get") {
          return (
            <button
              type="submit"
              className={cn(
                "flex w-full items-center px-4 py-2 text-left text-sm transition-colors duration-150",
                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                className
              )}
              onClick={onClick}
            >
              {children}
            </button>
          );
        }

        if (as === "button") {
          return (
            <button
              className={cn(
                "flex w-full items-center px-4 py-2 text-left text-sm transition-colors duration-150",
                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                className
              )}
              onClick={onClick}
            >
              {children}
            </button>
          );
        }

        return (
          <Link
            href={href}
            className={cn(
              "flex w-full items-center px-4 py-2 text-sm transition-colors duration-150",
              active ? "bg-gray-100 text-gray-900" : "text-gray-700",
              className
            )}
            onClick={onClick}
          >
            {children}
          </Link>
        );
      }}
    </Menu.Item>
  );
}

export interface DropdownButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownButton({ children, className }: DropdownButtonProps) {
  return (
    <button className={cn("inline-flex items-center", className)}>
      {children}
    </button>
  );
}