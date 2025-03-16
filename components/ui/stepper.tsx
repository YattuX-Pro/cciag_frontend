"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface StepProps {
  title: string;
  description?: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

export function Step({ title, description, isActive, isCompleted }: StepProps) {
  return (
    <div className="flex flex-col items-center relative">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          backgroundColor: isCompleted ? "rgb(6 182 212)" : isActive ? "rgb(236 254 255)" : "white",
          borderColor: isCompleted || isActive ? "rgb(6 182 212)" : "rgb(229 231 235)"
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-base font-semibold shadow-sm relative z-10 bg-white",
          isActive && "border-cyan-500 bg-cyan-50 text-cyan-600",
          isCompleted && "border-cyan-500 bg-cyan-500 text-white",
          !isActive && !isCompleted && "border-gray-200 bg-white text-gray-400"
        )}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.2 }}
        >
          {isCompleted ? (
            <Check className="h-6 w-6" />
          ) : (
            <span>{title}</span>
          )}
        </motion.div>
      </motion.div>
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mt-4 text-center"
      >
        <div
          className={cn(
            "text-sm font-medium transition-colors duration-300",
            isActive && "text-cyan-600",
            isCompleted && "text-cyan-600",
            !isActive && !isCompleted && "text-gray-500"
          )}
        >
          {description}
        </div>
      </motion.div>
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
    <div className={cn("flex items-center justify-between w-full max-w-4xl mx-auto py-6", className)}>
      {steps.map((step, index) => (
        <div key={step.title} className="flex items-center relative flex-1">
          <div className="flex-1">
            <Step
              title={step.title}
              description={step.description}
              isActive={currentStep === index}
              isCompleted={currentStep > index}
            />
          </div>
          {index !== steps.length - 1 && (
            <div className="absolute left-1/2 right-0 top-6 -translate-y-1/2 flex items-center justify-center w-full z-0">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: 1,
                  backgroundColor: currentStep > index ? "rgb(6 182 212)" : "rgb(229 231 235)"
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={cn(
                  "h-0.5 w-full origin-left",
                  currentStep > index && "bg-cyan-500",
                  currentStep <= index && "bg-gray-200"
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
