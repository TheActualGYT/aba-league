import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FinalScoresPage() {
  const data = await db.load();
  const games = data.games
    .map((g) => {
      const home = data.teams.find((t) => t.id === g.home_team_id);
      const away = data.teams.find((t) => t.id === g.away_team_id);
      return {
        ...g,
        home_name: home?.name,
        away_name: away?.name,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-white mb-6">Final Scores</h2>
      <div className="space-y-3">
        {games.map((game) => (
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
        {games.length === 0 && (
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 text-neutral-400">
            No games recorded yet.
          </div>
        )}
      </div>
    </main>
  );
}
