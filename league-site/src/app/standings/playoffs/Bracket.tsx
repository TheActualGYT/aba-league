"use client";

const LINE = "#f3f3f3";
const STROKE = 1.5;
const CURVE = 12;
const H = 58;
const W = 236;
const NUM_W = 18;
const DISPLAY_W = 1420;

type T = { name?: string; logo?: string } | null;

function ordinal(n: number) {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

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

  const y1 = 10;
  const y8 = 100;
  const y916 = 190;
  const y1114 = 270;
  const y5 = 360;
  const y4 = 450;

  const y3 = 570;
  const y6 = 660;
  const y1312 = 750;
  const y1015 = 830;
  const y7 = 920;
  const y2 = 1010;

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

  const elbow = (
    xFrom: number,
    yFrom: number,
    xTo: number,
    yTo: number,
    into: number,
    drawTail: boolean,
    key: string
  ) => {
    const dy = yTo - yFrom;
    if (Math.abs(dy) < 1) {
      return (
        <line key={key} x1={xFrom} y1={yFrom} x2={into} y2={yTo} stroke={LINE} strokeWidth={STROKE} fill="none" />
      );
    }
    const dir = dy > 0 ? 1 : -1;
    const sIn = xTo >= xFrom ? 1 : -1;
    const sOut = into >= xTo ? 1 : -1;
    const rad = Math.min(CURVE, Math.abs(xTo - xFrom) / 2, Math.abs(dy) / 2, Math.abs(into - xTo) / 2);
    const xBendIn = xTo - sIn * rad;
    const yBendIn = yFrom + dir * rad;
    const yBendOut = yTo - dir * rad;
    const xBendOut = xTo + sOut * rad;
    const d = [
      `M ${xFrom} ${yFrom}`,
      `L ${xBendIn} ${yFrom}`,
      `Q ${xTo} ${yFrom} ${xTo} ${yBendIn}`,
      `L ${xTo} ${yBendOut}`,
      `Q ${xTo} ${yTo} ${xBendOut} ${yTo}`,
      drawTail ? `L ${into} ${yTo}` : "",
    ].join(" ");
    return <path key={key} d={d} fill="none" stroke={LINE} strokeWidth={STROKE} />;
  };

  const bye = (y: number, seed: number, meet: number, id: string) => (
    <g key={id}>
      <text
        x={x1}
        y={y + 4}
        fontSize={12}
        fill={LINE}
        fontFamily="Inter, system-ui, sans-serif"
      >
        {ordinal(seed)} Seed Bye
      </text>
      <line
        x1={x1 + 112}
        y1={y}
        x2={meet}
        y2={y}
        stroke={LINE}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray="1.5 6"
      />
    </g>
  );

  const topFinalY = (mid(y1) + mid(y4)) / 2 - H / 2;
  const botFinalY = (mid(y3) + mid(y2)) / 2 - H / 2;
  const champCenter = (mid(topFinalY) + mid(botFinalY)) / 2;
  const champY = champCenter - (H * champScale) / 2;
  const jQ = between(x1 + W, xQ);
  const jS = between(xQ + W, xS);
  const jF = between(xS + W, xF);
  const joinC = xF + W + 36;
  const xC = joinC + 170;
  const layoutW = xC + W * champScale + 24;
  const layoutH = y2 + H + 24;
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

      <svg viewBox={`0 0 ${layoutW} ${layoutH}`} width={DISPLAY_W} height={displayH} className="block" style={{ marginTop: 48 }}>
        <defs>
          <filter id="gold-aura" x="-60%" y="-80%" width="220%" height="260%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {bye(mid(y1), 1, jS + CURVE, "bye-1")}
        {bye(mid(y8), 8, jQ + CURVE, "bye-8")}
        {bye(mid(y5), 5, jQ + CURVE, "bye-5")}
        {bye(mid(y4), 4, jS + CURVE, "bye-4")}
        {bye(mid(y3), 3, jS + CURVE, "bye-3")}
        {bye(mid(y6), 6, jQ + CURVE, "bye-6")}
        {bye(mid(y7), 7, jQ + CURVE, "bye-7")}
        {bye(mid(y2), 2, jS + CURVE, "bye-2")}

        {box(x1, y916, 1, 9, s[8], 16, s[15], "m1")}
        {box(x1, y1114, 2, 11, s[10], 14, s[13], "m2")}
        {box(x1, y1312, 3, 13, s[12], 12, s[11], "m3")}
        {box(x1, y1015, 4, 10, s[9], 15, s[14], "m4")}

        {box(xQ, y8, 5, 8, s[7], undefined, ofMatch(1), "m5")}
        {box(xQ, y5, 6, 5, s[4], undefined, ofMatch(2), "m6")}
        {box(xQ, y6, 7, 6, s[5], undefined, ofMatch(3), "m7")}
        {box(xQ, y7, 8, 7, s[6], undefined, ofMatch(4), "m8")}

        {box(xS, y1, 9, 1, s[0], undefined, ofMatch(5), "m9")}
        {box(xS, y4, 10, 4, s[3], undefined, ofMatch(6), "m10")}
        {box(xS, y3, 11, 3, s[2], undefined, ofMatch(7), "m11")}
        {box(xS, y2, 12, 2, s[1], undefined, ofMatch(8), "m12")}

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

        {elbow(x1 + W, mid(y916), jQ, mid(y8), xQ, true, "e4")}
        {elbow(x1 + W, mid(y1114), jQ, mid(y5), xQ, true, "e3")}
        {elbow(x1 + W, mid(y1312), jQ, mid(y6), xQ, true, "e2")}
        {elbow(x1 + W, mid(y1015), jQ, mid(y7), xQ, true, "e1")}

        {elbow(xQ + W, mid(y8), jS, mid(y1), xS, true, "e8")}
        {elbow(xQ + W, mid(y5), jS, mid(y4), xS, true, "e7")}
        {elbow(xQ + W, mid(y6), jS, mid(y3), xS, true, "e6")}
        {elbow(xQ + W, mid(y7), jS, mid(y2), xS, true, "e5")}

        {elbow(xS + W, mid(y1), jF, mid(topFinalY), xF, true, "e12")}
        {elbow(xS + W, mid(y4), jF, mid(topFinalY), xF, false, "e11")}
        {elbow(xS + W, mid(y3), jF, mid(botFinalY), xF, true, "e10")}
        {elbow(xS + W, mid(y2), jF, mid(botFinalY), xF, false, "e9")}

        {elbow(xF + W, mid(topFinalY), joinC, champCenter, xC, true, "e14")}
        {elbow(xF + W, mid(botFinalY), joinC, champCenter, xC, false, "e13")}
      </svg>
    </div>
  );
}
