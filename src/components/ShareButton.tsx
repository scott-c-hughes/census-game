"use client";
import { useState } from "react";
import { GuessEntry } from "@/lib/types";
import { MAX_GUESSES } from "@/lib/constants";
import { generateShareText, copyToClipboard } from "@/lib/sharing";

interface ShareButtonProps {
  puzzleId: number;
  guesses: GuessEntry[];
  didWin: boolean;
}

export default function ShareButton({ puzzleId, guesses, didWin }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = generateShareText(puzzleId, guesses, didWin, MAX_GUESSES);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3 rounded-lg transition-colors text-sm"
    >
      {copied ? "Copied!" : "Share Result"}
    </button>
  );
}
