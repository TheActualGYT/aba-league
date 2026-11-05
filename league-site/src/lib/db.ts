import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dataPath = process.env.VERCEL
  ? path.join('/tmp', 'data.json')
  : path.join(process.cwd(), 'data.json');

// In-memory cache so data survives within the same serverless instance
let memoryData: Data | null = null;

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
  created_by: number;
}

interface Player {
  id: number;
  name: string;
  team_id: number | null;
  position: string | null;
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

function loadData(): Data {
  if (memoryData) return memoryData;

  try {
    if (fs.existsSync(dataPath)) {
      const parsed = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      memoryData = parsed;
      return parsed;
    }
  } catch (e) {
    // ignore
  }

  const initial = getInitialData();
  memoryData = initial;
  try {
    fs.writeFileSync(dataPath, JSON.stringify(initial, null, 2));
  } catch (e) {
    // ignore
  }
  return initial;
}

function saveData(data: Data) {
  memoryData = data;
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

export const db = {
  load: loadData,
  save: saveData,
};

export default db;