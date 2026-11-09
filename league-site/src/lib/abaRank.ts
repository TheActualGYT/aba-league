export type AbaRank = {
  name: string;
  src: string;
  label: string;
};

const RANKS: { min: number; max: number; name: string; src: string; label: string }[] = [
  { min: 100, max: 100, name: "Amethyst", src: "/ranks/amethyst.png", label: "text-purple-300" },
  { min: 97, max: 99, name: "Diamond", src: "/ranks/diamond.png", label: "text-slate-100" },
  { min: 93, max: 96, name: "Aqua", src: "/ranks/aqua.png", label: "text-cyan-300" },
  { min: 88, max: 92, name: "Gold", src: "/ranks/gold.png", label: "text-yellow-300" },
  { min: 83, max: 87, name: "Silver", src: "/ranks/silver.png", label: "text-neutral-300" },
  { min: 78, max: 82, name: "Blue", src: "/ranks/blue.png", label: "text-blue-400" },
  { min: 73, max: 77, name: "Green", src: "/ranks/green.png", label: "text-green-400" },
  { min: 68, max: 72, name: "Pink", src: "/ranks/pink.png", label: "text-pink-400" },
  { min: 62, max: 67, name: "Red", src: "/ranks/red.png", label: "text-red-400" },
  { min: 56, max: 61, name: "Dark Red", src: "/ranks/dark-red.png", label: "text-[#e07a7a]" },
  { min: 0, max: 55, name: "Black", src: "/ranks/black.png", label: "text-neutral-400" },
];

export function abaRank(value: unknown): AbaRank | null {
  const text = String(value ?? "").trim();
  if (!/^\d+$/.test(text)) return null;
  const rating = Number(text);
  const rank = RANKS.find(item => rating >= item.min && rating <= item.max);
  if (!rank) return null;
  return { name: rank.name, src: rank.src, label: rank.label };
}
