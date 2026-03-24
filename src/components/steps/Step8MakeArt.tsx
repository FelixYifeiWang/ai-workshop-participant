"use client";

import { useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import DoodleDisplay from "../DoodleDisplay";
import LoadingSpinner from "../LoadingSpinner";

export default function Step8MakeArt() {
  const { state, dispatch } = useWorkshop();
  const [word, setWord] = useState(state.wordInput || "");
  const [feelingLoading, setFeelingLoading] = useState(false);
  const [emotionLoading, setEmotionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateArt() {
    if (!word.trim()) return;
    setError(null);
    dispatch({ type: "SET_WORD_INPUT", payload: word.trim() });
    dispatch({
      type: "SET_WORD_ART",
      payload: { feelingUrl: "", emotionUrl: "" },
    });

    try {
      setFeelingLoading(true);
      const res = await fetch("/api/generate-word-art", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": state.apiKey,
        },
        body: JSON.stringify({ word: word.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate art");
      }

      const data = await res.json();

      // Show feeling image first
      setFeelingLoading(false);
      dispatch({
        type: "SET_WORD_ART",
        payload: {
          feelingUrl: data.feelingImageUrl,
          emotionUrl: "",
        },
      });

      // Brief pause before revealing emotion image
      setEmotionLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      setEmotionLoading(false);

      dispatch({
        type: "SET_WORD_ART",
        payload: {
          feelingUrl: data.feelingImageUrl,
          emotionUrl: data.emotionImageUrl,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setFeelingLoading(false);
      setEmotionLoading(false);
    }
  }

  const showResults =
    feelingLoading ||
    emotionLoading ||
    state.feelingImageUrl ||
    state.emotionImageUrl;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">
          Step 8: Make Art From the Text
        </h2>
        <p className="text-gray-500 text-sm">
          Full art generation is coming soon. For now, enter a word to explore
          the difference between its feeling and emotion.
        </p>
      </div>

      {/* TODO banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-yellow-700 font-medium text-sm">
          Full feature coming soon
        </p>
      </div>

      {/* Word art sub-feature */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Word Art Generator</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder='Enter a word (e.g. "angry")'
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
          />
          <button
            onClick={generateArt}
            disabled={!word.trim() || feelingLoading || emotionLoading}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Sequential doodle reveal */}
      {showResults && (
        <div className="space-y-6">
          {/* Feeling doodle */}
          {feelingLoading ? (
            <LoadingSpinner message="Generating feeling doodle..." />
          ) : (
            state.feelingImageUrl && (
              <DoodleDisplay
                imageUrl={state.feelingImageUrl}
                loading={false}
                label={`The feeling of "${state.wordInput || word}"`}
              />
            )
          )}

          {/* Emotion doodle (appears after feeling) */}
          {!feelingLoading && state.feelingImageUrl && (
            <>
              {emotionLoading ? (
                <LoadingSpinner message="Now generating emotion doodle with feeling as context..." />
              ) : (
                state.emotionImageUrl && (
                  <DoodleDisplay
                    imageUrl={state.emotionImageUrl}
                    loading={false}
                    label={`The emotion of "${state.wordInput || word}"`}
                  />
                )
              )}
            </>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
