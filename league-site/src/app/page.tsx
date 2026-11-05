import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-neutral-900 border-b border-neutral-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">NCAA 10 League</h1>
          <div className="flex gap-6 items-center">
            <Link href="/standings" className="hover:text-neutral-300">Standings</Link>
            <Link href="/teams" className="hover:text-neutral-300">Teams</Link>
            <Link href="/players" className="hover:text-neutral-300">Players</Link>
            <Link href="/games" className="hover:text-neutral-300">Games</Link>
            <Link href="/news" className="hover:text-neutral-300">News</Link>
            <span className="text-sm text-neutral-400">{session.user?.name}</span>
            <Link href="/api/auth/signout" className="text-sm bg-neutral-700 hover:bg-neutral-600 px-3 py-1 rounded text-white">
              Logout
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-4xl font-bold mb-4 text-white">Welcome to the League Mastersheet</h2>
        <p className="text-lg text-neutral-300 mb-8">
          Private dashboard for tracking our NCAA 10 Xbox 360 league. Manage teams, rosters, games, stats, and more.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/standings" className="bg-neutral-900 p-6 rounded-lg hover:bg-neutral-800 transition border border-neutral-700">
            <h3 className="text-xl font-semibold text-white mb-2">Standings</h3>
            <p className="text-neutral-300">View current league rankings</p>
          </Link>
          <Link href="/teams" className="bg-neutral-900 p-6 rounded-lg hover:bg-neutral-800 transition border border-neutral-700">
            <h3 className="text-xl font-semibold text-white mb-2">Teams & Rosters</h3>
            <p className="text-neutral-300">Create teams and manage players</p>
          </Link>
          <Link href="/games" className="bg-neutral-900 p-6 rounded-lg hover:bg-neutral-800 transition border border-neutral-700">
            <h3 className="text-xl font-semibold text-white mb-2">Games</h3>
            <p className="text-neutral-300">Log results and view schedule</p>
          </Link>
        </div>
      </main>
    </div>
  );
}