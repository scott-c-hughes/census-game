"use client";
import { GuessEntry, HeatmapGuessResult, CityGuessResult } from "@/lib/types";
import { directionArrow } from "@/lib/geography";

interface GuessHistoryProps {
  guesses: GuessEntry[];
  mode: "heatmap" | "cityfinder";
  answerLat?: number;
  answerLng?: number;
}

export default function GuessHistory({
  guesses,
  mode,
  answerLat,
  answerLng,
}: GuessHistoryProps) {
  if (guesses.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
        Guesses
      </h3>
      <div className="space-y-1.5">
        {guesses.map((g, i) => {
          if (mode === "heatmap") {
            const result = g.result as HeatmapGuessResult;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${getHeatmapStyle(result)}`}
              >
                <span className="text-lg">{getHeatmapEmoji(result)}</span>
                <span className="font-medium text-sm">{g.value}</span>
                <span className="ml-auto text-xs text-gray-400 capitalize">
                  {result === "close" ? "Related" : result}
                </span>
              </div>
            );
          } else {
            const result = g.result as CityGuessResult;
            const arrow =
              answerLat !== undefined && answerLng !== undefined
                ? directionArrow(result.lat, result.lng, answerLat, answerLng)
                : "";
            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${getCityStyle(result.rating)}`}
              >
                <span className="text-lg">{getCityEmoji(result.rating)}</span>
                <span className="font-medium text-sm">{result.guess}</span>
                <span className="text-xs text-gray-500">
                  {result.distanceMiles} mi
                </span>
                {result.rating !== "green" && (
                  <span className="text-lg">{arrow}</span>
                )}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

function getHeatmapEmoji(result: HeatmapGuessResult): string {
  if (result === "correct") return "\uD83D\uDFE9";
  if (result === "close") return "\uD83D\uDFE8";
  return "\uD83D\uDFE5";
}

function getHeatmapStyle(result: HeatmapGuessResult): string {
  if (result === "correct") return "bg-green-50 border-green-300";
  if (result === "close") return "bg-yellow-50 border-yellow-300";
  return "bg-red-50 border-red-300";
}

function getCityEmoji(rating: "green" | "yellow" | "red"): string {
  if (rating === "green") return "\uD83D\uDFE9";
  if (rating === "yellow") return "\uD83D\uDFE8";
  return "\uD83D\uDFE5";
}

function getCityStyle(rating: "green" | "yellow" | "red"): string {
  if (rating === "green") return "bg-green-50 border-green-300";
  if (rating === "yellow") return "bg-yellow-50 border-yellow-300";
  return "bg-red-50 border-red-300";
}
