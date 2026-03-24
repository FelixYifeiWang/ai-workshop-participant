"use client";

import { useWorkshop } from "@/context/WorkshopContext";

export default function StepNavigation() {
  const { state, dispatch } = useWorkshop();
  const { currentStep } = state;

  function goTo(step: number) {
    dispatch({ type: "SET_STEP", payload: step });
  }

  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      {currentStep > 6 ? (
        <button
          onClick={() => goTo(currentStep - 1)}
          className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Previous
        </button>
      ) : (
        <div />
      )}
      {currentStep < 9 ? (
        <button
          onClick={() => goTo(currentStep + 1)}
          className="px-6 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors"
        >
          Next Step
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}
