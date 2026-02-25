"use client";
import { GuessEntry, PlayerStats, Puzzle } from "@/lib/types";
import ShareButton from "./ShareButton";
import CountdownTimer from "./CountdownTimer";

interface ResultsModalProps {
  puzzle: Puzzle;
  guesses: GuessEntry[];
  didWin: boolean;
  stats: PlayerStats;
  onClose: () => void;
}

export default function ResultsModal({
  puzzle,
  guesses,
  didWin,
  stats,
  onClose,
}: ResultsModalProps) {
  const winPct =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  const maxDistribution = Math.max(...stats.guessDistribution, 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-6 space-y-5 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl leading-none w-11 h-11 flex items-center justify-center rounded-lg"
        >
          &times;
        </button>

        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {didWin ? "Nice work!" : "Better luck tomorrow!"}
          </h2>
          <p className="text-sm text-gray-500">
            The answer was{" "}
            <span className="font-semibold text-gray-900">{puzzle.answer}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <StatBox label="Played" value={stats.gamesPlayed} />
          <StatBox label="Win %" value={winPct} />
          <StatBox label="Streak" value={stats.currentStreak} />
          <StatBox label="Max" value={stats.maxStreak} />
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Guess Distribution
          </h3>
          <div className="space-y-1">
            {stats.guessDistribution.map((count, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-3">{i + 1}</span>
                <div
                  className={`h-5 rounded-sm flex items-center justify-end px-1.5 text-xs font-bold text-white transition-all ${
                    didWin && guesses.length === i + 1
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                  style={{
                    width: `${Math.max(
                      (count / maxDistribution) * 100,
                      count > 0 ? 12 : 5
                    )}%`,
                    minWidth: "20px",
                  }}
                >
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 pt-2">
          <ShareButton
            puzzle={puzzle}
            guesses={guesses}
            didWin={didWin}
          />
          <CountdownTimer />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 uppercase">{label}</p>
    </div>
  );
}
