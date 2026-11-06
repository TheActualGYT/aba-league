import db from "@/lib/db";

export const dynamic = "force-dynamic";

const COLS = [
  { label: "Rank", width: "72px", align: "text-left" },
  { label: "Team Name", width: undefined, align: "text-left" },
  { label: "W", width: "64px", align: "text-center" },
  { label: "L", width: "64px", align: "text-center" },
  { label: "Win %", width: "84px", align: "text-center" },
  { label: "GB", width: "72px", align: "text-center" },
  { label: "Pts Scored", width: "120px", align: "text-center" },
  { label: "Pts Allowed", width: "124px", align: "text-center" },
  { label: "Diff", width: "80px", align: "text-center" },
];

function StandingsTable({ teams, showHeader }: { teams: any[]; showHeader: boolean }) {
  return (
    <table className="w-full table-fixed bg-neutral-900 rounded-lg border border-neutral-700">
      <colgroup>
        {COLS.map(col => (
          <col key={col.label} style={col.width ? { width: col.width } : undefined} />
        ))}
      </colgroup>
      {showHeader && (
        <thead className="bg-neutral-800">
          <tr>
            {COLS.map(col => (
              <th key={col.label} className={`px-3 py-3 text-neutral-300 text-sm whitespace-nowrap ${col.align}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {teams.map(team => (
          <tr key={team.id} className="border-t border-neutral-700">
            <td className={`px-3 py-3 ${team.seed <= 16 ? "label-glow text-white font-semibold" : ""}`}>{team.seed}</td>
            <td className="px-3 py-3 font-semibold text-white">
              <div className="flex items-center gap-2 min-w-0">
                {team.logo ? (
                  <img src={team.logo} alt="" className="h-6 w-6 object-contain flex-shrink-0" />
                ) : (
                  <div className="h-6 w-6 flex-shrink-0" />
                )}
                <span className="truncate">
                  {team.name}<sup className="text-neutral-500 text-[9px] ml-1">{team.overallRank}</sup>
                </span>
              </div>
            </td>
            <td className="px-3 py-3 text-center">{team.wins}</td>
            <td className="px-3 py-3 text-center">{team.losses}</td>
            <td className="px-3 py-3 text-center">{team.winPct.toFixed(3).replace(/^0/, "")}</td>
            <td className="px-3 py-3 text-center">{team.gb}</td>
            <td className="px-3 py-3 text-center">{team.pf}</td>
            <td className="px-3 py-3 text-center">{team.pa}</td>
            <td className="px-3 py-3 text-center">{team.diff > 0 ? "+" : ""}{team.diff}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function LeagueStandingsPage() {
  const data = await db.load();
  const teams = data.teams;
  const games = data.games;

  const ranked = [...teams]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((team, i) => ({ ...team, overallRank: i + 1 }));

  const standings = ranked.map(team => {
    let wins = 0, losses = 0, pf = 0, pa = 0;
    games.forEach(game => {
      if (game.home_team_id === team.id) {
        if (game.home_score > game.away_score) wins++;
        else losses++;
        pf += game.home_score;
        pa += game.away_score;
      } else if (game.away_team_id === team.id) {
        if (game.away_score > game.home_score) wins++;
        else losses++;
        pf += game.away_score;
        pa += game.home_score;
      }
    });
    const gamesPlayed = wins + losses;
    const winPct = gamesPlayed > 0 ? wins / gamesPlayed : 0;
    return { ...team, wins, losses, pf, pa, diff: pf - pa, winPct, gamesPlayed };
  });

  const hasGames = games.length > 0;
  const sorted = [...standings].sort((a, b) => {
    if (hasGames) {
      return b.wins - a.wins || a.losses - b.losses || b.diff - a.diff;
    }
    return a.overallRank - b.overallRank;
  });

  const leaderWins = sorted[0]?.wins || 0;
  const leaderLosses = sorted[0]?.losses || 0;
  const withGB = sorted.map((team, i) => {
    const gb = ((leaderWins - team.wins) + (team.losses - leaderLosses)) / 2;
    return { ...team, seed: i + 1, gb: gb === 0 ? "—" : gb.toFixed(1) };
  });

  const playoff = withGB.slice(0, 16);
  const outside = withGB.slice(16);

  return (
    <main
      className="pb-8"
      style={{
        paddingLeft: "max(16px, calc(50% - 707.56px))",
        paddingRight: "max(24px, calc(50% - 640px))",
      }}
    >
      <h2 className="standings-title label-glow text-3xl font-bold text-white text-center tracking-wide">LEAGUE STANDINGS</h2>

      {withGB.length === 0 ? (
        <div className="bg-neutral-900 rounded-lg border border-neutral-700 px-4 py-6 text-center text-neutral-400">No teams yet.</div>
      ) : (
        <>
          <StandingsTable teams={playoff} showHeader />
          {outside.length > 0 && (
            <>
              <div className="py-6 text-center">
                <span className="gold-glow text-sm font-bold tracking-[0.22em]">^  ^  ^  PLAYOFF QUALIFICATION  ^  ^  ^</span>
              </div>
              <StandingsTable teams={outside} showHeader={false} />
            </>
          )}
        </>
      )}
    </main>
  );
}
