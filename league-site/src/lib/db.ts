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
  news: News[];
  nextIds: {
    user: number;
    team: number;
    player: number;
    game: number;
    news: number;
  };
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

async function loadData(): Promise<Data> {
  await ensureTable();
  const rows = await sql`SELECT data FROM league_data WHERE id = 1`;
  if (rows.length === 0) {
    const initial = getInitialData();
    await sql`INSERT INTO league_data (id, data) VALUES (1, ${sql.json(initial as any)})`;
    return initial;
  }
  return rows[0].data as Data;
}

async function saveData(data: Data) {
  await ensureTable();
  await sql`
    INSERT INTO league_data (id, data)
    VALUES (1, ${sql.json(data as any)})
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
}

export const db = {
  load: () => loadData(),
  save: (data: Data) => saveData(data),
};

export default db;
