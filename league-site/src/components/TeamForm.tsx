"use client";

import { useState, useRef } from "react";

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

export default function TeamForm() {
  const [name, setName] = useState("");
  const [abbr, setAbbr] = useState("");
  const [location, setLocation] = useState("");
  const [ownership, setOwnership] = useState("");
  const [headCoach, setHeadCoach] = useState("");
  const [assistantCoach, setAssistantCoach] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);
  const [eyedropperMode, setEyedropperMode] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [magnifier, setMagnifier] = useState<{ x: number; y: number; color: string } | null>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setLogo(dataUrl);
      const extracted = await extractColors(dataUrl);
      setColors(extracted);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Creating...");
    if (!logo) {
      setMessage("Please upload a team logo");
      return;
    }
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          abbreviation: abbr,
          division: "Auto",
          logo,
          location,
          ownership,
          head_coach: headCoach,
          assistant_coach: assistantCoach,
          colors,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(`Error: ${json.error || "unknown"}`);
        return;
      }
      setMessage("Created! Reloading...");
      setTimeout(() => window.location.reload(), 600);
    } catch (err: any) {
      setMessage("Network error: " + err.message);
    }
  };

  const confirmRemove = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
    setRemoveIndex(null);
  };

  const startEyedropper = () => {
    setEyedropperMode(true);
    setReplaceIndex(null);
    setMessage("Click a color box to replace");
  };

  const selectBoxToReplace = (index: number) => {
    if (!eyedropperMode) return;
    setReplaceIndex(index);
    setMessage("Now click the logo to pick a color");
  };

  const updateMagnifier = (e: React.MouseEvent<HTMLImageElement>) => {
    if (replaceIndex === null || !logoRef.current) return;
    const img = logoRef.current;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * img.naturalWidth;
    const y = ((e.clientY - rect.top) / rect.height) * img.naturalHeight;

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, x, y, 1, 1, 0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

    setMagnifier({ x: e.clientX, y: e.clientY, color: hex });
  };

  const pickColorFromLogo = (e: React.MouseEvent<HTMLImageElement>) => {
    if (replaceIndex === null || !logoRef.current) return;
    const img = logoRef.current;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * img.naturalWidth;
    const y = ((e.clientY - rect.top) / rect.height) * img.naturalHeight;

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, x, y, 1, 1, 0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

    const newColors = [...colors];
    newColors[replaceIndex] = hex;
    setColors(newColors);
    setEyedropperMode(false);
    setReplaceIndex(null);
    setMagnifier(null);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-700 rounded-lg p-5 relative">
      <h3 className="text-sm font-bold tracking-widest text-neutral-300 mb-4">CREATE TEAM</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-2">
          <label className={labelClass}>Team Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className={fieldClass} required />
        </div>
        <div>
          <label className={labelClass}>Abbr</label>
          <input value={abbr} onChange={e => setAbbr(e.target.value.toUpperCase())} maxLength={4} className={fieldClass} required />
        </div>
        <div className="lg:col-span-3">
          <label className={labelClass}>Location (City)</label>
          <input value={location} onChange={e => setLocation(e.target.value)} className={fieldClass} required />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Ownership</label>
          <input value={ownership} onChange={e => setOwnership(e.target.value)} className={fieldClass} required />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Head Coach</label>
          <input value={headCoach} onChange={e => setHeadCoach(e.target.value)} className={fieldClass} required />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Assistant Coach</label>
          <input value={assistantCoach} onChange={e => setAssistantCoach(e.target.value)} className={fieldClass} required />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <label className={labelClass}>Team Logo *</label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={handleFile} className="text-sm text-neutral-300 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-neutral-700 file:text-white" required />
              {logo && (
                <img
                  ref={logoRef}
                  src={logo}
                  alt="preview"
                  className={`h-12 w-12 object-contain bg-neutral-800 rounded border border-neutral-700 ${replaceIndex !== null ? "cursor-crosshair" : ""}`}
                  onClick={pickColorFromLogo}
                  onMouseMove={updateMagnifier}
                  onMouseLeave={() => setMagnifier(null)}
                />
              )}
            </div>
          </div>

          {colors.length > 0 && (
            <div>
              <label className={labelClass}>Colors</label>
              <div className="flex gap-1 items-center h-10">
                {colors.map((c, i) => (
                  <div key={i} className="relative group">
                    <div
                      className={`h-8 w-8 rounded border border-neutral-600 ${eyedropperMode ? "cursor-pointer ring-2 ring-offset-1 ring-offset-neutral-900" : ""} ${replaceIndex === i ? "ring-white" : ""}`}
                      style={{ backgroundColor: c }}
                      title={c}
                      onClick={() => selectBoxToReplace(i)}
                    />
                    <button
                      type="button"
                      onClick={() => setRemoveIndex(i)}
                      className="absolute -top-1 -right-1 hidden group-hover:flex items-center justify-center h-4 w-4 bg-red-600 text-white text-xs rounded-full leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={startEyedropper}
                  className={`h-8 w-8 rounded border border-neutral-600 flex items-center justify-center text-neutral-300 hover:bg-neutral-800 ${eyedropperMode ? "bg-neutral-700" : ""}`}
                  title="Eyedropper"
                >
                  👁️
                </button>
              </div>
              {removeIndex !== null && (
                <div className="mt-1 text-xs flex items-center gap-2">
                  <span className="text-red-400">Remove this color?</span>
                  <button type="button" onClick={() => confirmRemove(removeIndex)} className="bg-red-600 text-white px-2 py-0.5 rounded">Yes</button>
                  <button type="button" onClick={() => setRemoveIndex(null)} className="bg-neutral-700 text-white px-2 py-0.5 rounded">No</button>
                </div>
              )}
            </div>
          )}
        </div>

        <button type="submit" className="bg-neutral-200 hover:bg-white text-black font-bold px-5 py-2 rounded">
          Create Team
        </button>
      </div>

      {message && <p className="text-sm text-amber-300 mt-3">{message}</p>}

      {magnifier && replaceIndex !== null && (
        <div
          className="fixed pointer-events-none z-50 border-2 border-white rounded-full shadow-lg"
          style={{
            left: magnifier.x + 16,
            top: magnifier.y - 40,
            width: 64,
            height: 64,
            backgroundColor: magnifier.color,
          }}
        />
      )}
    </form>
  );
}
