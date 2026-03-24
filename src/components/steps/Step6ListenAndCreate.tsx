"use client";

import { useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import FileUploader from "../FileUploader";
import DoodleDisplay from "../DoodleDisplay";
import LoadingSpinner from "../LoadingSpinner";

export default function Step6ListenAndCreate() {
  const { state, dispatch } = useWorkshop();
  const [loadingIndex, setLoadingIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const hasFiles = state.uploadedFiles.length > 0;
  const allDoodlesGenerated =
    state.doodleUrls.length === state.uploadedFiles.length &&
    state.doodleUrls.length > 0;

  async function generateDoodles() {
    setError(null);
    const urls: string[] = [];

    for (let i = 0; i < state.uploadedFiles.length; i++) {
      setLoadingIndex(i);
      try {
        const res = await fetch("/api/generate-doodle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": state.apiKey,
          },
          body: JSON.stringify({ text: state.uploadedFiles[i].text }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to generate doodle");
        }

        const data = await res.json();
        urls.push(data.imageUrl);
        // Update incrementally so doodles appear one by one
        dispatch({ type: "SET_DOODLE_URLS", payload: [...urls] });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
        setLoadingIndex(-1);
        return;
      }
    }

    setLoadingIndex(-1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Step 6: Listen and Create</h2>
        <p className="text-gray-500 text-sm">
          Upload up to 3 files (PDF, image, or DOCX). The AI will create a
          doodle for each while &quot;listening&quot; to them.
        </p>
      </div>

      <FileUploader />

      {hasFiles && !allDoodlesGenerated && loadingIndex === -1 && (
        <button
          onClick={generateDoodles}
          className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
        >
          Generate {state.uploadedFiles.length} Doodle
          {state.uploadedFiles.length > 1 ? "s" : ""}
        </button>
      )}

      {/* Doodles grid */}
      {(state.doodleUrls.length > 0 || loadingIndex >= 0) && (
        <div className="space-y-6">
          {state.uploadedFiles.map((file, i) => (
            <div key={i}>
              {i < state.doodleUrls.length ? (
                <DoodleDisplay
                  imageUrl={state.doodleUrls[i]}
                  loading={false}
                  label={`Doodle for "${file.name}"`}
                />
              ) : i === loadingIndex ? (
                <LoadingSpinner
                  message={`Generating doodle ${i + 1} of ${state.uploadedFiles.length}...`}
                />
              ) : null}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
