"use client";
import { MAX_GUESSES } from "@/lib/constants";

interface GameHeaderProps {
  puzzleId: number;
  guessCount: number;
  mode: "heatmap" | "cityfinder";
}

export default function GameHeader({ puzzleId, guessCount, mode }: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto px-4 py-3 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-wider text-gray-900">
          CENSUS
        </h1>
        <span className="text-gray-400 text-sm font-mono">#{puzzleId}</span>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            mode === "heatmap"
              ? "bg-violet-100 text-violet-700"
              : "bg-cyan-100 text-cyan-700"
          }`}
        >
          {mode === "heatmap" ? "HEATMAP" : "CITY FINDER"}
        </span>
        <span className="text-gray-400 text-sm font-mono">
          {guessCount}/{MAX_GUESSES}
        </span>
      </div>
    </div>
  );
}
