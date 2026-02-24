import {
  Puzzle,
  HeatmapPuzzle,
  CityFinderPuzzle,
  HeatmapGuessResult,
  CityGuessResult,
} from "./types";
import { LAUNCH_DATE, DISTANCE_GREEN, DISTANCE_YELLOW, SIMILARITY_GROUPS } from "./constants";
import { haversineDistance } from "./geography";

// Calculate today's puzzle ID (deterministic, same for everyone)
export function getDailyPuzzleId(totalPuzzles: number, dateOverride?: string): number {
  const launch = new Date(LAUNCH_DATE + "T00:00:00Z");
  const today = dateOverride
    ? new Date(dateOverride + "T00:00:00Z")
    : new Date();

  // Use UTC to ensure consistency
  const launchDay = Math.floor(launch.getTime() / 86400000);
  const todayDay = Math.floor(today.getTime() / 86400000);
  const daysSince = todayDay - launchDay;

  return (daysSince % totalPuzzles) + 1;
}

// Load all puzzles from the JSON file
export async function loadPuzzles(): Promise<Puzzle[]> {
  const res = await fetch("/data/puzzles.json");
  return res.json();
}

// Get a specific puzzle by ID
export function getPuzzleById(puzzles: Puzzle[], id: number): Puzzle | undefined {
  return puzzles.find((p) => p.id === id);
}

// Evaluate a heatmap guess
export function evaluateHeatmapGuess(
  puzzle: HeatmapPuzzle,
  guess: string
): HeatmapGuessResult {
  const normalized = guess.trim().toLowerCase();
  const answer = puzzle.answer.toLowerCase();

  // Check exact match
  if (normalized === answer) return "correct";

  // Check acceptable alternate answers
  if (puzzle.acceptableAnswers.some((a) => a.toLowerCase() === normalized)) {
    return "correct";
  }

  // Check per-puzzle related answers (yellow)
  if (puzzle.relatedAnswers.some((a) => a.toLowerCase() === normalized)) {
    return "close";
  }

  // Check similarity groups - if guess and answer share any group, it's close
  if (areInSameGroup(guess.trim(), puzzle.answer)) {
    return "close";
  }

  return "wrong";
}

// Check if two items share any similarity group
function areInSameGroup(a: string, b: string): boolean {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  return SIMILARITY_GROUPS.some((group) => {
    const lowerGroup = group.map((g) => g.toLowerCase());
    return lowerGroup.includes(aLower) && lowerGroup.includes(bLower);
  });
}

// Evaluate a city finder guess
export function evaluateCityGuess(
  puzzle: CityFinderPuzzle,
  cityName: string,
  guessLat: number,
  guessLng: number
): CityGuessResult {
  const dist = haversineDistance(guessLat, guessLng, puzzle.lat, puzzle.lng);

  let rating: "green" | "yellow" | "red";
  if (dist <= DISTANCE_GREEN) {
    rating = "green";
  } else if (dist <= DISTANCE_YELLOW) {
    rating = "yellow";
  } else {
    rating = "red";
  }

  return {
    guess: cityName,
    lat: guessLat,
    lng: guessLng,
    distanceMiles: Math.round(dist),
    rating,
  };
}
