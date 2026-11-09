import db from "@/lib/db";
import PlayerDirectory from "@/components/PlayerDirectory";
import { toDirectoryPlayers } from "@/lib/directoryPlayers";

export const dynamic = "force-dynamic";

export default async function DraftProspectsPage() {
  const data = await db.load();
  const prospects = (data.players || []).filter(player => player.status === "prospect" && !player.team_id);
  const players = toDirectoryPlayers(prospects, data.teams || []);
  const openPick = [...(data.draft_picks || [])].reverse().find(pick => !pick.player_id);
  const drafting = openPick ? (data.teams || []).find(team => team.id === openPick.team_id) : undefined;

  return (
    <main
      className="py-8"
      style={{
        paddingLeft: "max(16px, calc(50% - 707.56px))",
        paddingRight: "max(24px, calc(50% - 640px))",
      }}
    >
      <h2 className="label-glow text-3xl font-bold mb-8 text-white text-center tracking-wide">DRAFT PROSPECTS</h2>
      <PlayerDirectory
        players={players}
        emptyLabel="No prospects yet."
        showCreate={false}
        sheet
        draftTeam={drafting ? { name: drafting.name } : null}
      />
    </main>
  );
}
