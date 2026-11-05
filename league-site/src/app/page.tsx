import Link from "next/link";
import db from "@/lib/db";

export default async function Home() {
  const data = db.load();
  const teams = data.teams;
  const games = data.games;

  const divisions = ["Alpha Division", "Delta Division", "Gamma Division", "Omega Division"];

  const standingsByDivision = divisions.map(div => {
    const divTeams = teams.filter(t => t.division === div);
    const standings = divTeams.map(team => {
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
    }).sort((a, b) => b.wins - a.wins || a.losses - b.losses);

    const leaderWins = standings[0]?.wins || 0;
    const leaderLosses = standings[0]?.losses || 0;
    const withGB = standings.map(team => {
      const gb = ((leaderWins - team.wins) + (team.losses - leaderLosses)) / 2;
      return { ...team, gb: gb === 0 ? "—" : gb.toFixed(1) };
    });

    return { division: div, teams: withGB };
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mini Standings by Division */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">Standings</h2>
            <div className="space-y-6">
              {standingsByDivision.map(({ division, teams: divTeams }) => (
                <div key={division}>
                  <h3 className="text-lg font-semibold text-white mb-2">{division}</h3>
                  <div className="bg-neutral-900 border-2 border-white rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-800">
                        <tr>
                          <th className="px-3 py-2 text-left text-neutral-300">Team</th>
                          <th className="px-2 py-2 text-center text-neutral-300">W</th>
                          <th className="px-2 py-2 text-center text-neutral-300">L</th>
                          <th className="px-2 py-2 text-center text-neutral-300">W%</th>
                          <th className="px-2 py-2 text-center text-neutral-300">GB</th>
                        </tr>
                      </thead>
                      <tbody>
                        {divTeams.map((team, i) => (
                          <tr key={team.id} className="border-t border-neutral-700">
                            <td className="px-3 py-2 text-white font-medium">{i + 1}. {team.name}</td>
                            <td className="px-2 py-2 text-center">{team.wins}</td>
                            <td className="px-2 py-2 text-center">{team.losses}</td>
                            <td className="px-2 py-2 text-center">{team.winPct.toFixed(3).replace(/^0/, "")}</td>
                            <td className="px-2 py-2 text-center">{team.gb}</td>
                          </tr>
                        ))}
                        {divTeams.length === 0 && (
                          <tr><td colSpan={5} className="px-3 py-4 text-center text-neutral-400 text-xs">No teams</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* League Leaders */}
          <div className="lg:col-span-2">
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
        </div>
      </main>
    </div>
  );
}