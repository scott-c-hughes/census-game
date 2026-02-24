import { GuessEntry, HeatmapGuessResult, CityGuessResult } from "./types";

// Generate emoji share text
export function generateShareText(
  puzzleId: number,
  guesses: GuessEntry[],
  didWin: boolean,
  maxGuesses: number
): string {
  const guessCount = didWin ? guesses.length : "X";
  const emojiRows = guesses.map((g) => guessToEmoji(g)).join("");

  return [
    `CENSUS #${puzzleId} ${guessCount}/${maxGuesses}`,
    "",
    emojiRows,
    "",
    "https://census-game.vercel.app",
  ].join("\n");
}

function guessToEmoji(guess: GuessEntry): string {
  if (typeof guess.result === "string") {
    // Heatmap mode
    const r = guess.result as HeatmapGuessResult;
    if (r === "correct") return "\uD83D\uDFE9";
    if (r === "close") return "\uD83D\uDFE8";
    return "\uD83D\uDFE5";
  } else {
    // City finder mode
    const r = guess.result as CityGuessResult;
    if (r.rating === "green") return "\uD83D\uDFE9";
    if (r.rating === "yellow") return "\uD83D\uDFE8";
    return "\uD83D\uDFE5";
  }
}

// Copy to clipboard with fallback
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share({ text });
      return true;
    }
  } catch {
    // share cancelled or not supported, fall through to clipboard
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}
