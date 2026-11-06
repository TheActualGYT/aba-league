"use client";

import { Bracket, IRoundProps, Seed, SeedItem, SeedTeam } from "react-brackets";

function CustomSeed({ seed, breakpoint }: any) {
  return (
    <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
      <SeedItem style={{ width: 200 }}>
        <div>
          <SeedTeam style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>
            {seed.teams[0]?.name || "TBD"}
          </SeedTeam>
          <div style={{ height: 1, backgroundColor: "#444" }} />
          <SeedTeam style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>
            {seed.teams[1]?.name || "TBD"}
          </SeedTeam>
        </div>
      </SeedItem>
    </Seed>
  );
}

export default function BracketView({ teams }: { teams: any[] }) {
  const sorted = [...teams].sort((a, b) => a.name.localeCompare(b.name));
  const seeds = Array.from({ length: 16 }, (_, i) => sorted[i] || null);

  const name = (idx: number) => seeds[idx] ? `${idx + 1}. ${seeds[idx].name}` : "TBD";

  // Round 1: only seeds 9-16 (indices 8-15)
  // 10vs15, 13vs12, 11vs14, 9vs16
  const r1Seeds = [
    { id: 1, date: "", teams: [{ name: name(9) }, { name: name(14) }] },   // 10 vs 15
    { id: 2, date: "", teams: [{ name: name(12) }, { name: name(11) }] },  // 13 vs 12
    { id: 3, date: "", teams: [{ name: name(10) }, { name: name(13) }] },  // 11 vs 14
    { id: 4, date: "", teams: [{ name: name(8) }, { name: name(15) }] },   // 9 vs 16
  ];

  // Quarterfinals: seeds 5-8 enter (indices 4-7)
  // 5 vs W(13/12), 6 vs W(11/14), 7 vs W(10/15), 8 vs W(9/16)
  const qfSeeds = [
    { id: 11, date: "", teams: [{ name: name(4) }, { name: "Winner" }] },  // 5 vs W(13/12)
    { id: 12, date: "", teams: [{ name: name(5) }, { name: "Winner" }] },  // 6 vs W(11/14)
    { id: 13, date: "", teams: [{ name: name(6) }, { name: "Winner" }] },  // 7 vs W(10/15)
    { id: 14, date: "", teams: [{ name: name(7) }, { name: "Winner" }] },  // 8 vs W(9/16)
  ];

  // Semifinals: seeds 1-4 enter (indices 0-3)
  // 1 vs W(8), 2 vs W(7), 3 vs W(6), 4 vs W(5)
  const sfSeeds = [
    { id: 21, date: "", teams: [{ name: name(0) }, { name: "Winner" }] },  // 1 vs W(8)
    { id: 22, date: "", teams: [{ name: name(1) }, { name: "Winner" }] },  // 2 vs W(7)
    { id: 23, date: "", teams: [{ name: name(2) }, { name: "Winner" }] },  // 3 vs W(6)
    { id: 24, date: "", teams: [{ name: name(3) }, { name: "Winner" }] },  // 4 vs W(5)
  ];

  // Finals
  const finSeeds = [
    { id: 30, date: "", teams: [{ name: "Winner" }, { name: "Winner" }] },
  ];

  const rounds: IRoundProps[] = [
    { title: "Round 1", seeds: r1Seeds },
    { title: "Quarterfinals", seeds: qfSeeds },
    { title: "Semifinals", seeds: sfSeeds },
    { title: "Finals", seeds: finSeeds },
  ];

  return (
    <Bracket
      rounds={rounds}
      roundTitleComponent={(title: any) => (
        <div className="text-xs text-neutral-500 text-center mb-2">{title}</div>
      )}
      renderSeedComponent={CustomSeed}
    />
  );
}