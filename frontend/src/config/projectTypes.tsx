import { LucideIcon, Webhook } from "lucide-react";
import { WebhookProxyDetails } from "@/components/ProjectTypeDetails/WebhookProxyDetails";

export interface ProjectTypeConfig {
  type: string;
  name: string;
  icon: LucideIcon;
  shortDescription: string;
  detailsComponent: React.ComponentType;
  additionalSteps?: () => React.ReactNode[];
}

export const projectTypeConfig: Record<string, ProjectTypeConfig> = {
  "webhook-proxy": {
    type: "webhook-proxy",
    name: "Webhook Proxy",
    icon: Webhook,
    shortDescription: "Receive, process, and forward webhooks with advanced routing and monitoring",
    detailsComponent: WebhookProxyDetails,
    additionalSteps: () => []
  }
};

export function getProjectTypeConfig(type: string): ProjectTypeConfig | undefined {
  return projectTypeConfig[type];
}

export function getAllProjectTypes(): ProjectTypeConfig[] {
  return Object.values(projectTypeConfig);
}
