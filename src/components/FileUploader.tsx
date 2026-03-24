"use client";

import { useState, useRef } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import LoadingSpinner from "./LoadingSpinner";

const MAX_FILES = 3;
const ACCEPTED =
  ".pdf,.docx,.doc,image/png,image/jpeg,image/jpg,image/gif,image/webp";

export default function FileUploader() {
  const { state, dispatch } = useWorkshop();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const remaining = MAX_FILES - state.uploadedFiles.length;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (state.uploadedFiles.length >= MAX_FILES) {
      setError("Maximum 3 files allowed.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/extract-file", {
        method: "POST",
        headers: { "x-api-key": state.apiKey },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to extract text");
      }

      const data = await res.json();
      dispatch({
        type: "ADD_UPLOADED_FILE",
        payload: { name: file.name, text: data.text },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeFile(index: number) {
    dispatch({ type: "REMOVE_UPLOADED_FILE", payload: index });
  }

  return (
    <div className="space-y-3">
      {/* Uploaded files list */}
      {state.uploadedFiles.map((f, i) => (
        <div
          key={i}
          className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between"
        >
          <div>
            <p className="text-green-700 font-medium text-sm">{f.name}</p>
            <p className="text-xs text-green-600">
              {f.text.length} characters extracted
            </p>
          </div>
          <button
            onClick={() => removeFile(i)}
            className="text-gray-400 hover:text-red-500 text-lg px-2"
          >
            &times;
          </button>
        </div>
      ))}

      {/* Upload area */}
      {loading ? (
        <LoadingSpinner message="Extracting text from file..." />
      ) : remaining > 0 ? (
        <>
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-amber-400 transition-colors"
          >
            <p className="text-gray-500">Click to upload a file</p>
            <p className="text-xs text-gray-400 mt-1">
              PDF, image, or DOCX ({remaining} remaining)
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      ) : (
        <p className="text-sm text-gray-500 text-center">
          All 3 files uploaded.
        </p>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
