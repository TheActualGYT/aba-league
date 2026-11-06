import db from "@/lib/db";
import BracketView from "./Bracket";

export const dynamic = "force-dynamic";

export default async function PlayoffPicturePage() {
  const data = await db.load();
  const teams = data.teams || [];

  return (
    <main className="px-6 py-6">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-6">
        <div />
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 text-white">PLAYOFF BRACKET</h2>
          <p className="text-neutral-400 text-sm">
            Seeds 1–4 get 2 byes · Seeds 5–8 get 1 bye · Seeds 9–16 play in Round 1
          </p>
        </div>
        <div className="champ-box justify-self-end">
          <div className="champ-box-label">CHAMPION:</div>
          <div className="champ-box-name">TBD</div>
        </div>
      </div>

      {teams.length < 16 && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 mb-6 text-center text-neutral-400 text-sm">
          Showing current top {teams.length} of 16 playoff spots
        </div>
      )}

      <div className="overflow-auto no-scrollbar h-[calc(100vh-11rem)] flex">
        <div className="m-auto">
          <BracketView teams={teams} />
        </div>
      </div>
    </main>
  );
}
