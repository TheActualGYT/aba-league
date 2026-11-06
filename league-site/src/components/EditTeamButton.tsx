"use client";

import { useState, useRef } from "react";

export default function EditTeamButton({ team }: { team: any }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(team.name);
  const [abbr, setAbbr] = useState(team.abbreviation);
  const [location, setLocation] = useState(team.location || "");
  const [ownership, setOwnership] = useState(team.ownership || "");
  const [headCoach, setHeadCoach] = useState(team.head_coach || "");
  const [assistantCoach, setAssistantCoach] = useState(team.assistant_coach || "");
  const [logo, setLogo] = useState(team.logo || "");
  const [colors, setColors] = useState<string[]>(team.colors || []);
  const [message, setMessage] = useState("");
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);
  const [eyedropperMode, setEyedropperMode] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [magnifier, setMagnifier] = useState<{ x: number; y: number; color: string } | null>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setMessage("Saving...");
    try {
      const res = await fetch("/api/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: team.id,
          name,
          abbreviation: abbr,
          location,
          ownership,
          head_coach: headCoach,
          assistant_coach: assistantCoach,
          logo,
          colors,
        }),
      });
      if (!res.ok) {
        setMessage("Failed to save");
        return;
      }
      setMessage("Saved!");
      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 400);
    } catch {
      setMessage("Error");
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
    <>
      <button onClick={() => setOpen(true)} className="text-xs text-neutral-300 hover:text-white">
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setOpen(false)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Edit Team</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white" />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Abbr</label>
                <input value={abbr} onChange={e => setAbbr(e.target.value.toUpperCase())} maxLength={4} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white" />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Location</label>
                <input value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white" />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Ownership</label>
                <input value={ownership} onChange={e => setOwnership(e.target.value)} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white" />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Head Coach</label>
                <input value={headCoach} onChange={e => setHeadCoach(e.target.value)} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white" />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Assistant Coach</label>
                <input value={assistantCoach} onChange={e => setAssistantCoach(e.target.value)} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white" />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Logo</label>
                <input type="file" accept="image/*" onChange={handleFile} className="text-sm text-neutral-300" />
                {logo && (
                  <img
                    ref={logoRef}
                    src={logo}
                    alt=""
                    className={`mt-2 h-16 w-16 object-contain ${replaceIndex !== null ? "cursor-crosshair" : ""}`}
                    onClick={pickColorFromLogo}
                    onMouseMove={updateMagnifier}
                    onMouseLeave={() => setMagnifier(null)}
                  />
                )}
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Colors</label>
                <div className="flex gap-1 items-center flex-wrap">
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
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-neutral-300 hover:text-white">Cancel</button>
              <button onClick={save} className="bg-neutral-200 text-black font-bold px-4 py-2 rounded">Save</button>
            </div>
            {message && <p className="text-sm text-amber-300 mt-2">{message}</p>}

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
          </div>
        </div>
      )}
    </>
  );
}
