/**
 * Helper script for assembling puzzles.json
 *
 * Usage: npx ts-node scripts/build-puzzles.ts
 *
 * This is a utility for manually curating puzzles.
 * Each puzzle should be based on real Census ACS data from:
 * - Ancestry: Census Table B04006 (via Census Reporter or data.census.gov)
 * - Languages: Census Table B16001
 * - City demographics: Census QuickFacts or data.census.gov
 *
 * Puzzle format for heatmap:
 * {
 *   id: number,
 *   mode: "heatmap",
 *   category: "ancestry" | "language",
 *   answer: string,
 *   stateData: { [stateCode]: percentage (0-1) },
 *   acceptableAnswers: string[],
 *   relatedAnswers: string[],
 *   hints: [string, string, string, string, string]
 * }
 *
 * Puzzle format for cityfinder:
 * {
 *   id: number,
 *   mode: "cityfinder",
 *   answer: "City, ST",
 *   lat: number,
 *   lng: number,
 *   stats: { populationRange, populationGrowth, topEthnicities[], topLanguages[], medianAge },
 *   hints: [string, string, string, string, string]
 * }
 *
 * Hint ordering convention:
 * Heatmap: [region, population size, immigration era, top state, first letter]
 * City: [US region, notable feature, distance from major city, first letter, county]
 */

console.log("Puzzle data is maintained directly in public/data/puzzles.json");
console.log("See this file for the schema documentation.");
