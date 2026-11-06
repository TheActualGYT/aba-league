import db from "@/lib/db";
import BracketView from "./Bracket";

export const dynamic = "force-dynamic";

export default async function PlayoffPicturePage() {
  const data = await db.load();
  const teams = data.teams || [];

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-2 text-white text-center">Playoff Picture</h2>
      <p className="text-neutral-400 text-center mb-8 text-sm">
        Seeds 1–4 get 2 byes · Seeds 5–8 get 1 bye · Seeds 9–16 play in Round 1
      </p>

      {teams.length < 16 && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 mb-6 text-center text-neutral-400 text-sm">
          Showing current top {teams.length} of 16 playoff spots
        </div>
      )}

      <div className="overflow-x-auto pb-4 flex justify-center">
        <BracketView teams={teams} />
      </div>
    </main>
  );
}
