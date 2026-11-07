"use client";

import { useEffect, useState } from "react";

const squareClass = "w-full aspect-square text-center text-sm font-semibold bg-neutral-800 border border-neutral-600 rounded text-white";
const labelClass = "relative block h-4 text-[11px] font-semibold tracking-wide text-neutral-400 text-center mb-1 whitespace-nowrap cursor-default";

export const STAT_FIELDS = [
  { key: "fg", label: "FG", title: "Field Goal" },
  { key: "three_p", label: "3P", title: "Three Point" },
  { key: "ft", label: "FT", title: "Free Throw", locked: true },
  { key: "dk", label: "DK", title: "Dunk" },
  { key: "stl", label: "STL", title: "Steal" },
  { key: "blk", label: "BLK", title: "Block" },
  { key: "off_reb", label: "OR", title: "Offensive Rebound" },
  { key: "def_reb", label: "DR", title: "Defensive Rebound" },
  { key: "passing", label: "PS", title: "Passing" },
  { key: "off_ability", label: "OA", title: "Offensive Ability" },
  { key: "def_ability", label: "DA", title: "Defensive Ability" },
  { key: "speed", label: "SP", title: "Speed" },
  { key: "quickness", label: "QK", title: "Quickness" },
  { key: "vertical", label: "JP", title: "Vertical" },
  { key: "dribble", label: "DRI", title: "Dribble" },
  { key: "strength", label: "STR", title: "Strength" },
  { key: "durability", label: "DUR", title: "Durability" },
  { key: "shooting_range", label: "SR", title: "Shooting Range" },
  { key: "stamina", label: "STM", title: "Stamina" },
  { key: "inside_scoring", label: "IS", title: "Inside Scoring" },
] as const;

export const RATING_FIELD = { key: "in_game_rating", label: "IGR", title: "In-Game Rating" } as const;

export type StatKey = Exclude<(typeof STAT_FIELDS)[number]["key"], "ft"> | typeof RATING_FIELD.key;

export function emptyStats(): Record<StatKey, string> {
  return {
    fg: "",
    three_p: "",
    dk: "",
    stl: "",
    blk: "",
    off_reb: "",
    def_reb: "",
    passing: "",
    off_ability: "",
    def_ability: "",
    speed: "",
    quickness: "",
    vertical: "",
    dribble: "",
    strength: "",
    durability: "",
    shooting_range: "",
    stamina: "",
    inside_scoring: "",
    in_game_rating: "",
  };
}

export function digitsOnly(value: string, max: number) {
  return value.replace(/\D/g, "").slice(0, max);
}

export function statError(value: string) {
  if (!value) return "";
  if (!/^\d{2}$/.test(value)) return "Has to be 2 digits.";
  return "";
}

function Abbrev({ label, note }: { label: string; note: string }) {
  return (
    <label className={`${labelClass} group`}>
      {label}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded border border-neutral-500 bg-neutral-900 px-2 py-1 text-[10px] font-medium tracking-normal text-white shadow-lg group-hover:block">
        {note}
      </span>
    </label>
  );
}

function useSettledMap(entries: { key: string; error: string }[]) {
  const [shown, setShown] = useState<Record<string, string>>({});
  const serialized = entries.map(entry => entry.key + "|" + entry.error).join("~");

  useEffect(() => {
    const parsed = serialized.split("~").filter(Boolean).map(line => {
      const [key, error] = line.split("|");
      return { key, error: error || "" };
    });
    setShown(() => {
      const next: Record<string, string> = {};
      for (const entry of parsed) next[entry.key] = "";
      return next;
    });
    const timers = parsed.filter(entry => entry.error).map(entry =>
      window.setTimeout(() => {
        setShown(current => ({ ...current, [entry.key]: entry.error }));
      }, 2000)
    );
    return () => timers.forEach(timer => window.clearTimeout(timer));
  }, [serialized]);

  return shown;
}

export default function AttributeFields({
  stats,
  onChange,
  revealNow,
  onEdit,
}: {
  stats: Record<StatKey, string>;
  onChange: (key: StatKey, value: string) => void;
  revealNow: boolean;
  onEdit: () => void;
}) {
  const entries = (Object.keys(stats) as StatKey[]).map(key => ({
    key,
    error: statError(stats[key]),
  }));
  const settled = useSettledMap(entries);

  const renderBox = (field: { key: StatKey; label: string; title: string }, glow = false) => {
    const error = statError(stats[field.key]);
    const shown = revealNow ? error : settled[field.key] || "";
    return (
      <div key={field.key} className={`flex flex-col items-center flex-1 min-w-0 ${glow ? "ml-6" : ""}`}>
        <Abbrev label={field.label} note={field.title} />
        <input
          value={stats[field.key]}
          maxLength={2}
          inputMode="numeric"
          aria-label={field.title}
          onChange={event => {
            onEdit();
            onChange(field.key, digitsOnly(event.target.value, 2));
          }}
          className={`${squareClass} ${glow && !shown ? "rating-box" : ""} ${shown ? "abbr-taken" : ""}`}
        />
        <p className="h-3 mt-1 text-[9px] leading-none text-red-400 text-center whitespace-nowrap">{shown}</p>
      </div>
    );
  };

  return (
    <section className="mt-4 bg-neutral-900 border border-neutral-700 rounded-lg p-4">
      <h3 className="label-glow text-white text-lg font-bold tracking-widest mb-3 text-center">ATTRIBUTES</h3>
      <div className="flex flex-nowrap items-start w-full gap-1.5">
        {STAT_FIELDS.map(field => {
          if ("locked" in field && field.locked) {
            return (
              <div key={field.key} className="flex flex-col items-center flex-1 min-w-0">
                <Abbrev label={field.label} note={field.title} />
                <div
                  aria-readonly="true"
                  className="w-full aspect-square rounded border border-[#8a8a8a] cursor-default"
                  style={{
                    background: "linear-gradient(180deg, #8f8f8f 0%, #6d6d6d 48%, #7c7c7c 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.35)",
                  }}
                />
                <p className="h-3 mt-1" />
              </div>
            );
          }
          return renderBox({ key: field.key as StatKey, label: field.label, title: field.title });
        })}
        {renderBox(RATING_FIELD, true)}
      </div>
    </section>
  );
}
