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

  // Round 1: seeds 9-16 (4 matchups)
  const r1Seeds = [
    { id: 1, date: "", teams: [{ name: name(9) }, { name: name(14) }] },
    { id: 2, date: "", teams: [{ name: name(12) }, { name: name(11) }] },
    { id: 3, date: "", teams: [{ name: name(10) }, { name: name(13) }] },
    { id: 4, date: "", teams: [{ name: name(8) }, { name: name(15) }] },
  ];

  // Quarterfinals: seeds 5-8 enter (4 matchups)
  const qfSeeds = [
    { id: 11, date: "", teams: [{ name: name(4) }, { name: "Winner" }] },
    { id: 12, date: "", teams: [{ name: name(5) }, { name: "Winner" }] },
    { id: 13, date: "", teams: [{ name: name(6) }, { name: "Winner" }] },
    { id: 14, date: "", teams: [{ name: name(7) }, { name: "Winner" }] },
  ];

  // Semifinals: seeds 1-4 enter (4 matchups)
  const sfSeeds = [
    { id: 21, date: "", teams: [{ name: name(0) }, { name: "Winner" }] },
    { id: 22, date: "", teams: [{ name: name(1) }, { name: "Winner" }] },
    { id: 23, date: "", teams: [{ name: name(2) }, { name: "Winner" }] },
    { id: 24, date: "", teams: [{ name: name(3) }, { name: "Winner" }] },
  ];

  // Finals: 2 matchups
  const finSeeds = [
    { id: 31, date: "", teams: [{ name: "Winner" }, { name: "Winner" }] },
    { id: 32, date: "", teams: [{ name: "Winner" }, { name: "Winner" }] },
  ];

  // Championship: 1 matchup
  const champSeeds = [
    { id: 40, date: "", teams: [{ name: "Winner" }, { name: "Winner" }] },
  ];

  const rounds: IRoundProps[] = [
    { title: "Round 1", seeds: r1Seeds },
    { title: "Quarterfinals", seeds: qfSeeds },
    { title: "Semifinals", seeds: sfSeeds },
    { title: "Finals", seeds: finSeeds },
    { title: "Championship", seeds: champSeeds },
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