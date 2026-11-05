import type { Metadata } from "next";
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
      <body className="min-h-screen bg-neutral-950 text-white">
        {children}
      </body>
    </html>
  );
}