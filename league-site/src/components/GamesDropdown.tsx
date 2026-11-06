"use client";

import { useState } from "react";
import Link from "next/link";
import { useCloseOnOutside } from "@/components/useCloseOnOutside";

const items = [
  { href: "/games/schedule", label: "Schedule" },
  { href: "/games/scores", label: "Final Scores" },
  { href: "/games/all-star", label: "All-Star Game" },
];

export default function GamesDropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useCloseOnOutside<HTMLDivElement>(open, setOpen);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="hover:text-neutral-300 flex items-center gap-1 py-2">
        Games
        <span className="text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 pt-1 z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg py-1 min-w-[180px]">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm text-white hover:bg-neutral-800"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
