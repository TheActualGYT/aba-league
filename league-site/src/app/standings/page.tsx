import db from "@/lib/db";
import { STANDINGS_COLS, buildTeamRecord, gamesBehind, splitClass, statValues, type Game } from "@/lib/standings";

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

  const standingsByDivision = divisionTeams.map((divTeams, idx) => {
    const standings = divTeams.map(team => ({
      ...team,
      ...buildTeamRecord(team.id, games),
    })).sort((a, b) => b.wins - a.wins || a.losses - b.losses || b.diff - a.diff);

    const leader = standings[0];
    const withGB = standings.map(team => ({
      ...team,
      gb: leader ? gamesBehind(team, leader) : "—",
    }));

    return { division: DIVISION_NAMES[idx], teams: withGB };
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

      {standingsByDivision.map(({ division, teams: divTeams }) => (
        <div key={division} className="mb-10">
          <h3 className="text-2xl font-semibold text-white mb-3">{division}</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed bg-neutral-900 rounded-lg border border-neutral-700">
              <colgroup>
                {STANDINGS_COLS.map(col => (
                  <col key={col.label} style={col.width ? { width: col.width } : undefined} />
                ))}
              </colgroup>
              <thead className="bg-neutral-800">
                <tr>
                  {STANDINGS_COLS.map(col => (
                    <th key={col.label} className={`px-2 py-3 text-neutral-300 text-xs whitespace-nowrap ${col.align} ${splitClass(col)}`}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {divTeams.map((team, i) => (
                  <tr key={team.id} className="border-t border-neutral-700">
                    <td className="px-2 py-3 whitespace-nowrap">{i + 1}</td>
                    <td className="px-2 py-3 font-semibold text-white">
                      <div className="flex items-center gap-2 min-w-0">
                        {team.logo ? (
                          <img src={team.logo} alt="" className="h-6 w-6 object-contain flex-shrink-0" />
                        ) : (
                          <div className="h-6 w-6 flex-shrink-0" />
                        )}
                        <span className="truncate">
                          {team.name}<sup className="text-neutral-500 text-[9px] ml-1">{team.overallRank}</sup>
                        </span>
                      </div>
                    </td>
                    {statValues(team).map((value, index) => (
                      <td key={STANDINGS_COLS[index + 2].label} className={`px-2 py-3 text-center whitespace-nowrap ${splitClass(STANDINGS_COLS[index + 2])}`}>
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
                {divTeams.length === 0 && (
                  <tr><td colSpan={STANDINGS_COLS.length} className="px-4 py-6 text-center text-neutral-400">No teams in this division yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </main>
  );
}
