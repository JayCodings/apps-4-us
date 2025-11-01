"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { mutate as globalMutate } from "swr";
import { MultiStepWizard } from "@/components/MultiStepWizard";
import { Step1FeatureSelection } from "./steps/Step1FeatureSelection";
import { Step2Confirmation } from "./steps/Step2Confirmation";
import { Step3Success } from "./steps/Step3Success";
import { useFeatures } from "@/hooks/useFeatures";
import { useToast } from "@/contexts/ToastContext";
import { useActionModalContext } from "@/contexts/ActionModalContext";

interface SelectFreeFeatureFlowProps {
  onClose: () => void;
}

export function SelectFreeFeatureFlow({ onClose }: SelectFreeFeatureFlowProps) {
  const router = useRouter();
  const { assignFreeFeature } = useFeatures();
  const { showToast } = useToast();
  const { openAction } = useActionModalContext();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);

  // Handler functions
  const handleTypeSelection = useCallback((type: string) => {
    setSelectedType(type);
    setCurrentStep(1); // Move to Confirmation
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!selectedType) return;

    setIsLoading(true);

    try {
      // Don't revalidate immediately to prevent modal content switch
      await assignFreeFeature(selectedType, false);
      setIsAssigned(true);
      setCurrentStep(2); // Move to Success
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to assign feature";
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }, [selectedType, assignFreeFeature, showToast]);

  const handleCreateProject = useCallback(async () => {
    // Revalidate user data now that we're leaving
    await globalMutate("/api/user");
    onClose();
    // Small delay to ensure modal is closed before opening new one
    setTimeout(() => {
      openAction("create-project");
    }, 300);
  }, [onClose, openAction]);

  const handleBackToDashboard = useCallback(async () => {
    // Revalidate user data now that we're leaving
    await globalMutate("/api/user");
    onClose();
    router.push("/dashboard");
  }, [onClose, router]);

  // Build steps
  const steps = useMemo(() => {
    const stepComponents: React.ReactNode[] = [
      // Step 0: Feature Selection
      <Step1FeatureSelection
        key="feature-selection"
        onSelectType={handleTypeSelection}
      />
    ];

    if (selectedType) {
      // Step 1: Confirmation
      stepComponents.push(
        <Step2Confirmation
          key="confirmation"
          selectedType={selectedType}
          onConfirm={handleConfirm}
          isLoading={isLoading}
        />
      );
    }

    if (isAssigned) {
      // Step 2: Success
      stepComponents.push(
        <Step3Success
          key="success"
          selectedType={selectedType!}
          onCreateProject={handleCreateProject}
          onBackToDashboard={handleBackToDashboard}
        />
      );
    }

    return stepComponents;
  }, [selectedType, isAssigned, isLoading, handleTypeSelection, handleConfirm, handleCreateProject, handleBackToDashboard]);

  const totalSteps = 3; // Always 3 steps: Selection -> Confirmation -> Success

  const handleNext = useCallback(() => {
    if (currentStep === 1 && selectedType) {
      // On confirmation step, call handleConfirm
      handleConfirm();
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, selectedType, steps.length, handleConfirm]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const canGoBack = currentStep > 0 && !isLoading && !isAssigned;
  // On confirmation step (1), button should be enabled even if it's the last current step
  const canGoNext = (currentStep === 1 || currentStep < steps.length - 1) && !isLoading && !isAssigned;

  // Hide next button on Feature Selection (step 0) and Success (step 2)
  const hideNextButton = currentStep === 0 || currentStep === 2;
  const nextButtonText = currentStep === 1 ? "Confirm Selection" : "Next";

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
      nextButtonText={nextButtonText}
      hideNextButton={hideNextButton}
    />
  );
}
