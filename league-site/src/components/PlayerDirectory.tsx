"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import DeletePlayerButton from "@/components/DeletePlayerButton";
import { useCloseOnOutside } from "@/components/useCloseOnOutside";
import { ratingFill, RATING_INK } from "@/lib/ratingColor";

export type DirectoryPlayer = {
  id: number;
  name: string;
  team: string;
  abbreviation: string;
  logo: string;
  position: string;
  rating: string;
  height: string;
  weight: string;
  number: string;
  hand: string;
  skin_tone: string;
  body_type: string;
  head_model: string;
  tshirt_type: string;
  sock_style: string;
  sock_color: string;
  shoes_home: string;
  shoes_away: string;
  headband: string;
  right_bicep: string;
  left_bicep: string;
  right_forearm: string;
  left_forearm: string;
  right_elbow: string;
  left_elbow: string;
  right_wrist: string;
  left_wrist: string;
  right_knee: string;
  left_knee: string;
  right_calf: string;
  left_calf: string;
  fg: string;
  three_p: string;
  ft: string;
  dk: string;
  stl: string;
  blk: string;
  off_reb: string;
  def_reb: string;
  passing: string;
  off_ability: string;
  def_ability: string;
  speed: string;
  quickness: string;
  vertical: string;
  dribble: string;
  strength: string;
  durability: string;
  shooting_range: string;
  stamina: string;
  inside_scoring: string;
  in_game_rating: string;
};

type SectionId = "vitals" | "appearance" | "accessories" | "attributes";
type SortDir = "asc" | "desc";
type SortKey = "name" | keyof DirectoryPlayer;

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "vitals", label: "Vitals" },
  { id: "appearance", label: "Appearance" },
  { id: "accessories", label: "Accessories" },
  { id: "attributes", label: "Attributes" },
];

const NUM_COL = "2.75rem";
const NAME_COL = "16.5rem";
const ACTION_COL = "7.75rem";
const ROW = "h-10 max-h-10";
const POSITION_ORDER = ["C", "PF", "SF", "SG", "PG"];

const COLUMNS: Record<SectionId, { key: keyof DirectoryPlayer; label: string; note?: string; gap?: boolean; prefer: "high" | "low" | "alpha" }[]> = {
  vitals: [
    { key: "position", label: "Position", prefer: "alpha" },
    { key: "rating", label: "Rating", prefer: "high" },
    { key: "height", label: "Height", prefer: "high" },
    { key: "weight", label: "Weight", prefer: "high" },
    { key: "number", label: "Jersey", prefer: "low" },
    { key: "hand", label: "Hand", prefer: "alpha" },
    { key: "team", label: "Team", prefer: "alpha" },
  ],
  appearance: [
    { key: "skin_tone", label: "Skin Tone", prefer: "alpha" },
    { key: "body_type", label: "Body Type", prefer: "alpha" },
    { key: "head_model", label: "Head Model", prefer: "high" },
    { key: "tshirt_type", label: "T-Shirt", prefer: "alpha" },
    { key: "sock_style", label: "Sock Style", prefer: "alpha" },
    { key: "sock_color", label: "Sock Color", prefer: "alpha" },
    { key: "shoes_home", label: "Shoes Home", prefer: "alpha" },
    { key: "shoes_away", label: "Shoes Away", prefer: "alpha" },
  ],
  accessories: [
    { key: "headband", label: "Headband", prefer: "alpha" },
    { key: "left_bicep", label: "Left Bicep", prefer: "alpha" },
    { key: "right_bicep", label: "Right Bicep", prefer: "alpha" },
    { key: "left_forearm", label: "Left Forearm", prefer: "alpha" },
    { key: "right_forearm", label: "Right Forearm", prefer: "alpha" },
    { key: "left_elbow", label: "Left Elbow", prefer: "alpha" },
    { key: "right_elbow", label: "Right Elbow", prefer: "alpha" },
    { key: "left_wrist", label: "Left Wrist", prefer: "alpha" },
    { key: "right_wrist", label: "Right Wrist", prefer: "alpha" },
    { key: "left_knee", label: "Left Knee", prefer: "alpha" },
    { key: "right_knee", label: "Right Knee", prefer: "alpha" },
    { key: "left_calf", label: "Left Calf", prefer: "alpha" },
    { key: "right_calf", label: "Right Calf", prefer: "alpha" },
  ],
  attributes: [
    { key: "fg", label: "FG", note: "Field Goal", prefer: "high" },
    { key: "three_p", label: "3P", note: "Three Point", prefer: "high" },
    { key: "ft", label: "FT", note: "Free Throw", prefer: "high" },
    { key: "dk", label: "DK", note: "Dunk", prefer: "high" },
    { key: "stl", label: "STL", note: "Steal", prefer: "high" },
    { key: "blk", label: "BLK", note: "Block", prefer: "high" },
    { key: "off_reb", label: "OR", note: "Offensive Rebound", prefer: "high" },
    { key: "def_reb", label: "DR", note: "Defensive Rebound", prefer: "high" },
    { key: "passing", label: "PS", note: "Passing", prefer: "high" },
    { key: "off_ability", label: "OA", note: "Offensive Ability", prefer: "high" },
    { key: "def_ability", label: "DA", note: "Defensive Ability", prefer: "high" },
    { key: "speed", label: "SP", note: "Speed", prefer: "high" },
    { key: "quickness", label: "QK", note: "Quickness", prefer: "high" },
    { key: "vertical", label: "JP", note: "Vertical", prefer: "high" },
    { key: "dribble", label: "DRI", note: "Dribble", prefer: "high" },
    { key: "strength", label: "STR", note: "Strength", prefer: "high" },
    { key: "durability", label: "DUR", note: "Durability", prefer: "high" },
    { key: "shooting_range", label: "SR", note: "Shooting Range", prefer: "high" },
    { key: "stamina", label: "STM", note: "Stamina", prefer: "high" },
    { key: "inside_scoring", label: "IS", note: "Inside Scoring", prefer: "high" },
    { key: "in_game_rating", label: "IGR", note: "In-Game Rating", gap: true, prefer: "high" },
  ],
};

