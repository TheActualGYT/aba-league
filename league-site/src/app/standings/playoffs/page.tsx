"use client";

import { useEffect, useState } from "react";
import { Bracket, IRoundProps } from "react-brackets";

export default function PlayoffPicturePage() {
  const [rounds, setRounds] = useState<IRoundProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teams")
      .then(r => r.json())
      .then(data => {
        const teams = data.teams || [];
        const sorted = [...teams].sort((a: any, b: any) => a.name.localeCompare(b.name));
        const seeds = Array.from({ length: 16 }, (_, i) => sorted[i] || null);

        const matchups = [
          [0, 15], [7, 8], [4, 11], [3, 12],
          [5, 10], [2, 13], [6, 9], [1, 14],
        ];

        const r1Seeds = matchups.map(([a, b], i) => ({
          id: i + 1,
          date: "",
          teams: [
            { name: seeds[a]?.name || "TBD" },
            { name: seeds[b]?.name || "TBD" },
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

        setRounds([
          { title: "Round of 16", seeds: r1Seeds },
          { title: "Quarterfinals", seeds: qfSeeds },
          { title: "Semifinals", seeds: sfSeeds },
          { title: "Finals", seeds: finSeeds },
        ]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-2 text-white text-center">Playoff Picture</h2>
        <p className="text-neutral-400 text-center">Loading...</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-2 text-white text-center">Playoff Picture</h2>
      <p className="text-neutral-400 text-center mb-8 text-sm">16 Team Bracket</p>

      <div className="overflow-x-auto pb-4">
        <Bracket
          rounds={rounds}
          roundTitleComponent={(title: any) => (
            <div className="text-xs text-neutral-500 text-center mb-2">{title}</div>
          )}
        />
      </div>
    </main>
  );
}