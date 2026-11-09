export type CountingLine = {
  pts?: number;
  ast?: number;
  orb?: number;
  drb?: number;
  reb?: number;
  stl?: number;
  blk?: number;
  to?: number;
  pf?: number;
  fgm?: number;
  fga?: number;
  tpm?: number;
  tpa?: number;
  ftm?: number;
  fta?: number;
};

export type SeasonLine = {
  gp: number;
  pts: number;
  ast: number;
  reb: number;
  stl: number;
  blk: number;
  to: number;
  pf: number;
  fgm: number;
  fga: number;
  tpm: number;
  tpa: number;
  ftm: number;
  fta: number;
  twom: number;
  twoa: number;
  gmsc: number;
};

const n = (value?: number) => (Number.isFinite(value) ? Number(value) : 0);

function boards(line: CountingLine) {
  const orb = n(line.orb);
  const drb = line.drb == null && line.orb == null ? n(line.reb) : n(line.drb);
  return { orb, drb, reb: line.orb == null && line.drb == null ? n(line.reb) : orb + drb };
}

/** Hollinger Game Score for one game, or for per-game averages since the formula is linear. */
export function gameScore(line: CountingLine) {
  const { orb, drb } = boards(line);
  const fgm = n(line.fgm);
  const fga = n(line.fga);
  const ftm = n(line.ftm);
  const fta = n(line.fta);
  return (
    n(line.pts) +
    0.4 * fgm -
    0.7 * fga -
    0.4 * (fta - ftm) +
    0.7 * orb +
    0.3 * drb +
    n(line.stl) +
    0.7 * n(line.ast) +
    0.7 * n(line.blk) -
    0.4 * n(line.pf) -
    n(line.to)
  );
}

export function emptySeason(): SeasonLine {
  return {
    gp: 0,
    pts: 0,
    ast: 0,
    reb: 0,
    stl: 0,
    blk: 0,
    to: 0,
    pf: 0,
    fgm: 0,
    fga: 0,
    tpm: 0,
    tpa: 0,
    ftm: 0,
    fta: 0,
    twom: 0,
    twoa: 0,
    gmsc: 0,
  };
}

export function addLine(total: SeasonLine, line: CountingLine) {
  const shot = boards(line);
  total.gp += 1;
  total.pts += n(line.pts);
  total.ast += n(line.ast);
  total.reb += shot.reb;
  total.stl += n(line.stl);
  total.blk += n(line.blk);
  total.to += n(line.to);
  total.pf += n(line.pf);
  total.fgm += n(line.fgm);
  total.fga += n(line.fga);
  total.tpm += n(line.tpm);
  total.tpa += n(line.tpa);
  total.ftm += n(line.ftm);
  total.fta += n(line.fta);
  total.twom += n(line.fgm) - n(line.tpm);
  total.twoa += n(line.fga) - n(line.tpa);
  total.gmsc += gameScore(line);
}

export function perGame(total: SeasonLine): SeasonLine {
  if (!total.gp) return { ...total };
  const games = total.gp;
  const averaged = { ...total };
  (Object.keys(averaged) as (keyof SeasonLine)[]).forEach(key => {
    if (key === "gp") return;
    averaged[key] = total[key] / games;
  });
  return averaged;
}
