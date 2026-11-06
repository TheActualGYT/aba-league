"use client";

const LINE = "#e5e5e5";
const H = 58;
const W = 236;
const NUM_W = 18;

type T = { name?: string; logo?: string } | null;

function Row({
  x,
  y,
  w,
  seed,
  team,
}: {
  x: number;
  y: number;
  w: number;
  seed?: number;
  team: T;
}) {
  const winner = team?.name?.startsWith("Winner of");
  return (
    <foreignObject x={x} y={y} width={w} height={H / 2 - 1}>
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: winner ? "#d4d4d4" : "#fff",
          fontSize: winner ? 12 : 13,
          fontFamily: "Inter, system-ui, sans-serif",
          overflow: "hidden",
          whiteSpace: "nowrap",
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        {seed ? (
          <span style={{ color: "#a3a3a3", fontSize: 11, flex: "none", width: 14 }}>{seed}</span>
        ) : null}
        {team?.logo && (
          <img
            src={team.logo}
            alt=""
            style={{ width: 16, height: 16, objectFit: "contain", flex: "none" }}
          />
        )}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{team?.name || "TBD"}</span>
      </div>
    </foreignObject>
  );
}

const ofMatch = (n: number): T => ({ name: `Winner of Match ${n}` });

export default function BracketView({ teams }: { teams: any[] }) {
  const sorted = [...teams].sort((a: any, b: any) => a.name.localeCompare(b.name));
  const s: T[] = Array.from({ length: 16 }, (_, i) => sorted[i] || null);

  const x1 = 8;
  const xQ = 320;
  const xS = 632;
  const xF = 944;
  const xC = 1256;

  const y2 = 10;
  const y7 = 100;
  const y1015 = 175;
  const y1312 = 255;
  const y6 = 360;
  const y3 = 450;

  const y4 = 570;
  const y5 = 660;
  const y1114 = 735;
  const y916 = 815;
  const y8 = 920;
  const y1 = 1010;

  const mid = (y: number) => y + H / 2;

  const box = (
    x: number,
    y: number,
    n: number,
    topSeed: number | undefined,
    top: T,
    botSeed: number | undefined,
    bot: T,
    key: string,
    gold = false
  ) => (
    <g key={key}>
      {gold && (
        <rect
          x={x - 2}
          y={y - 2}
          width={W + 4}
          height={H + 4}
          rx={5}
          fill="#facc15"
          fillOpacity={0.18}
          stroke="#facc15"
          strokeWidth={2}
          filter="url(#gold-aura)"
        />
      )}
      <rect x={x} y={y} width={W} height={H} rx={3} fill={gold ? "#3a3214" : "#2a2a2a"} stroke={gold ? "#facc15" : "#a3a3a3"} strokeWidth={gold ? 1.75 : 1.25} />
      <rect x={x + NUM_W} y={y + 1.25} width={W - NUM_W - 1.25} height={H - 2.5} fill={gold ? "#1c180c" : "#141414"} />
      <line x1={x + NUM_W} y1={y} x2={x + NUM_W} y2={y + H} stroke={gold ? "#a38a2a" : "#404040"} />
      <line x1={x + NUM_W} y1={y + H / 2} x2={x + W} y2={y + H / 2} stroke={gold ? "#a38a2a" : "#525252"} />
      <text
        x={x + NUM_W / 2}
        y={y + H / 2 + 3}
        textAnchor="middle"
        fontSize={9}
        fontWeight={500}
        fill={gold ? "#facc15" : "#a3a3a3"}
        fontFamily="Inter, system-ui, sans-serif"
      >
        {n}
      </text>
      <Row x={x + NUM_W} y={y + 1} w={W - NUM_W} seed={topSeed} team={top} />
      <Row x={x + NUM_W} y={y + H / 2} w={W - NUM_W} seed={botSeed} team={bot} />
    </g>
  );

  const link = (xFrom: number, yFrom: number, xTo: number, yTo: number, into: number) => (
    <g key={`${xFrom}-${yFrom}-${xTo}-${yTo}`}>
      <line x1={xFrom} y1={yFrom} x2={xTo} y2={yFrom} stroke={LINE} strokeWidth={1.5} />
      <line x1={xTo} y1={yFrom} x2={xTo} y2={yTo} stroke={LINE} strokeWidth={1.5} />
      <line x1={xTo} y1={yTo} x2={into} y2={yTo} stroke={LINE} strokeWidth={1.5} />
    </g>
  );

  const topFinalY = (mid(y2) + mid(y3)) / 2 - H / 2;
  const botFinalY = (mid(y4) + mid(y1)) / 2 - H / 2;
  const champY = (mid(topFinalY) + mid(botFinalY)) / 2 - H / 2;
  const joinF = xF - 24;
  const joinC = xC - 28;
  const width = xC + W + 24;

  return (
    <svg viewBox={`0 0 ${width} ${y1 + H + 24}`} width={width} height={y1 + H + 24} className="block">
      <defs>
        <filter id="gold-aura" x="-50%" y="-80%" width="200%" height="260%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {box(x1, y1015, 1, 10, s[9], 15, s[14], "m1")}
      {box(x1, y1312, 2, 13, s[12], 12, s[11], "m2")}
      {box(x1, y1114, 3, 11, s[10], 14, s[13], "m3")}
      {box(x1, y916, 4, 9, s[8], 16, s[15], "m4")}

      {box(xQ, y7, 5, 7, s[6], undefined, ofMatch(1), "m5")}
      {box(xQ, y6, 6, 6, s[5], undefined, ofMatch(2), "m6")}
      {box(xQ, y5, 7, 5, s[4], undefined, ofMatch(3), "m7")}
      {box(xQ, y8, 8, 8, s[7], undefined, ofMatch(4), "m8")}

      {box(xS, y2, 9, 2, s[1], undefined, ofMatch(5), "m9")}
      {box(xS, y3, 10, 3, s[2], undefined, ofMatch(6), "m10")}
      {box(xS, y4, 11, 4, s[3], undefined, ofMatch(7), "m11")}
      {box(xS, y1, 12, 1, s[0], undefined, ofMatch(8), "m12")}

      {box(xF, topFinalY, 13, undefined, ofMatch(9), undefined, ofMatch(10), "m13")}
      {box(xF, botFinalY, 14, undefined, ofMatch(11), undefined, ofMatch(12), "m14")}
      {box(xC, champY, 15, undefined, ofMatch(13), undefined, ofMatch(14), "m15", true)}

      {link(x1 + W, mid(y1015), xQ - 28, mid(y7), xQ)}
      {link(x1 + W, mid(y1312), xQ - 28, mid(y6), xQ)}
      {link(x1 + W, mid(y1114), xQ - 28, mid(y5), xQ)}
      {link(x1 + W, mid(y916), xQ - 28, mid(y8), xQ)}

      {link(xQ + W, mid(y7), xS - 28, mid(y2), xS)}
      {link(xQ + W, mid(y6), xS - 28, mid(y3), xS)}
      {link(xQ + W, mid(y5), xS - 28, mid(y4), xS)}
      {link(xQ + W, mid(y8), xS - 28, mid(y1), xS)}

      {link(xS + W, mid(y2), joinF, mid(topFinalY), xF)}
      {link(xS + W, mid(y3), joinF, mid(topFinalY), xF)}
      {link(xS + W, mid(y4), joinF, mid(botFinalY), xF)}
      {link(xS + W, mid(y1), joinF, mid(botFinalY), xF)}

      {link(xF + W, mid(topFinalY), joinC, mid(champY), xC)}
      {link(xF + W, mid(botFinalY), joinC, mid(champY), xC)}
    </svg>
  );
}
