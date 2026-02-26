import { GuessEntry, HeatmapGuessResult, CityGuessResult } from "./types";
import { directionArrow } from "./geography";

// Generate emoji share text
export function generateShareText(
  puzzleId: number,
  guesses: GuessEntry[],
  didWin: boolean,
  maxGuesses: number,
  mode: "heatmap" | "cityfinder",
  answerLat?: number,
  answerLng?: number
): string {
  const guessCount = didWin ? guesses.length : "X";
  const modeIcon = mode === "heatmap" ? "🗺️" : "📍";

  let emojiRows: string;

  if (mode === "heatmap") {
    emojiRows = guesses
      .map((g) => guessToEmoji(g, mode))
      .join("");
  } else {
    const colors: string[] = [];
    const arrows: string[] = [];
    for (const g of guesses) {
      const r = g.result as CityGuessResult;
      colors.push(r.rating === "green" ? "🟩" : r.rating === "yellow" ? "🟨" : "🟥");
      if (r.rating === "green") {
        arrows.push("📍");
      } else if (answerLat !== undefined && answerLng !== undefined) {
        arrows.push(directionArrow(r.lat, r.lng, answerLat, answerLng));
      }
    }
    emojiRows = colors.join("") + "\n" + arrows.join("");
  }

  return [
    `CENSUS #${puzzleId} ${modeIcon} ${guessCount}/${maxGuesses}`,
    "",
    emojiRows,
    "",
    "https://census-game.vercel.app",
  ].join("\n");
}

function guessToEmoji(
  guess: GuessEntry,
  mode: "heatmap" | "cityfinder",
  answerLat?: number,
  answerLng?: number
): string {
  if (typeof guess.result === "string") {
    // Heatmap mode
    const r = guess.result as HeatmapGuessResult;
    if (r === "correct") return "🟩";
    if (r === "close") return "🟨";
    return "🟥";
  } else {
    // City finder mode
    const r = guess.result as CityGuessResult;
    const color = r.rating === "green" ? "🟩" : r.rating === "yellow" ? "🟨" : "🟥";

    if (r.rating === "green") {
      return `${color} 📍`;
    }

    // Add direction arrow showing which way the answer is
    if (answerLat !== undefined && answerLng !== undefined) {
      const arrow = directionArrow(r.lat, r.lng, answerLat, answerLng);
      return `${color} ${arrow}`;
    }

    return color;
  }
}

// Copy text to clipboard only
export async function copyTextToClipboard(text: string): Promise<boolean> {
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

// Native OS share sheet
export async function nativeShare(text: string): Promise<boolean> {
  try {
    if (navigator.share) {
      await navigator.share({ text });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
