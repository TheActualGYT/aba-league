import db from "@/lib/db";
import PlayerForm from "@/components/PlayerForm";

export const dynamic = "force-dynamic";

export default async function NewPlayerPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const data = await db.load();
  const teams = [...(data.teams || [])]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(team => ({ id: team.id, name: team.name }));

  return (
    <main
      className="py-8"
      style={{
        paddingLeft: "max(16px, calc(50% - 707.56px))",
        paddingRight: "max(24px, calc(50% - 640px))",
      }}
    >
      <h2 className="label-glow text-3xl font-bold mb-8 text-white text-center tracking-wide">CREATE PLAYER</h2>
      <PlayerForm teams={teams} initialStatus={status === "prospect" ? "prospect" : "free"} />
    </main>
  );
}
