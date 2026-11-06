import db from "@/lib/db";

export const dynamic = "force-dynamic";

function Slot({ team, seed, placeholder }: { team?: any; seed?: number; placeholder?: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-600 rounded px-2 py-1 flex items-center gap-1.5 w-36 h-7">
      {seed && <span className="text-neutral-500 text-[10px] w-3 shrink-0">{seed}</span>}
      {team?.logo && <img src={team.logo} alt="" className="h-3.5 w-3.5 object-contain shrink-0" />}
      <span className="text-white text-[11px] font-medium truncate">
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

  const row = (h: number) => ({ height: h });

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-2 text-white text-center">Playoff Picture</h2>
      <p className="text-neutral-400 text-center mb-6 text-sm">
        Seeds 1–4 get 2 byes · Seeds 5–8 get 1 bye · Seeds 9–16 play in Round 1
      </p>

      {sorted.length < 16 && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 mb-4 text-center text-neutral-400 text-sm">
          Showing current top {sorted.length} of 16 playoff spots
        </div>
      )}

      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-0 min-w-max">
          {/* Headers */}
          <div className="flex gap-0 mb-2">
            <div className="w-36 text-center text-[10px] text-neutral-500">Round 1</div>
            <div className="w-5" />
            <div className="w-36 text-center text-[10px] text-neutral-500">Quarterfinals</div>
            <div className="w-5" />
            <div className="w-36 text-center text-[10px] text-neutral-500">Semifinals</div>
            <div className="w-5" />
            <div className="w-36 text-center text-[10px] text-neutral-500">Finals</div>
            <div className="w-5" />
            <div className="w-24 text-center text-[10px] text-neutral-500" />
          </div>
        </div>

        <div className="flex gap-0 items-start">
          {/* R1 Column */}
          <div className="flex flex-col" style={{ gap: "4px" }}>
            <div className="space-y-0.5"><Slot team={s[8]} seed={9} /><Slot team={s[15]} seed={16} /></div>
            <div style={row(48)} />
            <div className="space-y-0.5"><Slot team={s[9]} seed={10} /><Slot team={s[14]} seed={15} /></div>
            <div style={row(48)} />
            <div className="space-y-0.5"><Slot team={s[10]} seed={11} /><Slot team={s[13]} seed={14} /></div>
            <div style={row(48)} />
            <div className="space-y-0.5"><Slot team={s[11]} seed={12} /><Slot team={s[12]} seed={13} /></div>
          </div>

          {/* Lines */}
          <div className="flex flex-col justify-around w-5" style={{ height: "380px" }}>
            <div className="border-t border-r border-neutral-600 h-8" />
            <div className="border-t border-r border-neutral-600 h-8" />
            <div className="border-t border-r border-neutral-600 h-8" />
            <div className="border-t border-r border-neutral-600 h-8" />
          </div>

          {/* QF Column - seeds 5-8 */}
          <div className="flex flex-col" style={{ gap: "4px" }}>
            <Slot team={s[4]} seed={5} />
            <Slot placeholder="Winner" />
            <div style={row(32)} />
            <Slot team={s[5]} seed={6} />
            <Slot placeholder="Winner" />
            <div style={row(32)} />
            <Slot team={s[6]} seed={7} />
            <Slot placeholder="Winner" />
            <div style={row(32)} />
            <Slot team={s[7]} seed={8} />
            <Slot placeholder="Winner" />
          </div>

          {/* Lines */}
          <div className="flex flex-col justify-around w-5" style={{ height: "380px" }}>
            <div className="border-t border-r border-neutral-600 h-12" />
            <div className="border-t border-r border-neutral-600 h-12" />
            <div className="border-t border-r border-neutral-600 h-12" />
            <div className="border-t border-r border-neutral-600 h-12" />
          </div>

          {/* SF Column - seeds 1-4 */}
          <div className="flex flex-col" style={{ gap: "4px" }}>
            <Slot team={s[0]} seed={1} />
            <Slot placeholder="Winner" />
            <div style={row(48)} />
            <Slot team={s[1]} seed={2} />
            <Slot placeholder="Winner" />
            <div style={row(48)} />
            <Slot team={s[2]} seed={3} />
            <Slot placeholder="Winner" />
            <div style={row(48)} />
            <Slot team={s[3]} seed={4} />
            <Slot placeholder="Winner" />
          </div>

          {/* Lines */}
          <div className="flex flex-col justify-around w-5" style={{ height: "380px" }}>
            <div className="border-t border-r border-neutral-600 h-16" />
            <div className="border-t border-r border-neutral-600 h-16" />
          </div>

          {/* Finals */}
          <div className="flex flex-col justify-around" style={{ height: "380px" }}>
            <Slot placeholder="Winner" />
            <Slot placeholder="Winner" />
          </div>

          {/* Line to champ */}
          <div className="flex flex-col justify-center w-5" style={{ height: "380px" }}>
            <div className="border-t border-r border-neutral-600 h-20" />
          </div>

          {/* Champion */}
          <div className="flex items-center" style={{ height: "380px" }}>
            <div className="bg-yellow-400 text-black font-bold text-[10px] px-2 py-1.5 rounded">
              CHAMPIONS
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-neutral-500 text-xs">
        Bracket updates automatically based on current standings
      </div>
    </main>
  );
}