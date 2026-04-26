# Writing Skill Tree

An interactive skill tree for tracking writing practice. Nodes unlock as you complete their prerequisites, giving a clear picture of what you've learned and what's next.

## Features

- **Five branches** — Poetry, Original Fiction, Fanfiction, Process, and Professional Practice — each colour-coded and filterable
- **Three node states** — locked (prerequisites unmet), available (ready to complete), completed (checked off)
- **Confirmation on uncheck** — an inline popover prevents accidental unchecks
- **Persistent progress** — saved server-side, syncs across devices
- **Read-only public view** — share the URL with anyone; only you can check nodes
- **Export / Import** — download your progress as a JSON file or import one to restore or transfer it

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

In dev mode (`EDIT_HOST` unset) the server assumes you are the owner — all nodes are interactive with no login required.

## Other commands

| Command | Description |
|---|---|
| `npm test` | Run the test suite once |
| `npm run check` | Type-check with `svelte-check` |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check formatting and linting |
| `npm run format` | Auto-format with Prettier |

## Tech stack

- [SvelteKit](https://kit.svelte.dev/) + TypeScript
- [@xyflow/svelte](https://svelteflow.dev/) for the node graph
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/) with browser-mode component tests via Playwright
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) for server-side persistence
- [jose](https://github.com/panva/jose) for Cloudflare Access JWT verification

## Deploying

The app runs as a Node.js server inside a Docker container, designed to be served via a Cloudflare Tunnel with [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) handling authentication.

### Cloudflare setup

The app uses two public hostnames on the same Cloudflare Tunnel pointing to the same container:

| Hostname | Access policy | Purpose |
|---|---|---|
| `yourdomain.com` | None (public) | Read-only view for visitors |
| `edit.yourdomain.com` | Allow — your email only | Interactive edit mode |

In Zero Trust, create a Self-hosted Application for `edit.yourdomain.com` with a single **Allow** policy for your email. Because the edit subdomain is fully protected at Cloudflare's edge, unauthenticated traffic never reaches your origin server. Once authenticated, CF injects a `Cf-Access-Jwt-Assertion` header that the server validates.

Copy the **Audience Tag** from the edit application settings — you'll need it below.

### Configuration

Create a `prod.env` file (gitignored, referenced by your production compose file) with:

```
CF_ACCESS_AUD=<audience tag for edit.yourdomain.com>
CF_TEAM_DOMAIN=<your team domain, e.g. myteam>
OWNER_EMAIL=<your email>
EDIT_HOST=edit.yourdomain.com
EDIT_URL=https://edit.yourdomain.com
PUBLIC_URL=https://yourdomain.com
DB_PATH=./data/wst.db
```

### Running with Docker Compose

```bash
docker-compose up --build
```

Progress is stored in a named Docker volume (`wst-data`) so it survives container restarts.
