import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const { teamId } = await req.json();
  const data = await db.load();
  const team = data.teams.find(item => item.id === Number(teamId));
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });
  data.next_picker_id = team.id;
  await db.save(data);
  return NextResponse.json({ ok: true });
}
