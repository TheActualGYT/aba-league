export type AbaRank = {
  name: string;
  src: string;
};

const RANKS: { min: number; max: number; name: string; src: string }[] = [
  { min: 100, max: 100, name: "Amethyst", src: "/ranks/amethyst.png" },
  { min: 97, max: 99, name: "Diamond", src: "/ranks/diamond.png" },
  { min: 93, max: 96, name: "Aqua", src: "/ranks/aqua.png" },
  { min: 88, max: 92, name: "Gold", src: "/ranks/gold.png" },
  { min: 83, max: 87, name: "Silver", src: "/ranks/silver.png" },
  { min: 78, max: 82, name: "Blue", src: "/ranks/blue.png" },
  { min: 73, max: 77, name: "Green", src: "/ranks/green.png" },
  { min: 68, max: 72, name: "Pink", src: "/ranks/pink.png" },
  { min: 62, max: 67, name: "Red", src: "/ranks/red.png" },
  { min: 56, max: 61, name: "Dark Red", src: "/ranks/dark-red.png" },
  { min: 10, max: 55, name: "Black", src: "/ranks/black.png" },
];

export const ABA_RANK_NAMES = RANKS.map(rank => rank.name);

export function abaRank(value: unknown): AbaRank | null {
  const text = String(value ?? "").trim();
  if (!/^\d+$/.test(text)) return null;
  const rating = Number(text);
  if (rating < 10 || rating > 100) return null;
  const rank = RANKS.find(item => rating >= item.min && rating <= item.max);
  if (!rank) return null;
  return { name: rank.name, src: rank.src };
}
