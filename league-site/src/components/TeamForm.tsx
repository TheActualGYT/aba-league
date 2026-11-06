"use client";

import { useState, useRef } from "react";
import { useCloseOnOutside } from "@/components/useCloseOnOutside";

function extractColors(dataUrl: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 80;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve([]);
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      const colorMap: Record<string, { count: number; r: number; g: number; b: number }> = {};

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        if (a < 200) continue;

        const brightness = (r + g + b) / 3;
        if (brightness < 40 || brightness > 220) continue;

        const qr = Math.round(r / 24) * 24;
        const qg = Math.round(g / 24) * 24;
        const qb = Math.round(b / 24) * 24;
        const key = `${qr},${qg},${qb}`;

        if (!colorMap[key]) {
          colorMap[key] = { count: 0, r: 0, g: 0, b: 0 };
        }
        colorMap[key].count++;
        colorMap[key].r += r;
        colorMap[key].g += g;
        colorMap[key].b += b;
      }

      const minCount = 15;
      const sorted = Object.values(colorMap)
        .filter(c => c.count >= minCount)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      const hexes = sorted.map(c => {
        const r = Math.round(c.r / c.count);
        const g = Math.round(c.g / c.count);
        const b = Math.round(c.b / c.count);
        return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
      });

      resolve(hexes);
    };
    img.src = dataUrl;
  });
}

const fieldClass = "w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white";
const labelClass = "block text-xs font-semibold tracking-wide text-neutral-400 mb-1.5";
const OWNERS = ["Garrett Jahnke", "Craig Jahnke", "Chad Jahnke"];

function OwnerMenu({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useCloseOnOutside<HTMLDivElement>(open, setOpen);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        className={`${fieldClass} text-left flex items-center justify-between min-h-[42px]`}
      >
        <span>{value}</span>
        <span className="text-neutral-400 text-[10px]">▼</span>
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full bg-neutral-800 border border-neutral-600 rounded overflow-hidden shadow-lg">
          {OWNERS.map(owner => (
            <button
              key={owner}
              type="button"
              onClick={() => {
                onChange(owner);
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-700 ${value === owner ? "bg-neutral-700" : ""}`}
            >
              {owner}
            </button>
          ))}
        </div>
      )}
      <input
        required
        value={value}
        onChange={() => {}}
        className="absolute h-px w-px opacity-0 pointer-events-none"
        tabIndex={-1}
        aria-hidden
      />
    </div>
  );
}
