import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dataPath = path.join(process.cwd(), 'data.json');

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

function loadData(): Data {
  if (!fs.existsSync(dataPath)) {
    const initial: Data = {
      users: [],
      teams: [],
      players: [],
      games: [],
      news: [],
      nextIds: { user: 1, team: 1, player: 1, game: 1, news: 1 },
    };
    // Seed users
    const hash = bcrypt.hashSync('password123', 10);
    initial.users = [
      { id: 1, username: 'garrett', password_hash: hash, name: 'Garrett' },
      { id: 2, username: 'dad', password_hash: hash, name: 'Dad' },
      { id: 3, username: 'uncle', password_hash: hash, name: 'Uncle' },
    ];
    initial.nextIds.user = 4;
    fs.writeFileSync(dataPath, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

function saveData(data: Data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

export const db = {
  load: loadData,
  save: saveData,
};

export default db;