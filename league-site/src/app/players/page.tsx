import db from "@/lib/db";
import PlayerForm from "@/components/PlayerForm";
import EditPlayerButton from "@/components/EditPlayerButton";
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

      {players.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-6 text-center text-neutral-400">
          No players yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map(player => {
            const team = teams.find(item => item.id === player.team_id);
            return (
              <div key={player.id} className="bg-neutral-900 p-4 rounded-lg border border-neutral-700">
                <h3 className="text-xl font-semibold text-white mb-2">{player.name}</h3>
                <p className="text-sm text-neutral-400"><span className="font-bold">Position</span> — {player.position || "N/A"}</p>
                <p className="text-sm text-neutral-400 flex items-center gap-2">
                  <span><span className="font-bold">Team</span> —</span>
                  {team ? (
                    <span className="inline-flex items-center gap-2 text-neutral-300">
                      {team.logo && <img src={team.logo} alt="" className="h-5 w-5 object-contain" />}
                      {team.name}
                    </span>
                  ) : (
                    <span>Free Agent</span>
                  )}
                </p>
                <div className="flex justify-end items-start gap-3 mt-3">
                  <EditPlayerButton player={player} teams={teams} />
                  <DeletePlayerButton playerId={player.id} playerName={player.name} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10">
        <PlayerForm teams={teams.map(team => ({ id: team.id, name: team.name }))} />
      </div>
    </main>
  );
}
