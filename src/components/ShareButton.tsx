"use client";
import { useState, useEffect } from "react";
import { GuessEntry, Puzzle, CityFinderPuzzle } from "@/lib/types";
import { MAX_GUESSES } from "@/lib/constants";
import { generateShareText, copyTextToClipboard, nativeShare } from "@/lib/sharing";

interface ShareButtonProps {
  puzzle: Puzzle;
  guesses: GuessEntry[];
  didWin: boolean;
}

export default function ShareButton({ puzzle, guesses, didWin }: ShareButtonProps) {
  const [showToast, setShowToast] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const getShareText = () => {
    const answerLat = puzzle.mode === "cityfinder" ? (puzzle as CityFinderPuzzle).lat : undefined;
    const answerLng = puzzle.mode === "cityfinder" ? (puzzle as CityFinderPuzzle).lng : undefined;
    return generateShareText(puzzle.id, guesses, didWin, MAX_GUESSES, puzzle.mode, answerLat, answerLng);
  };

  const handleCopy = async () => {
    const text = getShareText();
    const success = await copyTextToClipboard(text);
    if (success) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  const handleShare = async () => {
    const text = getShareText();
    await nativeShare(text);
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold px-8 py-3 rounded-lg transition-colors text-sm"
        >
          Copy
        </button>
        {canShare && (
          <button
            onClick={handleShare}
            className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3 rounded-lg transition-colors text-sm"
          >
            Share
          </button>
        )}
      </div>

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
