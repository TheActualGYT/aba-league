import db from "@/lib/db";
import { LeagueStandings, type StandingRow } from "@/components/StandingsTables";
import { buildTeamRecord, gamesBehind, type Game } from "@/lib/standings";

export const dynamic = "force-dynamic";

export default async function LeagueStandingsPage() {
  const data = await db.load();
  const teams = data.teams;
  const games = data.games as Game[];

  const ranked = [...teams]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((team, i) => ({ ...team, overallRank: i + 1 }));

  const standings = ranked.map(team => ({
    ...team,
    ...buildTeamRecord(team.id, games),
  }));

  const hasGames = games.length > 0;
  const sorted = [...standings].sort((a, b) => {
    if (hasGames) {
      return b.wins - a.wins || a.losses - b.losses || b.diff - a.diff;
    }
    return a.overallRank - b.overallRank;
  });

  const leader = sorted[0];
  const rows: StandingRow[] = sorted.map((team, i) => ({
    id: team.id,
    name: team.name,
    logo: team.logo,
    overallRank: team.overallRank,
    seed: i + 1,
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

  return (
    <main
      className="py-8"
      style={{
        paddingLeft: "max(16px, calc(50% - 707.56px))",
        paddingRight: "max(24px, calc(50% - 640px))",
      }}
    >
      <h2 className="label-glow text-3xl font-bold mb-8 text-white text-center tracking-wide">LEAGUE STANDINGS</h2>
      <LeagueStandings teams={rows} />
    </main>
  );
}
