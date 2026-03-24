"use client";

import { useState, useRef } from "react";

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

export default function ImageUploader({ onFilesSelected }: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    onFilesSelected(files);
  }

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-amber-400 transition-colors"
      >
        <p className="text-gray-500">Click to upload classroom question photos</p>
        <p className="text-xs text-gray-400 mt-1">You can select multiple images</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />
      {previews.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {previews.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`Preview ${i + 1}`}
              className="w-20 h-20 object-cover rounded border"
            />
          ))}
        </div>
      )}
    </div>
  );
}
