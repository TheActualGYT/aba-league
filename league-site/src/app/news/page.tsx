import db from "@/lib/db";
import Link from "next/link";

export default async function NewsPage() {
  const data = db.load();
  const news = data.news
    .map(n => {
      const author = data.users.find(u => u.id === n.author_id);
      return { ...n, author_name: author?.name || "Unknown" };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen">
      <nav className="bg-neutral-900 border-b border-neutral-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">ABA</Link>
          <Link href="/" className="text-sm hover:text-neutral-300">← Back</Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6 text-white">League News</h2>
        <div className="space-y-4">
          {news.map(item => (
            <article key={item.id} className="bg-neutral-900 p-6 rounded-lg border border-neutral-700">
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-neutral-400 mb-2">{item.date} • {item.author_name}</p>
              <p className="text-neutral-200">{item.content}</p>
            </article>
          ))}
          {news.length === 0 && <p className="text-neutral-400">No announcements yet.</p>}
        </div>
      </main>
    </div>
  );
}