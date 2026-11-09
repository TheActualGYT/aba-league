import db from "@/lib/db";
import DraftBoard from "@/components/DraftBoard";

export const dynamic = "force-dynamic";

export default async function DraftRoomPage() {
  const data = await db.load();
  const teams = [...(data.teams || [])]
    .filter(team => team.draft_eligible !== false)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(team => ({
      id: team.id,
      abbreviation: team.abbreviation,
      logo: team.logo,
    }));

  return <DraftBoard teams={teams} />;
}
