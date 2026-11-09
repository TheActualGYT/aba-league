import db from "@/lib/db";
import DraftBoard from "@/components/DraftBoard";

export const dynamic = "force-dynamic";

export default async function DraftRoomPage() {
  const data = await db.load();
  const teams = [...(data.teams || [])]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(team => ({
      id: team.id,
      name: team.name,
      logo: team.logo,
    }));

  return <DraftBoard teams={teams} />;
}
