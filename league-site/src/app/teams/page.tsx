import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import Link from "next/link";
import TeamForm from "@/components/TeamForm";

export default async function TeamsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const data = db.load();
  const teams = data.teams.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen">
      <nav className="bg-neutral-900 border-b border-neutral-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">NCAA 10 League</Link>
          <Link href="/" className="text-sm hover:text-neutral-300">← Back</Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6 text-white">Teams & Rosters</h2>
        <TeamForm />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => (
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