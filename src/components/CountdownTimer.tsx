"use client";
import { useCountdown } from "@/hooks/useCountdown";

export default function CountdownTimer() {
  const timeLeft = useCountdown();

  return (
    <div className="text-center">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
        Next puzzle in
      </p>
      <p className="text-2xl font-mono font-bold text-gray-900 tracking-widest">
        {timeLeft}
      </p>
    </div>
  );
}
