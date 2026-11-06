import db from "@/lib/db";
import { STANDINGS_COLS, buildTeamRecord, gamesBehind, splitClass, statValues, type Game } from "@/lib/standings";

export const dynamic = "force-dynamic";

function cellClass(index: number, edges: { top?: boolean; bottom?: boolean }) {
  const left = index === 0;
  const right = index === STANDINGS_COLS.length - 1;
  return [
    "px-2 py-3 bg-neutral-900 border-neutral-700 whitespace-nowrap",
    left ? "border-l" : "",
    right ? "border-r" : "",
    "border-b",
    edges.top ? "border-t" : "",
    edges.top && left ? "rounded-tl-lg" : "",
    edges.top && right ? "rounded-tr-lg" : "",
    edges.bottom && left ? "rounded-bl-lg" : "",
    edges.bottom && right ? "rounded-br-lg" : "",
  ].filter(Boolean).join(" ");
}

function TeamRow({ team, top, bottom }: { team: any; top?: boolean; bottom?: boolean }) {
  const edges = { top, bottom };
  const inPlayoffs = team.seed <= 16;
  const values = statValues(team);
  return (
    <tr>
      <td className={`${cellClass(0, edges)} ${inPlayoffs ? "gold-glow font-semibold" : ""}`}>{team.seed}</td>
      <td className={`${cellClass(1, edges)} font-semibold text-white`}>
        <div className="flex items-center gap-2 min-w-0">
          {team.logo ? (
            <img src={team.logo} alt="" className="h-6 w-6 object-contain flex-shrink-0" />
          ) : (
            <div className="h-6 w-6 flex-shrink-0" />
          )}
          <span className="truncate">
            <span className={inPlayoffs ? "label-glow" : ""}>{team.name}</span>
            <sup className="text-neutral-500 text-[9px] ml-1">{team.overallRank}</sup>
          </span>
        </div>
      </td>
      {values.map((value, i) => (
        <td key={STANDINGS_COLS[i + 2].label} className={`${cellClass(i + 2, edges)} text-center ${splitClass(STANDINGS_COLS[i + 2])}`}>
          {value}
        </td>
      ))}
    </tr>
  );
}

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
  const withGB = sorted.map((team, i) => ({
    ...team,
    seed: i + 1,
    gb: leader ? gamesBehind(team, leader) : "—",
  }));

  const playoff = withGB.slice(0, 16);
  const outside = withGB.slice(16);

  return (
    <main
      className="py-8"
      style={{
        paddingLeft: "max(16px, calc(50% - 707.56px))",
        paddingRight: "max(24px, calc(50% - 640px))",
      }}
    >
      <h2 className="label-glow text-3xl font-bold mb-8 text-white text-center tracking-wide">LEAGUE STANDINGS</h2>

      {withGB.length === 0 ? (
        <div className="bg-neutral-900 rounded-lg border border-neutral-700 px-4 py-6 text-center text-neutral-400">No teams yet.</div>
      ) : (
        <table className="w-full table-fixed border-separate border-spacing-0">
          <colgroup>
            {STANDINGS_COLS.map(col => (
              <col key={col.label} style={col.width ? { width: col.width } : undefined} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {STANDINGS_COLS.map((col, index) => (
                <th
                  key={col.label}
                  className={`sticky top-[81px] z-30 px-2 py-3 bg-neutral-800 text-neutral-300 text-xs font-semibold whitespace-nowrap border-y border-neutral-700 ${col.align} ${splitClass(col)} ${
                    index === 0 ? "border-l rounded-tl-lg" : ""
                  } ${index === STANDINGS_COLS.length - 1 ? "border-r rounded-tr-lg" : ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {playoff.map((team, i) => (
              <TeamRow key={team.id} team={team} bottom={i === playoff.length - 1} />
            ))}
            {outside.length > 0 && (
              <tr>
                <td colSpan={STANDINGS_COLS.length} className="bg-transparent py-6 text-center">
                  <span className="gold-glow inline-flex items-center justify-center text-sm font-bold tracking-[0.22em]">
                    <span className="inline-flex gap-5">
                      <span>^</span>
                      <span>^</span>
                      <span>^</span>
                    </span>
                    <span className="mx-6">PLAYOFF QUALIFICATION</span>
                    <span className="inline-flex gap-5">
                      <span>^</span>
                      <span>^</span>
                      <span>^</span>
                    </span>
                  </span>
                </td>
              </tr>
            )}
            {outside.map((team, i) => (
              <TeamRow key={team.id} team={team} top={i === 0} bottom={i === outside.length - 1} />
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
