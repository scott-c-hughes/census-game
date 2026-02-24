"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { loadPlayerStats } from "@/lib/storage";
import { PlayerStats } from "@/lib/types";
import CountdownTimer from "@/components/CountdownTimer";

export default function Home() {
  const [stats, setStats] = useState<PlayerStats | null>(null);

  useEffect(() => {
    setStats(loadPlayerStats());
  }, []);

  const hasPlayed = stats && stats.gamesPlayed > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-[0.2em] md:tracking-[0.3em] text-gray-900">
            CENSUS
          </h1>
          <p className="text-gray-500 text-sm">
            Daily US Census Data Quiz
          </p>
          <p className="text-gray-400 text-xs">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* How it works */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-left space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            How to Play
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex gap-3">
              <span className="text-violet-600 font-bold shrink-0">01</span>
              <p>
                <span className="text-violet-700 font-medium">Heatmap Mode:</span>{" "}
                Guess the ancestry or language shown on the US map
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-cyan-600 font-bold shrink-0">02</span>
              <p>
                <span className="text-cyan-700 font-medium">City Finder:</span>{" "}
                Find a mystery city from its demographic stats
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-gray-400 font-bold shrink-0">03</span>
              <p>You get 6 guesses with progressive hints after each wrong answer</p>
            </div>
          </div>
        </div>

        {/* Returning player stats */}
        {hasPlayed && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.gamesPlayed}</p>
              <p className="text-xs text-gray-500 uppercase">Played</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {Math.round((stats.gamesWon / stats.gamesPlayed) * 100)}%
              </p>
              <p className="text-xs text-gray-500 uppercase">Win %</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.currentStreak}</p>
              <p className="text-xs text-gray-500 uppercase">Streak</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.maxStreak}</p>
              <p className="text-xs text-gray-500 uppercase">Max</p>
            </div>
          </div>
        )}

        {/* Play button */}
        <Link
          href="/play"
          className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg px-12 py-4 rounded-xl transition-colors shadow-lg shadow-violet-200"
        >
          Play Today&apos;s Puzzle
        </Link>

        {/* Countdown */}
        <CountdownTimer />
      </div>
    </div>
  );
}
