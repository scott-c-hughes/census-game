"use client";
import { useState, useEffect } from "react";

// Returns time remaining until midnight UTC as "HH:MM:SS"
export function useCountdown(): string {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnightUTC());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnightUTC());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

function getTimeUntilMidnightUTC(): string {
  const now = new Date();
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0
  ));
  const diff = tomorrow.getTime() - now.getTime();

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
}
