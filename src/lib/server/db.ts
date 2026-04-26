import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const dbPath = resolve(env.DB_PATH ?? './data/wst.db');
mkdirSync(dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.exec(`
	CREATE TABLE IF NOT EXISTS progress (
		key TEXT PRIMARY KEY,
		completed_nodes TEXT NOT NULL DEFAULT '[]'
	)
`);

const KEY = 'progress';

export function loadProgress(): Set<string> {
	const row = db
		.prepare<[string], { completed_nodes: string }>('SELECT completed_nodes FROM progress WHERE key = ?')
		.get(KEY);
	if (!row) return new Set();
	const parsed: unknown = JSON.parse(row.completed_nodes);
	return new Set(Array.isArray(parsed) ? (parsed as string[]) : []);
}

export function saveProgress(completed: Set<string>): void {
	db.prepare('INSERT OR REPLACE INTO progress (key, completed_nodes) VALUES (?, ?)').run(
		KEY,
		JSON.stringify(Array.from(completed))
	);
}
