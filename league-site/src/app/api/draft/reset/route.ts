import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST() {
  const data = await db.load();
  db.clearDraft(data);
  await db.save(data);
  return NextResponse.json({ ok: true });
}
