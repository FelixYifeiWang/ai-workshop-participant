"use client";

import { useState, useRef } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import LoadingSpinner from "./LoadingSpinner";
import { UploadedFile } from "@/types/workshop";

const MAX_FILES = 3;
const ACCEPTED =
  ".pdf,.docx,.doc,image/png,image/jpeg,image/jpg,image/gif,image/webp";

export default function FileUploader() {
  const { state, dispatch } = useWorkshop();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function extractFile(file: File): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/extract-file", {
      method: "POST",
      headers: { "x-api-key": state.apiKey },
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(`${file.name}: ${data.error || "Failed to extract text"}`);
    }

    const data = await res.json();
    return { name: file.name, text: data.text };
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const selected = files.slice(0, MAX_FILES);
    if (files.length > MAX_FILES) {
      setError(`Only ${MAX_FILES} files allowed. Using the first ${MAX_FILES}.`);
    } else {
      setError(null);
    }

    setLoading(true);
    setProgress(`Processing ${selected.length} file${selected.length > 1 ? "s" : ""}...`);

    try {
      const results = await Promise.all(selected.map((f) => extractFile(f)));
      dispatch({ type: "SET_UPLOADED_FILES", payload: results });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      setProgress("");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clearFiles() {
    dispatch({ type: "SET_UPLOADED_FILES", payload: [] });
  }

  if (loading) {
    return <LoadingSpinner message={progress} />;
  }

  return (
    <div className="space-y-3">
      {/* Uploaded files list */}
      {state.uploadedFiles.length > 0 && (
        <>
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
            </div>
          ))}
          <button
            onClick={clearFiles}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear all and re-upload
          </button>
        </>
      )}

      {/* Upload area */}
      {state.uploadedFiles.length === 0 && (
        <>
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-400 transition-colors"
          >
            <p className="text-gray-500">Click to select up to 3 files</p>
            <p className="text-xs text-gray-400 mt-1">
              PDF, image, or DOCX
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
