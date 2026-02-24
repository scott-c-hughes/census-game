"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Puzzle,
  HeatmapPuzzle,
  CityFinderPuzzle,
  GameState,
  PlayerStats,
  GuessEntry,
} from "@/lib/types";
import { MAX_GUESSES } from "@/lib/constants";
import {
  getDailyPuzzleId,
  loadPuzzles,
  getPuzzleById,
  evaluateHeatmapGuess,
  evaluateCityGuess,
} from "@/lib/gameEngine";
import {
  loadGameState,
  saveGameState,
  loadPlayerStats,
  updateStatsAfterGame,
} from "@/lib/storage";

interface UseGameStateReturn {
  puzzle: Puzzle | null;
  gameState: GameState | null;
  playerStats: PlayerStats;
  loading: boolean;
  submitHeatmapGuess: (guess: string) => void;
  submitCityGuess: (cityName: string, lat: number, lng: number) => void;
  revealHint: () => void;
}

export function useGameState(puzzleOverride?: number): UseGameStateReturn {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats>(loadPlayerStats());
  const [loading, setLoading] = useState(true);

  // Load puzzle on mount
  useEffect(() => {
    async function init() {
      try {
        const puzzles = await loadPuzzles();
        const puzzleId = puzzleOverride ?? getDailyPuzzleId(puzzles.length);
        const p = getPuzzleById(puzzles, puzzleId);
        if (!p) {
          setLoading(false);
          return;
        }
        setPuzzle(p);

        // Load existing game state or create new
        const existing = loadGameState(puzzleId);
        if (existing) {
          setGameState(existing);
        } else {
          const newState: GameState = {
            puzzleId,
            guesses: [],
            hintsRevealed: 0,
            isComplete: false,
            didWin: false,
          };
          setGameState(newState);
          saveGameState(newState);
        }
      } catch (err) {
        console.error("Failed to load puzzles:", err);
      }
      setLoading(false);
    }
    init();
  }, [puzzleOverride]);

  // Persist game state on change
  useEffect(() => {
    if (gameState) {
      saveGameState(gameState);
    }
  }, [gameState]);

  const submitHeatmapGuess = useCallback(
    (guess: string) => {
      if (!puzzle || !gameState || gameState.isComplete) return;
      if (puzzle.mode !== "heatmap") return;

      const result = evaluateHeatmapGuess(puzzle as HeatmapPuzzle, guess);
      const entry: GuessEntry = { value: guess, result };
      const newGuesses = [...gameState.guesses, entry];
      const didWin = result === "correct";
      const isComplete = didWin || newGuesses.length >= MAX_GUESSES;

      const newState: GameState = {
        ...gameState,
        guesses: newGuesses,
        hintsRevealed: didWin
          ? gameState.hintsRevealed
          : Math.min(gameState.hintsRevealed + 1, 5),
        isComplete,
        didWin,
      };
      setGameState(newState);

      if (isComplete) {
        const stats = updateStatsAfterGame(didWin, newGuesses.length);
        setPlayerStats(stats);
      }
    },
    [puzzle, gameState]
  );

  const submitCityGuess = useCallback(
    (cityName: string, lat: number, lng: number) => {
      if (!puzzle || !gameState || gameState.isComplete) return;
      if (puzzle.mode !== "cityfinder") return;

      const result = evaluateCityGuess(puzzle as CityFinderPuzzle, cityName, lat, lng);
      const entry: GuessEntry = {
        value: cityName,
        result,
      };
      const newGuesses = [...gameState.guesses, entry];
      const didWin = result.rating === "green";
      const isComplete = didWin || newGuesses.length >= MAX_GUESSES;

      const newState: GameState = {
        ...gameState,
        guesses: newGuesses,
        hintsRevealed: didWin
          ? gameState.hintsRevealed
          : Math.min(gameState.hintsRevealed + 1, 5),
        isComplete,
        didWin,
      };
      setGameState(newState);

      if (isComplete) {
        const stats = updateStatsAfterGame(didWin, newGuesses.length);
        setPlayerStats(stats);
      }
    },
    [puzzle, gameState]
  );

  const revealHint = useCallback(() => {
    if (!gameState || gameState.isComplete) return;
    if (gameState.hintsRevealed >= 5) return;
    setGameState({
      ...gameState,
      hintsRevealed: gameState.hintsRevealed + 1,
    });
  }, [gameState]);

  return {
    puzzle,
    gameState,
    playerStats,
    loading,
    submitHeatmapGuess,
    submitCityGuess,
    revealHint,
  };
}
