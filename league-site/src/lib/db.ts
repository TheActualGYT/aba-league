import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const connectionString = process.env.STORAGE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('No database connection string found. Set STORAGE_URL, POSTGRES_URL, or DATABASE_URL.');
}

const sql = postgres(connectionString, { ssl: 'require' });

interface User {
  id: number;
  username: string;
  password_hash: string;
  name: string;
}

interface Team {
  id: number;
  name: string;
  abbreviation: string;
  division: string;
  logo: string;
  location: string;
  ownership: string;
  head_coach?: string;
  assistant_coach?: string;
  colors: string[];
  created_by: number;
  draft_eligible?: boolean;
}

interface Player {
  id: number;
  name: string;
  team_id: number | null;
  status?: "free" | "prospect" | "team";
  vba_representative?: string;
  vba_abbreviation?: string;
  vba_logo?: string;
  position: string | null;
  first_name?: string;
  last_name?: string;
  overall?: number;
  height?: string;
  weight?: number;
  number?: string;
  hand?: string;
  skin_tone?: string;
  body_type?: string;
  head_model?: string;
  tshirt_type?: string;
  sock_style?: string;
  sock_color?: string;
  shoes_home?: string;
  shoes_away?: string;
  headband?: string;
  right_bicep?: string;
  left_bicep?: string;
  right_forearm?: string;
  left_forearm?: string;
  right_elbow?: string;
  left_elbow?: string;
  right_wrist?: string;
  left_wrist?: string;
  right_knee?: string;
  left_knee?: string;
  right_calf?: string;
  left_calf?: string;
  fg?: string;
  three_p?: string;
  dk?: string;
  stl?: string;
  blk?: string;
  off_reb?: string;
  def_reb?: string;
  passing?: string;
  off_ability?: string;
  def_ability?: string;
  speed?: string;
  quickness?: string;
  vertical?: string;
  dribble?: string;
  strength?: string;
  durability?: string;
  shooting_range?: string;
  stamina?: string;
  inside_scoring?: string;
  in_game_rating?: string;
}

interface Game {
  id: number;
  date: string;
  home_team_id: number;
  away_team_id: number;
  home_score: number;
  away_score: number;
}

interface BoxScore {
  game_id: number;
  player_id: number;
  pts?: number;
  ast?: number;
  orb?: number;
  drb?: number;
  reb?: number;
  stl?: number;
  blk?: number;
  to?: number;
  pf?: number;
  fgm?: number;
  fga?: number;
  tpm?: number;
  tpa?: number;
  ftm?: number;
  fta?: number;
}

interface News {
  id: number;
  title: string;
  content: string;
  date: string;
  author_id: number;
}

interface Data {
  users: User[];
  teams: Team[];
  players: Player[];
  games: Game[];
  box_scores?: BoxScore[];
  news: News[];
  nextIds: {
    user: number;
    team: number;
    player: number;
    game: number;
    news: number;
  };
  next_picker_id?: number | null;
  draft_picks?: { slot: string; team_id: number; player_id?: number }[];
  cleared_slot_101?: boolean;
  full_draft_reset_v1?: boolean;
}

const ROSTERS_ALREADY_SET = [
  "baylor", "buffalo", "cincinnati", "colorado", "duke", "houston",
  "marquette", "memphis", "michigan", "missouri", "st johns", "saint johns",
  "stanford", "texas tech", "texas", "utep",
];

function rosterAlreadySet(name: string) {
  const normalized = name.toLowerCase().replace(/['\u2019.]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  const keys = [...ROSTERS_ALREADY_SET].sort((a, b) => b.length - a.length);
  return keys.some(key => normalized === key || normalized.startsWith(`${key} `));
}

function getInitialData(): Data {
  const hash = bcrypt.hashSync('password123', 10);
  return {
    users: [
      { id: 1, username: 'garrett', password_hash: hash, name: 'Garrett' },
      { id: 2, username: 'dad', password_hash: hash, name: 'Dad' },
      { id: 3, username: 'uncle', password_hash: hash, name: 'Uncle' },
    ],
    teams: [],
    players: [],
    games: [],
    news: [],
    nextIds: { user: 4, team: 1, player: 1, game: 1, news: 1 },
  };
}

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS league_data (
      id INTEGER PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL
    )
  `;
}

async function saveData(data: Data) {
  await ensureTable();
  await sql`
    INSERT INTO league_data (id, data)
    VALUES (1, ${sql.json(data as any)})
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
}

function clearDraft(data: Data) {
  const drafted = new Set(
    (data.draft_picks || []).map(pick => pick.player_id).filter((id): id is number => typeof id === "number"),
  );
  for (const player of data.players || []) {
    if (!drafted.has(player.id)) continue;
    player.team_id = null;
    player.status = "prospect";
  }
  data.draft_picks = [];
  data.next_picker_id = null;
}

async function applyDraftEligibility(data: Data) {
  let changed = false;
  for (const team of data.teams || []) {
    if (typeof team.draft_eligible !== "boolean") {
      team.draft_eligible = !rosterAlreadySet(team.name);
      changed = true;
    }
  }
  if (!data.cleared_slot_101) {
    data.draft_picks = (data.draft_picks || []).filter(pick => pick.slot !== "1.01");
    data.cleared_slot_101 = true;
    changed = true;
  }
  if (!data.full_draft_reset_v1) {
    clearDraft(data);
    data.full_draft_reset_v1 = true;
    changed = true;
  }
  if (changed) await saveData(data);
}

async function loadData(): Promise<Data> {
  await ensureTable();
  const rows = await sql`SELECT data FROM league_data WHERE id = 1`;
  if (rows.length === 0) {
    const initial = getInitialData();
    await sql`INSERT INTO league_data (id, data) VALUES (1, ${sql.json(initial as any)})`;
    return initial;
  }
  const data = rows[0].data as Data;
  await applyDraftEligibility(data);
  return data;
}

export const db = {
  load: () => loadData(),
  save: (data: Data) => saveData(data),
  clearDraft,
};

export default db;
