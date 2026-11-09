import db from "@/lib/db";
import DraftBoard from "@/components/DraftBoard";

export const dynamic = "force-dynamic";

function stat(value: unknown) {
  const rating = Number(String(value ?? "").trim());
  return Number.isFinite(rating) ? rating : -1;
}

function shootingAverage(fg: unknown, three: unknown) {
  const fieldGoal = stat(fg);
  const threePoint = stat(three);
  if (fieldGoal < 0 && threePoint < 0) return -1;
  if (fieldGoal < 0) return threePoint;
  if (threePoint < 0) return fieldGoal;
  return (fieldGoal + threePoint) / 2;
}

function prospectName(player: { name: string; first_name?: string; last_name?: string }) {
  const last = player.last_name?.trim();
  const first = player.first_name?.trim();
  return last && first ? `${last}, ${first}` : player.name;
}

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

  const prospects = [...(data.players || [])]
    .filter(player => player.status === "prospect" && !player.team_id)
    .sort((a, b) => {
      const rating = stat(b.overall) - stat(a.overall);
      if (rating) return rating;
      const inGame = stat(b.in_game_rating) - stat(a.in_game_rating);
      if (inGame) return inGame;
      const shooting = shootingAverage(b.fg, b.three_p) - shootingAverage(a.fg, a.three_p);
      if (shooting) return shooting;
      return prospectName(a).localeCompare(prospectName(b));
    })
    .slice(0, 25)
    .map(player => ({
      id: player.id,
      position: player.position || "",
      name: prospectName(player),
      rating: player.overall != null ? String(player.overall) : "",
      height: player.height || "",
      weight: player.weight != null ? String(player.weight) : "",
      fg: player.fg || "",
      threeP: player.three_p || "",
    }));

  return <DraftBoard teams={teams} prospects={prospects} />;
}
