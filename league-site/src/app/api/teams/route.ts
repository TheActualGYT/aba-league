import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name, abbreviation, division, logo } = await req.json();
  if (!name || !abbreviation || !division || !logo) {
    return NextResponse.json({ error: "Missing fields (logo required)" }, { status: 400 });
  }

  const data = db.load();
  const newId = data.nextIds.team++;
  data.teams.push({
    id: newId,
    name,
    abbreviation,
    division,
    logo,
    created_by: 1,
  });
  db.save(data);
  return NextResponse.json({ id: newId });
}