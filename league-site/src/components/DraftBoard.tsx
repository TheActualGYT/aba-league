"use client";

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

function boardRows() {
  return Array.from({ length: ROUNDS }, (_, index) => {
    const round = index + 1;
    return Array.from({ length: PICKS }, (_, pick) => `${round}.${String(pick + 1).padStart(2, "0")}`);
  });
}

function shown(value: string) {
  return value || "\u2014";
}

export default function DraftBoard({
  teams,
  prospects,
}: {
  teams: { id: number; abbreviation: string; logo?: string }[];
  prospects: DraftProspect[];
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ left: 0, max: 0 });
  const rows = boardRows();

  const syncScroll = () => {
    const node = bodyRef.current;
    if (!node) return;
    setScroll({ left: node.scrollLeft, max: Math.max(0, node.scrollWidth - node.clientWidth) });
  };

  useEffect(() => {
    syncScroll();
    window.addEventListener("resize", syncScroll);
    return () => window.removeEventListener("resize", syncScroll);
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
          <h3 className="label-glow mb-6 text-3xl font-bold tracking-wide text-white">TOP REMAINING PROSPECTS</h3>
          {prospects.length === 0 ? (
            <p className="text-neutral-400">No prospects yet.</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-neutral-400">
                  <th className="border-b border-neutral-700 px-2 py-2 font-semibold">Position</th>
                  <th className="border-b border-neutral-700 px-2 py-2 font-semibold">Player Name</th>
                  <th className="border-b border-neutral-700 px-2 py-2 font-semibold">ABA Rating</th>
                  <th className="border-b border-neutral-700 px-2 py-2 font-semibold">HT</th>
                  <th className="border-b border-neutral-700 px-2 py-2 font-semibold">WT</th>
                  <th className="border-b border-neutral-700 px-2 py-2 font-semibold">FG</th>
                  <th className="border-b border-neutral-700 px-2 py-2 font-semibold">3P</th>
                </tr>
              </thead>
              <tbody>
                {prospects.map(player => {
                  const rank = abaRank(player.rating);
                  return (
                    <tr key={player.id}>
                      <td className="border-b border-neutral-800 px-2 py-2 text-neutral-200">{shown(player.position)}</td>
                      <td className="border-b border-neutral-800 px-2 py-2 text-white">{player.name}</td>
                      <td className="border-b border-neutral-800 px-2 py-2 text-white">
                        <span className="inline-flex items-center gap-1.5">
                          <span>{shown(player.rating)}</span>
                          {rank && <img src={rank.src} alt="" title={rank.name} className="h-5 w-auto object-contain" />}
                        </span>
                      </td>
                      <td className="border-b border-neutral-800 px-2 py-2 text-neutral-200">{shown(player.height)}</td>
                      <td className="border-b border-neutral-800 px-2 py-2 text-neutral-200">{shown(player.weight)}</td>
                      <td className="border-b border-neutral-800 px-2 py-2 text-neutral-200">{shown(player.fg)}</td>
                      <td className="border-b border-neutral-800 px-2 py-2 text-neutral-200">{shown(player.threeP)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
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
