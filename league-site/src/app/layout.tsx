import type { Metadata } from "next";
import Link from "next/link";
import NavDropdown from "@/components/NavDropdown";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABA",
  description: "Private mastersheet for our ABA league",
};

const LOGO = "data:image/png;base64,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";

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
            <Link href="/" className="flex items-center gap-2">
              <img src={LOGO} alt="ABA" className="h-8 w-auto" />
              <span className="text-2xl font-bold text-white">ABA</span>
            </Link>
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