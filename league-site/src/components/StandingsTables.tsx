"use client";

import { useState } from "react";
import { STANDINGS_COLS, splitClass, statValues } from "@/lib/standings";

export type StandingRow = {
  id: number;
  name: string;
  logo?: string;
  overallRank: number;
  seed: number;
  wins: number;
  losses: number;
  winPct: number;
  winPctLabel: string;
  gb: string;
  streak: string;
  home: string;
  away: string;
  ppg: string;
  oppPpg: string;
  diff: number;
  diffLabel: string;
  gpa: string;
};

type SortDir = "asc" | "desc";
type SortKey = "seed" | "name" | "wins" | "losses" | "winPct" | "gb" | "streak" | "home" | "away" | "ppg" | "oppPpg" | "diff" | "gpa";

const COL_SORT: { key: SortKey; prefer: "high" | "low" | "alpha" }[] = [
  { key: "seed", prefer: "low" },
  { key: "name", prefer: "alpha" },
  { key: "wins", prefer: "high" },
  { key: "losses", prefer: "low" },
  { key: "winPct", prefer: "high" },
  { key: "gb", prefer: "low" },
  { key: "streak", prefer: "high" },
  { key: "home", prefer: "high" },
  { key: "away", prefer: "high" },
  { key: "ppg", prefer: "high" },
  { key: "oppPpg", prefer: "low" },
  { key: "diff", prefer: "high" },
  { key: "gpa", prefer: "high" },
];

function recordValue(record: string) {
  const match = /^(\d+)-(\d+)$/.exec(record);
  if (!match) return null;
  return Number(match[1]) * 1000 - Number(match[2]);
}

function streakValue(streak: string) {
  const match = /^([WL])(\d+)$/.exec(streak);
  if (!match) return null;
  const count = Number(match[2]);
  return match[1] === "W" ? count : -count;
}

function numberValue(raw: string) {
  if (!raw || raw === "\u2014") return null;
  const value = Number(String(raw).replace("+", ""));
  return Number.isFinite(value) ? value : null;
}

function sortValue(team: StandingRow, key: SortKey): number | string | null {
  if (key === "seed") return team.seed;
  if (key === "name") return team.name;
  if (key === "wins") return team.wins;
  if (key === "losses") return team.losses;
  if (key === "winPct") return team.winPct;
  if (key === "gb") return numberValue(team.gb) ?? 0;
  if (key === "streak") return streakValue(team.streak);
  if (key === "home") return recordValue(team.home);
  if (key === "away") return recordValue(team.away);
  if (key === "ppg") return numberValue(team.ppg);
  if (key === "oppPpg") return numberValue(team.oppPpg);
  if (key === "diff") return team.diff;
  return numberValue(team.gpa);
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

function sortTeams(teams: StandingRow[], key: SortKey, dir: SortDir) {
  return teams
    .map((team, index) => ({ team, index }))
    .sort((a, b) => compare(sortValue(a.team, key), sortValue(b.team, key), dir) || a.team.seed - b.team.seed || a.index - b.index)
    .map(item => item.team);
}

function useStandingsSort() {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "seed", dir: "asc" });

  const toggle = (index: number) => {
    const column = COL_SORT[index];
    setSort(current => {
      if (current.key !== column.key) {
        const dir: SortDir = column.prefer === "high" ? "desc" : "asc";
        return { key: column.key, dir };
      }
      return { key: column.key, dir: current.dir === "asc" ? "desc" : "asc" };
    });
  };

  return { sort, toggle };
}

function SortLabel({
  index,
  active,
  dir,
  onSort,
  buttonClass,
}: {
  index: number;
  active: boolean;
  dir: SortDir;
  onSort: (index: number) => void;
  buttonClass: string;
}) {
  const column = STANDINGS_COLS[index];
  return (
    <button type="button" onClick={() => onSort(index)} className={buttonClass}>
      <span>{column.label}</span>
      {active && <span className="ml-1 text-[9px]">{dir === "asc" ? "\u25b2" : "\u25bc"}</span>}
    </button>
  );
}

function cellClass(index: number, edges: { top?: boolean; bottom?: boolean }) {
  const left = index === 0;
  const right = index === STANDINGS_COLS.length - 1;
  return [
    "px-2 py-3 bg-neutral-900 border-neutral-700 whitespace-nowrap",
    left ? "border-l" : "",
    right ? "border-r" : "",
    "border-b",
    edges.top ? "border-t" : "",
    edges.top && left ? "rounded-tl-lg" : "",
    edges.top && right ? "rounded-tr-lg" : "",
    edges.bottom && left ? "rounded-bl-lg" : "",
    edges.bottom && right ? "rounded-br-lg" : "",
  ].filter(Boolean).join(" ");
}

function LeagueRow({ team, top, bottom }: { team: StandingRow; top?: boolean; bottom?: boolean }) {
  const edges = { top, bottom };
  const inPlayoffs = team.seed <= 16;
  const values = statValues(team);
  return (
    <tr>
      <td className={`${cellClass(0, edges)} ${inPlayoffs ? "gold-glow font-semibold" : ""}`}>{team.seed}</td>
      <td className={`${cellClass(1, edges)} font-semibold text-white`}>
        <div className="flex items-center gap-2 min-w-0">
          {team.logo ? (
            <img src={team.logo} alt="" className="h-6 w-6 object-contain flex-shrink-0" />
          ) : (
            <div className="h-6 w-6 flex-shrink-0" />
          )}
          <span className="truncate">
            <span className={inPlayoffs ? "label-glow" : ""}>{team.name}</span>
            <sup className="text-neutral-500 text-[9px] ml-1">{team.overallRank}</sup>
          </span>
        </div>
      </td>
      {values.map((value, i) => (
        <td key={STANDINGS_COLS[i + 2].label} className={`${cellClass(i + 2, edges)} text-center ${splitClass(STANDINGS_COLS[i + 2])}`}>
          {value}
        </td>
      ))}
    </tr>
  );
}

