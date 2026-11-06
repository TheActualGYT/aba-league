import db from "@/lib/db";
import BracketView from "./Bracket";

export const dynamic = "force-dynamic";

export default async function PlayoffPicturePage() {
  const data = await db.load();
  const teams = data.teams || [];

  return (
    <main className="flex flex-col h-[calc(100vh-5.125rem)]">
      <div className="shrink-0 relative px-6 pt-6 pb-5" style={{ background: "#111111" }}>
        <div
          className="absolute text-neutral-400 leading-tight"
          style={{ left: "max(24px, calc(50% - 703.56px))", top: 18, fontSize: 12 }}
        >
          <div style={{ marginBottom: 10 }}>1st Annual</div>
          <div>Dates: TBD</div>
          <div>Finals: TBD</div>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <h2 className="label-glow text-3xl font-bold mb-2 text-white">PLAYOFF BRACKET</h2>
            <p className="text-neutral-400 text-sm">
              Seeds 1–4 get 2 byes · Seeds 5–8 get 1 bye · Seeds 9–16 play in Round 1
            </p>
          </div>
          <div className="champ-box absolute right-0 top-1/2 -translate-y-1/2">
            <div className="champ-box-label">CHAMPION:</div>
            <div className="champ-box-name">TBD</div>
          </div>
        </div>

        {teams.length < 16 && (
          <div className="max-w-7xl mx-auto bg-neutral-900 border border-neutral-700 rounded-lg p-3 mt-5 text-center text-neutral-400 text-sm">
            Showing current top {teams.length} of 16 playoff spots
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <BracketView teams={teams} />
      </div>
    </main>
  );
}
