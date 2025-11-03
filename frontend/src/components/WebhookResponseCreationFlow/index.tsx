"use client";

import { useState, useMemo, useCallback } from "react";
import { MultiStepWizard } from "@/components/MultiStepWizard";
import { Step1TypeSelection } from "./steps/Step1TypeSelection";
import { Step2Configuration } from "./steps/Step2Configuration";
import { Step3Success } from "./steps/Step3Success";
import { useWebhookResponses } from "@/hooks/useWebhookResponses";
import { useToast } from "@/contexts/ToastContext";
import type { WebhookResponse, WebhookResponseType } from "@/types/webhook";

interface WebhookResponseCreationFlowProps {
  routeId: string;
  onClose: () => void;
}

export function WebhookResponseCreationFlow({ routeId, onClose }: WebhookResponseCreationFlowProps) {
  const { createResponse, activateResponse } = useWebhookResponses(routeId);
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [responseType, setResponseType] = useState<WebhookResponseType | null>(null);
  const [responseName, setResponseName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [createdResponse, setCreatedResponse] = useState<WebhookResponse | null>(null);
  const [showProgress, setShowProgress] = useState(false);

  const handleTypeSelection = useCallback((type: WebhookResponseType, name: string) => {
    setResponseType(type);
    setResponseName(name);
    setShowProgress(true);
    setCurrentStep(1);
  }, []);

  const handleConfigurationSubmit = useCallback(async (config: any) => {
    if (!responseType || !responseName) return;

    setIsLoading(true);

    try {
      const response = await createResponse({
        name: responseName,
        type: responseType,
        ...config,
      });

      setCreatedResponse(response);
      showToast("Webhook response created successfully", "success");
      setCurrentStep(2);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to create webhook response";
      showToast(errorMessage, "error");
      console.error("Failed to create webhook response:", error);
    } finally {
      setIsLoading(false);
    }
  }, [responseType, responseName, createResponse, showToast]);

  const handleActivate = useCallback(async () => {
    if (!createdResponse) return;

    setIsActivating(true);

    try {
      await activateResponse(createdResponse.id);
      showToast("Response activated successfully", "success");
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to activate response";
      showToast(errorMessage, "error");
      console.error("Failed to activate response:", error);
    } finally {
      setIsActivating(false);
    }
  }, [createdResponse, activateResponse, showToast, onClose]);

  const steps = useMemo(() => {
    const stepComponents: React.ReactNode[] = [
      <Step1TypeSelection key="type-selection" onSelect={handleTypeSelection} />,
    ];

    if (responseType) {
      stepComponents.push(
        <Step2Configuration
          key="configuration"
          type={responseType}
          onSubmit={handleConfigurationSubmit}
          isLoading={isLoading}
        />
      );
    }

    if (createdResponse) {
      stepComponents.push(
        <Step3Success
          key="success"
          response={createdResponse}
          onActivate={handleActivate}
          onClose={onClose}
          isActivating={isActivating}
        />
      );
    }

    return stepComponents;
  }, [responseType, createdResponse, handleTypeSelection, handleConfigurationSubmit, handleActivate, onClose, isLoading, isActivating]);

  const totalSteps = useMemo(() => {
    if (!responseType) return 1;
    if (!createdResponse) return 2;
    return 3;
  }, [responseType, createdResponse]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      if (newStep === 0) {
        setShowProgress(false);
      }
    }
  };

  const canGoBack = currentStep > 0 && !isLoading && !createdResponse;
  const canGoNext = currentStep < steps.length - 1 && !isLoading;

  const hideNextButton = currentStep === 0 || currentStep === 1 || currentStep === steps.length - 1;

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
