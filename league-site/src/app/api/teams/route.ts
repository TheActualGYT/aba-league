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