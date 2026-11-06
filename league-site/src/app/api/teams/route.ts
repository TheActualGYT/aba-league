import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

const OWNERS = ["Garrett Jahnke", "Craig Jahnke", "Chad Jahnke"];

function takenBy(teams: { id: number; name: string; abbreviation: string }[], abbreviation: string, ignoreId?: number) {
  const next = String(abbreviation || "").trim().toUpperCase();
  if (!next) return undefined;
  return teams.find(t => t.id !== ignoreId && t.abbreviation?.toUpperCase() === next);
}

export async function POST(req: NextRequest) {
  const { name, abbreviation, division, logo, location, ownership, head_coach, assistant_coach, colors } = await req.json();
  if (!name || !abbreviation || !division || !logo || !location || !ownership || !head_coach || !assistant_coach) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!OWNERS.includes(ownership)) {
    return NextResponse.json({ error: "Invalid owner" }, { status: 400 });
  }

  const data = await db.load();
  const clash = takenBy(data.teams, abbreviation);
  if (clash) {
    return NextResponse.json({ error: `Already taken by "${clash.name}"` }, { status: 400 });
  }

  const newId = data.nextIds.team++;
  data.teams.push({
    id: newId,
    name,
    abbreviation: String(abbreviation).trim().toUpperCase(),
    division,
    logo,
    location,
    ownership,
    head_coach,
    assistant_coach,
    colors: colors || [],
    created_by: 1,
  });
  await db.save(data);
  return NextResponse.json({ id: newId });
}

export async function PATCH(req: NextRequest) {
  const { id, name, abbreviation, logo, location, ownership, head_coach, assistant_coach, colors } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing team id" }, { status: 400 });

  const data = await db.load();
  const team = data.teams.find(t => t.id === Number(id));
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  if (abbreviation) {
    const clash = takenBy(data.teams, abbreviation, team.id);
    if (clash) {
      return NextResponse.json({ error: `Already taken by "${clash.name}"` }, { status: 400 });
    }
  }

  if (name) team.name = name;
  if (abbreviation) team.abbreviation = String(abbreviation).trim().toUpperCase();
  if (logo) team.logo = logo;
  if (location) team.location = location;
  if (ownership) team.ownership = ownership;
  if (head_coach !== undefined) team.head_coach = head_coach;
  if (assistant_coach !== undefined) team.assistant_coach = assistant_coach;
  if (colors) team.colors = colors;

  await db.save(data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing team id" }, { status: 400 });

  const data = await db.load();
  data.teams = data.teams.filter(t => t.id !== Number(id));
  await db.save(data);
  return NextResponse.json({ ok: true });
}
