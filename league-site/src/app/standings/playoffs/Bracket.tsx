"use client";

const LINE = "#e5e5e5";

type T = { name?: string; logo?: string } | null;

function Row({
  x,
  y,
  w,
  h,
  seed,
  team,
  align,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  seed: number;
  team: T;
  align: "left" | "right";
}) {
  return (
    <foreignObject x={x} y={y} width={w} height={h}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: align === "right" ? "flex-end" : "flex-start",
          gap: 6,
          color: "#fff",
          fontSize: 13,
          fontFamily: "Inter, system-ui, sans-serif",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: "#a3a3a3", fontSize: 11, flex: "none" }}>{seed}</span>
        {team?.logo && (
          <img
            src={team.logo}
            alt=""
            style={{ width: 16, height: 16, objectFit: "contain", flex: "none" }}
          />
        )}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {team?.name || "TBD"}
        </span>
      </div>
    </foreignObject>
  );
}

export default function BracketView({ teams }: { teams: any[] }) {
  const sorted = [...teams].sort((a: any, b: any) => a.name.localeCompare(b.name));
  const s: T[] = Array.from({ length: 16 }, (_, i) => sorted[i] || null);

  const r1x = 8;
  const r1w = 230;
  const r1r = r1x + r1w;
  const qL = 258;
  const qR = 520;
  const sL = 340;
  const sR = 730;
  const outX = 900;

  const H = (x1: number, x2: number, y: number) => (
    <line key={`${x1}-${x2}-${y}`} x1={x1} y1={y} x2={x2} y2={y} stroke={LINE} strokeWidth={1.5} />
  );
  const V = (x: number, y1: number, y2: number) => (
    <line key={`${x}-${y1}-${y2}`} x1={x} y1={y1} x2={x} y2={y2} stroke={LINE} strokeWidth={1.5} />
  );

  const box = (x: number, y: number, top: number, bot: number) => {
    const h = 58;
    return (
      <g key={`${top}-${bot}`}>
        <rect x={x} y={y} width={r1w} height={h} rx={3} fill="#141414" stroke="#a3a3a3" strokeWidth={1.25} />
        <line x1={x} y1={y + h / 2} x2={x + r1w} y2={y + h / 2} stroke="#525252" />
        <Row x={x + 8} y={y + 1} w={r1w - 16} h={h / 2 - 1} seed={top + 1} team={s[top]} align="left" />
        <Row x={x + 8} y={y + h / 2} w={r1w - 16} h={h / 2 - 1} seed={bot + 1} team={s[bot]} align="left" />
      </g>
    );
  };

  const bye = (x: number, y: number, w: number, idx: number) => (
    <Row key={idx} x={x} y={y - 18} w={w} h={18} seed={idx + 1} team={s[idx]} align="right" />
  );

  // Top half
  const moY = 36;
  const dukeY = 92;
  const boxA = 116; // 10 vs 15, center 145
  const boxB = 196; // 13 vs 12, center 225
  const marqY = 282;
  const texY = 352;
  const topMid = (moY + texY) / 2;

  // Bottom half
  const bufY = 440;
  const bayY = 496;
  const boxC = 520; // 11 vs 14, center 549
  const boxD = 600; // 9 vs 16, center 629
  const michY = 686;
  const kenY = 756;
  const botMid = (bufY + kenY) / 2;
  const champY = (topMid + botMid) / 2;

  return (
    <svg viewBox="0 0 1060 800" width="1060" height="800" className="block">
      {/* Round 1 boxes */}
      {box(r1x, boxA, 9, 14)}
      {box(r1x, boxB, 12, 11)}
      {box(r1x, boxC, 10, 13)}
      {box(r1x, boxD, 8, 15)}

      {/* 10/15 up into 7 */}
      {H(r1r, qL, boxA + 29)}
      {V(qL, boxA + 29, dukeY)}
      {H(qL, qR, dukeY)}
      {bye(qL, dukeY, qR - qL - 16, 6)}

      {/* 13/12 down into 6 */}
      {H(r1r, qL, boxB + 29)}
      {V(qL, boxB + 29, marqY)}
      {H(qL, qR, marqY)}
      {bye(qL, marqY, qR - qL - 16, 5)}

      {/* 7 up into 2, 6 down into 3 */}
      {V(qR, dukeY, moY)}
      {H(sL, sR, moY)}
      {bye(sL, moY, qR - sL - 8, 1)}

      {V(qR, marqY, texY)}
      {H(sL, sR, texY)}
      {bye(sL, texY, qR - sL - 8, 2)}

      {V(sR, moY, texY)}
      {H(sR, outX, topMid)}

      {/* 11/14 up into 5 */}
      {H(r1r, qL, boxC + 29)}
      {V(qL, bayY, boxC + 29)}
      {H(qL, qR, bayY)}
      {bye(qL, bayY, qR - qL - 16, 4)}

      {/* 9/16 down into 8 */}
      {H(r1r, qL, boxD + 29)}
      {V(qL, boxD + 29, michY)}
      {H(qL, qR, michY)}
      {bye(qL, michY, qR - qL - 16, 7)}

      {/* 5 up into 4, 8 down into 1 */}
      {V(qR, bayY, bufY)}
      {H(sL, sR, bufY)}
      {bye(sL, bufY, qR - sL - 8, 3)}

      {V(qR, michY, kenY)}
      {H(sL, sR, kenY)}
      {bye(sL, kenY, qR - sL - 8, 0)}

      {V(sR, bufY, kenY)}
      {H(sR, outX, botMid)}

      {/* Championship */}
      {V(outX, topMid, botMid)}
      {H(outX, 940, champY)}
      <rect x={948} y={champY - 16} width={100} height={32} rx={2} fill="#facc15" />
      <text
        x={998}
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
