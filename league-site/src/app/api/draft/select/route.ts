import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const { playerId } = await req.json();
  const data = await db.load();
  const picks = data.draft_picks || [];
  const open = [...picks].reverse().find(pick => !pick.player_id);
  if (!open) return NextResponse.json({ error: "Nobody is on the clock" }, { status: 400 });
  const player = (data.players || []).find(item => item.id === Number(playerId));
  if (!player || player.status !== "prospect" || player.team_id) {
    return NextResponse.json({ error: "Player is not available" }, { status: 400 });
  }
  const position = String(player.position || "").trim().toUpperCase();
  if (!["C", "PF", "SF", "SG", "PG"].includes(position)) {
    return NextResponse.json({ error: "Player needs a valid position" }, { status: 400 });
  }
  const filled = (data.players || []).some(item =>
    item.id !== player.id &&
    item.team_id === open.team_id &&
    String(item.position || "").trim().toUpperCase() === position
  );
  if (filled) return NextResponse.json({ error: "Position already filled" }, { status: 400 });
  player.team_id = open.team_id;
  player.status = "team";
  open.player_id = player.id;
  await db.save(data);
  return NextResponse.json({ ok: true, slot: open.slot, teamId: open.team_id });
}
