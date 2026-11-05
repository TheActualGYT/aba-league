import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, abbreviation, division } = await req.json();
  if (!name || !abbreviation || !division) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const data = db.load();
  const newId = data.nextIds.team++;
  data.teams.push({
    id: newId,
    name,
    abbreviation,
    division,
    created_by: Number(session.user.id),
  });
  db.save(data);
  return NextResponse.json({ id: newId });
}