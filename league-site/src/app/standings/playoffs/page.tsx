import db from "@/lib/db";

export const dynamic = "force-dynamic";

function Slot({ team, seed, placeholder }: { team?: any; seed?: number; placeholder?: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-600 rounded px-2 py-1.5 flex items-center gap-2 w-40 h-8">
      {seed && <span className="text-neutral-500 text-xs w-4 shrink-0">{seed}</span>}
      {team?.logo && <img src={team.logo} alt="" className="h-4 w-4 object-contain shrink-0" />}
      <span className="text-white text-xs font-medium truncate">
        {team?.name || placeholder || "TBD"}
      </span>
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

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-2 text-white text-center">Playoff Picture</h2>
      <p className="text-neutral-400 text-center mb-8 text-sm">
        Seeds 1–4 get 2 byes · Seeds 5–8 get 1 bye · Seeds 9–16 play in Round 1
      </p>

      {sorted.length < 16 && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 mb-6 text-center text-neutral-400 text-sm">
          Showing current top {sorted.length} of 16 playoff spots
        </div>
      )}

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-1 min-w-max justify-center items-start">
          {/* ROUND 1 - seeds 9-16 only */}
          <div className="flex flex-col">
            <div className="text-xs text-neutral-500 text-center h-6">Round 1</div>
            <div className="flex flex-col gap-6 mt-2">
              <div className="space-y-0.5"><Slot team={s[8]} seed={9} /><Slot team={s[15]} seed={16} /></div>
              <div className="h-16" />
              <div className="space-y-0.5"><Slot team={s[9]} seed={10} /><Slot team={s[14]} seed={15} /></div>
              <div className="h-16" />
              <div className="space-y-0.5"><Slot team={s[10]} seed={11} /><Slot team={s[13]} seed={14} /></div>
              <div className="h-16" />
              <div className="space-y-0.5"><Slot team={s[11]} seed={12} /><Slot team={s[12]} seed={13} /></div>
            </div>
          </div>

          {/* Connector R1 → QF */}
          <div className="flex flex-col justify-around pt-8" style={{ height: "520px" }}>
            {[0,1,2,3].map(i => (
              <div key={i} className="w-6 border-t border-r border-neutral-600 h-16" />
            ))}
          </div>

          {/* QUARTERFINALS - seeds 5-8 enter */}
          <div className="flex flex-col">
            <div className="text-xs text-neutral-500 text-center h-6">Quarterfinals</div>
            <div className="flex flex-col gap-4 mt-2">
              <Slot team={s[4]} seed={5} />
              <Slot placeholder="Winner" />
              <div className="h-8" />
              <Slot team={s[5]} seed={6} />
              <Slot placeholder="Winner" />
              <div className="h-8" />
              <Slot team={s[6]} seed={7} />
              <Slot placeholder="Winner" />
              <div className="h-8" />
              <Slot team={s[7]} seed={8} />
              <Slot placeholder="Winner" />
            </div>
          </div>

          {/* Connector QF → SF */}
          <div className="flex flex-col justify-around pt-8" style={{ height: "520px" }}>
            {[0,1,2,3].map(i => (
              <div key={i} className="w-6 border-t border-r border-neutral-600 h-20" />
            ))}
          </div>

          {/* SEMIFINALS - seeds 1-4 enter */}
          <div className="flex flex-col">
            <div className="text-xs text-neutral-500 text-center h-6">Semifinals</div>
            <div className="flex flex-col gap-6 mt-2">
              <Slot team={s[0]} seed={1} />
              <Slot placeholder="Winner" />
              <div className="h-12" />
              <Slot team={s[1]} seed={2} />
              <Slot placeholder="Winner" />
              <div className="h-12" />
              <Slot team={s[2]} seed={3} />
              <Slot placeholder="Winner" />
              <div className="h-12" />
              <Slot team={s[3]} seed={4} />
              <Slot placeholder="Winner" />
            </div>
          </div>

          {/* Connector SF → Finals */}
          <div className="flex flex-col justify-around pt-8" style={{ height: "520px" }}>
            {[0,1].map(i => (
              <div key={i} className="w-6 border-t border-r border-neutral-600 h-28" />
            ))}
          </div>

          {/* FINALS */}
          <div className="flex flex-col">
            <div className="text-xs text-neutral-500 text-center h-6">Finals</div>
            <div className="flex flex-col justify-around mt-2" style={{ height: "400px" }}>
              <Slot placeholder="Winner" />
              <Slot placeholder="Winner" />
            </div>
          </div>

          {/* Connector to Champion */}
          <div className="flex flex-col justify-center pt-8" style={{ height: "520px" }}>
            <div className="w-6 border-t border-r border-neutral-600 h-32" />
          </div>

          {/* CHAMPION */}
          <div className="flex flex-col justify-center pt-6">
            <div className="bg-yellow-400 text-black font-bold text-xs px-3 py-2 rounded text-center">
              CHAMPIONS
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-neutral-500 text-xs">
        Bracket updates automatically based on current standings
      </div>
    </main>
  );
}