"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import DropdownLayer from "@/components/DropdownLayer";
import { useCloseOnOutside } from "@/components/useCloseOnOutside";

const items = [
  { href: "/teams", label: "Team Directory" },
  { href: "/players", label: "Player Directory" },
  { href: "/draft/prospects", label: "Draft Prospects" },
  { href: "/draft/room", label: "Draft Room" },
];

export default function CreationDropdown() {
  const [open, setOpen] = useState(false);
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
      <button type="button" className="hover:text-neutral-300 flex items-center gap-1 py-2" onClick={() => (open ? hide() : show())}>
        Create
        <span className="text-xs">▾</span>
      </button>
      <DropdownLayer anchor={rootRef.current} open={open} owner={owner} onMouseEnter={show} onMouseLeave={hide}>
        <div className="pt-1">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg py-1 min-w-[180px]">
            {items.map(item => (
              <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-white hover:bg-neutral-800" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </DropdownLayer>
    </div>
  );
}
