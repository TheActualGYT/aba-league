import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

const POSITIONS = ["PG", "SG", "SF", "PF", "C"];

export async function POST(req: NextRequest) {
  const { name, position, team_id } = await req.json();
  const cleanName = String(name || "").trim();
  if (!cleanName || !position) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!POSITIONS.includes(position)) {
    return NextResponse.json({ error: "Invalid position" }, { status: 400 });
  }

  const data = await db.load();
  if (!data.players) data.players = [];
  if (data.nextIds.player == null) {
    data.nextIds.player = data.players.reduce((max, player) => Math.max(max, player.id), 0) + 1;
  }

  const teamId = team_id == null || team_id === "" ? null : Number(team_id);
  if (teamId != null && !data.teams.some(team => team.id === teamId)) {
    return NextResponse.json({ error: "Team not found" }, { status: 400 });
  }

  const newId = data.nextIds.player++;
  data.players.push({
    id: newId,
    name: cleanName,
    position,
    team_id: teamId,
  });
  await db.save(data);
  return NextResponse.json({ id: newId });
}

export async function PATCH(req: NextRequest) {
  const { id, name, position, team_id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing player id" }, { status: 400 });
  if (position && !POSITIONS.includes(position)) {
    return NextResponse.json({ error: "Invalid position" }, { status: 400 });
  }

  const data = await db.load();
  const player = data.players.find(item => item.id === Number(id));
  if (!player) return NextResponse.json({ error: "Player not found" }, { status: 404 });

  if (name !== undefined) {
    const cleanName = String(name).trim();
    if (!cleanName) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    player.name = cleanName;
  }
  if (position) player.position = position;
  if (team_id !== undefined) {
    const teamId = team_id == null || team_id === "" ? null : Number(team_id);
    if (teamId != null && !data.teams.some(team => team.id === teamId)) {
      return NextResponse.json({ error: "Team not found" }, { status: 400 });
    }
    player.team_id = teamId;
  }

  await db.save(data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing player id" }, { status: 400 });

  const data = await db.load();
  data.players = data.players.filter(player => player.id !== Number(id));
  await db.save(data);
  return NextResponse.json({ ok: true });
}
