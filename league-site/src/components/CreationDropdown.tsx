"use client";

import { useState } from "react";
import Link from "next/link";

const items = [
  { href: "/teams", label: "Team Directory" },
  { href: "/players", label: "Player Directory" },
  { href: "/draft/prospects", label: "Draft Prospects" },
  { href: "/draft/room", label: "Draft Room" },
];

export default function CreationDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="hover:text-neutral-300 flex items-center gap-1 py-2">
        Creation
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
