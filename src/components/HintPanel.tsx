"use client";

interface HintPanelProps {
  hints: string[];
  hintsRevealed: number;
}

export default function HintPanel({ hints, hintsRevealed }: HintPanelProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
        Hints
      </h3>
      <div className="grid gap-2">
        {hints.map((hint, i) => {
          const revealed = i < hintsRevealed;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
                revealed
                  ? "bg-white border-gray-200 text-gray-700"
                  : "bg-gray-50 border-gray-100 text-gray-300"
              }`}
            >
              <span
                className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                  revealed
                    ? "bg-violet-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {i + 1}
              </span>
              <span className="text-sm">
                {revealed ? hint : "Locked - wrong guess to reveal"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
