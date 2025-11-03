'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useWebhooks } from '@/hooks/useWebhooks';
import { useProjects } from '@/hooks/useProjects';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useToast } from '@/contexts/ToastContext';
import { WebhookRouteForm } from '@/components/webhooks/WebhookRouteForm';
import { useSlidePanel } from '@/hooks/useSlidePanel';

export function CreateWebhookRoutePanel() {
  const params = useParams();
  const projectId = params.id as string;
  const { createRoute } = useWebhooks(projectId);
  const { getProject } = useProjects();
  const { setProject } = useProjectContext();
  const { showToast } = useToast();
  const { close } = useSlidePanel();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await createRoute(data);
      const updatedProject = await getProject(projectId);
      setProject(updatedProject);
      showToast('Webhook route created successfully', 'success');
      close();
    } catch (error) {
      console.error('Failed to create webhook route:', error);
      showToast('Failed to create webhook route', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-discord-text-normal">
          Create Webhook Route
        </h2>
        <p className="text-discord-text-muted mt-1">
          Create a new public webhook route for your project
        </p>
      </div>

      <WebhookRouteForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
