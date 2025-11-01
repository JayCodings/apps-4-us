"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MultiStepWizard } from "@/components/MultiStepWizard";
import { Step1TypeSelection } from "./steps/Step1TypeSelection";
import { StepProjectInfo } from "./steps/StepProjectInfo";
import { StepSuccess } from "./steps/StepSuccess";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/contexts/ToastContext";
import type { Project } from "@/types";
import { getProjectTypeConfig } from "@/config/projectTypes";

interface ProjectCreationFlowProps {
  onClose: () => void;
}

export function ProjectCreationFlow({ onClose }: ProjectCreationFlowProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { projects, createProject } = useProjects();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createdProject, setCreatedProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState(false);

  // Handler functions
  const handleTypeSelection = useCallback((type: string) => {
    setSelectedType(type);
    setShowProgress(true); // Show progress once type is selected
    setCurrentStep(1); // Move to Type Details
  }, []);

  const handleProjectSubmit = useCallback(async (data: { name: string; description?: string }) => {
    if (!selectedType) return;

    setIsLoading(true);
    setError(null);

    try {
      const project = await createProject({
        type: selectedType,
        name: data.name,
        description: data.description
      });

      setCreatedProject(project);
      setCurrentStep((prev) => prev + 1); // Move to Success step
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create project";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }, [selectedType, createProject, showToast]);

  const handleNavigateToProject = useCallback(() => {
    if (createdProject) {
      router.push(`/projects/${createdProject.id}`);
      // Close modal after navigation starts
      setTimeout(() => {
        onClose();
      }, 100);
    }
  }, [createdProject, onClose, router]);

  // Build steps dynamically based on selected type
  const steps = useMemo(() => {
    const baseSteps: React.ReactNode[] = [
      // Step 0: Type Selection
      <Step1TypeSelection
        key="type-selection"
        user={user!}
        projects={projects || []}
        onSelectType={handleTypeSelection}
      />
    ];

    if (selectedType) {
      const config = getProjectTypeConfig(selectedType);
      if (config) {
        // Step 1: Type Details
        const DetailsComponent = config.detailsComponent;
        baseSteps.push(<DetailsComponent key="type-details" />);

        // Additional steps (if any)
        const additionalSteps = config.additionalSteps?.() || [];
        additionalSteps.forEach((step, index) => {
          baseSteps.push(<div key={`additional-${index}`}>{step}</div>);
        });

        // Step N: Project Info
        baseSteps.push(
          <StepProjectInfo
            key="project-info"
            projectType={selectedType}
            onSubmit={handleProjectSubmit}
            isLoading={isLoading}
          />
        );
      }
    }

    // Step Final: Success (only after project is created)
    if (createdProject) {
      baseSteps.push(
        <StepSuccess
          key="success"
          project={createdProject}
          onNavigateToProject={handleNavigateToProject}
        />
      );
    }

    return baseSteps;
  }, [user, projects, selectedType, isLoading, createdProject, handleTypeSelection, handleProjectSubmit, handleNavigateToProject]);

  const totalSteps = useMemo(() => {
    if (!selectedType) return 1;

    const config = getProjectTypeConfig(selectedType);
    const additionalStepsCount = config?.additionalSteps?.().length || 0;

    // Type Selection + Type Details + Additional Steps + Project Info + Success
    return 1 + 1 + additionalStepsCount + 1 + 1;
  }, [selectedType]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      // Hide progress when going back to type selection
      if (newStep === 0) {
        setShowProgress(false);
      }
    }
  };

  const canGoBack = currentStep > 0 && !isLoading && !createdProject;
  const canGoNext = currentStep < steps.length - 1 && !isLoading;

  // Calculate the index of the Project Info step
  const projectInfoStepIndex = steps.length - (createdProject ? 2 : 1);

  // Hide next button on Type Selection, Project Info (has submit), and Success steps
  const hideNextButton = currentStep === 0 ||
                          currentStep === projectInfoStepIndex ||
                          currentStep === steps.length - 1;

  return (
    <MultiStepWizard
      steps={steps}
      totalSteps={totalSteps}
      currentStep={currentStep}
      onNext={handleNext}
      onBack={handleBack}
      onClose={onClose}
      canGoBack={canGoBack}
      canGoNext={canGoNext}
      isLoading={isLoading}
      nextButtonText="Continue"
      hideNextButton={hideNextButton}
      showProgress={showProgress}
    />
  );
}
