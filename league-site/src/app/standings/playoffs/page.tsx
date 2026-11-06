import db from "@/lib/db";

export const dynamic = "force-dynamic";

function Team({ team, seed, placeholder }: { team?: any; seed?: number; placeholder?: string }) {
  return (
    <div className="flex items-center gap-2 px-2 h-7">
      {seed && <span className="text-neutral-500 text-xs w-4">{seed}</span>}
      {team?.logo && <img src={team.logo} alt="" className="h-4 w-4 object-contain" />}
      <span className="text-white text-xs font-medium truncate">{team?.name || placeholder || "TBD"}</span>
    </div>
  );
}

function Matchup({ top, bottom, topSeed, bottomSeed }: { top?: any; bottom?: any; topSeed?: number; bottomSeed?: number }) {
  return (
    <div className="bg-neutral-900 border border-neutral-600 rounded w-44">
      <Team team={top} seed={topSeed} placeholder={!top ? "Winner" : undefined} />
      <div className="border-t border-neutral-700" />
      <Team team={bottom} seed={bottomSeed} placeholder={!bottom ? "Winner" : undefined} />
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
        <div className="flex min-w-max justify-center">
          {/* Round of 16 */}
          <div>
            <div className="text-xs text-neutral-500 text-center mb-3">Round of 16</div>
            <div className="flex flex-col" style={{ gap: "12px" }}>
              {r1.map(([a, b], i) => (
                <Matchup key={i} top={s[a]} bottom={s[b]} topSeed={a + 1} bottomSeed={b + 1} />
              ))}
            </div>
          </div>

          {/* Lines R1 to QF */}
          <svg width="24" height="650" className="mt-8">
            {[0,1,2,3].map(i => {
              const r1Top = i * 2 * 70 + 28;
              const r1Bot = r1Top + 70;
              const qfMid = 50 + i * 148 + 28;
              return (
                <g key={i}>
                  <line x1="0" y1={r1Top} x2="12" y2={r1Top} stroke="#737373" strokeWidth="1" />
                  <line x1="0" y1={r1Bot} x2="12" y2={r1Bot} stroke="#737373" strokeWidth="1" />
                  <line x1="12" y1={r1Top} x2="12" y2={r1Bot} stroke="#737373" strokeWidth="1" />
                  <line x1="12" y1={(r1Top + r1Bot) / 2} x2="24" y2={qfMid} stroke="#737373" strokeWidth="1" />
                </g>
              );
            })}
          </svg>

          {/* Quarterfinals */}
          <div>
            <div className="text-xs text-neutral-500 text-center mb-3">Quarterfinals</div>
            <div className="flex flex-col" style={{ gap: "90px", marginTop: "50px" }}>
              {[0, 1, 2, 3].map(i => (
                <Matchup key={i} />
              ))}
            </div>
          </div>

          {/* Lines QF to SF */}
          <svg width="24" height="650" className="mt-8">
            {[0,1].map(i => {
              const qfTop = 50 + i * 2 * 148 + 28;
              const qfBot = qfTop + 148;
              const sfMid = 130 + i * 300 + 28;
              return (
                <g key={i}>
                  <line x1="0" y1={qfTop} x2="12" y2={qfTop} stroke="#737373" strokeWidth="1" />
                  <line x1="0" y1={qfBot} x2="12" y2={qfBot} stroke="#737373" strokeWidth="1" />
                  <line x1="12" y1={qfTop} x2="12" y2={qfBot} stroke="#737373" strokeWidth="1" />
                  <line x1="12" y1={(qfTop + qfBot) / 2} x2="24" y2={sfMid} stroke="#737373" strokeWidth="1" />
                </g>
              );
            })}
          </svg>

          {/* Semifinals */}
          <div>
            <div className="text-xs text-neutral-500 text-center mb-3">Semifinals</div>
            <div className="flex flex-col" style={{ gap: "250px", marginTop: "130px" }}>
              {[0, 1].map(i => (
                <Matchup key={i} />
              ))}
            </div>
          </div>

          {/* Lines SF to Finals */}
          <svg width="24" height="650" className="mt-8">
            {(() => {
              const sfTop = 130 + 28;
              const sfBot = 130 + 250 + 56 + 28;
              const finMid = 290 + 28;
              return (
                <g>
                  <line x1="0" y1={sfTop} x2="12" y2={sfTop} stroke="#737373" strokeWidth="1" />
                  <line x1="0" y1={sfBot} x2="12" y2={sfBot} stroke="#737373" strokeWidth="1" />
                  <line x1="12" y1={sfTop} x2="12" y2={sfBot} stroke="#737373" strokeWidth="1" />
                  <line x1="12" y1={(sfTop + sfBot) / 2} x2="24" y2={finMid} stroke="#737373" strokeWidth="1" />
                </g>
              );
            })()}
          </svg>

          {/* Finals */}
          <div>
            <div className="text-xs text-neutral-500 text-center mb-3">Finals</div>
            <div style={{ marginTop: "290px" }}>
              <Matchup />
            </div>
          </div>

          {/* Line to Champion */}
          <svg width="24" height="650" className="mt-8">
            <line x1="0" y1="318" x2="24" y2="338" stroke="#737373" strokeWidth="1" />
          </svg>

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