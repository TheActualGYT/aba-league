import db from "@/lib/db";

export const dynamic = "force-dynamic";

function Slot({ team, seed, placeholder }: { team?: any; seed?: number; placeholder?: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-600 rounded px-2 py-1.5 flex items-center gap-2 w-44 h-8">
      {seed && <span className="text-neutral-500 text-xs w-4">{seed}</span>}
      {team?.logo && <img src={team.logo} alt="" className="h-4 w-4 object-contain" />}
      <span className="text-white text-xs font-medium truncate">{team?.name || placeholder || "TBD"}</span>
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

  const s = Array.from({ length: 16 }, (_, i) => sorted[i] || null);

  const r1 = [
    [0, 15],
    [7, 8],
    [4, 11],
    [3, 12],
    [5, 10],
    [2, 13],
    [6, 9],
    [1, 14],
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-2 text-white text-center">Playoff Picture</h2>
      <p className="text-neutral-400 text-center mb-8 text-sm">16 Team Bracket</p>

      {sorted.length < 16 && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 mb-6 text-center text-neutral-400 text-sm">
          Showing current top {sorted.length} of 16 playoff spots
        </div>
      )}

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-2 min-w-max justify-center">
          {/* Round of 16 */}
          <div>
            <div className="text-xs text-neutral-500 text-center mb-3">Round of 16</div>
            <div className="flex flex-col" style={{ gap: "12px" }}>
              {r1.map(([a, b], i) => (
                <div key={i} className="space-y-0.5 relative">
                  <Slot team={s[a]} seed={a + 1} />
                  <Slot team={s[b]} seed={b + 1} />
                  <div className="absolute right-0 top-1/2 w-3 h-px bg-neutral-500" style={{ transform: "translateX(100%) translateY(-50%)" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Connector R1 to QF */}
          <div className="flex flex-col justify-around" style={{ width: "12px", marginTop: "50px" }}>
            {[0,1,2,3].map(i => (
              <div key={i} className="flex flex-col items-center" style={{ height: "156px" }}>
                <div className="w-px bg-neutral-500 flex-1" />
                <div className="w-3 h-px bg-neutral-500" />
                <div className="w-px bg-neutral-500 flex-1" />
              </div>
            ))}
          </div>

          {/* Quarterfinals */}
          <div>
            <div className="text-xs text-neutral-500 text-center mb-3">Quarterfinals</div>
            <div className="flex flex-col" style={{ gap: "90px", marginTop: "50px" }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="space-y-0.5 relative">
                  <Slot placeholder="Winner" />
                  <Slot placeholder="Winner" />
                  <div className="absolute right-0 top-1/2 w-3 h-px bg-neutral-500" style={{ transform: "translateX(100%) translateY(-50%)" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Connector QF to SF */}
          <div className="flex flex-col" style={{ width: "12px", marginTop: "130px", gap: "250px" }}>
            {[0,1].map(i => (
              <div key={i} className="flex flex-col items-center" style={{ height: "156px" }}>
                <div className="w-px bg-neutral-500 flex-1" />
                <div className="w-3 h-px bg-neutral-500" />
                <div className="w-px bg-neutral-500 flex-1" />
              </div>
            ))}
          </div>

          {/* Semifinals */}
          <div>
            <div className="text-xs text-neutral-500 text-center mb-3">Semifinals</div>
            <div className="flex flex-col" style={{ gap: "250px", marginTop: "130px" }}>
              {[0, 1].map(i => (
                <div key={i} className="space-y-0.5 relative">
                  <Slot placeholder="Winner" />
                  <Slot placeholder="Winner" />
                  <div className="absolute right-0 top-1/2 w-3 h-px bg-neutral-500" style={{ transform: "translateX(100%) translateY(-50%)" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Connector SF to Finals */}
          <div className="flex flex-col" style={{ width: "12px", marginTop: "290px" }}>
            <div className="flex flex-col items-center" style={{ height: "156px" }}>
              <div className="w-px bg-neutral-500 flex-1" />
              <div className="w-3 h-px bg-neutral-500" />
              <div className="w-px bg-neutral-500 flex-1" />
            </div>
          </div>

          {/* Finals */}
          <div>
            <div className="text-xs text-neutral-500 text-center mb-3">Finals</div>
            <div className="relative" style={{ marginTop: "290px" }}>
              <div className="space-y-0.5">
                <Slot placeholder="Winner" />
                <Slot placeholder="Winner" />
              </div>
              <div className="absolute right-0 top-1/2 w-3 h-px bg-neutral-500" style={{ transform: "translateX(100%) translateY(-50%)" }} />
            </div>
          </div>

          {/* Connector to Champion */}
          <div className="flex items-center" style={{ width: "12px", marginTop: "310px" }}>
            <div className="w-full h-px bg-neutral-500" />
          </div>

          {/* Champion */}
          <div>
            <div className="text-xs text-neutral-500 text-center mb-3">Champion</div>
            <div style={{ marginTop: "310px" }}>
              <div className="bg-yellow-400 text-black font-bold text-xs px-3 py-2 rounded text-center">
                CHAMPIONS
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}