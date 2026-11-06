import db from "@/lib/db";

export const dynamic = "force-dynamic";

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
  const withGB = sorted.map(team => {
    const gb = ((leaderWins - team.wins) + (team.losses - leaderLosses)) / 2;
    return { ...team, gb: gb === 0 ? "—" : gb.toFixed(1) };
  });

  return (
    <main
      className="py-8"
      style={{
        paddingLeft: "max(16px, calc(50% - 707.56px))",
        paddingRight: "max(24px, calc(50% - 640px))",
      }}
    >
      <h2 className="label-glow text-3xl font-bold mb-8 text-white text-center tracking-wide">LEAGUE STANDINGS</h2>

      <div className="overflow-x-auto">
        <table className="w-full bg-neutral-900 rounded-lg border border-neutral-700">
          <thead className="bg-neutral-800">
            <tr>
              <th className="px-3 py-3 text-left text-neutral-300 text-sm">Rank</th>
              <th className="px-3 py-3 text-left text-neutral-300 text-sm">Team Name</th>
              <th className="px-3 py-3 text-center text-neutral-300 text-sm">W</th>
              <th className="px-3 py-3 text-center text-neutral-300 text-sm">L</th>
              <th className="px-3 py-3 text-center text-neutral-300 text-sm">Win %</th>
              <th className="px-3 py-3 text-center text-neutral-300 text-sm">GB</th>
              <th className="px-3 py-3 text-center text-neutral-300 text-sm">Pts Scored</th>
              <th className="px-3 py-3 text-center text-neutral-300 text-sm">Pts Allowed</th>
              <th className="px-3 py-3 text-center text-neutral-300 text-sm">Diff</th>
            </tr>
          </thead>
          <tbody>
            {withGB.map((team, i) => (
              <tr key={team.id} className="border-t border-neutral-700">
                <td className="px-3 py-3">{i + 1}</td>
                <td className="px-3 py-3 font-semibold text-white">
                  <div className="flex items-center gap-2">
                    {team.logo && <img src={team.logo} alt="" className="h-6 w-6 object-contain" />}
                    <span>
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
            {withGB.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-6 text-center text-neutral-400">No teams yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
