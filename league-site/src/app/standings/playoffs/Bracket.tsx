"use client";

const LINE = "#e5e5e5";
const H = 58;
const W = 220;

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
  return (
    <foreignObject x={x} y={y} width={w} height={H / 2 - 1}>
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: team?.name === "Winner" ? "#d4d4d4" : "#fff",
          fontSize: 13,
          fontFamily: "Inter, system-ui, sans-serif",
          overflow: "hidden",
          whiteSpace: "nowrap",
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        {seed ? (
          <span style={{ color: "#a3a3a3", fontSize: 11, flex: "none", width: 14 }}>{seed}</span>
        ) : (
          <span style={{ width: 14, flex: "none" }} />
        )}
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

const WIN: T = { name: "Winner" };

export default function BracketView({ teams }: { teams: any[] }) {
  const sorted = [...teams].sort((a: any, b: any) => a.name.localeCompare(b.name));
  const s: T[] = Array.from({ length: 16 }, (_, i) => sorted[i] || null);

  const x1 = 8;
  const xQ = 300;
  const xS = 590;
  const xF = 880;

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
    topSeed: number | undefined,
    top: T,
    botSeed: number | undefined,
    bot: T,
    key: string
  ) => (
    <g key={key}>
      <rect x={x} y={y} width={W} height={H} rx={3} fill="#141414" stroke="#a3a3a3" strokeWidth={1.25} />
      <line x1={x} y1={y + H / 2} x2={x + W} y2={y + H / 2} stroke="#525252" />
      <Row x={x} y={y + 1} w={W} seed={topSeed} team={top} />
      <Row x={x} y={y + H / 2} w={W} seed={botSeed} team={bot} />
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
  const champY = (mid(topFinalY) + mid(botFinalY)) / 2;
  const joinF = xF - 24;
  const champX = xF + W + 36;

  return (
    <svg viewBox={`0 0 ${champX + 120} ${y1 + H + 24}`} width={champX + 120} height={y1 + H + 24} className="block">
      {box(x1, y1015, 10, s[9], 15, s[14], "r-10")}
      {box(x1, y1312, 13, s[12], 12, s[11], "r-13")}
      {box(x1, y1114, 11, s[10], 14, s[13], "r-11")}
      {box(x1, y916, 9, s[8], 16, s[15], "r-9")}

      {box(xQ, y7, 7, s[6], undefined, WIN, "q-7")}
      {box(xQ, y6, 6, s[5], undefined, WIN, "q-6")}
      {box(xQ, y5, 5, s[4], undefined, WIN, "q-5")}
      {box(xQ, y8, 8, s[7], undefined, WIN, "q-8")}

      {box(xS, y2, 2, s[1], undefined, WIN, "s-2")}
      {box(xS, y3, 3, s[2], undefined, WIN, "s-3")}
      {box(xS, y4, 4, s[3], undefined, WIN, "s-4")}
      {box(xS, y1, 1, s[0], undefined, WIN, "s-1")}

      {box(xF, topFinalY, undefined, WIN, undefined, WIN, "f-top")}
      {box(xF, botFinalY, undefined, WIN, undefined, WIN, "f-bot")}

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

      <line x1={xF + W} y1={mid(topFinalY)} x2={champX - 16} y2={mid(topFinalY)} stroke={LINE} strokeWidth={1.5} />
      <line x1={xF + W} y1={mid(botFinalY)} x2={champX - 16} y2={mid(botFinalY)} stroke={LINE} strokeWidth={1.5} />
      <line x1={champX - 16} y1={mid(topFinalY)} x2={champX - 16} y2={mid(botFinalY)} stroke={LINE} strokeWidth={1.5} />
      <line x1={champX - 16} y1={champY} x2={champX} y2={champY} stroke={LINE} strokeWidth={1.5} />
      <rect x={champX} y={champY - 16} width={108} height={32} rx={2} fill="#facc15" />
      <text
        x={champX + 54}
        y={champY + 5}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="#111"
        fontFamily="Inter, system-ui, sans-serif"
      >
        CHAMPIONS
      </text>
    </svg>
  );
}
