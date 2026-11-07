import db from "@/lib/db";
import PlayerDirectory, { type DirectoryPlayer } from "@/components/PlayerDirectory";

export const dynamic = "force-dynamic";

function show(value: unknown, empty = "\u2014") {
  const text = String(value ?? "").trim();
  return text || empty;
}

function accessory(value: unknown) {
  return show(value, "None");
}

function directoryName(player: { name?: string; first_name?: string; last_name?: string }) {
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

export default async function PlayersPage() {
  const data = await db.load();
  const teams = data.teams || [];
  const players: DirectoryPlayer[] = [...(data.players || [])]
    .map(player => {
      const team = teams.find(item => item.id === player.team_id);
      return {
        id: player.id,
        name: directoryName(player),
        team: team ? team.name : "Free Agent",
        logo: team?.logo || "",
        position: show(player.position),
        rating: show(player.overall),
        height: show(player.height),
        weight: show(player.weight),
        number: show(player.number),
        hand: show(player.hand),
        skin_tone: show(player.skin_tone),
        body_type: show(player.body_type),
        head_model: show(player.head_model),
        tshirt_type: show(player.tshirt_type),
        sock_style: show(player.sock_style),
        sock_color: show(player.sock_color),
        shoes_home: show(player.shoes_home),
        shoes_away: show(player.shoes_away),
        headband: accessory(player.headband),
        right_bicep: accessory(player.right_bicep),
        left_bicep: accessory(player.left_bicep),
        right_forearm: accessory(player.right_forearm),
        left_forearm: accessory(player.left_forearm),
        right_elbow: accessory(player.right_elbow),
        left_elbow: accessory(player.left_elbow),
        right_wrist: accessory(player.right_wrist),
        left_wrist: accessory(player.left_wrist),
        right_knee: accessory(player.right_knee),
        left_knee: accessory(player.left_knee),
        right_calf: accessory(player.right_calf),
        left_calf: accessory(player.left_calf),
        fg: show(player.fg),
        three_p: show(player.three_p),
        ft: "\u2014",
        dk: show(player.dk),
        stl: show(player.stl),
        blk: show(player.blk),
        off_reb: show(player.off_reb),
        def_reb: show(player.def_reb),
        passing: show(player.passing),
        off_ability: show(player.off_ability),
        def_ability: show(player.def_ability),
        speed: show(player.speed),
        quickness: show(player.quickness),
        vertical: show(player.vertical),
        dribble: show(player.dribble),
        strength: show(player.strength),
        durability: show(player.durability),
        shooting_range: show(player.shooting_range),
        stamina: show(player.stamina),
        inside_scoring: show(player.inside_scoring),
        in_game_rating: show(player.in_game_rating),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

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
