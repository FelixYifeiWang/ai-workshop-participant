"use client";

import LoadingSpinner from "./LoadingSpinner";

interface DoodleDisplayProps {
  imageUrl: string | null;
  loading: boolean;
  label?: string;
}

export default function DoodleDisplay({
  imageUrl,
  loading,
  label,
}: DoodleDisplayProps) {
  if (loading) {
    return <LoadingSpinner message="Generating doodle..." />;
  }

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <p className="text-sm font-medium text-gray-700">{label}</p>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={label || "AI generated doodle"}
        className="rounded-lg shadow-md max-w-full h-auto"
        style={{ maxHeight: 400 }}
      />
    </div>
  );
}
