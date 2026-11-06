"use client";

import { useEffect, useRef } from "react";

export function useCloseOnOutside<T extends HTMLElement>(
  open: boolean,
  setOpen: (open: boolean) => void,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!ref.current || !target || ref.current.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, setOpen]);

  return ref;
}
