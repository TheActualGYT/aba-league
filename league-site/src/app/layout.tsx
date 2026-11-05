import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NCAA 10 League",
  description: "Private mastersheet for our NCAA 10 Xbox 360 league",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}