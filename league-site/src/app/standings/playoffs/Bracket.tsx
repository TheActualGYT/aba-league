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

  const matchups = [
    [0, 15], [7, 8], [4, 11], [3, 12],
    [5, 10], [2, 13], [6, 9], [1, 14],
  ];

  const r1Seeds = matchups.map(([a, b], i) => ({
    id: i + 1,
    date: "",
    teams: [
      { name: seeds[a] ? `${a + 1}. ${seeds[a].name}` : "TBD" },
      { name: seeds[b] ? `${b + 1}. ${seeds[b].name}` : "TBD" },
    ],
  }));

  const qfSeeds = [1, 2, 3, 4].map(i => ({
    id: 10 + i,
    date: "",
    teams: [{ name: "Winner" }, { name: "Winner" }],
  }));

  const sfSeeds = [1, 2].map(i => ({
    id: 20 + i,
    date: "",
    teams: [{ name: "Winner" }, { name: "Winner" }],
  }));

  const finSeeds = [{
    id: 30,
    date: "",
    teams: [{ name: "Winner" }, { name: "Winner" }],
  }];

  const rounds: IRoundProps[] = [
    { title: "Round of 16", seeds: r1Seeds },
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