const NUMERIC = new Set([
  "rating", "weight", "number", "head_model",
  "fg", "three_p", "dk", "stl", "blk", "off_reb", "def_reb", "passing",
  "off_ability", "def_ability", "speed", "quickness", "vertical", "dribble",
  "strength", "durability", "shooting_range", "stamina", "inside_scoring", "in_game_rating",
]);

function heightInches(raw: string) {
  const match = /^(\d+)'(\d+)"$/.exec(raw.trim());
  if (!match) return null;
  return Number(match[1]) * 12 + Number(match[2]);
}

function positionRank(raw: string) {
  const index = POSITION_ORDER.indexOf(raw.trim());
  return index === -1 ? null : index;
}

function columnWeight(section: SectionId, key: string) {
  if (section === "vitals" && key === "team") return 3;
  return 1;
}

function playerValue(player: DirectoryPlayer, key: SortKey): number | string | null {
  if (key === "name") return player.name;
  if (key === "team") return player.abbreviation.trim() || null;
  const raw = String(player[key] ?? "").trim();
  if (!raw || raw === "\u2014" || raw === "None") return null;
  if (key === "height") return heightInches(raw);
  if (NUMERIC.has(key)) {
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  }
  return raw;
}

function compare(a: number | string | null, b: number | string | null, dir: SortDir) {
  const aEmpty = a == null || a === "";
  const bEmpty = b == null || b === "";
  if (aEmpty && bEmpty) return 0;
  if (aEmpty) return 1;
  if (bEmpty) return -1;
  const result = typeof a === "number" && typeof b === "number"
    ? a - b
    : String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
  return dir === "asc" ? result : -result;
}

function HeaderLabel({ label, note }: { label: string; note?: string }) {
  const [box, setBox] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!box) return;
    const close = () => setBox(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [box]);

  if (!note) return <span>{label}</span>;

  return (
    <span
      className="cursor-default"
      onMouseEnter={event => {
        const rect = event.currentTarget.getBoundingClientRect();
        setBox({ x: rect.left + rect.width / 2, y: rect.top - 6 });
      }}
      onMouseLeave={() => setBox(null)}
    >
      {label}
      {box && createPortal(
        <span
          className="pointer-events-none fixed z-[80] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded border border-neutral-500 bg-neutral-900 px-2 py-1 text-[10px] font-medium tracking-normal text-white shadow-lg"
          style={{ left: box.x, top: box.y }}
        >
          {note}
        </span>,
        document.body
      )}
    </span>
  );
}

