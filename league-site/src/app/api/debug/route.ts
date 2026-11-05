import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const envKeys = Object.keys(process.env).filter(k =>
    k.includes("URL") || k.includes("DATABASE") || k.includes("POSTGRES") || k.includes("STORAGE")
  );

  try {
    const data = await db.load();
    return NextResponse.json({
      ok: true,
      teamCount: data.teams.length,
      teams: data.teams.map(t => ({ id: t.id, name: t.name, division: t.division })),
      envKeys,
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err.message,
      envKeys,
    }, { status: 500 });
  }
}