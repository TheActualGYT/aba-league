"use client";

const LINE = "#e5e5e5";
const H = 58;
const W = 236;
const NUM_W = 18;
const DISPLAY_W = 1420;

type T = { name?: string; logo?: string } | null;

function Row({
  x,
  y,
  w,
  h,
  seed,
  team,
  scale = 1,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  seed?: number;
  team: T;
  scale?: number;
}) {
  const winner = team?.name?.startsWith("Winner of");
  return (
    <foreignObject x={x} y={y} width={w} height={h / 2 - 1}>
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 6 * scale,
          color: winner ? "#d4d4d4" : "#fff",
          fontSize: (winner ? 12 : 13) * scale,
          fontFamily: "Inter, system-ui, sans-serif",
          overflow: "hidden",
          whiteSpace: "nowrap",
          paddingLeft: 8 * scale,
          paddingRight: 8 * scale,
        }}
      >
        {seed ? (
          <span style={{ color: "#a3a3a3", fontSize: 11 * scale, flex: "none", width: 14 * scale }}>{seed}</span>
        ) : null}
        {team?.logo && (
          <img
            src={team.logo}
            alt=""
            style={{ width: 16 * scale, height: 16 * scale, objectFit: "contain", flex: "none" }}
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
  const champScale = 1.5;

  const y2 = 10;
  const y7 = 100;
  const y1015 = 190;
  const y1312 = 270;
  const y6 = 360;
  const y3 = 450;

  const y4 = 570;
  const y5 = 660;
  const y1114 = 750;
  const y916 = 830;
  const y8 = 920;
  const y1 = 1010;

  const mid = (y: number) => y + H / 2;
  const between = (a: number, b: number) => (a + b) / 2;

  const box = (
    x: number,
    y: number,
    n: number,
    topSeed: number | undefined,
    top: T,
    botSeed: number | undefined,
    bot: T,
    key: string,
    gold = false,
    scale = 1
  ) => {
    const w = W * scale;
    const h = H * scale;
    const numW = NUM_W * scale;
    return (
      <g key={key}>
        {gold && (
          <rect
            x={x - 4}
            y={y - 4}
            width={w + 8}
            height={h + 8}
            rx={8}
            fill="#facc15"
            fillOpacity={0.22}
            stroke="#facc15"
            strokeWidth={2}
            filter="url(#gold-aura)"
          >
            <animate attributeName="opacity" values="0.35;1;0.35" dur="2.8s" repeatCount="indefinite" />
          </rect>
        )}
        <rect x={x} y={y} width={w} height={h} rx={4} fill={gold ? "#3a3214" : "#2a2a2a"} stroke={gold ? "#facc15" : "#a3a3a3"} strokeWidth={gold ? 1.75 : 1.25} />
        <rect x={x + numW} y={y + 1.25} width={w - numW - 1.25} height={h - 2.5} fill={gold ? "#1c180c" : "#141414"} />
        <line x1={x + numW} y1={y} x2={x + numW} y2={y + h} stroke={gold ? "#a38a2a" : "#404040"} />
        <line x1={x + numW} y1={y + h / 2} x2={x + w} y2={y + h / 2} stroke={gold ? "#a38a2a" : "#525252"} />
        <text
          x={x + numW / 2}
          y={y + h / 2 + 3 * scale}
          textAnchor="middle"
          fontSize={9 * scale}
          fontWeight={500}
          fill={gold ? "#facc15" : "#a3a3a3"}
          fontFamily="Inter, system-ui, sans-serif"
        >
          {n}
        </text>
        <Row x={x + numW} y={y + 1} w={w - numW} h={h} seed={topSeed} team={top} scale={scale} />
        <Row x={x + numW} y={y + h / 2} w={w - numW} h={h} seed={botSeed} team={bot} scale={scale} />
      </g>
    );
  };

  const link = (xFrom: number, yFrom: number, xTo: number, yTo: number, into: number) => (
    <g key={`${xFrom}-${yFrom}-${xTo}-${yTo}`}>
      <line x1={xFrom} y1={yFrom} x2={xTo} y2={yFrom} stroke={LINE} strokeWidth={1.5} />
      <line x1={xTo} y1={yFrom} x2={xTo} y2={yTo} stroke={LINE} strokeWidth={1.5} />
      <line x1={xTo} y1={yTo} x2={into} y2={yTo} stroke={LINE} strokeWidth={1.5} />
    </g>
  );

  const topFinalY = (mid(y2) + mid(y3)) / 2 - H / 2;
  const botFinalY = (mid(y4) + mid(y1)) / 2 - H / 2;
  const champCenter = (mid(topFinalY) + mid(botFinalY)) / 2;
  const champY = champCenter - (H * champScale) / 2;
  const jQ = between(x1 + W, xQ);
  const jS = between(xQ + W, xS);
  const jF = between(xS + W, xF);
  const joinC = xF + W + 36;
  const xC = joinC + 170;
  const layoutW = xC + W * champScale + 24;
  const layoutH = y1 + H + 24;
  const fit = DISPLAY_W / layoutW;
  const displayH = layoutH * fit;

  const rounds = [
    { label: "First Round", x: x1 + W / 2 },
    { label: "Second Round", x: xQ + W / 2 },
    { label: "Elite Eight", x: xS + W / 2 },
    { label: "Final Four", x: xF + W / 2 },
  ];

  return (
    <div style={{ width: DISPLAY_W, margin: "0 auto", position: "relative" }}>
      <div
        className="sticky top-0 z-20"
        style={{
          height: 32,
          width: DISPLAY_W,
          background: "#0a0a0a",
          borderBottom: "1px solid #262626",
        }}
      >
        {rounds.map((round) => (
          <div
            key={round.label}
            style={{
              position: "absolute",
              left: round.x * fit,
              top: 0,
              height: 32,
              display: "flex",
              alignItems: "center",
              transform: "translateX(-50%)",
              color: "#e5e5e5",
              fontSize: Math.max(11, 13 * fit),
              fontWeight: 600,
              letterSpacing: "0.03em",
              fontFamily: "Inter, system-ui, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {round.label}
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${layoutW} ${layoutH}`} width={DISPLAY_W} height={displayH} className="block">
        <defs>
          <filter id="gold-aura" x="-60%" y="-80%" width="220%" height="260%">
            <feGaussianBlur stdDeviation="7" result="blur" />
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

        <text
          x={xC + (W * champScale) / 2}
          y={champY - 14}
          textAnchor="middle"
          fontSize={16}
          fontWeight={600}
          fill="#facc15"
          fontFamily="Inter, system-ui, sans-serif"
        >
          Championship Game
        </text>
        {box(xC, champY, 15, undefined, ofMatch(13), undefined, ofMatch(14), "m15", true, champScale)}

        {link(x1 + W, mid(y1015), jQ, mid(y7), xQ)}
        {link(x1 + W, mid(y1312), jQ, mid(y6), xQ)}
        {link(x1 + W, mid(y1114), jQ, mid(y5), xQ)}
        {link(x1 + W, mid(y916), jQ, mid(y8), xQ)}

        {link(xQ + W, mid(y7), jS, mid(y2), xS)}
        {link(xQ + W, mid(y6), jS, mid(y3), xS)}
        {link(xQ + W, mid(y5), jS, mid(y4), xS)}
        {link(xQ + W, mid(y8), jS, mid(y1), xS)}

        {link(xS + W, mid(y2), jF, mid(topFinalY), xF)}
        {link(xS + W, mid(y3), jF, mid(topFinalY), xF)}
        {link(xS + W, mid(y4), jF, mid(botFinalY), xF)}
        {link(xS + W, mid(y1), jF, mid(botFinalY), xF)}

        {link(xF + W, mid(topFinalY), joinC, champCenter, xC)}
        {link(xF + W, mid(botFinalY), joinC, champCenter, xC)}
      </svg>
    </div>
  );
}
