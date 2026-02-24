"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { ALL_GUESSABLE } from "@/lib/constants";

interface GuessInputProps {
  onSubmit: (guess: string) => void;
  disabled: boolean;
  pastGuesses: string[];
}

export default function GuessInput({ onSubmit, disabled, pastGuesses }: GuessInputProps) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pastGuessesLower = pastGuesses.map((g) => g.toLowerCase());

  const filterSuggestions = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      const q = query.toLowerCase();
      const filtered = ALL_GUESSABLE.filter(
        (item) =>
          item.toLowerCase().includes(q) &&
          !pastGuessesLower.includes(item.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setSelectedIndex(-1);
    },
    [pastGuessesLower]
  );

  useEffect(() => {
    filterSuggestions(value);
  }, [value, filterSuggestions]);

  const handleSubmit = (guess?: string) => {
    const finalGuess = guess || value.trim();
    if (!finalGuess) return;
    onSubmit(finalGuess);
    setValue("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSubmit(suggestions[selectedIndex]);
      } else if (suggestions.length === 1) {
        handleSubmit(suggestions[0]);
      } else {
        handleSubmit();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type an ancestry or language..."
          className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 disabled:opacity-50"
        />
        <button
          onClick={() => handleSubmit()}
          disabled={disabled || !value.trim()}
          className="bg-violet-600 hover:bg-violet-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Guess
        </button>
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
        >
          {suggestions.map((item, i) => (
            <button
              key={item}
              onClick={() => handleSubmit(item)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                i === selectedIndex
                  ? "bg-violet-100 text-violet-900"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
