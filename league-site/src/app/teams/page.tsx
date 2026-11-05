import db from "@/lib/db";
import Link from "next/link";
import TeamForm from "@/components/TeamForm";

export default async function TeamsPage() {
  let data: any = null;
  let error = "";
  try {
    data = await db.load();
  } catch (err: any) {
    error = err.message;
  }

  const teams = data?.teams || [];
  const envKeys = Object.keys(process.env).filter(k =>
    k.includes("URL") || k.includes("DATABASE") || k.includes("POSTGRES") || k.includes("STORAGE")
  );

  return (
    <div className="min-h-screen">
      <nav className="bg-neutral-900 border-b border-neutral-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">ABA</Link>
          <Link href="/" className="text-sm hover:text-neutral-300">← Back</Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6 text-white">Teams & Rosters</h2>

        {/* Debug box */}
        <div className="bg-neutral-800 border border-neutral-600 rounded p-4 mb-6 text-xs text-neutral-300">
          <p><strong>Debug:</strong></p>
          <p>Teams loaded: {teams.length}</p>
          <p>Error: {error || "none"}</p>
          <p>Env vars found: {envKeys.join(", ") || "none"}</p>
        </div>

        <TeamForm />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team: any) => (
            <div key={team.id} className="bg-neutral-900 p-4 rounded-lg border border-neutral-700">
              <h3 className="text-xl font-semibold text-white">{team.name}</h3>
              <p className="text-neutral-400">{team.abbreviation}</p>
              <Link href={`/teams/${team.id}`} className="text-sm text-neutral-300 hover:underline mt-2 inline-block">
                View Roster →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}