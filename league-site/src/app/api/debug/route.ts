import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const data = await db.load();
    return NextResponse.json({
      ok: true,
      teamCount: data.teams.length,
      teams: data.teams.map(t => ({ id: t.id, name: t.name, division: t.division })),
      hasConnection: !!(process.env.STORAGE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL),
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err.message,
      hasConnection: !!(process.env.STORAGE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL),
    }, { status: 500 });
  }
}