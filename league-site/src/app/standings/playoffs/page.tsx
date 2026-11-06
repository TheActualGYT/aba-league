import db from "@/lib/db";

export const dynamic = "force-dynamic";

function Slot({ team, seed, placeholder }: { team?: any; seed?: number; placeholder?: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-600 rounded px-2 py-1.5 flex items-center gap-2 w-44 h-9">
      {seed && <span className="text-neutral-500 text-xs w-4">{seed}</span>}
      {team?.logo && <img src={team.logo} alt="" className="h-4 w-4 object-contain" />}
      <span className="text-white text-xs font-medium truncate flex-1">
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
        <div className="flex items-center gap-0 min-w-max justify-center text-white">
          {/* Column 1: Round 1 matchups + bye teams */}
          <div className="flex flex-col justify-around h-[720px]">
            <Slot team={s[1]} seed={2} />
            <Slot team={s[6]} seed={7} />
            <div className="space-y-0.5">
              <Slot team={s[9]} seed={10} />
              <Slot team={s[14]} seed={15} />
            </div>
            <div className="space-y-0.5">
              <Slot team={s[12]} seed={13} />
              <Slot team={s[11]} seed={12} />
            </div>
            <Slot team={s[5]} seed={6} />
            <Slot team={s[2]} seed={3} />
            <Slot team={s[3]} seed={4} />
            <Slot team={s[4]} seed={5} />
            <div className="space-y-0.5">
              <Slot team={s[10]} seed={11} />
              <Slot team={s[13]} seed={14} />
            </div>
            <div className="space-y-0.5">
              <Slot team={s[8]} seed={9} />
              <Slot team={s[15]} seed={16} />
            </div>
            <Slot team={s[7]} seed={8} />
            <Slot team={s[0]} seed={1} />
          </div>

          {/* Connector lines */}
          <svg width="40" height="720" className="text-neutral-600">
            <line x1="0" y1="30" x2="40" y2="30" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="90" x2="40" y2="90" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="30" x2="40" y2="90" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="60" x2="40" y2="60" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="150" x2="40" y2="150" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="210" x2="40" y2="210" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="150" x2="40" y2="210" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="270" x2="40" y2="270" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="330" x2="40" y2="330" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="270" x2="40" y2="330" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="390" x2="40" y2="390" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="450" x2="40" y2="450" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="390" x2="40" y2="450" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="510" x2="40" y2="510" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="570" x2="40" y2="570" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="510" x2="40" y2="570" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="630" x2="40" y2="630" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="690" x2="40" y2="690" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="630" x2="40" y2="690" stroke="currentColor" strokeWidth="1" />
          </svg>

          {/* Column 2: Quarterfinals */}
          <div className="flex flex-col justify-around h-[720px]">
            <Slot placeholder="Winner" />
            <Slot placeholder="Winner" />
            <Slot placeholder="Winner" />
            <Slot placeholder="Winner" />
            <Slot placeholder="Winner" />
            <Slot placeholder="Winner" />
          </div>

          {/* Connector */}
          <svg width="40" height="720" className="text-neutral-600">
            <line x1="0" y1="60" x2="40" y2="60" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="180" x2="40" y2="180" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="60" x2="40" y2="180" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="300" x2="40" y2="300" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="420" x2="40" y2="420" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="300" x2="40" y2="420" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="540" x2="40" y2="540" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="660" x2="40" y2="660" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="540" x2="40" y2="660" stroke="currentColor" strokeWidth="1" />
          </svg>

          {/* Column 3: Semifinals */}
          <div className="flex flex-col justify-around h-[720px]">
            <Slot placeholder="Winner" />
            <Slot placeholder="Winner" />
            <Slot placeholder="Winner" />
            <Slot placeholder="Winner" />
          </div>

          {/* Connector */}
          <svg width="40" height="720" className="text-neutral-600">
            <line x1="0" y1="120" x2="40" y2="120" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="360" x2="40" y2="360" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="120" x2="40" y2="360" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="480" x2="40" y2="480" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="600" x2="40" y2="600" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="480" x2="40" y2="600" stroke="currentColor" strokeWidth="1" />
          </svg>

          {/* Column 4: Finals */}
          <div className="flex flex-col justify-around h-[720px]">
            <Slot placeholder="Winner" />
            <Slot placeholder="Winner" />
          </div>

          {/* Connector to champion */}
          <svg width="40" height="720" className="text-neutral-600">
            <line x1="0" y1="240" x2="40" y2="240" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="480" x2="40" y2="480" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="240" x2="40" y2="480" stroke="currentColor" strokeWidth="1" />
          </svg>

          {/* Champion */}
          <div className="flex flex-col justify-center h-[720px]">
            <div className="bg-yellow-400 text-black font-bold text-sm px-4 py-3 rounded text-center">
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