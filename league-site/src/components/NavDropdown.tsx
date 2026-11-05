"use client";

import { useState } from "react";
import Link from "next/link";

export default function NavDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="hover:text-neutral-300 flex items-center gap-1">
        Standings
        <span className="text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg py-1 min-w-[180px] z-50">
          <Link
            href="/standings"
            className="block px-4 py-2 text-sm text-white hover:bg-neutral-800"
            onClick={() => setOpen(false)}
          >
            Divisional Standings
          </Link>
          <Link
            href="/standings/league"
            className="block px-4 py-2 text-sm text-white hover:bg-neutral-800"
            onClick={() => setOpen(false)}
          >
            League Standings
          </Link>
        </div>
      )}
    </div>
  );
}