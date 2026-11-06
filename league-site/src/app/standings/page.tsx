import db from "@/lib/db";

export const dynamic = "force-dynamic";

const DIVISION_NAMES = ["Alpha Division", "Delta Division", "Gamma Division", "Omega Division"];

function assignDivisions(teams: any[]) {
  const sorted = [...teams].sort((a, b) => a.name.localeCompare(b.name));
  const divisions: any[][] = [[], [], [], []];

  sorted.forEach((team, index) => {
    const overallRank = index + 1;
    const round = Math.floor(index / 4);
    const posInRound = index % 4;
    const divIndex = round % 2 === 0 ? posInRound : 3 - posInRound;
    divisions[divIndex].push({ ...team, overallRank });
  });

  return divisions;
}

export default async function StandingsPage() {
  const data = await db.load();
  const teams = data.teams;
  const games = data.games;

  const divisionTeams = assignDivisions(teams);

  const standingsByDivision = divisionTeams.map((divTeams, idx) => {
    const standings = divTeams.map(team => {
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
    }).sort((a, b) => b.wins - a.wins || b.diff - a.diff);

    const leaderWins = standings[0]?.wins || 0;
    const leaderLosses = standings[0]?.losses || 0;
    const withGB = standings.map(team => {
      const gb = ((leaderWins - team.wins) + (team.losses - leaderLosses)) / 2;
      return { ...team, gb: gb === 0 ? "—" : gb.toFixed(1) };
    });

    return { division: DIVISION_NAMES[idx], teams: withGB };
  });

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="label-glow text-3xl font-bold mb-8 text-white text-center tracking-wide">DIVISIONAL STANDINGS</h2>

      {standingsByDivision.map(({ division, teams: divTeams }) => (
        <div key={division} className="mb-10">
          <h3 className="text-2xl font-semibold text-white mb-3">{division}</h3>
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
                {divTeams.map((team, i) => (
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
                {divTeams.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-6 text-center text-neutral-400">No teams in this division yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </main>
  );
}
