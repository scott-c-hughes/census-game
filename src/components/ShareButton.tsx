"use client";
import { useState } from "react";
import { GuessEntry, Puzzle, CityFinderPuzzle } from "@/lib/types";
import { MAX_GUESSES } from "@/lib/constants";
import { generateShareText, copyToClipboard } from "@/lib/sharing";

interface ShareButtonProps {
  puzzle: Puzzle;
  guesses: GuessEntry[];
  didWin: boolean;
}

export default function ShareButton({ puzzle, guesses, didWin }: ShareButtonProps) {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const answerLat = puzzle.mode === "cityfinder" ? (puzzle as CityFinderPuzzle).lat : undefined;
    const answerLng = puzzle.mode === "cityfinder" ? (puzzle as CityFinderPuzzle).lng : undefined;
    const text = generateShareText(puzzle.id, guesses, didWin, MAX_GUESSES, puzzle.mode, answerLat, answerLng);
    const success = await copyToClipboard(text);
    if (success) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3 rounded-lg transition-colors text-sm"
      >
        Share Result
      </button>

      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-toast-slide-up">
          <div className="bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-full shadow-lg flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Copied to clipboard!
          </div>
        </div>
      )}
    </>
  );
}
