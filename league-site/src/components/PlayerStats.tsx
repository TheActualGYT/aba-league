"use client";

import { useEffect, useRef, useState } from "react";
import type { SeasonLine } from "@/lib/gameScore";

export type StatRow = {
  id: number;
  rank: number;
  position: string;
  name: string;
  line: SeasonLine;
};

const POS_ORDER = ["C", "PF", "SF", "SG", "PG"];

const COLUMNS: { key: keyof SeasonLine | "fgPct" | "tpPct" | "ftPct" | "twoPct"; label: string; pct?: boolean }[] = [
  { key: "gmsc", label: "GmSc" },
  { key: "pts", label: "PTS" },
  { key: "ast", label: "AST" },
  { key: "reb", label: "REB" },
  { key: "stl", label: "STL" },
  { key: "blk", label: "BLK" },
  { key: "to", label: "TO" },
  { key: "pf", label: "PF" },
  { key: "fgm", label: "FGM" },
  { key: "fga", label: "FGA" },
  { key: "fgPct", label: "FG%", pct: true },
  { key: "tpm", label: "3PM" },
  { key: "tpa", label: "3PA" },
  { key: "tpPct", label: "3P%", pct: true },
  { key: "ftm", label: "FTM" },
  { key: "fta", label: "FTA" },
  { key: "ftPct", label: "FT%", pct: true },
  { key: "twom", label: "2PM" },
  { key: "twoa", label: "2PA" },
  { key: "twoPct", label: "2P%", pct: true },
];

const RANK_W = "3.25rem";
const POS_W = "4.75rem";
const NAME_W = "14rem";
const STAT_W = "4.35rem";

type SortKey = "rank" | "position" | "name" | (typeof COLUMNS)[number]["key"];

function pct(makes: number, attempts: number) {
  if (!attempts) return "\u2014";
  return (makes / attempts).toFixed(3).slice(1);
}

function valueOf(row: StatRow, key: SortKey) {
  const line = row.line;
  if (key === "rank") return 0;
  if (key === "position") return POS_ORDER.indexOf(row.position) === -1 ? 99 : POS_ORDER.indexOf(row.position);
  if (key === "name") return row.name;
  if (key === "fgPct") return line.fga ? line.fgm / line.fga : -1;
  if (key === "tpPct") return line.tpa ? line.tpm / line.tpa : -1;
  if (key === "ftPct") return line.fta ? line.ftm / line.fta : -1;
  if (key === "twoPct") return line.twoa ? line.twom / line.twoa : -1;
  return line[key];
}

function shown(row: StatRow, key: SortKey) {
  const line = row.line;
  if (key === "fgPct") return pct(line.fgm, line.fga);
  if (key === "tpPct") return pct(line.tpm, line.tpa);
  if (key === "ftPct") return pct(line.ftm, line.fta);
  if (key === "twoPct") return pct(line.twom, line.twoa);
  if (key === "gmsc" || key === "pts" || key === "ast" || key === "reb" || key === "stl" || key === "blk" || key === "to" || key === "pf" || key === "fgm" || key === "fga" || key === "tpm" || key === "tpa" || key === "ftm" || key === "fta" || key === "twom" || key === "twoa") {
    return line[key].toFixed(1);
  }
  return "";
}

