import db from "@/lib/db";
import PlayerStats, { type StatRow } from "@/components/PlayerStats";
import { addLine, emptySeason, type CountingLine } from "@/lib/gameScore";

export const dynamic = "force-dynamic";

type Player = {
  id: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  team_id?: number | null;
  status?: string;
  position?: string | null;
  overall?: number;
  age?: number;
};

function playerName(player: Player) {
  const last = String(player.last_name ?? "").trim();
  const first = String(player.first_name ?? "").trim();
  if (last && first) return `${last}, ${first}`;
  if (last || first) return last || first;
  const full = String(player.name ?? "").trim();
  if (!full) return "\u2014";
  const parts = full.split(/\s+/);
  if (parts.length < 2) return full;
  return `${parts[parts.length - 1]}, ${parts.slice(0, -1).join(" ")}`;
}

export default async function PlayerStatsPage() {
  const data = await db.load();
  const lines = ((data as { box_scores?: (CountingLine & { player_id: number })[] }).box_scores || []);
  const totals = new Map<number, ReturnType<typeof emptySeason>>();
  for (const line of lines) {
    const current = totals.get(line.player_id) || emptySeason();
    addLine(current, line);
    totals.set(line.player_id, current);
  }

  const rows: StatRow[] = (data.players || [])
    .filter((player: Player) => player.status !== "prospect" && player.team_id)
    .map((player: Player) => ({
      id: player.id,
      position: String(player.position || "").toUpperCase(),
      name: playerName(player),
      age: player.age ?? null,
      rating: player.overall != null ? String(player.overall) : "",
      totals: totals.get(player.id) || emptySeason(),
    }))
    .sort((a, b) => b.totals.gmsc - a.totals.gmsc || b.totals.pts - a.totals.pts || a.name.localeCompare(b.name));

  return (
    <main
      className="py-8"
      style={{
        paddingLeft: "max(16px, calc(50% - 707.56px))",
        paddingRight: "max(24px, calc(50% - 640px))",
      }}
    >
      <h2 className="label-glow mb-8 text-center text-3xl font-bold tracking-wide text-white">PLAYER STATS</h2>
      <PlayerStats rows={rows} />
    </main>
  );
}
