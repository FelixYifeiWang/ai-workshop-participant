"use client";

import { useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import LoadingSpinner from "../LoadingSpinner";

export default function Step9ShareReflection() {
  const { state, dispatch } = useWorkshop();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const combinedText = state.uploadedFiles.map((f) => f.text).join("\n\n");

  async function generateReflection() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-reflection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": state.apiKey,
        },
        body: JSON.stringify({
          extractedTextSnippet: combinedText.slice(0, 200) || null,
          doodleGenerated: state.doodleUrls.length > 0,
          doodleCount: state.doodleUrls.length,
          questionsGenerated: !!state.generatedQuestions,
          questionAdopted: state.adoptedQuestion,
          wordUsed: state.wordInput,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate reflection");
      }

      const data = await res.json();
      dispatch({ type: "SET_REFLECTION", payload: data.reflection });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">
          Step 9: Share What You&apos;ve Done
        </h2>
        <p className="text-gray-500 text-sm">
          The AI reflects on its workshop experience in 2-3 sentences.
        </p>
      </div>

      {!state.reflection && !loading && (
        <button
          onClick={generateReflection}
          className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
        >
          Generate Reflection
        </button>
      )}

      {loading && <LoadingSpinner message="Reflecting on the workshop..." />}

      {state.reflection && (
        <blockquote className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-6">
          <p className="text-gray-800 italic leading-relaxed">
            {state.reflection}
          </p>
        </blockquote>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
