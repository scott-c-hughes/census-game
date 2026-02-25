// State abbreviation type
export type StateCode =
  | "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "CT" | "DE" | "FL" | "GA"
  | "HI" | "ID" | "IL" | "IN" | "IA" | "KS" | "KY" | "LA" | "ME" | "MD"
  | "MA" | "MI" | "MN" | "MS" | "MO" | "MT" | "NE" | "NV" | "NH" | "NJ"
  | "NM" | "NY" | "NC" | "ND" | "OH" | "OK" | "OR" | "PA" | "RI" | "SC"
  | "SD" | "TN" | "TX" | "UT" | "VT" | "VA" | "WA" | "WV" | "WI" | "WY"
  | "DC";

// Heatmap puzzle - guess the ancestry or language from the map
export interface HeatmapPuzzle {
  id: number;
  mode: "heatmap";
  category: "ancestry" | "language";
  answer: string;
  stateData: Partial<Record<StateCode, number>>;
  acceptableAnswers: string[];   // alternate valid spellings
  relatedAnswers: string[];      // close enough for yellow
  hints: [string, string, string, string, string];
}

// City finder puzzle - pinpoint a city from stats
export interface CityFinderPuzzle {
  id: number;
  mode: "cityfinder";
  answer: string;  // e.g. "Boise, ID"
  lat: number;
  lng: number;
  stats: CityStats;
  hints: [string, string, string, string, string];
}

export interface CityStats {
  populationRange: string;     // e.g. "200,000 - 250,000"
  population: number;          // exact population, revealed after 3rd guess
  populationGrowth: string;    // e.g. "+9.3%"
  topEthnicities: EthnicityBar[];
  topLanguages: LanguageBar[];
  topAncestries: AncestryBar[];
  medianAge: number;
}

export interface EthnicityBar {
  label: string;
  percent: number;
}

export interface LanguageBar {
  label: string;
  percent: number;
}

export interface AncestryBar {
  label: string;
  percent: number;
}

export type Puzzle = HeatmapPuzzle | CityFinderPuzzle;

// Guess result for Mode 1 (heatmap)
export type HeatmapGuessResult = "correct" | "close" | "wrong";

// Guess result for Mode 2 (city finder)
export interface CityGuessResult {
  guess: string;
  lat: number;
  lng: number;
  distanceMiles: number;
  rating: "green" | "yellow" | "red";
}

// A single guess entry
export interface GuessEntry {
  value: string;
  result: HeatmapGuessResult | CityGuessResult;
}

// Current game state (saved to localStorage)
export interface GameState {
  puzzleId: number;
  guesses: GuessEntry[];
  hintsRevealed: number;  // 0-5
  isComplete: boolean;
  didWin: boolean;
}

// Player stats across games (saved to localStorage)
export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: [number, number, number, number, number, number]; // 1-6 guesses
}
