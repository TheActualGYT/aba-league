"use client";

import { useState } from "react";

const POSITIONS = ["PG", "SG", "SF", "PF", "C"];
const fieldClass = "w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white";
const labelClass = "block text-xs font-semibold tracking-wide text-neutral-400 mb-1.5";

function Menu({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find(option => option.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(currentOpen => !currentOpen)}
        className={`${fieldClass} text-left flex items-center justify-between min-h-[42px]`}
      >
        <span>{current?.label || ""}</span>
        <span className="text-neutral-400 text-[10px]">▼</span>
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full bg-neutral-800 border border-neutral-600 rounded overflow-hidden shadow-lg max-h-60 overflow-y-auto">
          {options.map(option => (
            <button
              key={option.value || "none"}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-700 ${value === option.value ? "bg-neutral-700" : ""}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PlayerForm({ teams }: { teams: { id: number; name: string }[] }) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [teamId, setTeamId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) {
      setMessage("Select a position");
      return;
    }
    setMessage("Creating...");
    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          position,
          team_id: teamId || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(`Error: ${json.error || "unknown"}`);
        return;
      }
      window.location.href = "/players";
    } catch (err: any) {
      setMessage("Network error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-700 rounded-lg p-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Player Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className={fieldClass} required />
        </div>
        <div>
          <label className={labelClass}>Position</label>
          <Menu
            value={position}
            onChange={setPosition}
            options={POSITIONS.map(pos => ({ value: pos, label: pos }))}
          />
        </div>
        <div>
          <label className={labelClass}>Team</label>
          <Menu
            value={teamId}
            onChange={setTeamId}
            options={[
              { value: "", label: "Free Agent" },
              ...teams.map(team => ({ value: String(team.id), label: team.name })),
            ]}
          />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-4">
        {message && <p className="text-sm text-amber-300 mr-auto">{message}</p>}
        <button type="submit" className="bg-neutral-200 text-black font-bold px-5 py-2 rounded hover:bg-white">
          Create Player
        </button>
      </div>
    </form>
  );
}
