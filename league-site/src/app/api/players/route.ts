import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

function jerseyError(raw: string) {
  const value = String(raw || "").trim();
  if (!value) return "Jersey number is required.";
  if (!/^\d+$/.test(value) || value.length > 2 || Number(value) > 55) {
    return "Jersey numbers cap at 55.";
  }
  if ([...value].some(digit => Number(digit) > 5) || !/^(?:[0-5]|00|[1-5][0-5])$/.test(value)) {
    return "Each digit has to be 0\u20135. 17 isn't allowed.";
  }
  return "";
}

function overallError(raw: unknown) {
  const value = String(raw ?? "").trim();
  if (!/^\d+$/.test(value)) return "Overall has to be a whole number from 10 to 99.";
  const overall = Number(value);
  if (overall < 10 || overall > 99) return "Overall has to be between 10 and 99.";
  return "";
}

function heightInches(raw: string) {
  const match = /^(\d+)'(\d+)"$/.exec(String(raw || "").trim());
  if (!match) return null;
  return Number(match[1]) * 12 + Number(match[2]);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const firstName = String(body.first_name || "").trim();
  const lastName = String(body.last_name || "").trim();
  const number = String(body.number || "").trim();
  const hand = body.hand;
  const height = String(body.height || "").trim();
  const weight = Number(body.weight);
  const overallMessage = overallError(body.overall);
  const numberMessage = jerseyError(number);
  const inches = heightInches(height);

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  }
  if (overallMessage) return NextResponse.json({ error: overallMessage }, { status: 400 });
  if (inches == null || inches < 5 * 12 + 3 || inches > 7 * 12 + 7) {
    return NextResponse.json({ error: "Height has to be between 5'3\" and 7'7\"." }, { status: 400 });
  }
  if (!Number.isInteger(weight) || weight < 150 || weight > 400) {
    return NextResponse.json({ error: "Weight has to be between 150 and 400." }, { status: 400 });
  }
  if (numberMessage) return NextResponse.json({ error: numberMessage }, { status: 400 });
  if (hand !== "Left" && hand !== "Right") {
    return NextResponse.json({ error: "Select a hand." }, { status: 400 });
  }

  const data = await db.load();
  if (!data.players) data.players = [];
  if (data.nextIds.player == null) {
    data.nextIds.player = data.players.reduce((max, player) => Math.max(max, player.id), 0) + 1;
  }

  const newId = data.nextIds.player++;
  data.players.push({
    id: newId,
    name: `${firstName} ${lastName}`,
    team_id: null,
    position: null,
    first_name: firstName,
    last_name: lastName,
    overall: Number(body.overall),
    height,
    weight,
    number,
    hand,
  });
  await db.save(data);
  return NextResponse.json({ id: newId });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing player id" }, { status: 400 });

  const data = await db.load();
  data.players = data.players.filter(player => player.id !== Number(id));
  await db.save(data);
  return NextResponse.json({ ok: true });
}
