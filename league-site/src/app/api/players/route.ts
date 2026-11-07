import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

const POSITIONS = ["C", "PF", "SF", "SG", "PG"];
const COMPLEXIONS = Array.from({ length: 10 }, (_, index) => `Complexion ${index + 1}`);
const TSHIRTS = ["None", "Muscle T", "Angled T", "Short Sleeve", "Long Sleeve"];
const SOCK_COLORS = ["White", "Black", "Team"];
const STATS = [
  ["fg", "FG"],
  ["three_p", "3P"],
  ["dk", "DK"],
  ["stl", "STL"],
  ["blk", "BLK"],
  ["off_reb", "OR"],
  ["def_reb", "DR"],
  ["passing", "PS"],
  ["off_ability", "OA"],
  ["def_ability", "DA"],
  ["speed", "SP"],
  ["quickness", "QK"],
  ["vertical", "JP"],
  ["dribble", "DRI"],
  ["strength", "STR"],
  ["durability", "DUR"],
  ["shooting_range", "SR"],
  ["stamina", "STM"],
  ["inside_scoring", "IS"],
  ["in_game_rating", "In-Game Rating"],
] as const;

function text(raw: unknown) {
  const value = String(raw ?? "").trim();
  return value || undefined;
}

function twoDigits(raw: unknown, label: string): { error?: string; value?: string } {
  const value = String(raw ?? "").trim();
  if (!value) return { value: undefined };
  if (!/^\d{2}$/.test(value)) return { error: `${label} has to be 2 digits.` };
  return { value };
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
  const headModel = String(body.head_model ?? "").trim();
  const skinTone = text(body.skin_tone);
  const tshirtType = text(body.tshirt_type);
  const sockColor = text(body.sock_color);
  const overallMessage = overallError(overallRaw);
  const numberMessage = jerseyError(number);
  const inches = height ? heightInches(height) : null;
  const stats = Object.fromEntries(STATS.map(([key]) => [key, undefined])) as Record<(typeof STATS)[number][0], string | undefined>;

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
  if (skinTone && !COMPLEXIONS.includes(skinTone)) {
    return NextResponse.json({ error: "Select a skin tone." }, { status: 400 });
  }
  if (tshirtType && !TSHIRTS.includes(tshirtType)) {
    return NextResponse.json({ error: "Select a t-shirt type." }, { status: 400 });
  }
  if (sockColor && !SOCK_COLORS.includes(sockColor)) {
    return NextResponse.json({ error: "Select a sock color." }, { status: 400 });
  }
  if (headModel && (!/^\d{1,3}$/.test(headModel) || Number(headModel) === 0)) {
    return NextResponse.json({ error: Number(headModel) === 0 ? "0 isn't allowed." : "Head model can be at most 3 digits." }, { status: 400 });
  }
  for (const [key, label] of STATS) {
    const parsed = twoDigits(body[key], label);
    if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: 400 });
    stats[key] = parsed.value;
  }

  const data = await db.load();
  const requestedTeam = body.team_id;
  let teamId: number | null = null;
  if (requestedTeam !== null && requestedTeam !== undefined && String(requestedTeam) !== "" && String(requestedTeam) !== "free") {
    const parsedTeam = Number(requestedTeam);
    if (!data.teams?.some(team => team.id === parsedTeam)) {
      return NextResponse.json({ error: "That team no longer exists." }, { status: 400 });
    }
    teamId = parsedTeam;
  }
  if (!data.players) data.players = [] as typeof data.players;
  if (data.nextIds.player == null) {
    data.nextIds.player = data.players.reduce((max, player) => Math.max(max, player.id), 0) + 1;
  }

  const newId = data.nextIds.player++;
  data.players.push({
    id: newId,
    name: `${firstName} ${lastName}`,
    team_id: teamId,
    position,
    first_name: firstName,
    last_name: lastName,
    overall: overallRaw ? Number(overallRaw) : undefined,
    height: height || undefined,
    weight: weightRaw ? Number(weightRaw) : undefined,
    number: number || undefined,
    hand: hand || undefined,
    skin_tone: skinTone,
    head_model: headModel || undefined,
    tshirt_type: tshirtType,
    sock_style: text(body.sock_style),
    sock_color: sockColor,
    shoes_home: text(body.shoes_home),
    shoes_away: text(body.shoes_away),
    headband: text(body.headband),
    right_bicep: text(body.right_bicep),
    left_bicep: text(body.left_bicep),
    right_forearm: text(body.right_forearm),
    left_forearm: text(body.left_forearm),
    right_elbow: text(body.right_elbow),
    left_elbow: text(body.left_elbow),
    right_wrist: text(body.right_wrist),
    left_wrist: text(body.left_wrist),
    right_knee: text(body.right_knee),
    left_knee: text(body.left_knee),
    right_calf: text(body.right_calf),
    left_calf: text(body.left_calf),
    fg: stats.fg,
    three_p: stats.three_p,
    dk: stats.dk,
    stl: stats.stl,
    blk: stats.blk,
    off_reb: stats.off_reb,
    def_reb: stats.def_reb,
    passing: stats.passing,
    off_ability: stats.off_ability,
    def_ability: stats.def_ability,
    speed: stats.speed,
    quickness: stats.quickness,
    vertical: stats.vertical,
    dribble: stats.dribble,
    strength: stats.strength,
    durability: stats.durability,
    shooting_range: stats.shooting_range,
    stamina: stats.stamina,
    inside_scoring: stats.inside_scoring,
    in_game_rating: stats.in_game_rating,
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
