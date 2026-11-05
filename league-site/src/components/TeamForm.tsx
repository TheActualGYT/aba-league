"use client";

import { useState } from "react";

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

      // Only keep colors that appear enough times (avoid noise)
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

      // Return only the real colors found (2 or 3)
      resolve(hexes);
    };
    img.src = dataUrl;
  });
}

export default function TeamForm() {
  const [name, setName] = useState("");
  const [abbr, setAbbr] = useState("");
  const [location, setLocation] = useState("");
  const [ownership, setOwnership] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [message, setMessage] = useState("");

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
        body: JSON.stringify({ name, abbreviation: abbr, division: "Auto", logo, location, ownership, colors }),
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

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 p-4 rounded-lg mb-6 flex gap-4 items-end border border-neutral-700 flex-wrap">
      <div>
        <label className="block text-sm mb-1 text-neutral-300">Team Name</label>
        <input value={name} onChange={e => setName(e.target.value)} className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white" required />
      </div>
      <div>
        <label className="block text-sm mb-1 text-neutral-300">Abbr</label>
        <input value={abbr} onChange={e => setAbbr(e.target.value.toUpperCase())} maxLength={4} className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded w-20 text-white" required />
      </div>
      <div>
        <label className="block text-sm mb-1 text-neutral-300">Location (City)</label>
        <input value={location} onChange={e => setLocation(e.target.value)} className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white" required />
      </div>
      <div>
        <label className="block text-sm mb-1 text-neutral-300">Ownership</label>
        <input value={ownership} onChange={e => setOwnership(e.target.value)} className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white" required />
      </div>
      <div>
        <label className="block text-sm mb-1 text-neutral-300">Team Logo *</label>
        <input type="file" accept="image/*" onChange={handleFile} className="text-sm text-neutral-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-neutral-700 file:text-white" required />
        {logo && <img src={logo} alt="preview" className="mt-1 h-8 w-8 object-contain" />}
      </div>
      {colors.length > 0 && (
        <div>
          <label className="block text-sm mb-1 text-neutral-300">Colors</label>
          <div className="flex gap-1">
            {colors.map((c, i) => (
              <div key={i} className="h-8 w-8 rounded border border-neutral-600" style={{ backgroundColor: c }} title={c} />
            ))}
          </div>
        </div>
      )}
      <button type="submit" className="bg-neutral-200 hover:bg-white text-black font-bold px-4 py-2 rounded">
        Create Team
      </button>
      {message && <p className="text-sm text-amber-300 w-full">{message}</p>}
    </form>
  );
}