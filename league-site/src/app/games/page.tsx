import db from "@/lib/db";
import Link from "next/link";

export default async function GamesPage() {
  const data = db.load();
  const games = data.games
    .map(g => {
      const home = data.teams.find(t => t.id === g.home_team_id);
      const away = data.teams.find(t => t.id === g.away_team_id);
      return {
        ...g,
        home_name: home?.name,
        away_name: away?.name,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen">
      <nav className="bg-neutral-900 border-b border-neutral-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">ABA</Link>
          <Link href="/" className="text-sm hover:text-neutral-300">← Back</Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6 text-white">Games & Results</h2>
        <p className="text-neutral-400 mb-4">Add game results below (API ready for form expansion).</p>
        <div className="space-y-3">
          {games.map(game => (
            <div key={game.id} className="bg-neutral-900 p-4 rounded flex justify-between items-center border border-neutral-700">
              <div>
                <span className="font-semibold text-white">{game.home_name || "TBD"}</span>
                <span className="mx-2 text-neutral-300">{game.home_score}</span>
                <span className="text-neutral-400">vs</span>
                <span className="mx-2 text-neutral-300">{game.away_score}</span>
                <span className="font-semibold text-white">{game.away_name || "TBD"}</span>
              </div>
              <span className="text-sm text-neutral-400">{game.date}</span>
            </div>
          ))}
          {games.length === 0 && <p className="text-neutral-400">No games recorded yet.</p>}
        </div>
      </main>
    </div>
  );
}