import { notFound } from "next/navigation";
import db from "@/lib/db";
import PlayerForm from "@/components/PlayerForm";
import { buildUsage } from "@/lib/playerUsage";

export const dynamic = "force-dynamic";

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await db.load();
  const player = (data.players || []).find(item => item.id === Number(id));
  if (!player) notFound();

  const teams = [...(data.teams || [])]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(team => ({ id: team.id, name: team.name }));
  const usage = buildUsage(data.players || [], player.id);

  return (
    <main
      className="py-8"
      style={{
        paddingLeft: "max(16px, calc(50% - 707.56px))",
        paddingRight: "max(24px, calc(50% - 640px))",
      }}
    >
      <h2 className="label-glow text-3xl font-bold mb-8 text-white text-center tracking-wide">EDIT PLAYER</h2>
      <PlayerForm teams={teams} player={player} usage={usage} />
    </main>
  );
}
