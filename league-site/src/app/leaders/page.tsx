import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LeadersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const categories = [
    { key: "ppg", label: "Points Per Game", color: "border-green-500", text: "text-green-400" },
    { key: "apg", label: "Assists Per Game", color: "border-purple-500", text: "text-purple-400" },
    { key: "rpg", label: "Rebounds Per Game", color: "border-blue-500", text: "text-blue-400" },
    { key: "gpa", label: "GPA", color: "border-white", text: "text-white" },
  ];

  return (
    <div className="min-h-screen">
      <nav className="bg-neutral-900 border-b border-neutral-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">ABA</Link>
          <Link href="/" className="text-sm hover:text-neutral-300">← Back</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-white mb-8">League Leaders</h2>

        <div className="space-y-10">
          {categories.map(cat => (
            <div key={cat.key}>
              <h3 className={`text-2xl font-semibold mb-4 ${cat.text}`}>{cat.label}</h3>
              <div className={`bg-neutral-900 border-2 ${cat.color} rounded-lg p-6`}>
                {/* #1 bigger */}
                <div className="text-center mb-6 pb-6 border-b border-neutral-700">
                  <div className="text-neutral-500 text-lg">#1</div>
                  <div className="text-3xl font-bold text-white mt-2">—</div>
                  <div className="text-neutral-400 mt-1">No stats yet</div>
                </div>
                {/* 2-5 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {[2, 3, 4, 5].map(rank => (
                    <div key={rank}>
                      <div className="text-neutral-500">#{rank}</div>
                      <div className="text-white font-medium mt-1">—</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}