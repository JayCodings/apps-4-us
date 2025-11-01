"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

interface MultiStepWizardProps {
  steps: React.ReactNode[];
  totalSteps: number;
  currentStep: number;
  onNext?: () => void;
  onBack?: () => void;
  onClose: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
  isLoading?: boolean;
  nextButtonText?: string;
  hideNextButton?: boolean;
  showProgress?: boolean;
}

export function MultiStepWizard({
  steps,
  totalSteps,
  currentStep,
  onNext,
  onBack,
  onClose,
  canGoBack = true,
  canGoNext = true,
  isLoading = false,
  nextButtonText = "Next",
  hideNextButton = false,
  showProgress = true,
}: MultiStepWizardProps) {
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isLoading, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-discord-card rounded-2xl border border-discord-dark w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar at Top */}
        {showProgress && (
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        )}

        {/* Header */}
        <div className="p-4 border-b border-discord-dark">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStep > 0 && canGoBack && (
                <button
                  onClick={onBack}
                  disabled={isLoading}
                  className="p-2 text-discord-text-muted hover:text-discord-text-normal hover:bg-discord-darker rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Go back"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-2 text-discord-text-muted hover:text-discord-text-normal hover:bg-discord-darker rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer with Navigation */}
        {!hideNextButton && onNext && (
          <div className="p-6 border-t border-discord-dark">
            <button
              onClick={onNext}
              disabled={!canGoNext || isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-purple-600 transition-all active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Loading..." : nextButtonText}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
