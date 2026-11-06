import db from "@/lib/db";
import Link from "next/link";
import DeletePlayerButton from "@/components/DeletePlayerButton";

export const dynamic = "force-dynamic";

export default async function PlayersPage() {
  const data = await db.load();
  const teams = [...data.teams].sort((a, b) => a.name.localeCompare(b.name));
  const players = [...(data.players || [])].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main
      className="py-8"
      style={{
        paddingLeft: "max(16px, calc(50% - 707.56px))",
        paddingRight: "max(24px, calc(50% - 640px))",
      }}
    >
      <h2 className="label-glow text-3xl font-bold mb-8 text-white text-center tracking-wide">PLAYER DIRECTORY</h2>

      <div className="flex justify-end mb-6">
        <Link href="/players/new" className="bg-neutral-200 text-black font-bold px-5 py-2 rounded hover:bg-white">
          Create Player
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden">
        {players.length === 0 ? (
          <p className="px-4 py-6 text-center text-neutral-400">No players yet.</p>
        ) : (
          <ul>
            {players.map(player => {
              const team = teams.find(item => item.id === player.team_id);
              return (
                <li key={player.id} className="flex items-center gap-4 px-4 py-3 border-t border-neutral-700 first:border-t-0">
                  <span className="text-white font-semibold flex-1 min-w-0 truncate">{player.name}</span>
                  <span className="text-neutral-300 w-16 text-center">{player.position || "N/A"}</span>
                  <span className="text-neutral-400 w-56 truncate text-right flex items-center justify-end gap-2">
                    {team?.logo && <img src={team.logo} alt="" className="h-5 w-5 object-contain" />}
                    {team ? team.name : "Free Agent"}
                  </span>
                  <DeletePlayerButton playerId={player.id} playerName={player.name} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
