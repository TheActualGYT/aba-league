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

export default function EditPlayerButton({
  player,
  teams,
}: {
  player: { id: number; name: string; position: string | null; team_id: number | null };
  teams: { id: number; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(player.name);
  const [position, setPosition] = useState(player.position || "");
  const [teamId, setTeamId] = useState(player.team_id == null ? "" : String(player.team_id));
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) {
      setMessage("Select a position");
      return;
    }
    setMessage("Saving...");
    try {
      const res = await fetch("/api/players", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: player.id,
          name,
          position,
          team_id: teamId || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error || "Failed");
        return;
      }
      window.location.reload();
    } catch (err: any) {
      setMessage("Error: " + err.message);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs text-neutral-300 hover:text-white">
        Edit
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 pt-3 border-t border-neutral-800 space-y-3">
      <div>
        <label className={labelClass}>Player Name</label>
        <input value={name} onChange={e => setName(e.target.value)} className={fieldClass} required />
      </div>
      <div>
        <label className={labelClass}>Position</label>
        <Menu value={position} onChange={setPosition} options={POSITIONS.map(pos => ({ value: pos, label: pos }))} />
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
      {message && <p className="text-xs text-amber-300">{message}</p>}
      <div className="flex gap-2">
        <button type="submit" className="text-xs bg-neutral-200 text-black font-bold px-3 py-1.5 rounded hover:bg-white">Save</button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs bg-neutral-700 text-white px-3 py-1.5 rounded hover:bg-neutral-600">Cancel</button>
      </div>
    </form>
  );
}
