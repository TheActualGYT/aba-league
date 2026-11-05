import type { Metadata } from "next";
import Link from "next/link";
import NavDropdown from "@/components/NavDropdown";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABA",
  description: "Private mastersheet for our ABA league",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-neutral-950 text-white">
        <nav className="bg-neutral-900 border-b border-neutral-700 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white">ABA</Link>
            <div className="flex gap-6 items-center">
              <NavDropdown />
              <Link href="/leaders" className="hover:text-neutral-300">League Leaders</Link>
              <Link href="/teams" className="hover:text-neutral-300">Teams</Link>
              <Link href="/players" className="hover:text-neutral-300">Players</Link>
              <Link href="/games" className="hover:text-neutral-300">Games</Link>
              <span className="text-sm text-neutral-400">Dev Mode</span>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}