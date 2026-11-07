"use client";

import { useState } from "react";
import Link from "next/link";
import DeletePlayerButton from "@/components/DeletePlayerButton";

export type DirectoryPlayer = {
  id: number;
  name: string;
  team: string;
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

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "vitals", label: "VITALS" },
  { id: "appearance", label: "APPEARANCE" },
  { id: "accessories", label: "ACCESSORIES" },
  { id: "attributes", label: "ATTRIBUTES" },
];

const COLUMNS: Record<SectionId, { key: keyof DirectoryPlayer; label: string; note?: string; gap?: boolean }[]> = {
  vitals: [
    { key: "position", label: "Position" },
    { key: "rating", label: "Rating" },
    { key: "height", label: "Height" },
    { key: "weight", label: "Weight" },
    { key: "number", label: "Jersey" },
    { key: "hand", label: "Hand" },
    { key: "team", label: "Team" },
  ],
  appearance: [
    { key: "skin_tone", label: "Skin Tone" },
    { key: "body_type", label: "Body Type" },
    { key: "head_model", label: "Head Model" },
    { key: "tshirt_type", label: "T-Shirt" },
    { key: "sock_style", label: "Sock Style" },
    { key: "sock_color", label: "Sock Color" },
    { key: "shoes_home", label: "Shoes Home" },
    { key: "shoes_away", label: "Shoes Away" },
  ],
  accessories: [
    { key: "headband", label: "Headband" },
    { key: "left_bicep", label: "Left Bicep" },
    { key: "right_bicep", label: "Right Bicep" },
    { key: "left_forearm", label: "Left Forearm" },
    { key: "right_forearm", label: "Right Forearm" },
    { key: "left_elbow", label: "Left Elbow" },
    { key: "right_elbow", label: "Right Elbow" },
    { key: "left_wrist", label: "Left Wrist" },
    { key: "right_wrist", label: "Right Wrist" },
    { key: "left_knee", label: "Left Knee" },
    { key: "right_knee", label: "Right Knee" },
    { key: "left_calf", label: "Left Calf" },
    { key: "right_calf", label: "Right Calf" },
  ],
  attributes: [
    { key: "fg", label: "FG", note: "Field Goal" },
    { key: "three_p", label: "3P", note: "Three Point" },
    { key: "ft", label: "FT", note: "Free Throw" },
    { key: "dk", label: "DK", note: "Dunk" },
    { key: "stl", label: "STL", note: "Steal" },
    { key: "blk", label: "BLK", note: "Block" },
    { key: "off_reb", label: "OR", note: "Offensive Rebound" },
    { key: "def_reb", label: "DR", note: "Defensive Rebound" },
    { key: "passing", label: "PS", note: "Passing" },
    { key: "off_ability", label: "OA", note: "Offensive Ability" },
    { key: "def_ability", label: "DA", note: "Defensive Ability" },
    { key: "speed", label: "SP", note: "Speed" },
    { key: "quickness", label: "QK", note: "Quickness" },
    { key: "vertical", label: "JP", note: "Vertical" },
    { key: "dribble", label: "DRI", note: "Dribble" },
    { key: "strength", label: "STR", note: "Strength" },
    { key: "durability", label: "DUR", note: "Durability" },
    { key: "shooting_range", label: "SR", note: "Shooting Range" },
    { key: "stamina", label: "STM", note: "Stamina" },
    { key: "inside_scoring", label: "IS", note: "Inside Scoring" },
    { key: "in_game_rating", label: "IGR", note: "In-Game Rating", gap: true },
  ],
};

function HeaderLabel({ label, note }: { label: string; note?: string }) {
  if (!note) return <span>{label}</span>;
  return (
    <span className="relative inline-block cursor-default group">
      {label}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded border border-neutral-500 bg-neutral-900 px-2 py-1 text-[10px] font-medium tracking-normal text-white shadow-lg group-hover:block">
        {note}
      </span>
    </span>
  );
}

export default function PlayerDirectory({ players }: { players: DirectoryPlayer[] }) {
  const [section, setSection] = useState<SectionId>("vitals");
  const columns = COLUMNS[section];

  return (
    <>
      <div className="relative mb-6 flex items-center justify-center min-h-10">
        <div className="flex flex-wrap justify-center gap-2">
          {SECTIONS.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`px-4 py-2 rounded text-sm font-bold tracking-wide ${
                section === item.id
                  ? "bg-neutral-200 text-black"
                  : "border border-neutral-600 text-neutral-300 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Link href="/players/new" className="absolute right-0 bg-neutral-200 text-black font-bold px-5 py-2 rounded hover:bg-white">
          Create Player
        </Link>
      </div>

      {players.length === 0 ? (
        <div className="bg-neutral-900 rounded-lg border border-neutral-700 px-4 py-6 text-center text-neutral-400">No players yet.</div>
      ) : (
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="sticky top-[81px] z-30 px-3 py-3 bg-neutral-800 text-left text-neutral-300 text-xs font-semibold whitespace-nowrap border-y border-l border-neutral-700 rounded-tl-lg">
                Player
              </th>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`sticky top-[81px] z-30 px-2 py-3 bg-neutral-800 text-center text-neutral-300 text-xs font-semibold whitespace-nowrap border-y border-neutral-700 ${column.gap ? "border-l" : ""}`}
                >
                  <HeaderLabel label={column.label} note={column.note} />
                </th>
              ))}
              <th className="sticky top-[81px] z-30 px-3 py-3 bg-neutral-800 border-y border-r border-neutral-700 rounded-tr-lg" />
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => {
              const last = index === players.length - 1;
              return (
                <tr key={player.id}>
                  <td className={`px-3 py-3 bg-neutral-900 text-white font-semibold whitespace-nowrap border-b border-l border-neutral-700 ${last ? "rounded-bl-lg" : ""}`}>
                    {player.name}
                  </td>
                  {columns.map(column => (
                    <td
                      key={column.key}
                      className={`px-2 py-3 bg-neutral-900 text-center text-neutral-200 whitespace-nowrap border-b border-neutral-700 ${column.gap ? "border-l border-neutral-700" : ""}`}
                    >
                      {column.key === "team" ? (
                        <span className="inline-flex items-center justify-center gap-2">
                          {player.logo && <img src={player.logo} alt="" className="h-5 w-5 object-contain" />}
                          {player.team}
                        </span>
                      ) : (
                        player[column.key]
                      )}
                    </td>
                  ))}
                  <td className={`px-3 py-3 bg-neutral-900 text-right whitespace-nowrap border-b border-r border-neutral-700 ${last ? "rounded-br-lg" : ""}`}>
                    <DeletePlayerButton playerId={player.id} playerName={player.name} />
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
