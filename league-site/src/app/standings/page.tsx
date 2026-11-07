import db from "@/lib/db";
import { DivisionStandings, type StandingRow } from "@/components/StandingsTables";
import { buildTeamRecord, gamesBehind, type Game } from "@/lib/standings";

export const dynamic = "force-dynamic";

const DIVISION_NAMES = ["Alpha Division", "Delta Division", "Gamma Division", "Omega Division"];

function assignDivisions(teams: any[]) {
  const sorted = [...teams].sort((a, b) => a.name.localeCompare(b.name));
  const divisions: any[][] = [[], [], [], []];

  sorted.forEach((team, index) => {
    const overallRank = index + 1;
    const round = Math.floor(index / 4);
    const posInRound = index % 4;
    const divIndex = round % 2 === 0 ? posInRound : 3 - posInRound;
    divisions[divIndex].push({ ...team, overallRank });
  });

  return divisions;
}

export default async function StandingsPage() {
  const data = await db.load();
  const teams = data.teams;
  const games = data.games as Game[];

  const divisionTeams = assignDivisions(teams);

  const divisions = divisionTeams.map((divTeams, idx) => {
    const standings = divTeams.map(team => ({
      ...team,
      ...buildTeamRecord(team.id, games),
    })).sort((a, b) => b.wins - a.wins || a.losses - b.losses || b.diff - a.diff);

    const leader = standings[0];
    const rows: StandingRow[] = standings.map((team, index) => ({
      id: team.id,
      name: team.name,
      logo: team.logo,
      overallRank: team.overallRank,
      seed: index + 1,
      wins: team.wins,
      losses: team.losses,
      winPct: team.winPct,
      winPctLabel: team.winPctLabel,
      gb: leader ? gamesBehind(team, leader) : "\u2014",
      streak: team.streak,
      home: team.home,
      away: team.away,
      ppg: team.ppg,
      oppPpg: team.oppPpg,
      diff: team.diff,
      diffLabel: team.diffLabel,
      gpa: team.gpa,
    }));

    return { division: DIVISION_NAMES[idx], teams: rows };
  });

  return (
    <main
      className="py-8"
      style={{
        paddingLeft: "max(16px, calc(50% - 707.56px))",
        paddingRight: "max(24px, calc(50% - 640px))",
      }}
    >
      <h2 className="label-glow text-3xl font-bold mb-8 text-white text-center tracking-wide">DIVISIONAL STANDINGS</h2>
      <DivisionStandings divisions={divisions} />
    </main>
  );
}
