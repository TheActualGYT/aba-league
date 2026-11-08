export type UsageIndex = {
  total: number;
  fields: Record<string, string[]>;
};

const KEYS = [
  "first_name",
  "last_name",
  "position",
  "overall",
  "height",
  "weight",
  "number",
  "hand",
  "skin_tone",
  "head_model",
  "tshirt_type",
  "sock_style",
  "sock_color",
  "shoes_home",
  "shoes_away",
  "headband",
  "right_bicep",
  "left_bicep",
  "right_forearm",
  "left_forearm",
  "right_elbow",
  "left_elbow",
  "right_wrist",
  "left_wrist",
  "right_knee",
  "left_knee",
  "right_calf",
  "left_calf",
  "fg",
  "three_p",
  "dk",
  "stl",
  "blk",
  "off_reb",
  "def_reb",
  "passing",
  "off_ability",
  "def_ability",
  "speed",
  "quickness",
  "vertical",
  "dribble",
  "strength",
  "durability",
  "stamina",
  "inside_scoring",
  "in_game_rating",
];

export function buildUsage(players: Array<{ id?: number }>, excludeId?: number): UsageIndex {
  const fields: Record<string, string[]> = {};
  for (const key of KEYS) fields[key] = [];
  for (const player of players) {
    if (excludeId != null && player.id === excludeId) continue;
    const record = player as Record<string, unknown>;
    for (const key of KEYS) {
      const text = String(record[key] ?? "").trim().toLowerCase();
      if (text) fields[key].push(text);
    }
  }
  return { total: players.length, fields };
}

export function usageHit(index: UsageIndex | undefined, key: string, value: string) {
  const text = value.trim().toLowerCase();
  if (!text || !index) return null;
  const count = (index.fields[key] || []).filter(item => item === text).length;
  const percent = index.total > 0 ? Math.round((count / index.total) * 100) : 0;
  if (count === 0) {
    return { text: "Available", shared: false, title: "No other player has this." };
  }
  const noun = count === 1 ? "other" : "others";
  return {
    text: `${count} ${noun} · ${percent}%`,
    shared: true,
    title: `${count} ${noun} · ${percent}% of the league`,
  };
}
