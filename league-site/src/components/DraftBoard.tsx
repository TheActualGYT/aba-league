"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { abaRank } from "@/lib/abaRank";

const ROUNDS = 5;
const PICKS = 20;
const CELL = 168;
const ROW_H = 112;
const ROUND_W = 156;
const SUMMARY_W = 96;
const SUMMARY_H = 64;

export type DraftProspect = {
  id: number;
  position: string;
  name: string;
  rating: string;
  igr: string;
  height: string;
  weight: string;
  fg: string;
  threeP: string;
};

export type ProspectSection = {
  name: string;
  src: string;
  slots: number;
  players: DraftProspect[];
};

export type PickerTeam = {
  id: number;
  abbreviation: string;
  logo?: string;
  ownership?: string;
};

export type DraftPick = { slot: string; teamId: number; playerId?: number };

function boardRows() {
  return Array.from({ length: ROUNDS }, (_, index) => {
    const round = index + 1;
    return Array.from({ length: PICKS }, (_, pick) => `${round}.${String(pick + 1).padStart(2, "0")}`);
  });
}

function cycleTaken(picks: DraftPick[], teamIds: number[]) {
  const ids = new Set(teamIds);
  let taken = new Set<number>();
  for (const pick of picks) {
    if (!ids.has(pick.teamId)) continue;
    taken.add(pick.teamId);
    if (taken.size === ids.size) taken = new Set();
  }
  return taken;
}

function nextOpenSlot(picks: DraftPick[]) {
  const used = new Set(picks.map(pick => pick.slot));
  for (const row of boardRows()) {
    for (const slot of row) {
      if (!used.has(slot)) return slot;
    }
  }
  return null;
}

function shown(value: string) {
  return value || "-";
}

