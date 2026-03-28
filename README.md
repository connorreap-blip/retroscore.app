# RetroScore

A hyper-realistic outfield wall baseball scoreboard for your TV, desktop, or second monitor. Live MLB scores, standings, and schedule — rendered as a vintage hand-posted scoreboard with recessed number plates, 3D indicator lights, and painted metal textures.

## What It Does

- **Live Scoreboard** -- Inning-by-inning linescore with R/H/E, balls/strikes/outs indicator lights, and current batter
- **Team Selection** -- Pick your MLB team on first visit; scoreboard tracks your team's game
- **Around the League** -- Compact live score cards for every game, click any to pull it up on the main board
- **Standings** -- Your division's W/L/GB
- **Upcoming Games** -- Next 4 games with probable pitchers
- **Ballpark Ambiance** -- Synthesized crowd murmur via Web Audio API (no audio files)
- **Stadium Announcer** -- Web Speech API announces each new batter with PA-style delivery
- **Fullscreen + TV Mode** -- Built for passive display on a TV; wake lock prevents sleep
- **Cast Guide** -- Instructions for AirPlay, Chromecast, Roku, and HDMI mirroring
- **Auto-Cycling Views** -- Alternates between "My Team" and "Around the League" every 10 minutes

## The Aesthetic

Every surface is a painted metal outfield wall:

- Matte hunter green with SVG noise texture overlays
- Recessed number plate slots with inner shadows and hand-placed imperfections (slight rotation/offset)
- 3D glass dome indicator lights with brushed-metal bezels, specular highlights, and dust/grime layers
- Water streak weathering, panel seam lines, warm off-white stencil typography
- Team cap logos from MLB's CDN
- Venue name displayed in the matchup header

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19, CSS Modules |
| State | Zustand 5 with localStorage persistence |
| Data Fetching | @tanstack/react-query (polling) |
| Data Source | MLB Stats API (free, no auth) |
| Audio | Web Audio API (crowd ambiance), Web Speech API (announcer) |
| Real-time Sync | PartyKit (scaffolded for multi-screen) |
| Deployment | Vercel |

## Data Source

All game data comes from the [MLB Stats API](https://statsapi.mlb.com/api/v1/) -- free, no authentication required. The app polls every 10-15 seconds during live games and every 60 seconds otherwise.

**Endpoints used:**
- `/schedule` with `hydrate=linescore,team,probablePitcher,venue` -- today's games
- `/game/{id}/feed/live` (v1.1) -- detailed game feed with batter info
- `/standings` with `hydrate=division` -- division standings
- Team cap logos via `mlbstatic.com/team-logos/team-cap-on-dark/{teamId}.svg`

## Getting Started

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). Pick a team. Watch baseball.

For TV display, go fullscreen or navigate to `/tv`.

## Project Structure

```
src/
  app/
    scoreboard/     Main scoreboard page with data hooks
    tv/             Passive TV display mode
  components/
    scoreboard/     Linescore, NumberPlate, IndicatorLights, StatsPanel
    cards/          UpcomingGames, Standings, LiveGameCard
    layout/         TopBar, ViewToggle
    settings/       TeamPicker, CastGuide
    shared/         TeamLogo
  stores/           Zustand stores (team, scoreboard, schedule, standings, league)
  lib/
    mlb/            API client, response transforms, 30-team metadata, types
    audio/          Ballpark ambiance engine, stadium announcer, radio scaffolding
  styles/           Scoreboard CSS module (board surfaces, plates, lights, weathering)
```

## Future

- Radio stream integration (Radio Browser API scaffolding in place)
- Native Roku/Fire TV channel
- Shareable screenshot cards for social

## License

MIT
