import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name, abbreviation, division, logo, location, ownership, colors } = await req.json();
  if (!name || !abbreviation || !division || !logo || !location || !ownership) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const data = await db.load();
  const newId = data.nextIds.team++;
  data.teams.push({
    id: newId,
    name,
    abbreviation,
    division,
    logo,
    location,
    ownership,
    colors: colors || [],
    created_by: 1,
  });
  await db.save(data);
  return NextResponse.json({ id: newId });
}

export async function PATCH(req: NextRequest) {
  const { id, name, abbreviation, logo, location, ownership, colors } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing team id" }, { status: 400 });

  const data = await db.load();
  const team = data.teams.find(t => t.id === Number(id));
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  if (name) team.name = name;
  if (abbreviation) team.abbreviation = abbreviation;
  if (logo) team.logo = logo;
  if (location) team.location = location;
  if (ownership) team.ownership = ownership;
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