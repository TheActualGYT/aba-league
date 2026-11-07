import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

const POSITIONS = ["C", "PF", "SF", "SG", "PG"];

function text(raw: unknown) {
  const value = String(raw ?? "").trim();
  return value || undefined;
}

function jerseyError(raw: string) {
  const value = String(raw || "").trim();
  if (!value) return "";
  const digits = /^\d+$/.test(value);
  const overCap = !digits || value.length > 2 || Number(value) > 55;
  const badDigit = digits && [...value].some(digit => Number(digit) > 5);
  const illegal = !/^(?:[0-5]|00|[1-5][0-5])$/.test(value);
  if (!overCap && !badDigit && !illegal) return "";
  if (overCap && !badDigit) return `Jersey numbers cap at 55. ${value} isn't allowed.`;
  return `Each digit has to be 0\u20135. ${value} isn't allowed.`;
}

function overallError(raw: unknown) {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  if (!/^\d+$/.test(value) || Number(value) < 10 || Number(value) > 99) {
    return "Rating has to be between 10 and 99.";
  }
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
  const position = String(body.position || "").trim();
  const number = String(body.number || "").trim();
  const hand = String(body.hand || "").trim();
  const height = String(body.height || "").trim();
  const weightRaw = String(body.weight ?? "").trim();
  const overallRaw = String(body.overall ?? "").trim();
  const overallMessage = overallError(overallRaw);
  const numberMessage = jerseyError(number);
  const inches = height ? heightInches(height) : null;

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  }
  if (!POSITIONS.includes(position)) {
    return NextResponse.json({ error: "Select a position." }, { status: 400 });
  }
  if (overallMessage) return NextResponse.json({ error: overallMessage }, { status: 400 });
  if (height && (inches == null || inches < 5 * 12 + 3 || inches > 7 * 12 + 7)) {
    return NextResponse.json({ error: "Height has to be between 5'3\" and 7'7\"." }, { status: 400 });
  }
  if (weightRaw && (!/^\d+$/.test(weightRaw) || Number(weightRaw) < 150 || Number(weightRaw) > 400)) {
    return NextResponse.json({ error: "Weight has to be between 150 and 400." }, { status: 400 });
  }
  if (numberMessage) return NextResponse.json({ error: numberMessage }, { status: 400 });
  if (hand && hand !== "Left" && hand !== "Right") {
    return NextResponse.json({ error: "Select a hand." }, { status: 400 });
  }

  const data = await db.load();
  if (!data.players) data.players = [] as typeof data.players;
  if (data.nextIds.player == null) {
    data.nextIds.player = data.players.reduce((max, player) => Math.max(max, player.id), 0) + 1;
  }

  const newId = data.nextIds.player++;
  data.players.push({
    id: newId,
    name: `${firstName} ${lastName}`,
    team_id: null,
    position,
    first_name: firstName,
    last_name: lastName,
    overall: overallRaw ? Number(overallRaw) : undefined,
    height: height || undefined,
    weight: weightRaw ? Number(weightRaw) : undefined,
    number: number || undefined,
    hand: hand || undefined,
    skin_tone: text(body.skin_tone),
    body_type: text(body.body_type),
    head_model: text(body.head_model),
    tshirt_type: text(body.tshirt_type),
    sock_style: text(body.sock_style),
    sock_color: text(body.sock_color),
    shoes_home: text(body.shoes_home),
    shoes_away: text(body.shoes_away),
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
