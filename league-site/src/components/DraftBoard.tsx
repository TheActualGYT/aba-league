"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

function boardRows() {
  return Array.from({ length: ROUNDS }, (_, index) => {
    const round = index + 1;
    return Array.from({ length: PICKS }, (_, pick) => `${round}.${String(pick + 1).padStart(2, "0")}`);
  });
}

function shown(value: string) {
  return value || "-";
}

function ProspectTable({ players, slots }: { players: DraftProspect[]; slots: number }) {
  const rows: Array<DraftProspect | null> = players.slice(0, slots);
  while (rows.length < slots) rows.push(null);

  return (
    <table className="w-full table-fixed border-collapse text-sm">
      <colgroup>
        <col style={{ width: "4.5rem" }} />
        <col style={{ width: "42%" }} />
        <col />
        <col />
        <col />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr className="text-left text-xs uppercase tracking-wide text-neutral-400">
          <th className="border-b border-neutral-700 px-1 py-2 text-center font-semibold">Position</th>
          <th className="border-b border-neutral-700 px-3 py-2 font-semibold">Player Name</th>
          <th className="border-b border-neutral-700 px-2 py-2 font-semibold">ABA Rating</th>
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
            <tr key={player?.id ?? `empty-${index}`}>
              <td className="border-b border-neutral-800 px-1 py-2 text-center text-neutral-200">{player ? shown(player.position) : "-"}</td>
              <td className="border-b border-neutral-800 px-3 py-2 text-white">{player ? player.name : "-"}</td>
              <td className="border-b border-neutral-800 px-2 py-2 text-white">
                <span className="inline-flex items-center gap-1.5">
                  <span>{player ? shown(player.rating) : "-"}</span>
                  {rank && <img src={rank.src} alt="" title={rank.name} className="h-5 w-auto object-contain" />}
                </span>
              </td>
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
  sections,
}: {
  teams: { id: number; abbreviation: string; logo?: string }[];
  pickerTeams: { id: number; abbreviation: string; logo?: string }[];
  nextPickerId: number | null;
  sections: ProspectSection[];
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<number | null>(null);
  const beforeSpin = useRef(0);
  const [scroll, setScroll] = useState({ left: 0, max: 0 });
  const startIndex = Math.max(0, pickerTeams.findIndex(team => team.id === nextPickerId));
  const [pickerIndex, setPickerIndex] = useState(startIndex);
  const [spinning, setSpinning] = useState(false);
  const [pending, setPending] = useState(false);
  const rows = boardRows();
  const picker = pickerTeams[pickerIndex];

  const savePicker = (index: number) => {
    const team = pickerTeams[index];
    if (!team) return;
    fetch("/api/draft/picker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId: team.id }),
    }).catch(() => undefined);
  };

  const choosePicker = (next: number) => {
    if (!pickerTeams.length || spinning || pending) return;
    const index = (next + pickerTeams.length) % pickerTeams.length;
    setPickerIndex(index);
    savePicker(index);
  };

  const randomize = () => {
    if (!pickerTeams.length || spinning || pending) return;
    const count = pickerTeams.length;
    const finalIndex = Math.floor(Math.random() * count);
    const loops = count === 1 ? 0 : 8;
    const totalSteps = loops * count + ((finalIndex - pickerIndex + count) % count);
    beforeSpin.current = pickerIndex;
    setSpinning(true);
    const start = performance.now();

    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / 5000);
      const eased = 1 - Math.pow(1 - t, 3);
      const step = Math.min(totalSteps, Math.floor(eased * (totalSteps + 1)));
      setPickerIndex((beforeSpin.current + step) % count);
      if (t < 1) {
        spinRef.current = requestAnimationFrame(frame);
        return;
      }
      setPickerIndex(finalIndex);
      setSpinning(false);
      setPending(true);
      spinRef.current = null;
    };

    spinRef.current = requestAnimationFrame(frame);
  };

  const continuePick = () => {
    savePicker(pickerIndex);
    setPending(false);
  };

  const rejectPick = () => {
    setPickerIndex(beforeSpin.current);
    setPending(false);
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
      {picker && (
        <div className="mb-8 flex flex-col items-start">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Previous team"
              disabled={spinning || pending}
              onClick={() => choosePicker(pickerIndex - 1)}
              className="flex h-10 w-10 items-center justify-center rounded border border-neutral-600 text-2xl leading-none text-white hover:bg-neutral-800 disabled:opacity-40"
            >
              ‹
            </button>
            <div className={`flex h-20 w-20 items-center justify-center rounded border bg-neutral-950 ${spinning ? "border-white" : "border-neutral-500"}`}>
              {picker.logo ? (
                <img src={picker.logo} alt="" className="h-16 w-16 object-contain" />
              ) : (
                <span className="text-xs text-neutral-400">{picker.abbreviation}</span>
              )}
            </div>
            <button
              type="button"
              aria-label="Next team"
              disabled={spinning || pending}
              onClick={() => choosePicker(pickerIndex + 1)}
              className="flex h-10 w-10 items-center justify-center rounded border border-neutral-600 text-2xl leading-none text-white hover:bg-neutral-800 disabled:opacity-40"
            >
              ›
            </button>
            <button
              type="button"
              onClick={randomize}
              disabled={spinning || pending}
              className="h-10 rounded border border-neutral-500 px-4 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-40"
            >
              {spinning ? "Randomizing" : "Randomize"}
            </button>
          </div>
          <p className="mt-2 text-xs tracking-wide text-neutral-300">PICKING NEXT · {picker.abbreviation}</p>
          {pending && (
            <div className="mt-3 flex items-center gap-3">
              <button type="button" onClick={continuePick} className="h-9 rounded bg-neutral-200 px-4 text-sm font-bold text-black">
                Continue
              </button>
              <button type="button" onClick={rejectPick} className="h-9 rounded px-3 text-sm font-semibold text-red-400 hover:text-red-300">
                Reject
              </button>
            </div>
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
                  {row.map(slot => (
                    <td
                      key={slot}
                      style={{ width: CELL, height: ROW_H }}
                      className="border border-neutral-600 bg-neutral-950 text-xl text-white/50"
                    >
                      {slot}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 flex items-start justify-between gap-8">
        <section className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="label-glow text-3xl font-bold tracking-wide text-white">REMAINING PROSPECTS</h3>
            <Link href="/draft/prospects" className="text-sm text-neutral-300 underline hover:text-white">
              View all prospects
            </Link>
          </div>
          <div className="space-y-8">
            {sections.map(section => (
              <div key={section.name}>
                <div className="mb-2 flex items-center gap-2">
                  <img src={section.src} alt="" className="h-6 w-auto object-contain" />
                  <h4 className="text-sm font-bold tracking-wide text-white">{section.name}</h4>
                </div>
                <ProspectTable players={section.players} slots={section.slots} />
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
                    {Array.from({ length: ROUNDS }, (_, pick) => (
                      <div
                        key={pick}
                        style={{ width: SUMMARY_W, height: SUMMARY_H }}
                        className={`border-y border-r border-neutral-600 bg-neutral-950 ${pick === 0 ? "border-l" : ""}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