function ProspectTable({
  players,
  slots,
  canDraft,
  onDraft,
}: {
  players: DraftProspect[];
  slots: number;
  canDraft: boolean;
  onDraft: (playerId: number) => void;
}) {
  const rows: Array<DraftProspect | null> = players.slice(0, slots);
  while (rows.length < slots) rows.push(null);

  return (
    <table className="w-full table-fixed border-collapse text-sm">
      <colgroup>
        <col style={{ width: "3.25rem" }} />
        <col />
        <col style={{ width: "4.75rem" }} />
        <col style={{ width: "4.75rem" }} />
        <col style={{ width: "4.75rem" }} />
        <col style={{ width: "4.75rem" }} />
        <col style={{ width: "4.75rem" }} />
        <col style={{ width: "4.75rem" }} />
      </colgroup>
      <thead>
        <tr className="text-left text-xs uppercase tracking-wide text-neutral-400">
          <th className="border-b border-neutral-700 px-1 py-2 text-center font-semibold">Pos</th>
          <th className="border-b border-neutral-700 px-3 py-2 font-semibold">Player Name</th>
          <th className="border-b border-neutral-700 px-2 py-2 font-semibold">ABA</th>
          <th className="border-b border-neutral-700 px-2 py-2 font-semibold">IGR</th>
          <th className="border-b border-neutral-700 px-2 py-2 font-semibold">HT</th>
          <th className="border-b border-neutral-700 px-2 py-2 font-semibold">WT</th>
          <th className="border-b border-neutral-700 px-2 py-2 font-semibold">FG</th>
          <th className="border-b border-neutral-700 px-2 py-2 font-semibold">3P</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((player, index) => {
          const rank = player ? abaRank(player.rating) : null;
          return (
            <tr
              key={player?.id ?? `empty-${index}`}
              onClick={() => player && canDraft && onDraft(player.id)}
              className={player && canDraft ? "cursor-pointer hover:bg-white/5" : undefined}
            >
              <td className="border-b border-neutral-800 px-1 py-2 text-center text-neutral-200">{player ? shown(player.position) : "-"}</td>
              <td className="border-b border-neutral-800 px-3 py-2 text-white">{player ? player.name : "-"}</td>
              <td className="border-b border-neutral-800 px-2 py-2 text-white">
                <span className="inline-flex items-center gap-1.5">
                  <span>{player ? shown(player.rating) : "-"}</span>
                  {rank && <img src={rank.src} alt="" title={rank.name} className="h-5 w-auto object-contain" />}
                </span>
              </td>
              <td className="border-b border-neutral-800 px-2 py-2 text-neutral-200">{player ? shown(player.igr) : "-"}</td>
              <td className="border-b border-neutral-800 px-2 py-2 text-neutral-200">{player ? shown(player.height) : "-"}</td>
              <td className="border-b border-neutral-800 px-2 py-2 text-neutral-200">{player ? shown(player.weight) : "-"}</td>
              <td className="border-b border-neutral-800 px-2 py-2 text-neutral-200">{player ? shown(player.fg) : "-"}</td>
              <td className="border-b border-neutral-800 px-2 py-2 text-neutral-200">{player ? shown(player.threeP) : "-"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function DraftBoard({
  teams,
  pickerTeams,
  nextPickerId,
  picks: initialPicks,
  playerNames,
  sections,
}: {
  teams: { id: number; abbreviation: string; logo?: string }[];
  pickerTeams: PickerTeam[];
  nextPickerId: number | null;
  picks: DraftPick[];
  playerNames: { id: number; name: string }[];
  sections: ProspectSection[];
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<number | null>(null);
  const beforeSpin = useRef<number | null>(null);
  const [scroll, setScroll] = useState({ left: 0, max: 0 });
  const [picks, setPicks] = useState(initialPicks);
  const [lists, setLists] = useState(sections);
  const [selectedId, setSelectedId] = useState<number | null>(nextPickerId);
  const [spinning, setSpinning] = useState(false);
  const [pending, setPending] = useState(false);
  const rows = boardRows();
  const openPick = [...picks].reverse().find(pick => !pick.playerId);
  const taken = cycleTaken(picks, pickerTeams.map(team => team.id));
  const pool = pickerTeams.filter(team => !taken.has(team.id) && team.id !== openPick?.teamId);
  const activePool = pool.length ? pool : pickerTeams.filter(team => team.id !== openPick?.teamId);
  const picker = activePool.find(team => team.id === selectedId) || activePool[0];
  const teamById = new Map(pickerTeams.map(team => [team.id, team]));
  const pickBySlot = new Map(picks.map(pick => [pick.slot, pick]));
  const names = new Map(playerNames.map(player => [player.id, player.name]));
  const onClock = openPick ? teamById.get(openPick.teamId) : undefined;
  const clockPicks = picks.filter(pick => pick.teamId === onClock?.id);
  const locked = Boolean(openPick);

  const savePicker = (teamId: number) => {
    fetch("/api/draft/picker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId }),
    }).catch(() => undefined);
  };

  const choosePicker = (step: number) => {
    if (!activePool.length || spinning || pending || locked || !picker) return;
    const current = Math.max(0, activePool.findIndex(team => team.id === picker.id));
    const team = activePool[(current + step + activePool.length) % activePool.length];
    setSelectedId(team.id);
    savePicker(team.id);
  };

  const randomize = () => {
    if (!activePool.length || spinning || pending || locked || !picker) return;
    const count = activePool.length;
    const startIndex = Math.max(0, activePool.findIndex(team => team.id === picker.id));
    const finalIndex = Math.floor(Math.random() * count);
    const loops = count === 1 ? 0 : 8;
    const totalSteps = loops * count + ((finalIndex - startIndex + count) % count);
    beforeSpin.current = picker.id;
    setSpinning(true);
    const start = performance.now();

    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / 5000);
      const eased = t <= 0.32 ? (t / 0.32) * 0.62 : 0.62 + (1 - Math.pow(1 - (t - 0.32) / 0.68, 4)) * 0.38;
      const step = Math.min(totalSteps, Math.floor(Math.min(1, eased) * (totalSteps + 1)));
      setSelectedId(activePool[(startIndex + step) % count].id);
      if (t < 1) {
        spinRef.current = requestAnimationFrame(frame);
        return;
      }
      setSelectedId(activePool[finalIndex].id);
      setSpinning(false);
      setPending(true);
      spinRef.current = null;
    };

    spinRef.current = requestAnimationFrame(frame);
  };

  const continuePick = () => {
    if (!picker || locked) return;
    const slot = nextOpenSlot(picks);
    if (!slot) return;
    const nextPicks = [...picks, { slot, teamId: picker.id }];
    setPicks(nextPicks);
    setPending(false);
    fetch("/api/draft/pick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId: picker.id }),
    }).catch(() => undefined);
  };

  const draftPlayer = (playerId: number) => {
    if (!openPick) return;
    setPicks(current => current.map(pick => pick.slot === openPick.slot ? { ...pick, playerId } : pick));
    setLists(current => current.map(section => ({
      ...section,
      players: section.players.filter(player => player.id !== playerId),
    })));
    fetch("/api/draft/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId }),
    }).catch(() => undefined);
  };

  const rejectPick = () => {
    setSelectedId(beforeSpin.current);
    setPending(false);
  };

  const resetDraft = () => {
    if (!window.confirm("Reset the entire draft? This clears every pick.")) return;
    fetch("/api/draft/reset", { method: "POST" })
      .then(() => window.location.reload())
      .catch(() => undefined);
  };

  const syncScroll = () => {
    const node = bodyRef.current;
    if (!node) return;
    setScroll({ left: node.scrollLeft, max: Math.max(0, node.scrollWidth - node.clientWidth) });
  };

  useEffect(() => {
    syncScroll();
    window.addEventListener("resize", syncScroll);
    return () => {
      window.removeEventListener("resize", syncScroll);
      if (spinRef.current) cancelAnimationFrame(spinRef.current);
    };
  }, []);

  return (
    <main
      className="py-8"
      style={{
        paddingLeft: "max(16px, calc(50% - 707.56px))",
        paddingRight: "max(24px, calc(50% - 640px))",
      }}
    >
      <h2 className="label-glow text-3xl font-bold mb-8 text-white text-center tracking-wide">DRAFT BOARD</h2>
      {(picker || onClock) && (
        <div className="mb-8 flex items-start justify-between gap-6">
          {picker && (
          <div className="inline-flex flex-col items-center rounded-xl border border-neutral-700 bg-neutral-900 px-5 py-4">
            <button
              type="button"
              onClick={randomize}
              disabled={spinning || pending || locked}
              className="mb-3 h-8 rounded-full border border-neutral-500 px-4 text-xs font-semibold tracking-wide text-white hover:bg-neutral-800 disabled:opacity-40"
            >
              {spinning ? "Randomizing" : "Randomize"}
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous team"
                disabled={spinning || pending || locked}
                onClick={() => choosePicker(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-600 text-xl leading-none text-white hover:bg-neutral-800 disabled:opacity-40"
              >
                ‹
              </button>
              <div className={`flex h-20 w-20 items-center justify-center rounded-lg border bg-neutral-950 ${spinning ? "border-white" : "border-neutral-500"}`}>
                {picker.logo ? (
                  <img src={picker.logo} alt="" className="h-16 w-16 object-contain" />
                ) : (
                  <span className="text-xs text-neutral-400">{picker.abbreviation}</span>
                )}
              </div>
              <button
                type="button"
                aria-label="Next team"
                disabled={spinning || pending || locked}
                onClick={() => choosePicker(1)}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-600 text-xl leading-none text-white hover:bg-neutral-800 disabled:opacity-40"
              >
                ›
              </button>
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-neutral-400">Picking next</p>
            <p className="text-sm font-semibold tracking-wide text-white">{picker.abbreviation}</p>
            {pending && (
              <div className="mt-3 flex items-center gap-3">
                <button type="button" onClick={continuePick} className="h-8 rounded bg-neutral-200 px-4 text-sm font-bold text-black">
                  Continue
                </button>
                <button type="button" onClick={rejectPick} className="h-8 px-2 text-sm font-semibold text-red-400 hover:text-red-300">
                  Reject
                </button>
              </div>
            )}
          </div>
          )}
          {onClock && (
          <aside className="w-80 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-4">
            <h3 className="text-center text-sm font-bold tracking-[0.14em] text-white">YOU'RE ON THE CLOCK</h3>
            <div className="mt-3 flex justify-center">
              {onClock.logo ? (
                <img src={onClock.logo} alt="" className="h-16 w-16 object-contain" />
              ) : (
                <span className="text-sm text-neutral-300">{onClock.abbreviation}</span>
              )}
            </div>
            <p className="mt-2 text-center text-sm text-white">{onClock.ownership || "N/A"}</p>
            <div className="mt-4 border-t border-neutral-700 pt-3">
              <p className="mb-1 text-[11px] uppercase tracking-wide text-neutral-400">Draft</p>
              <div className="flex flex-wrap gap-1">
                {clockPicks.map(pick => (
                  <span key={pick.slot} className="rounded border border-neutral-600 px-1.5 py-0.5 text-xs text-white">{pick.slot}</span>
                ))}
              </div>
            </div>
          </aside>
          )}
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-neutral-700">
        {scroll.max > 0 && (
          <div className="border-b border-neutral-700 bg-neutral-900 px-3 pt-2 pb-1">
            <input
              type="range"
              min={0}
              max={scroll.max}
              value={Math.min(scroll.left, scroll.max)}
              aria-label="Scroll draft board"
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
          <table className="border-collapse text-center" style={{ width: ROUND_W + PICKS * CELL }}>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td
                    style={{ width: ROUND_W, minWidth: ROUND_W, height: ROW_H, left: 0 }}
                    className="sticky z-10 border border-neutral-600 bg-neutral-900 px-2 text-sm font-bold tracking-wide text-white"
                  >
                    ROUND {index + 1}
                  </td>
                  {row.map(slot => {
                    const placedPick = pickBySlot.get(slot);
                    const placed = placedPick ? teamById.get(placedPick.teamId) : undefined;
                    const waiting = Boolean(placedPick && !placedPick.playerId);
                    return (
                      <td
                        key={slot}
                        style={{ width: CELL, height: ROW_H }}
                        className="border border-neutral-600 bg-neutral-950 text-xl text-white/50"
                      >
                        {placed ? (
                          <span className="flex h-full items-center justify-center">
                            {placed.logo ? (
                              <img src={placed.logo} alt="" className={`h-16 w-16 object-contain ${waiting ? "animate-pulse" : ""}`} />
                            ) : (
                              <span className={`text-sm font-semibold text-white ${waiting ? "animate-pulse" : ""}`}>{placed.abbreviation}</span>
                            )}
                          </span>
                        ) : slot}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 flex items-start justify-between gap-8">
        <section className="min-w-0 flex-1" style={{ zoom: 0.96 } as CSSProperties}>
          <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="label-glow text-3xl font-bold tracking-wide text-white">REMAINING PROSPECTS</h3>
            <Link href="/draft/prospects" className="text-sm text-neutral-300 underline hover:text-white">
              View all prospects
            </Link>
          </div>
          <div className="space-y-8">
            {lists.map(section => (
              <div key={section.name}>
                <div className="mb-2 flex items-center gap-2">
                  <img src={section.src} alt="" className="h-6 w-auto object-contain" />
                  <h4 className="text-sm font-bold tracking-wide text-white">{section.name}</h4>
                </div>
                <ProspectTable players={section.players} slots={section.slots} canDraft={Boolean(onClock)} onDraft={draftPlayer} />
              </div>
            ))}
          </div>
        </section>
        <section className="shrink-0">
          <h3 className="label-glow mb-6 text-center text-3xl font-bold tracking-wide text-white">DRAFT SUMMARY</h3>
          {teams.length === 0 ? (
            <p className="text-center text-neutral-400">No teams yet.</p>
          ) : (
            <div className="space-y-3">
              {teams.map(team => (
                <div key={team.id} className="flex items-stretch">
                  <div style={{ width: 52, height: SUMMARY_H }} className="flex shrink-0 flex-col items-center justify-center pr-2">
                    {team.logo && <img src={team.logo} alt="" className="h-8 max-w-full object-contain" />}
                    <span className="mt-1 text-[11px] font-semibold leading-none tracking-wide text-white">{team.abbreviation}</span>
                  </div>
                  <div className="flex">
                    {Array.from({ length: ROUNDS }, (_, index) => {
                      const drafted = picks.filter(pick => pick.teamId === team.id && pick.playerId);
                      const playerId = drafted[index]?.playerId;
                      const name = playerId ? names.get(playerId) : "";
                      return (
                        <div
                          key={index}
                          style={{ width: SUMMARY_W, height: SUMMARY_H }}
                          className={`flex items-center justify-center overflow-hidden border-y border-r border-neutral-600 bg-neutral-950 px-1 ${index === 0 ? "border-l" : ""}`}
                        >
                          {name && <span className="line-clamp-2 text-center text-[11px] leading-tight text-white">{name}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <button
        type="button"
        onClick={resetDraft}
        className="fixed bottom-5 right-5 z-40 rounded border border-red-500/70 bg-neutral-950 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-neutral-900"
      >
        Reset Draft
      </button>
    </main>
  );
}
