"use client";

import { useState } from "react";

const SEASONS = ["1st Annual"];

export default function SeasonDropdown() {
  const [open, setOpen] = useState(false);
  const [season, setSeason] = useState(SEASONS[0]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-2 text-sm text-neutral-200 bg-neutral-800 border border-neutral-600 rounded-md px-3 py-1.5 hover:border-neutral-400">
        {season}
        <span className="text-xs text-neutral-400">▾</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 pt-1 z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg py-1 min-w-[140px]">
            {SEASONS.map((item) => (
              <button
                key={item}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-800"
                onClick={() => {
                  setSeason(item);
                  setOpen(false);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
