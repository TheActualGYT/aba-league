"use client";

export default function BracketView({ teams }: { teams: any[] }) {
  const sorted = [...teams].sort((a, b) => a.name.localeCompare(b.name));
  const seeds = Array.from({ length: 16 }, (_, i) => sorted[i] || null);

  const name = (idx: number) => seeds[idx]?.name || "TBD";
  const logo = (idx: number) => seeds[idx]?.logo;

  const Slot = ({ idx, seed }: { idx?: number; seed?: number }) => (
    <div className="bg-neutral-900 border border-neutral-600 rounded px-2 py-1.5 flex items-center gap-2 w-44 h-8">
      {seed && <span className="text-neutral-500 text-xs w-4">{seed}</span>}
      {idx !== undefined && logo(idx) && <img src={logo(idx)} alt="" className="h-4 w-4 object-contain" />}
      <span className="text-white text-xs font-medium truncate">{idx !== undefined ? name(idx) : "Winner"}</span>
    </div>
  );

  return (
    <div className="flex gap-1 items-start text-white">
      {/* Column 1: Round 1 matchups */}
      <div className="flex flex-col" style={{ gap: "8px" }}>
        <div className="text-xs text-neutral-500 text-center mb-1">Round 1</div>
        {/* 10 vs 15 */}
        <div className="space-y-0.5"><Slot idx={9} seed={10} /><Slot idx={14} seed={15} /></div>
        <div className="h-8" />
        {/* 13 vs 12 */}
        <div className="space-y-0.5"><Slot idx={12} seed={13} /><Slot idx={11} seed={12} /></div>
        <div className="h-8" />
        {/* 11 vs 14 */}
        <div className="space-y-0.5"><Slot idx={10} seed={11} /><Slot idx={13} seed={14} /></div>
        <div className="h-8" />
        {/* 9 vs 16 */}
        <div className="space-y-0.5"><Slot idx={8} seed={9} /><Slot idx={15} seed={16} /></div>
      </div>

      {/* Connector */}
      <div className="flex flex-col justify-around pt-6" style={{ width: "16px", height: "400px" }}>
        <div className="border-t border-r border-neutral-500 h-8" />
        <div className="border-t border-r border-neutral-500 h-8" />
        <div className="border-t border-r border-neutral-500 h-8" />
        <div className="border-t border-r border-neutral-500 h-8" />
      </div>

      {/* Column 2: Seeds 5-8 (1 bye) */}
      <div className="flex flex-col" style={{ gap: "8px" }}>
        <div className="text-xs text-neutral-500 text-center mb-1">Quarterfinals</div>
        <Slot idx={6} seed={7} />
        <Slot />
        <div className="h-4" />
        <Slot idx={5} seed={6} />
        <Slot />
        <div className="h-4" />
        <Slot idx={4} seed={5} />
        <Slot />
        <div className="h-4" />
        <Slot idx={7} seed={8} />
        <Slot />
      </div>

      {/* Connector */}
      <div className="flex flex-col justify-around pt-6" style={{ width: "16px", height: "400px" }}>
        <div className="border-t border-r border-neutral-500 h-12" />
        <div className="border-t border-r border-neutral-500 h-12" />
        <div className="border-t border-r border-neutral-500 h-12" />
        <div className="border-t border-r border-neutral-500 h-12" />
      </div>

      {/* Column 3: Seeds 1-4 (2 byes) */}
      <div className="flex flex-col" style={{ gap: "8px" }}>
        <div className="text-xs text-neutral-500 text-center mb-1">Semifinals</div>
        <Slot idx={1} seed={2} />
        <Slot />
        <div className="h-8" />
        <Slot idx={2} seed={3} />
        <Slot />
        <div className="h-8" />
        <Slot idx={3} seed={4} />
        <Slot />
        <div className="h-8" />
        <Slot idx={0} seed={1} />
        <Slot />
      </div>

      {/* Connector */}
      <div className="flex flex-col justify-around pt-6" style={{ width: "16px", height: "400px" }}>
        <div className="border-t border-r border-neutral-500 h-16" />
        <div className="border-t border-r border-neutral-500 h-16" />
      </div>

      {/* Column 4: Finals */}
      <div className="flex flex-col" style={{ gap: "8px" }}>
        <div className="text-xs text-neutral-500 text-center mb-1">Finals</div>
        <div className="h-16" />
        <Slot />
        <Slot />
        <div className="h-16" />
        <Slot />
        <Slot />
      </div>

      {/* Connector to Champion */}
      <div className="flex flex-col justify-center pt-6" style={{ width: "16px", height: "400px" }}>
        <div className="border-t border-r border-neutral-500 h-20" />
      </div>

      {/* Champion */}
      <div className="flex flex-col justify-center" style={{ height: "400px" }}>
        <div className="bg-yellow-400 text-black font-bold text-xs px-3 py-2 rounded text-center">
          CHAMPIONS
        </div>
      </div>
    </div>
  );
}