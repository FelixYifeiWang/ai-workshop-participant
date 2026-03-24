"use client";

import { useWorkshop } from "@/context/WorkshopContext";
import ApiKeyInput from "./ApiKeyInput";
import StepNavigation from "./StepNavigation";
import Step6ListenAndCreate from "./steps/Step6ListenAndCreate";
import Step7AskTheText from "./steps/Step7AskTheText";
import Step8MakeArt from "./steps/Step8MakeArt";
import Step9ShareReflection from "./steps/Step9ShareReflection";

const STEP_LABELS: Record<number, string> = {
  6: "Listen and Create",
  7: "Ask the Text a Question",
  8: "Make Art From the Text",
  9: "Share What You've Done",
};

export default function StepWizard() {
  const { state } = useWorkshop();
  const { currentStep } = state;

  if (currentStep === 0) {
    return <ApiKeyInput />;
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {[6, 7, 8, 9].map((step) => (
          <div key={step} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`h-1.5 w-full rounded-full transition-colors ${
                step <= currentStep ? "bg-amber-500" : "bg-gray-200"
              }`}
            />
            <span
              className={`text-xs ${
                step === currentStep
                  ? "text-amber-700 font-semibold"
                  : "text-gray-400"
              }`}
            >
              {STEP_LABELS[step]}
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {currentStep === 6 && <Step6ListenAndCreate />}
        {currentStep === 7 && <Step7AskTheText />}
        {currentStep === 8 && <Step8MakeArt />}
        {currentStep === 9 && <Step9ShareReflection />}
        <StepNavigation />
      </div>
    </div>
  );
}
