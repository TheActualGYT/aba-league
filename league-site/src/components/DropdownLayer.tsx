"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function DropdownLayer({
  anchor,
  open,
  owner,
  children,
  matchWidth = false,
  up = false,
  onMouseEnter,
  onMouseLeave,
}: {
  anchor: HTMLElement | null;
  open: boolean;
  owner: string;
  children: React.ReactNode;
  matchWidth?: boolean;
  up?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const [box, setBox] = useState<{ top: number; bottom: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (!open || !anchor) return;
    const place = () => {
      const rect = anchor.getBoundingClientRect();
      setBox({ top: rect.top, bottom: rect.bottom, left: rect.left, width: rect.width });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, anchor]);

  if (!open || !box || typeof document === "undefined") return null;

  return createPortal(
    <div
      data-dropdown-owner={owner}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fixed z-[1000]"
      style={up
        ? { left: box.left, width: matchWidth ? box.width : undefined, bottom: window.innerHeight - box.top }
        : { left: box.left, width: matchWidth ? box.width : undefined, top: box.bottom }}
    >
      {children}
    </div>,
    document.body
  );
}