export default function PlayerStats({ rows }: { rows: StatRow[] }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "gmsc", dir: "desc" });
  const [scroll, setScroll] = useState({ left: 0, max: 0 });

  const ordered = [...rows].sort((a, b) => {
    const left = valueOf(a, sort.key);
    const right = valueOf(b, sort.key);
    const primary = typeof left === "string" || typeof right === "string"
      ? String(left).localeCompare(String(right))
      : left - right;
    if (primary) return sort.dir === "asc" ? primary : -primary;
    return a.name.localeCompare(b.name);
  });

  const syncScroll = () => {
    const node = bodyRef.current;
    if (!node) return;
    setScroll({ left: node.scrollLeft, max: Math.max(0, node.scrollWidth - node.clientWidth) });
  };

  useEffect(() => {
    syncScroll();
    const onResize = () => syncScroll();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [rows.length]);

  const toggle = (key: SortKey) => {
    if (key === "rank") {
      setSort({ key: "gmsc", dir: "desc" });
      return;
    }
    setSort(current => {
      if (current.key === key) return { key, dir: current.dir === "asc" ? "desc" : "asc" };
      if (key === "name") return { key, dir: "asc" };
      if (key === "position") return { key, dir: "asc" };
      return { key, dir: "desc" };
    });
  };

  const mark = (key: SortKey) => (sort.key === key ? (sort.dir === "asc" ? " \u25b2" : " \u25bc") : "");

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-700">
      {scroll.max > 0 && (
        <div className="border-b border-neutral-700 bg-neutral-900 px-3 pt-2 pb-1">
          <input
            type="range"
            min={0}
            max={scroll.max}
            value={Math.min(scroll.left, scroll.max)}
            aria-label="Scroll player stats"
            className="sheet-slider"
            onChange={event => {
              const left = Number(event.target.value);
              if (bodyRef.current) bodyRef.current.scrollLeft = left;
              setScroll(current => ({ ...current, left }));
            }}
          />
        </div>
      )}
      <div ref={bodyRef} onScroll={syncScroll} className="overflow-x-auto">
        <table className="w-max border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-[11px] font-bold tracking-[0.18em] text-white">
              <th
                colSpan={4}
                style={{ left: 0 }}
                className="sticky z-30 bg-neutral-950 px-2 py-2 text-center border-b border-r border-neutral-600"
              >
                VITALS
              </th>
              <th colSpan={COLUMNS.length - 1} className="bg-neutral-950 px-2 py-2 text-center border-b border-neutral-600">
                AVERAGES
              </th>
            </tr>
            <tr className="text-xs text-neutral-300">
              <th style={{ width: RANK_W, minWidth: RANK_W, left: 0 }} className="sticky z-20 bg-neutral-800 px-2 py-3 text-center font-semibold border-b border-r border-neutral-700">
                <button type="button" onClick={() => toggle("rank")} className="hover:text-white">Rank{mark("rank")}</button>
              </th>
              <th style={{ width: POS_W, minWidth: POS_W, left: RANK_W }} className="sticky z-20 bg-neutral-800 px-2 py-3 text-center font-semibold border-b border-r border-neutral-700">
                <button type="button" onClick={() => toggle("position")} className="hover:text-white">Position{mark("position")}</button>
              </th>
              <th style={{ width: NAME_W, minWidth: NAME_W, left: `calc(${RANK_W} + ${POS_W})` }} className="sticky z-20 bg-neutral-800 px-3 py-3 text-left font-semibold border-b border-r border-neutral-700">
                <button type="button" onClick={() => toggle("name")} className="hover:text-white">Player Name{mark("name")}</button>
              </th>
              {COLUMNS.map(column => {
                const frozen = column.key === "gmsc";
                return (
                  <th
                    key={column.label}
                    style={{
                      width: STAT_W,
                      minWidth: STAT_W,
                      ...(frozen ? { left: `calc(${RANK_W} + ${POS_W} + ${NAME_W})` } : {}),
                    }}
                    className={`${frozen ? "sticky z-20 border-r" : "border-l"} bg-neutral-800 px-2 py-3 text-center font-semibold border-b border-neutral-700`}
                  >
                    <button type="button" onClick={() => toggle(column.key)} className="hover:text-white">{column.label}{mark(column.key)}</button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ordered.length === 0 ? (
              <tr>
                <td colSpan={3 + COLUMNS.length} className="bg-neutral-900 px-4 py-8 text-center text-neutral-400">
                  No player stats yet.
                </td>
              </tr>
            ) : (
              ordered.map((row, index) => (
                <tr key={row.id} className="h-10">
                  <td style={{ width: RANK_W, minWidth: RANK_W, left: 0 }} className="sticky z-10 bg-neutral-900 px-2 text-center text-neutral-400 border-b border-r border-neutral-700">{index + 1}</td>
                  <td style={{ width: POS_W, minWidth: POS_W, left: RANK_W }} className="sticky z-10 bg-neutral-900 px-2 text-center text-neutral-200 border-b border-r border-neutral-700">{row.position || "\u2014"}</td>
                  <td style={{ width: NAME_W, minWidth: NAME_W, left: `calc(${RANK_W} + ${POS_W})` }} className="sticky z-10 bg-neutral-900 px-3 text-left font-semibold text-white border-b border-r border-neutral-700">{row.name}</td>
                  {COLUMNS.map(column => {
                    const frozen = column.key === "gmsc";
                    return (
                      <td
                        key={column.label}
                        style={{
                          width: STAT_W,
                          minWidth: STAT_W,
                          ...(frozen ? { left: `calc(${RANK_W} + ${POS_W} + ${NAME_W})` } : {}),
                        }}
                        className={`${frozen ? "sticky z-10 border-r" : "border-l"} bg-neutral-900 px-2 text-center text-neutral-200 border-b border-neutral-700`}
                      >
                        {shown(row, column.key)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
