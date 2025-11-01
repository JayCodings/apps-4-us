import { useMemo } from "react";
import { LayoutDashboard, Settings } from "lucide-react";

export function useUserAreaMenu() {
  return useMemo(
    () => ({
      userArea: {
        id: "userArea",
        items: [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard",
          },
          {
            id: "settings",
            label: "Settings",
            icon: Settings,
            path: "/dashboard/settings",
          },
        ],
      },
    }),
    []
  );
}
