import { GameState, PlayerStats } from "./types";

const GAME_STATE_KEY = "census-game-state";
const PLAYER_STATS_KEY = "census-player-stats";

// Default empty stats
function defaultStats(): PlayerStats {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
  };
}

// Load game state for a specific puzzle
export function loadGameState(puzzleId: number): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GAME_STATE_KEY);
    if (!raw) return null;
    const state: GameState = JSON.parse(raw);
    // Only return if it matches today's puzzle
    if (state.puzzleId !== puzzleId) return null;
    return state;
  } catch {
    return null;
  }
}

// Save game state
export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable
  }
}

// Load player stats
export function loadPlayerStats(): PlayerStats {
  if (typeof window === "undefined") return defaultStats();
  try {
    const raw = localStorage.getItem(PLAYER_STATS_KEY);
    if (!raw) return defaultStats();
    return JSON.parse(raw);
  } catch {
    return defaultStats();
  }
}

// Save player stats
export function savePlayerStats(stats: PlayerStats): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PLAYER_STATS_KEY, JSON.stringify(stats));
  } catch {
    // localStorage full or unavailable
  }
}

// Update stats after a game ends
export function updateStatsAfterGame(didWin: boolean, numGuesses: number): PlayerStats {
  const stats = loadPlayerStats();
  stats.gamesPlayed += 1;
  if (didWin) {
    stats.gamesWon += 1;
    stats.currentStreak += 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    // guessDistribution is 0-indexed (index 0 = solved in 1 guess)
    if (numGuesses >= 1 && numGuesses <= 6) {
      stats.guessDistribution[numGuesses - 1] += 1;
    }
  } else {
    stats.currentStreak = 0;
  }
  savePlayerStats(stats);
  return stats;
}
