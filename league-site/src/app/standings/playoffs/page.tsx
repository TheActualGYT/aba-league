import db from "@/lib/db";

export const dynamic = "force-dynamic";

function Slot({ team, seed, placeholder }: { team?: any; seed?: number; placeholder?: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-600 rounded px-3 py-2 flex items-center gap-2 w-48">
      {seed && <span className="text-neutral-500 text-xs w-4">{seed}</span>}
      {team?.logo && <img src={team.logo} alt="" className="h-5 w-5 object-contain" />}
      <span className="text-white text-sm font-medium truncate">{team?.name || placeholder || "TBD"}</span>
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

      <div className="flex justify-center">
        <div className="relative">
          {/* Headers */}
          <div className="flex">
            <div className="w-48 text-xs text-neutral-500 text-center">Round 1</div>
            <div className="w-16" />
            <div className="w-48 text-xs text-neutral-500 text-center">Quarterfinals</div>
          </div>

          {/* Bracket area */}
          <div className="flex mt-2">
            {/* Round 1 column */}
            <div className="flex flex-col gap-6">
              {/* 10 vs 15 */}
              <div className="space-y-0.5">
                <Slot team={s[9]} seed={10} />
                <Slot team={s[14]} seed={15} />
              </div>

              {/* 13 vs 12 */}
              <div className="space-y-0.5">
                <Slot team={s[12]} seed={13} />
                <Slot team={s[11]} seed={12} />
              </div>

              <div className="h-12" />

              {/* 11 vs 14 */}
              <div className="space-y-0.5">
                <Slot team={s[10]} seed={11} />
                <Slot team={s[13]} seed={14} />
              </div>

              {/* 9 vs 16 */}
              <div className="space-y-0.5">
                <Slot team={s[8]} seed={9} />
                <Slot team={s[15]} seed={16} />
              </div>
            </div>

            {/* Connector lines */}
            <div className="relative w-16">
              {/* Horizontal line from top of 10vs15 going right */}
              <div className="absolute top-4 left-0 w-8 h-px bg-neutral-500" />
              {/* Vertical line going up */}
              <div className="absolute top-0 left-8 w-px h-4 bg-neutral-500" />
              {/* Horizontal line to 7 seed */}
              <div className="absolute top-0 left-8 w-8 h-px bg-neutral-500" />
            </div>

            {/* Quarterfinals - 7 seed positioned at top */}
            <div className="flex flex-col">
              <div className="space-y-0.5">
                <Slot team={s[6]} seed={7} />
                <Slot placeholder="Winner" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}