"use client";

import { useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";

export default function ApiKeyInput() {
  const { dispatch } = useWorkshop();
  const [key, setKey] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (key.trim()) {
      dispatch({ type: "SET_API_KEY", payload: key.trim() });
      dispatch({ type: "SET_STEP", payload: 6 });
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold mb-2">Get Started</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your OpenAI API key to power the AI features.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
          />
          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Start Workshop
          </button>
        </form>
      </div>
    </div>
  );
}
