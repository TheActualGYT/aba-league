import Link from "next/link";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await db.load();
  const teams = data.teams;
  const games = data.games;

  // Assign overall rank alphabetically for now
  const ranked = [...teams]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((team, i) => ({ ...team, overallRank: i + 1 }));

  // Calculate standings
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
    const gamesPlayed = wins + losses;
    const winPct = gamesPlayed > 0 ? wins / gamesPlayed : 0;
    return { ...team, wins, losses, winPct, gamesPlayed };
  });

  // Sort: by wins if games played, otherwise by overall rank
  const hasGames = games.length > 0;
  const sorted = [...standings].sort((a, b) => {
    if (hasGames) {
      return b.wins - a.wins || a.losses - b.losses || a.overallRank - b.overallRank;
    }
    return a.overallRank - b.overallRank;
  });

  const top16 = sorted.slice(0, 16);

  // GB relative to #1
  const leaderWins = top16[0]?.wins || 0;
  const leaderLosses = top16[0]?.losses || 0;
  const withGB = top16.map(team => {
    const gb = ((leaderWins - team.wins) + (team.losses - leaderLosses)) / 2;
    return { ...team, gb: gb === 0 ? "—" : gb.toFixed(1) };
  });

  const recentGames = [...games]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4)
    .map(g => {
      const home = teams.find(t => t.id === g.home_team_id);
      const away = teams.find(t => t.id === g.away_team_id);
      return {
        ...g,
        home_name: home?.name || "TBD",
        away_name: away?.name || "TBD",
      };
    });

  return (
    <div className="min-h-screen">
      <nav className="bg-neutral-900 border-b border-neutral-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">ABA</Link>
          <div className="flex gap-6 items-center">
            <Link href="/standings" className="hover:text-neutral-300">Standings</Link>
            <Link href="/leaders" className="hover:text-neutral-300">League Leaders</Link>
            <Link href="/teams" className="hover:text-neutral-300">Teams</Link>
            <Link href="/players" className="hover:text-neutral-300">Players</Link>
            <Link href="/games" className="hover:text-neutral-300">Games</Link>
            <Link href="/news" className="hover:text-neutral-300">News</Link>
            <span className="text-sm text-neutral-400">Dev Mode</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8">
          <div style={{ width: "480px" }}>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">Playoff Standings</h2>
            <div className="bg-neutral-900 border-2 border-white rounded-lg overflow-hidden">
              <table className="text-sm w-full table-fixed">
                <thead className="bg-neutral-800">
                  <tr>
                    <th className="px-2 py-2 text-center text-neutral-300" style={{ width: "40px" }}>RK</th>
                    <th className="px-3 py-2 text-left text-neutral-300">Team</th>
                    <th className="px-2 py-2 text-center text-neutral-300" style={{ width: "36px" }}>W</th>
                    <th className="px-2 py-2 text-center text-neutral-300" style={{ width: "36px" }}>L</th>
                    <th className="px-2 py-2 text-center text-neutral-300" style={{ width: "48px" }}>W%</th>
                    <th className="px-2 py-2 text-center text-neutral-300" style={{ width: "40px" }}>GB</th>
                  </tr>
                </thead>
                <tbody>
                  {withGB.map((team, i) => (
                    <tr key={team.id} className="border-t border-neutral-700">
                      <td className="px-2 py-2 text-center text-white text-xs">{i + 1}</td>
                      <td className="px-3 py-2 text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                        <div className="flex items-center gap-2">
                          {team.logo ? (
                            <img src={team.logo} alt="" className="h-5 w-5 object-contain flex-shrink-0" />
                          ) : (
                            <div className="h-5 w-5 flex-shrink-0" />
                          )}
                          <span className="whitespace-nowrap truncate">
                            {team.name}<sup className="text-neutral-500 text-[9px] ml-1">{team.overallRank}</sup>
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center">{team.wins}</td>
                      <td className="px-2 py-2 text-center">{team.losses}</td>
                      <td className="px-2 py-2 text-center">{team.winPct.toFixed(3).replace(/^0/, "")}</td>
                      <td className="px-2 py-2 text-center">{team.gb}</td>
                    </tr>
                  ))}
                  {withGB.length === 0 && (
                    <tr><td colSpan={6} className="px-3 py-4 text-center text-neutral-400 text-xs">No teams</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <Link href="/standings" className="text-neutral-300 hover:text-white text-sm">View Full Standings →</Link>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">League Leaders</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-900 border-2 border-green-500 rounded-lg p-4">
                  <h3 className="text-green-400 font-bold text-lg mb-2">Points Per Game</h3>
                  <div className="text-center py-8 text-neutral-500">No stats yet</div>
                </div>
                <div className="bg-neutral-900 border-2 border-red-500 rounded-lg p-4">
                  <h3 className="text-red-400 font-bold text-lg mb-2">Assists Per Game</h3>
                  <div className="text-center py-8 text-neutral-500">No stats yet</div>
                </div>
                <div className="bg-neutral-900 border-2 border-blue-500 rounded-lg p-4">
                  <h3 className="text-blue-400 font-bold text-lg mb-2">Rebounds Per Game</h3>
                  <div className="text-center py-8 text-neutral-500">No stats yet</div>
                </div>
                <div className="bg-neutral-900 border-2 border-white rounded-lg p-4">
                  <h3 className="text-white font-bold text-lg mb-2">GPA</h3>
                  <div className="text-center py-8 text-neutral-500">No stats yet</div>
                </div>
              </div>
              <div className="mt-4 text-right">
                <Link href="/leaders" className="text-neutral-300 hover:text-white text-sm">View Full League Leaders →</Link>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">Final Scores</h2>
              <div className="space-y-3">
                {recentGames.map(game => (
                  <div key={game.id} className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-white w-32 text-right">{game.home_name}</span>
                      <span className="text-2xl font-bold text-white">{game.home_score}</span>
                      <span className="text-neutral-500">-</span>
                      <span className="text-2xl font-bold text-white">{game.away_score}</span>
                      <span className="font-semibold text-white w-32">{game.away_name}</span>
                    </div>
                    <span className="text-sm text-neutral-400">{game.date}</span>
                  </div>
                ))}
                {recentGames.length === 0 && (
                  <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 text-center text-neutral-400">
                    No games recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}