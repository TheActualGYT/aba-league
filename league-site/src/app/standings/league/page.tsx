import db from "@/lib/db";

export const dynamic = "force-dynamic";

const COLS = [
  { label: "Rank", width: "72px", align: "text-left" },
  { label: "Team Name", width: undefined, align: "text-left" },
  { label: "W", width: "64px", align: "text-center" },
  { label: "L", width: "64px", align: "text-center" },
  { label: "Win %", width: "84px", align: "text-center" },
  { label: "GB", width: "72px", align: "text-center" },
  { label: "Pts Scored", width: "120px", align: "text-center" },
  { label: "Pts Allowed", width: "124px", align: "text-center" },
  { label: "Diff", width: "80px", align: "text-center" },
];

function cellClass(index: number, edges: { top?: boolean; bottom?: boolean }) {
  const left = index === 0;
  const right = index === COLS.length - 1;
  return [
    "px-3 py-3 bg-neutral-900 border-neutral-700",
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
  return (
    <tr>
      <td className={`${cellClass(0, edges)} ${team.seed <= 16 ? "label-glow text-white font-semibold" : ""}`}>{team.seed}</td>
      <td className={`${cellClass(1, edges)} font-semibold text-white`}>
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
      <td className={`${cellClass(2, edges)} text-center`}>{team.wins}</td>
      <td className={`${cellClass(3, edges)} text-center`}>{team.losses}</td>
      <td className={`${cellClass(4, edges)} text-center`}>{team.winPct.toFixed(3).replace(/^0/, "")}</td>
      <td className={`${cellClass(5, edges)} text-center`}>{team.gb}</td>
      <td className={`${cellClass(6, edges)} text-center`}>{team.pf}</td>
      <td className={`${cellClass(7, edges)} text-center`}>{team.pa}</td>
      <td className={`${cellClass(8, edges)} text-center`}>{team.diff > 0 ? "+" : ""}{team.diff}</td>
    </tr>
  );
}

export default async function LeagueStandingsPage() {
  const data = await db.load();
  const teams = data.teams;
  const games = data.games;

  const ranked = [...teams]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((team, i) => ({ ...team, overallRank: i + 1 }));

  const standings = ranked.map(team => {
    let wins = 0, losses = 0, pf = 0, pa = 0;
    games.forEach(game => {
      if (game.home_team_id === team.id) {
        if (game.home_score > game.away_score) wins++;
        else losses++;
        pf += game.home_score;
        pa += game.away_score;
      } else if (game.away_team_id === team.id) {
        if (game.away_score > game.home_score) wins++;
        else losses++;
        pf += game.away_score;
        pa += game.home_score;
      }
    });
    const gamesPlayed = wins + losses;
    const winPct = gamesPlayed > 0 ? wins / gamesPlayed : 0;
    return { ...team, wins, losses, pf, pa, diff: pf - pa, winPct, gamesPlayed };
  });

  const hasGames = games.length > 0;
  const sorted = [...standings].sort((a, b) => {
    if (hasGames) {
      return b.wins - a.wins || a.losses - b.losses || b.diff - a.diff;
    }
    return a.overallRank - b.overallRank;
  });

  const leaderWins = sorted[0]?.wins || 0;
  const leaderLosses = sorted[0]?.losses || 0;
  const withGB = sorted.map((team, i) => {
    const gb = ((leaderWins - team.wins) + (team.losses - leaderLosses)) / 2;
    return { ...team, seed: i + 1, gb: gb === 0 ? "—" : gb.toFixed(1) };
  });

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
            {COLS.map(col => (
              <col key={col.label} style={col.width ? { width: col.width } : undefined} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {COLS.map((col, index) => (
                <th
                  key={col.label}
                  className={`sticky top-[81px] z-30 px-3 py-3 bg-neutral-800 text-neutral-300 text-sm font-semibold whitespace-nowrap border-y border-neutral-700 ${col.align} ${
                    index === 0 ? "border-l rounded-tl-lg" : ""
                  } ${index === COLS.length - 1 ? "border-r rounded-tr-lg" : ""}`}
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
                <td colSpan={9} className="bg-transparent py-6 text-center">
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
