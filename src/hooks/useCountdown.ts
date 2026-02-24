"use client";
import { useState, useEffect } from "react";

// Returns time remaining until midnight Eastern as "HH:MM:SS"
export function useCountdown(): string {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnightET());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnightET());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

function getTimeUntilMidnightET(): string {
  const now = new Date();

  // Get tomorrow's date in Eastern time
  const eastern = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  eastern.setDate(eastern.getDate() + 1);
  eastern.setHours(0, 0, 0, 0);

  // Convert that Eastern midnight back to a UTC timestamp
  // by finding the offset between local-interpreted Eastern and real now
  const nowEastern = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const offsetMs = now.getTime() - nowEastern.getTime();
  const midnightUtc = eastern.getTime() + offsetMs;

  const diff = midnightUtc - now.getTime();

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
}
