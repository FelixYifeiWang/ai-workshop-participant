"use client";

import { useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { WordArtPair } from "@/types/workshop";
import DoodleDisplay from "../DoodleDisplay";
import LoadingSpinner from "../LoadingSpinner";

export default function Step8MakeArt() {
  const { state, dispatch } = useWorkshop();
  const [input, setInput] = useState(state.wordInputs.join(", ") || "");
  const [generating, setGenerating] = useState(false);
  const [currentLabel, setCurrentLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  function parseWords(raw: string): string[] {
    return raw
      .split(",")
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w.length > 0);
  }

  async function generateAll() {
    const words = parseWords(input);
    if (words.length === 0) return;

    setError(null);
    setGenerating(true);
    dispatch({ type: "SET_WORD_INPUTS", payload: words });
    dispatch({ type: "SET_WORD_ART_PAIRS", payload: [] });

    const pairs: WordArtPair[] = [];

    for (const word of words) {
      try {
        // Generate feeling + emotion for this word
        setCurrentLabel(`Generating feeling doodle for "${word}"...`);

        const res = await fetch("/api/generate-word-art", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || `Failed to generate art for "${word}"`);
        }

        const data = await res.json();

        // Show feeling first
        const partialPair: WordArtPair = {
          word,
          feelingUrl: data.feelingImageUrl,
          emotionUrl: "",
        };
        dispatch({
          type: "SET_WORD_ART_PAIRS",
          payload: [...pairs, partialPair],
        });

        // Brief pause then reveal emotion
        setCurrentLabel(`Revealing emotion doodle for "${word}"...`);
        await new Promise((r) => setTimeout(r, 800));

        const completePair: WordArtPair = {
          word,
          feelingUrl: data.feelingImageUrl,
          emotionUrl: data.emotionImageUrl,
        };
        pairs.push(completePair);
        dispatch({ type: "SET_WORD_ART_PAIRS", payload: [...pairs] });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setGenerating(false);
        setCurrentLabel("");
        return;
      }
    }

    setGenerating(false);
    setCurrentLabel("");
  }

  const hasResults = state.wordArtPairs.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">
          Step 8: Make Art From the Text
        </h2>
        <p className="text-gray-500 text-sm">
          Full art generation is coming soon. For now, enter words separated by
          commas to explore the difference between feeling and emotion for each.
        </p>
      </div>

      {/* Word art input */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Word Art Generator</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='e.g. "angry, sad, joyful"'
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
          />
          <button
            onClick={generateAll}
            disabled={parseWords(input).length === 0 || generating}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Generate
          </button>
        </div>
        {parseWords(input).length > 1 && !generating && (
          <p className="text-xs text-gray-400">
            {parseWords(input).length} words: {parseWords(input).join(", ")}
          </p>
        )}
      </div>

      {/* Results */}
      {(hasResults || generating) && (
        <div className="space-y-8">
          {state.wordArtPairs.map((pair, i) => (
            <div key={i} className="space-y-4">
              <h4 className="font-semibold text-gray-600 text-sm border-b pb-1">
                &ldquo;{pair.word}&rdquo;
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DoodleDisplay
                  imageUrl={pair.feelingUrl}
                  loading={false}
                  label={`Feeling of "${pair.word}"`}
                />
                {pair.emotionUrl ? (
                  <DoodleDisplay
                    imageUrl={pair.emotionUrl}
                    loading={false}
                    label={`Emotion of "${pair.word}"`}
                  />
                ) : (
                  <LoadingSpinner message={`Generating emotion doodle for "${pair.word}"...`} />
                )}
              </div>
            </div>
          ))}

          {generating && currentLabel && state.wordArtPairs.length < state.wordInputs.length && (
            <LoadingSpinner message={currentLabel} />
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
