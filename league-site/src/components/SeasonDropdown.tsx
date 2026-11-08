"use client";

import { useId, useRef, useState } from "react";
import DropdownLayer from "@/components/DropdownLayer";
import { useCloseOnOutside } from "@/components/useCloseOnOutside";

const SEASONS = ["1st Annual"];

export default function SeasonDropdown() {
  const [open, setOpen] = useState(false);
  const [season, setSeason] = useState(SEASONS[0]);
  const owner = useId().replace(/:/g, "");
  const rootRef = useCloseOnOutside<HTMLDivElement>(open, setOpen);
  const hideTimer = useRef<number | null>(null);
  const show = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    setOpen(true);
  };
  const hide = () => {
    hideTimer.current = window.setTimeout(() => setOpen(false), 180);
  };

  return (
    <div ref={rootRef} data-dropdown-owner={owner} className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button type="button" className="flex items-center gap-2 text-sm text-neutral-200 bg-neutral-800 border border-neutral-600 rounded-md px-3 py-1.5 hover:border-neutral-400" onClick={() => (open ? hide() : show())}>
        {season}
        <span className="text-xs text-neutral-400">▾</span>
      </button>
      <DropdownLayer anchor={rootRef.current} open={open} owner={owner} onMouseEnter={show} onMouseLeave={hide}>
        <div className="pt-1">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg py-1 min-w-[140px]">
            {SEASONS.map(item => (
              <button
                key={item}
                type="button"
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
      </DropdownLayer>
    </div>
  );
}
