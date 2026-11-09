import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

const ROUNDS = 5;
const PICKS = 20;

function slots() {
  const list: string[] = [];
  for (let round = 1; round <= ROUNDS; round += 1) {
    for (let pick = 1; pick <= PICKS; pick += 1) list.push(`${round}.${String(pick).padStart(2, "0")}`);
  }
  return list;
}

function cycleTaken(picks: { team_id: number }[], teamIds: number[]) {
  const ids = new Set(teamIds);
  let taken = new Set<number>();
  for (const pick of picks) {
    if (!ids.has(pick.team_id)) continue;
    taken.add(pick.team_id);
    if (taken.size === ids.size) taken = new Set();
  }
  return taken;
}

export async function POST(req: NextRequest) {
  const { teamId } = await req.json();
  const data = await db.load();
  const teams = [...(data.teams || [])].sort((a, b) => a.name.localeCompare(b.name));
  const team = teams.find(item => item.id === Number(teamId));
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  const picks = data.draft_picks || [];
  if (picks.some(pick => !pick.player_id)) {
    return NextResponse.json({ error: "Finish the current pick" }, { status: 400 });
  }
  const taken = cycleTaken(picks, teams.map(item => item.id));
  if (taken.has(team.id)) return NextResponse.json({ error: "Team already picked this round" }, { status: 400 });

  const used = new Set(picks.map(pick => pick.slot));
  const slot = slots().find(item => !used.has(item));
  if (!slot) return NextResponse.json({ error: "Draft board is full" }, { status: 400 });

  data.draft_picks = [...picks, { slot, team_id: team.id }];
  const takenAfter = cycleTaken(data.draft_picks, teams.map(item => item.id));
  const pool = teams.filter(item => !takenAfter.has(item.id));
  const nextPool = pool.length ? pool : teams;
  const current = teams.findIndex(item => item.id === team.id);
  const following = teams[(current + 1) % teams.length];
  const nextTeam = nextPool.find(item => item.id === following.id) || nextPool[0];
  data.next_picker_id = nextTeam?.id ?? null;
  await db.save(data);
  return NextResponse.json({
    slot,
    teamId: team.id,
    nextPickerId: data.next_picker_id,
  });
}
