"use client";
import { CityStats } from "@/lib/types";

interface StatsPanelProps {
  stats: CityStats;
  guessCount: number;
}

function formatPopulation(population: number, guessCount: number, populationRange: string): string {
  if (population >= 500_000) {
    if (guessCount === 0) {
      // 500k buckets: "500,000 - 1,000,000"
      const lower = Math.floor(population / 500_000) * 500_000;
      return `${lower.toLocaleString()} - ${(lower + 500_000).toLocaleString()}`;
    }
    if (guessCount < 3) {
      // 100k buckets: "700,000 - 800,000"
      const lower = Math.floor(population / 100_000) * 100_000;
      return `${lower.toLocaleString()} - ${(lower + 100_000).toLocaleString()}`;
    }
    return population.toLocaleString();
  }

  // Under 500k: show range until 3rd guess, then exact
  return guessCount >= 3 ? population.toLocaleString() : populationRange;
}

export default function StatsPanel({ stats, guessCount }: StatsPanelProps) {
  const growthNum = parseFloat(stats.populationGrowth);
  const hasGrowth = !isNaN(growthNum);
  const growthPositive = growthNum > 0;

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Mystery City Stats
      </h3>

      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-xs text-gray-400">Population</span>
          <p className="text-lg font-bold text-gray-900">
            {formatPopulation(stats.population, guessCount, stats.populationRange)}
          </p>
        </div>
        {hasGrowth && (
          <div className="text-right">
            <span className="text-xs text-gray-400">Growth (10yr)</span>
            <p
              className={`text-lg font-bold ${
                growthPositive ? "text-green-600" : "text-red-500"
              }`}
            >
              {stats.populationGrowth}
            </p>
          </div>
        )}
      </div>

      <div>
        <span className="text-xs text-gray-400">Median Age</span>
        <p className="text-lg font-bold text-gray-900">{stats.medianAge}</p>
      </div>

      <div>
        <span className="text-xs text-gray-400 block mb-2">
          Top Ethnicities
        </span>
        <div className="space-y-1.5">
          {stats.topEthnicities.map((e) => (
            <div key={e.label} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-28 truncate">
                {e.label}
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(e.percent, 100)}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-10 text-right">
                {e.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {stats.topLanguages.length > 0 && (
        <div>
          <span className="text-xs text-gray-400 block mb-2">
            Top Languages (Non-English)
          </span>
          <div className="space-y-1.5">
            {stats.topLanguages.map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-28 truncate">
                  {l.label}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-violet-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(l.percent * 3, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-10 text-right">
                  {l.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.topAncestries?.length > 0 && (
        <div>
          <span className="text-xs text-gray-400 block mb-2">
            Top Ancestries
          </span>
          <div className="space-y-1.5">
            {stats.topAncestries.map((a) => (
              <div key={a.label} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-28 truncate">
                  {a.label}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(a.percent * 2, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-10 text-right">
                  {a.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
