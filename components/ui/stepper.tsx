"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepProps {
  title: string;
  description?: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

export function Step({ title, description, isActive, isCompleted }: StepProps) {
  return (
    <div className="flex flex-col items-center relative">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-base font-semibold shadow-sm transition-all duration-200",
          isActive && "border-cyan-500 bg-cyan-50 text-cyan-600",
          isCompleted && "border-cyan-500 bg-cyan-500 text-white",
          !isActive && !isCompleted && "border-gray-200 bg-white text-gray-400"
        )}
      >
        {isCompleted ? (
          <Check className="h-5 w-5" />
        ) : (
          <span>{title}</span>
        )}
      </div>
      <div className="mt-3 text-center">
        <div
          className={cn(
            "text-sm font-medium mb-0.5 transition-colors duration-200",
            isActive && "text-cyan-600",
            isCompleted && "text-cyan-600",
            !isActive && !isCompleted && "text-gray-500"
          )}
        >
          {description}
        </div>
      </div>
    </div>
  );
}

interface StepperProps {
  steps: {
    title: string;
    description?: string;
  }[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("flex items-center w-full max-w-3xl mx-auto", className)}>
      {steps.map((step, index) => (
        <div key={step.title} className="flex items-center flex-1">
          <div className="flex-1">
            <Step
              title={step.title}
              description={step.description}
              isActive={currentStep === index}
              isCompleted={currentStep > index}
            />
          </div>
          {index !== steps.length - 1 && (
            <div className="w-full flex items-center justify-center px-2">
              <div
                className={cn(
                  "h-0.5 w-full bg-gray-200 transition-colors duration-200",
                  currentStep > index && "bg-cyan-500"
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
