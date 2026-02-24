"use client";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useGameState } from "@/hooks/useGameState";
import {
  HeatmapPuzzle,
  CityFinderPuzzle,
} from "@/lib/types";
import GameHeader from "@/components/GameHeader";
import USHeatmap from "@/components/USHeatmap";
import GuessInput from "@/components/GuessInput";
import CityGuessInput from "@/components/CityGuessInput";
import HintPanel from "@/components/HintPanel";
import GuessHistory from "@/components/GuessHistory";
import StatsPanel from "@/components/StatsPanel";
import ResultsModal from "@/components/ResultsModal";

function PlayContent() {
  const searchParams = useSearchParams();
  const puzzleParam = searchParams.get("puzzle");
  const puzzleOverride = puzzleParam ? parseInt(puzzleParam, 10) : undefined;

  const {
    puzzle,
    gameState,
    playerStats,
    loading,
    submitHeatmapGuess,
    submitCityGuess,
  } = useGameState(puzzleOverride);

  const [showResults, setShowResults] = useState(false);

  const isComplete = gameState?.isComplete ?? false;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400 text-lg animate-pulse">Loading puzzle...</div>
      </div>
    );
  }

  if (!puzzle || !gameState) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400 text-lg">Puzzle not found</div>
      </div>
    );
  }

  const pastGuessValues = gameState.guesses.map((g) => g.value);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <GameHeader
        puzzleId={puzzle.id}
        guessCount={gameState.guesses.length}
        mode={puzzle.mode}
      />

      <main className="max-w-4xl mx-auto px-4 pb-8 space-y-6">
        {puzzle.mode === "heatmap" ? (
          <>
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Which{" "}
                <span className="text-violet-600 font-semibold">
                  {(puzzle as HeatmapPuzzle).category}
                </span>{" "}
                does this heatmap show?
              </p>
            </div>

            <USHeatmap stateData={(puzzle as HeatmapPuzzle).stateData} />
            <p className="text-center text-xs text-gray-400 -mt-3">
              Source: U.S. Census Bureau, 2024 American Community Survey
            </p>

            {!isComplete && (
              <GuessInput
                onSubmit={submitHeatmapGuess}
                disabled={isComplete}
                pastGuesses={pastGuessValues}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GuessHistory guesses={gameState.guesses} mode="heatmap" />
              <HintPanel
                hints={[...puzzle.hints]}
                hintsRevealed={gameState.hintsRevealed}
              />
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Which{" "}
                <span className="text-cyan-600 font-semibold">US city</span>{" "}
                matches these stats?
              </p>
            </div>

            <StatsPanel stats={(puzzle as CityFinderPuzzle).stats} />
            <p className="text-center text-xs text-gray-400 -mt-3">
              Source: U.S. Census Bureau, 2024 American Community Survey
            </p>

            {!isComplete && (
              <CityGuessInput
                onSubmit={submitCityGuess}
                disabled={isComplete}
                pastGuesses={pastGuessValues}
              />
            )}

            <GuessHistory
              guesses={gameState.guesses}
              mode="cityfinder"
              answerLat={(puzzle as CityFinderPuzzle).lat}
              answerLng={(puzzle as CityFinderPuzzle).lng}
            />
          </>
        )}

        {isComplete && !showResults && (
          <div className="text-center">
            <button
              onClick={() => setShowResults(true)}
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              View Results
            </button>
          </div>
        )}

        {isComplete && showResults && (
          <ResultsModal
            puzzle={puzzle}
            guesses={gameState.guesses}
            didWin={gameState.didWin}
            stats={playerStats}
            onClose={() => setShowResults(false)}
          />
        )}
      </main>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-gray-400 text-lg animate-pulse">Loading...</div>
        </div>
      }
    >
      <PlayContent />
    </Suspense>
  );
}
