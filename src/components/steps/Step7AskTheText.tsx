"use client";

import { useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import ImageUploader from "../ImageUploader";
import LoadingSpinner from "../LoadingSpinner";

export default function Step7AskTheText() {
  const { state, dispatch } = useWorkshop();
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const combinedText = state.uploadedFiles.map((f) => f.text).join("\n\n");
  const hasText = combinedText.trim().length > 0;

  async function generateQuestions() {
    if (!hasText) return;
    setQuestionsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: combinedText }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate questions");
      }

      const data = await res.json();
      dispatch({ type: "SET_GENERATED_QUESTIONS", payload: data.questions });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setQuestionsLoading(false);
    }
  }

  async function submitImages() {
    if (selectedFiles.length === 0) return;
    setResponseLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));

      const res = await fetch("/api/ocr-and-respond", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to process images");
      }

      const data = await res.json();
      dispatch({
        type: "SET_ADOPTED_QA",
        payload: { question: data.adoptedQuestion, response: data.response },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setResponseLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">
          Step 7: Ask the Text a Question
        </h2>
        <p className="text-gray-500 text-sm">
          The AI generates questions from the text, then reads your classmates&apos;
          questions and responds to one.
        </p>
      </div>

      {!hasText && (
        <p className="text-amber-600 text-sm">
          Please upload files in Step 6 first.
        </p>
      )}

      {hasText && !state.generatedQuestions && !questionsLoading && (
        <button
          onClick={generateQuestions}
          className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
        >
          Generate Questions
        </button>
      )}

      {questionsLoading && <LoadingSpinner message="Generating questions..." />}

      {state.generatedQuestions && (
        <div className="bg-amber-50 rounded-lg p-4">
          <h3 className="font-semibold text-sm mb-3 text-amber-800">
            AI&apos;s Questions for the Text
          </h3>
          <ol className="list-decimal list-inside space-y-2">
            {state.generatedQuestions.map((q, i) => (
              <li key={i} className="text-sm text-gray-700">
                {q}
              </li>
            ))}
          </ol>
        </div>
      )}

      {state.generatedQuestions && !state.adoptedQuestion && (
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-gray-700">
            Now upload photos of classroom questions to adopt one:
          </h3>
          <ImageUploader onFilesSelected={setSelectedFiles} />
          {selectedFiles.length > 0 && !responseLoading && (
            <button
              onClick={submitImages}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Submit and Get Response
            </button>
          )}
        </div>
      )}

      {responseLoading && (
        <LoadingSpinner message="Reading questions and writing response..." />
      )}

      {state.adoptedQuestion && state.adoptedResponse && (
        <div className="bg-blue-50 rounded-lg p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-sm text-blue-800">
              Adopted Question
            </h3>
            <p className="text-sm text-gray-700 mt-1">
              {state.adoptedQuestion}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-blue-800">
              AI&apos;s Response
            </h3>
            <p className="text-sm text-gray-700 mt-1">
              {state.adoptedResponse}
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
