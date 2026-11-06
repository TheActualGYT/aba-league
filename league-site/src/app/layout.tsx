import type { Metadata } from "next";
import Link from "next/link";
import NavDropdown from "@/components/NavDropdown";
import GamesDropdown from "@/components/GamesDropdown";
import StatsDropdown from "@/components/StatsDropdown";
import CreationDropdown from "@/components/CreationDropdown";
import SeasonDropdown from "@/components/SeasonDropdown";
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
        <nav className="bg-neutral-900 border-b border-neutral-700 sticky top-0 z-50">
          <div className="relative px-6 py-2">
            <div
              className="flex items-center gap-6 absolute top-1/2 -translate-y-1/2"
              style={{ left: "max(24px, calc(50% - 703.56px))" }}
            >
              <Link href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="ABA" className="h-16 w-auto" />
                <div className="flex flex-col leading-tight">
                  <span className="text-2xl font-bold text-white">ABA</span>
                  <span className="text-xs text-neutral-400">NCAA 10 Basketball</span>
                </div>
              </Link>
              <SeasonDropdown />
            </div>
            <div className="max-w-7xl mx-auto flex justify-end items-center gap-6 min-h-16">
              <NavDropdown />
              <StatsDropdown />
              <GamesDropdown />
              <CreationDropdown />
              <Link href="/players" className="hover:text-neutral-300">Players</Link>
              <span className="text-sm text-neutral-400">Dev Mode</span>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
