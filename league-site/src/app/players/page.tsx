import db from "@/lib/db";
import PlayerDirectory from "@/components/PlayerDirectory";
import { toDirectoryPlayers } from "@/lib/directoryPlayers";

export const dynamic = "force-dynamic";

export default async function PlayersPage() {
  const data = await db.load();
  const players = toDirectoryPlayers(data.players || [], data.teams || []);

  return (
    <main
      className="py-8"
      style={{
        paddingLeft: "max(16px, calc(50% - 707.56px))",
        paddingRight: "max(24px, calc(50% - 640px))",
      }}
    >
      <h2 className="label-glow text-3xl font-bold mb-8 text-white text-center tracking-wide">PLAYER DIRECTORY</h2>
      <PlayerDirectory players={players} />
    </main>
  );
}
