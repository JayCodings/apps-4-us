"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Users, Server, Settings2 } from "lucide-react";
import { useSubMenuRegistry } from "@/hooks/useSubMenuRegistry";
import { useSubMenuContext } from "@/contexts/SubMenuContext";
import { useUserAreaMenu } from "@/hooks/useUserAreaMenu";

const statsData = [
  { id: "webhooks", icon: Activity, label: "Active Webhooks", value: "12", trend: "+2.5%" },
  { id: "members", icon: Users, label: "Team Members", value: "8", trend: "+1" },
  { id: "projects", icon: Server, label: "Projects", value: "3", trend: "0" },
  { id: "configs", icon: Settings2, label: "Configurations", value: "24", trend: "+3" },
];

export function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const userAreaMenu = useUserAreaMenu();
  const { setTitle } = useSubMenuContext();

  useSubMenuRegistry(userAreaMenu);

  useEffect(() => {
    setTitle("User Area");
    return () => setTitle(null);
  }, [setTitle]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-6">
      {/* Welcome Card */}
      <div className="bg-discord-card rounded-lg p-6 mb-6">
        <h2 className="text-3xl font-bold text-discord-text-normal mb-3">
          Welcome to Webhook Proxy
        </h2>
        <p className="text-discord-text-muted text-lg">
          You're successfully logged in! Start managing your webhooks and projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat) => (
          <div
            key={stat.id}
            className="bg-discord-card rounded-lg p-4 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="h-8 w-8 text-indigo-500" />
              <span className="text-xs text-green-400 font-medium">{stat.trend}</span>
            </div>
            <h3 className="text-2xl font-bold text-discord-text-normal">{stat.value}</h3>
            <p className="text-sm text-discord-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-discord-card rounded-lg p-6">
        <h3 className="text-xl font-bold text-discord-text-normal mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((id) => (
            <div
              key={`activity-${id}`}
              className="flex items-center p-3 bg-discord-darkest rounded-md hover:bg-opacity-70 transition-colors"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
              <div className="flex-1">
                <p className="text-discord-text-normal text-sm">
                  Webhook triggered for project "Development"
                </p>
                <p className="text-discord-text-muted text-xs">2 minutes ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;