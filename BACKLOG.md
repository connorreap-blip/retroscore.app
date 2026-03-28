# RetroScore Backlog

Items for future development. Prioritized top-down.

---

### 1. Mac Desktop App with Dynamic Island Notch

Native macOS desktop app (Electron or Tauri) featuring a sleek dynamic notch/island widget in the top menu bar. Shows live score, inning, and count in a compact always-visible format. Expands on hover/click to show the full scoreboard. Should feel native — not a wrapped web view in a window.

**Considerations:**
- Tauri preferred over Electron (smaller binary, native performance)
- Menu bar widget with dynamic island-style expand/collapse
- Pull from the same MLB Stats API
- Auto-launch on login option
- Could also explore a macOS widget for Notification Center

---

### 2. About / Feedback Page

Accessible via the baseball settings menu. Two sections:

**About:**
- What RetroScore is and why it exists
- The design philosophy (outfield wall aesthetic, built for TVs)
- Link to GitHub repo

**Feedback / Bug Report Form:**
- Fields: type (bug / feature request / general), description, email (optional)
- Submissions should route to a GitHub Issue via the GitHub API (`POST /repos/connorreap-blip/retroscore.app/issues`) so agents and humans can find and triage them
- Alternatively: Google Form that dumps to a Sheet, with a Zapier/webhook to create GitHub issues
- The form endpoint should be documented in CLAUDE.md or a `CONTRIBUTING.md` so agents working on the project know where feedback lives

**Implementation path:** Add a `/about` route, same board-surface styling, form posts to GitHub Issues API using a server-side API route (to keep the token out of the client).

---

**Decision: Feedback routing** — GitHub Issues (`connorreap-blip/retroscore.app/issues`) via a thin API route at `/api/feedback`. Takes form data, creates a GitHub issue using a `GITHUB_TOKEN` env var server-side. Cleanest option since agents already know how to read/search GitHub issues via `gh`.
