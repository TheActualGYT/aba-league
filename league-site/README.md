# NCAA 10 League Mastersheet

Private website for tracking your NCAA 10 Xbox 360 basketball league. Built with Next.js, Tailwind CSS, and NextAuth. Data is stored in a simple JSON file.

## Features
- Login for the 3 of you (admin access for all)
- League standings (auto-calculated from games)
- Team creation and management
- Player rosters (expandable)
- Game results
- News / announcements
- Dark, modern sports theme

## Setup

1. **Install dependencies**
   ```bash
   cd league-site
   npm install
   ```

2. **Environment**
   Create `.env.local`:
   ```
   NEXTAUTH_SECRET=your-long-random-secret-here
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Run locally**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Default Logins
- Username: `garrett`, `dad`, or `uncle`
- Password: `password123`

**Change these immediately** after first login by editing the seed in `src/lib/db.ts` or adding a password change feature.

## Deployment
- Push to GitHub
- Deploy on [Vercel](https://vercel.com) (free)
- For hosting online, consider Vercel (free). The JSON file works fine for local use.

## Next Steps / Extending
- Add player creation form and stats tracking
- Game entry form (API already partially set up)
- Player profiles pages
- More detailed stats (points, rebounds, assists, etc. from the game)
- Image uploads for teams/players
- Export standings/stats

The data file (`data.json`) is created automatically on first run. All three of you can log in and have full edit access.