export function LeagueStandings({ teams }: { teams: StandingRow[] }) {
  const { sort, toggle } = useStandingsSort();
  const sorted = sortTeams(teams, sort.key, sort.dir);
  const defaultOrder = sort.key === "seed" && sort.dir === "asc";
  const playoff = defaultOrder ? sorted.filter(team => team.seed <= 16) : sorted;
  const outside = defaultOrder ? sorted.filter(team => team.seed > 16) : [];

  if (teams.length === 0) {
    return <div className="bg-neutral-900 rounded-lg border border-neutral-700 px-4 py-6 text-center text-neutral-400">No teams yet.</div>;
  }

  return (
    <table className="w-full table-fixed border-separate border-spacing-0">
      <colgroup>
        {STANDINGS_COLS.map(col => (
          <col key={col.label} style={col.width ? { width: col.width } : undefined} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {STANDINGS_COLS.map((col, index) => (
            <th
              key={col.label}
              aria-sort={sort.key === COL_SORT[index].key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
              className={`sticky top-[81px] z-30 px-2 py-3 bg-neutral-800 text-neutral-300 text-xs font-semibold whitespace-nowrap border-y border-neutral-700 ${col.align} ${splitClass(col)} ${
                index === 0 ? "border-l rounded-tl-lg" : ""
              } ${index === STANDINGS_COLS.length - 1 ? "border-r rounded-tr-lg" : ""}`}
            >
              <SortLabel
                index={index}
                active={sort.key === COL_SORT[index].key}
                dir={sort.dir}
                onSort={toggle}
                buttonClass={`inline-flex items-center ${col.align === "text-left" ? "justify-start" : "justify-center"} w-full text-neutral-300 hover:text-white`}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {playoff.map((team, i) => (
          <LeagueRow key={team.id} team={team} bottom={defaultOrder ? i === playoff.length - 1 : i === playoff.length - 1 && outside.length === 0} />
        ))}
        {outside.length > 0 && (
          <tr>
            <td colSpan={STANDINGS_COLS.length} className="bg-transparent py-6 text-center">
              <span className="gold-glow inline-flex items-center justify-center text-sm font-bold tracking-[0.22em]">
                <span className="inline-flex gap-5">
                  <span>^</span>
                  <span>^</span>
                  <span>^</span>
                </span>
                <span className="mx-6">PLAYOFF QUALIFICATION</span>
                <span className="inline-flex gap-5">
                  <span>^</span>
                  <span>^</span>
                  <span>^</span>
                </span>
              </span>
            </td>
          </tr>
        )}
        {outside.map((team, i) => (
          <LeagueRow key={team.id} team={team} top={i === 0} bottom={i === outside.length - 1} />
        ))}
      </tbody>
    </table>
  );
}

export function DivisionStandings({ divisions }: { divisions: { division: string; teams: StandingRow[] }[] }) {
  const { sort, toggle } = useStandingsSort();

  return (
    <>
      {divisions.map(({ division, teams }) => {
        const rows = sortTeams(teams, sort.key, sort.dir);
        return (
          <div key={division} className="mb-10">
            <h3 className="text-2xl font-semibold text-white mb-3">{division}</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-fixed bg-neutral-900 rounded-lg border border-neutral-700">
                <colgroup>
                  {STANDINGS_COLS.map(col => (
                    <col key={col.label} style={col.width ? { width: col.width } : undefined} />
                  ))}
                </colgroup>
                <thead className="bg-neutral-800">
                  <tr>
                    {STANDINGS_COLS.map((col, index) => (
                      <th
                        key={col.label}
                        aria-sort={sort.key === COL_SORT[index].key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                        className={`px-2 py-3 text-neutral-300 text-xs whitespace-nowrap ${col.align} ${splitClass(col)}`}
                      >
                        <SortLabel
                          index={index}
                          active={sort.key === COL_SORT[index].key}
                          dir={sort.dir}
                          onSort={toggle}
                          buttonClass={`inline-flex items-center ${col.align === "text-left" ? "justify-start" : "justify-center"} w-full hover:text-white`}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(team => (
                    <tr key={team.id} className="border-t border-neutral-700">
                      <td className="px-2 py-3 whitespace-nowrap">{team.seed}</td>
                      <td className="px-2 py-3 font-semibold text-white">
                        <div className="flex items-center gap-2 min-w-0">
                          {team.logo ? (
                            <img src={team.logo} alt="" className="h-6 w-6 object-contain flex-shrink-0" />
                          ) : (
                            <div className="h-6 w-6 flex-shrink-0" />
                          )}
                          <span className="truncate">
                            {team.name}<sup className="text-neutral-500 text-[9px] ml-1">{team.overallRank}</sup>
                          </span>
                        </div>
                      </td>
                      {statValues(team).map((value, index) => (
                        <td key={STANDINGS_COLS[index + 2].label} className={`px-2 py-3 text-center whitespace-nowrap ${splitClass(STANDINGS_COLS[index + 2])}`}>
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td colSpan={STANDINGS_COLS.length} className="px-4 py-6 text-center text-neutral-400">No teams in this division yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </>
  );
}