function SectionMenu({ value, onChange }: { value: SectionId; onChange: (value: SectionId) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useCloseOnOutside<HTMLDivElement>(open, setOpen);
  const current = SECTIONS.find(item => item.id === value);

  return (
    <div className="relative w-52" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen(currentOpen => !currentOpen)}
        className="w-full h-10 px-3 bg-neutral-800 border border-neutral-600 rounded text-white text-left flex items-center justify-between"
      >
        <span>{current?.label}</span>
        <span className="text-neutral-400 text-[10px]">▼</span>
      </button>
      {open && (
        <div className="absolute z-40 mt-1 w-full bg-neutral-800 border border-neutral-600 rounded overflow-hidden shadow-lg">
          {SECTIONS.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onChange(item.id);
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-700 ${value === item.id ? "bg-neutral-700" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PlayerDirectory({ players }: { players: DirectoryPlayer[] }) {
  const [section, setSection] = useState<SectionId>("vitals");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "name", dir: "asc" });
  const columns = COLUMNS[section];
  const dense = columns.length > 10;
  const numStyle = { width: NUM_COL, minWidth: NUM_COL, maxWidth: NUM_COL };
  const nameStyle = { width: NAME_COL, minWidth: NAME_COL, maxWidth: NAME_COL };
  const actionStyle = { width: ACTION_COL, minWidth: ACTION_COL, maxWidth: ACTION_COL };
  const totalWeight = columns.reduce((sum, column) => sum + columnWeight(section, column.key), 0);
  const widthFor = (key: string) => `calc((100% - ${NUM_COL} - ${NAME_COL} - ${ACTION_COL}) * ${columnWeight(section, key)} / ${totalWeight})`;
  const rows = [...players]
    .map((player, index) => ({ player, index }))
    .sort((a, b) => {
      const primary = sort.key === "position"
        ? compare(positionRank(a.player.position), positionRank(b.player.position), sort.dir)
        : compare(playerValue(a.player, sort.key), playerValue(b.player, sort.key), sort.dir);
      return primary || a.player.name.localeCompare(b.player.name) || a.index - b.index;
    })
    .map(item => item.player);

  const chooseSection = (next: SectionId) => {
    setSection(next);
    setSort(current => {
      if (current.key === "name") return current;
      return COLUMNS[next].some(column => column.key === current.key) ? current : { key: "name", dir: "asc" };
    });
  };

  const toggleSort = (key: SortKey, prefer: "high" | "low" | "alpha") => {
    setSort(current => {
      if (current.key !== key) return { key, dir: prefer === "high" ? "desc" : "asc" };
      return { key, dir: current.dir === "asc" ? "desc" : "asc" };
    });
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <SectionMenu value={section} onChange={chooseSection} />
        <Link href="/players/new" className="bg-neutral-200 text-black font-bold px-5 py-2 rounded hover:bg-white">
          Create Player
        </Link>
      </div>

      {players.length === 0 ? (
        <div className="bg-neutral-900 rounded-lg border border-neutral-700 px-4 py-6 text-center text-neutral-400">No players yet.</div>
      ) : (
        <table className="w-full table-fixed border-separate border-spacing-0 text-sm leading-5">
          <colgroup>
            <col style={{ width: NUM_COL }} />
            <col style={{ width: NAME_COL }} />
            {columns.map(column => (
              <col key={column.key} style={{ width: widthFor(column.key) }} />
            ))}
            <col style={{ width: ACTION_COL }} />
          </colgroup>
          <thead>
            <tr>
              <th
                style={numStyle}
                className="sticky top-[81px] z-30 px-1 py-3 bg-neutral-800 text-center text-neutral-300 text-xs font-semibold border-y border-l border-neutral-700 rounded-tl-lg"
              >
                #
              </th>
              <th
                aria-sort={sort.key === "name" ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                style={nameStyle}
                className="sticky top-[81px] z-30 px-3 py-3 bg-neutral-800 text-left text-sm font-semibold whitespace-nowrap border-y border-l border-neutral-700"
              >
                <button type="button" onClick={() => toggleSort("name", "alpha")} className="inline-flex items-center text-xs text-neutral-300 hover:text-white">
                  <span>Player</span>
                  {sort.key === "name" && <span className="ml-1 text-[9px]">{sort.dir === "asc" ? "\u25b2" : "\u25bc"}</span>}
                </button>
              </th>
              {columns.map(column => (
                <th
                  key={column.key}
                  aria-sort={sort.key === column.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                  style={{ width: widthFor(column.key) }}
                  className={`sticky top-[81px] z-30 py-3 bg-neutral-800 text-center text-neutral-300 text-xs font-semibold border-y border-l border-neutral-700 whitespace-normal leading-tight ${dense ? "px-1" : "px-2"}`}
                >
                  <button type="button" onClick={() => toggleSort(column.key, column.prefer)} className="inline-flex items-center justify-center w-full text-neutral-300 hover:text-white">
                    <HeaderLabel label={column.label} note={column.note} />
                    {sort.key === column.key && <span className="ml-1 text-[9px]">{sort.dir === "asc" ? "\u25b2" : "\u25bc"}</span>}
                  </button>
                </th>
              ))}
              <th
                style={actionStyle}
                className="sticky top-[81px] z-30 px-3 py-3 bg-neutral-800 border-y border-l border-r border-neutral-700 rounded-tr-lg"
              />
            </tr>
          </thead>
          <tbody>
            {rows.map((player, index) => {
              const last = index === rows.length - 1;
              return (
                <tr key={player.id} className="h-10">
                  <td
                    style={numStyle}
                    className={`${ROW} px-1 py-0 bg-neutral-900 text-center text-neutral-400 border-b border-l border-neutral-700 align-middle ${last ? "rounded-bl-lg" : ""}`}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={nameStyle}
                    className={`${ROW} px-3 py-0 bg-neutral-900 text-white text-sm font-semibold border-b border-l border-neutral-700 align-middle`}
                  >
                    <div className="truncate">
                      {player.name}
                    </div>
                  </td>
                  {columns.map(column => {
                    const tinted = section === "attributes" || column.key === "rating";
                    const fill = tinted ? ratingFill(String(player[column.key] ?? "")) : null;
                    const value = column.key === "team" ? player.team : String(player[column.key] ?? "");
                    return (
                      <td
                        key={column.key}
                        title={value}
                        style={{ width: widthFor(column.key), height: 40, ...(fill ? { backgroundColor: fill, color: RATING_INK } : {}) }}
                        className={`${ROW} py-0 text-center border-b border-l border-neutral-700 overflow-hidden align-middle ${dense ? "px-1" : "px-2"} ${fill ? "font-semibold" : "bg-neutral-900 text-neutral-200"}`}
                      >
                        {column.key === "team" ? (
                          <span className="flex h-5 items-center justify-center gap-1.5">
                            {player.logo && (
                              <img
                                src={player.logo}
                                alt=""
                                width={16}
                                height={16}
                                className="block h-4 w-4 shrink-0 object-contain"
                                style={{ width: 16, height: 16 }}
                              />
                            )}
                            <span className="truncate leading-5">{player.abbreviation}</span>
                          </span>
                        ) : (
                          <span className="block truncate leading-5">
                            {player[column.key]}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td style={{ ...actionStyle, height: 40 }} className={`${ROW} px-2 py-0 bg-neutral-900 whitespace-nowrap border-b border-l border-r border-neutral-700 align-middle ${last ? "rounded-br-lg" : ""}`}>
                    <div className="flex h-5 items-center justify-center gap-3">
                      <Link href={`/players/${player.id}/edit`} className="text-xs leading-5 text-neutral-300 hover:text-white">
                        Edit
                      </Link>
                      <DeletePlayerButton playerId={player.id} playerName={player.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
