export type AbaRank = {
  name: string;
  src: string;
};

const RANKS: { min: number; max: number; name: string; src: string; color: string }[] = [
  { min: 100, max: 100, name: "Amethyst", src: "/ranks/amethyst.png", color: "#c084fc" },
  { min: 97, max: 99, name: "Diamond", src: "/ranks/diamond.png", color: "#f5f7ff" },
  { min: 93, max: 96, name: "Aqua", src: "/ranks/aqua.png", color: "#2ee6e6" },
  { min: 88, max: 92, name: "Gold", src: "/ranks/gold.png", color: "#f5c451" },
  { min: 83, max: 87, name: "Silver", src: "/ranks/silver.png", color: "#d4d4d4" },
  { min: 78, max: 82, name: "Blue", src: "/ranks/blue.png", color: "#60a5fa" },
  { min: 73, max: 77, name: "Green", src: "/ranks/green.png", color: "#4ade80" },
  { min: 68, max: 72, name: "Pink", src: "/ranks/pink.png", color: "#f472b6" },
  { min: 62, max: 67, name: "Red", src: "/ranks/red.png", color: "#f87171" },
  { min: 56, max: 61, name: "Dark Red", src: "/ranks/dark-red.png", color: "#c44545" },
  { min: 10, max: 55, name: "Black", src: "/ranks/black.png", color: "#bdbdbd" },
];

export const ABA_RANKS = RANKS.map(rank => ({ name: rank.name, src: rank.src, color: rank.color }));
export const ABA_RANK_NAMES = ABA_RANKS.map(rank => rank.name);

export function abaRank(value: unknown): AbaRank | null {
  const text = String(value ?? "").trim();
  if (!/^\d+$/.test(text)) return null;
  const rating = Number(text);
  if (rating < 10 || rating > 100) return null;
  const rank = RANKS.find(item => rating >= item.min && rating <= item.max);
  if (!rank) return null;
  return { name: rank.name, src: rank.src };
}
