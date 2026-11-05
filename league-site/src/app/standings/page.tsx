import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import Link from "next/link";

export default async function StandingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const data = db.load();
  const teams = data.teams;
  const games = data.games;

  const standings = teams.map(team => {
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
    return { ...team, wins, losses, pf, pa, diff: pf - pa };
  }).sort((a, b) => b.wins - a.wins || b.diff - a.diff);

  return (
    <div className="min-h-screen">
      <nav className="bg-neutral-900 border-b border-neutral-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">NCAA 10 League</Link>
          <Link href="/" className="text-sm hover:text-neutral-300">← Back</Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6 text-white">League Standings</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-neutral-900 rounded-lg border border-neutral-700">
            <thead className="bg-neutral-800">
              <tr>
                <th className="px-4 py-3 text-left text-neutral-300">Rank</th>
                <th className="px-4 py-3 text-left text-neutral-300">Team</th>
                <th className="px-4 py-3 text-center text-neutral-300">W</th>
                <th className="px-4 py-3 text-center text-neutral-300">L</th>
                <th className="px-4 py-3 text-center text-neutral-300">PF</th>
                <th className="px-4 py-3 text-center text-neutral-300">PA</th>
                <th className="px-4 py-3 text-center text-neutral-300">Diff</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, i) => (
                <tr key={team.id} className="border-t border-neutral-700">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-white">{team.name} ({team.abbreviation})</td>
                  <td className="px-4 py-3 text-center">{team.wins}</td>
                  <td className="px-4 py-3 text-center">{team.losses}</td>
                  <td className="px-4 py-3 text-center">{team.pf}</td>
                  <td className="px-4 py-3 text-center">{team.pa}</td>
                  <td className="px-4 py-3 text-center">{team.diff > 0 ? "+" : ""}{team.diff}</td>
                </tr>
              ))}
              {standings.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-neutral-400">No teams yet. Create some!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}