import db from "@/lib/db";

export const dynamic = "force-dynamic";

function TeamSlot({ team, seed, bye }: { team: any; seed: number; bye?: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 flex items-center gap-2 min-w-[180px]">
      <span className="text-neutral-400 text-xs w-5">{seed}</span>
      {team?.logo && <img src={team.logo} alt="" className="h-5 w-5 object-contain" />}
      <span className="text-white text-sm font-medium truncate flex-1">{team?.name || "TBD"}</span>
      {bye && <span className="text-[10px] text-neutral-500 uppercase">{bye}</span>}
    </div>
  );
}

export default async function PlayoffPicturePage() {
  const data = await db.load();
  const teams = data.teams;
  const games = data.games;

  const ranked = [...teams]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((team, i) => ({ ...team, overallRank: i + 1 }));

  const standings = ranked.map(team => {
    let wins = 0, losses = 0;
    games.forEach(game => {
      if (game.home_team_id === team.id) {
        if (game.home_score > game.away_score) wins++;
        else losses++;
      } else if (game.away_team_id === team.id) {
        if (game.away_score > game.home_score) wins++;
        else losses++;
      }
    });
    return { ...team, wins, losses };
  });

  const hasGames = games.length > 0;
  const sorted = [...standings].sort((a, b) => {
    if (hasGames) return b.wins - a.wins || a.losses - b.losses || a.overallRank - b.overallRank;
    return a.overallRank - b.overallRank;
  });

  const top16 = sorted.slice(0, 16);
  const seeds = Array.from({ length: 16 }, (_, i) => top16[i] || null);

  // Bracket structure:
  // R1: 9v16, 10v15, 11v14, 12v13
  // QF: 5 vs W(12v13), 6 vs W(11v14), 7 vs W(10v15), 8 vs W(9v16)
  // SF: 1 vs W(8), 2 vs W(7), 3 vs W(6), 4 vs W(5)
  // Final: W(1) vs W(2), W(3) vs W(4) → Championship

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-2 text-white text-center">Playoff Picture</h2>
      <p className="text-neutral-400 text-center mb-8 text-sm">
        Seeds 1–4 get 2 byes · Seeds 5–8 get 1 bye · Seeds 9–16 play in Round 1
      </p>

      {top16.length < 16 && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 mb-6 text-center text-neutral-400 text-sm">
          Showing current top {top16.length} of 16 playoff spots
        </div>
      )}

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max justify-center">
          {/* Round 1 */}
          <div className="flex flex-col justify-around gap-4">
            <div className="text-center text-xs text-neutral-500 uppercase mb-2">Round 1</div>
            {[
              [8, 15],
              [9, 14],
              [10, 13],
              [11, 12],
            ].map(([a, b], i) => (
              <div key={i} className="space-y-1">
                <TeamSlot team={seeds[a]} seed={a + 1} />
                <TeamSlot team={seeds[b]} seed={b + 1} />
              </div>
            ))}
          </div>

          {/* Quarterfinals */}
          <div className="flex flex-col justify-around gap-8">
            <div className="text-center text-xs text-neutral-500 uppercase mb-2">Quarterfinals</div>
            {[
              [4, "W of 9/16"],
              [5, "W of 10/15"],
              [6, "W of 11/14"],
              [7, "W of 12/13"],
            ].map(([seed, opp], i) => (
              <div key={i} className="space-y-1">
                <TeamSlot team={seeds[seed as number]} seed={(seed as number) + 1} bye="BYE" />
                <div className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-400 text-sm text-center min-w-[180px]">
                  {opp}
                </div>
              </div>
            ))}
          </div>

          {/* Semifinals */}
          <div className="flex flex-col justify-around gap-16">
            <div className="text-center text-xs text-neutral-500 uppercase mb-2">Semifinals</div>
            {[
              [0, "W of 8"],
              [1, "W of 7"],
              [2, "W of 6"],
              [3, "W of 5"],
            ].map(([seed, opp], i) => (
              <div key={i} className="space-y-1">
                <TeamSlot team={seeds[seed as number]} seed={(seed as number) + 1} bye="2 BYES" />
                <div className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-400 text-sm text-center min-w-[180px]">
                  {opp}
                </div>
              </div>
            ))}
          </div>

          {/* Finals */}
          <div className="flex flex-col justify-center gap-8">
            <div className="text-center text-xs text-neutral-500 uppercase mb-2">Finals</div>
            <div className="space-y-4">
              <div className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-400 text-sm text-center min-w-[180px]">
                Winner SF1
              </div>
              <div className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-400 text-sm text-center min-w-[180px]">
                Winner SF2
              </div>
              <div className="text-center text-neutral-500 text-xs py-2">vs</div>
              <div className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-400 text-sm text-center min-w-[180px]">
                Winner SF3
              </div>
              <div className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-400 text-sm text-center min-w-[180px]">
                Winner SF4
              </div>
            </div>
          </div>

          {/* Champion */}
          <div className="flex flex-col justify-center">
            <div className="text-center text-xs text-neutral-500 uppercase mb-2">Champion</div>
            <div className="bg-neutral-900 border-2 border-white rounded-lg px-4 py-6 text-center min-w-[160px]">
              <div className="text-neutral-400 text-sm">TBD</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-neutral-500 text-xs">
        Bracket updates automatically based on current standings
      </div>
    </main>
  );
}