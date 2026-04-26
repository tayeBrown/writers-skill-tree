# Writing Skill Tree

An interactive skill tree for tracking writing practice. Nodes unlock as you complete their prerequisites, giving a clear picture of what you've learned and what's next.

## Features

- **Five branches** — Poetry, Original Fiction, Fanfiction, Process, and Professional Practice — each colour-coded and filterable
- **Three node states** — locked (prerequisites unmet), available (ready to complete), completed (checked off)
- **Confirmation on uncheck** — an inline popover prevents accidental unchecks
- **Persistent progress** — saved to IndexedDB, survives browser restarts
- **Export / Import** — download your progress as a JSON file or import one to restore or transfer it

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

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
- IndexedDB for local persistence (no server required)

## Deploying

The app is a fully static site — no server needed. Build and deploy the `build/` output to any static host:

```bash
npm run build
```
