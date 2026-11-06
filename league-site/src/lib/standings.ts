export type Game = {
  id: number;
  date: string;
  home_team_id: number;
  away_team_id: number;
  home_score: number;
  away_score: number;
};

export type StandingsCol = {
  label: string;
  width?: string;
  align: string;
  split?: boolean;
};

export const NAME_COLS: StandingsCol[] = [
  { label: "Rank", width: "56px", align: "text-left" },
  { label: "Team Name", width: undefined, align: "text-left" },
];

export const STAT_COLS: StandingsCol[] = [
  { label: "W", width: "48px", align: "text-center" },
  { label: "L", width: "48px", align: "text-center" },
  { label: "W%", width: "64px", align: "text-center" },
  { label: "GB", width: "56px", align: "text-center" },
  { label: "STRK", width: "64px", align: "text-center" },
  { label: "HOME", width: "72px", align: "text-center", split: true },
  { label: "AWAY", width: "72px", align: "text-center" },
  { label: "PPG", width: "64px", align: "text-center", split: true },
  { label: "OPP PPG", width: "88px", align: "text-center" },
  { label: "DIFF", width: "64px", align: "text-center" },
  { label: "GPA", width: "56px", align: "text-center", split: true },
];

export const STANDINGS_COLS: StandingsCol[] = [...NAME_COLS, ...STAT_COLS];

export function splitClass(col: { split?: boolean }) {
  return col.split ? "col-split" : "";
}

export function formatWinPct(winPct: number) {
  return winPct.toFixed(3).replace(/^0/, "");
}

export function buildTeamRecord(teamId: number, games: Game[]) {
  let wins = 0;
  let losses = 0;
  let pf = 0;
  let pa = 0;
  let homeW = 0;
  let homeL = 0;
  let awayW = 0;
  let awayL = 0;
  const played: { date: string; id: number; win: boolean }[] = [];

  for (const game of games) {
    const isHome = game.home_team_id === teamId;
    const isAway = game.away_team_id === teamId;
    if (!isHome && !isAway) continue;

    const scored = isHome ? game.home_score : game.away_score;
    const allowed = isHome ? game.away_score : game.home_score;
    const win = scored > allowed;

    if (win) wins++;
    else losses++;
    pf += scored;
    pa += allowed;

    if (isHome) {
      if (win) homeW++;
      else homeL++;
    } else if (win) {
      awayW++;
    } else {
      awayL++;
    }

    played.push({ date: game.date || "", id: game.id, win });
  }

  played.sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);

  let streak = "—";
  if (played.length > 0) {
    const lastWin = played[played.length - 1].win;
    let count = 0;
    for (let i = played.length - 1; i >= 0; i--) {
      if (played[i].win !== lastWin) break;
      count++;
    }
    streak = `${lastWin ? "W" : "L"}${count}`;
  }

  const gamesPlayed = wins + losses;
  const winPct = gamesPlayed > 0 ? wins / gamesPlayed : 0;
  const diff = pf - pa;

  return {
    wins,
    losses,
    winPct,
    winPctLabel: formatWinPct(winPct),
    pf,
    pa,
    diff,
    diffLabel: `${diff > 0 ? "+" : ""}${diff}`,
    streak,
    home: `${homeW}-${homeL}`,
    away: `${awayW}-${awayL}`,
    ppg: gamesPlayed ? (pf / gamesPlayed).toFixed(1) : "0.0",
    oppPpg: gamesPlayed ? (pa / gamesPlayed).toFixed(1) : "0.0",
    gpa: "—",
    gamesPlayed,
  };
}

export function gamesBehind(team: { wins: number; losses: number }, leader: { wins: number; losses: number }) {
  const gb = ((leader.wins - team.wins) + (team.losses - leader.losses)) / 2;
  return gb === 0 ? "—" : gb.toFixed(1);
}

export function statValues(team: {
  wins: number;
  losses: number;
  winPctLabel: string;
  gb: string;
  streak: string;
  home: string;
  away: string;
  ppg: string;
  oppPpg: string;
  diffLabel: string;
  gpa: string;
}) {
  return [
    team.wins,
    team.losses,
    team.winPctLabel,
    team.gb,
    team.streak,
    team.home,
    team.away,
    team.ppg,
    team.oppPpg,
    team.diffLabel,
    team.gpa,
  ];
}
