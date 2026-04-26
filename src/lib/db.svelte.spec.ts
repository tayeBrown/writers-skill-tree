import { describe, it, expect, beforeEach } from 'vitest';
import { loadProgress, saveProgress, closeDatabase } from './db';

// Each test gets a clean slate by closing and deleting the database between runs.
beforeEach(async () => {
	closeDatabase();
	await new Promise<void>((resolve, reject) => {
		const request = indexedDB.deleteDatabase('wst');
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
		request.onblocked = () => resolve();
	});
});

describe('loadProgress', () => {
	it('returns an empty set when no progress has been saved', async () => {
		const result = await loadProgress();
		expect(result.size).toBe(0);
	});
});

describe('saveProgress / loadProgress', () => {
	it('round-trips a set of completed node IDs', async () => {
		const completed = new Set(['p_ballad', 'p_triolet', 'o_root']);
		await saveProgress(completed);
		const loaded = await loadProgress();
		expect(loaded).toEqual(completed);
	});

	it('overwrites previously saved progress', async () => {
		await saveProgress(new Set(['p_ballad', 'p_triolet']));
		await saveProgress(new Set(['o_root']));
		const loaded = await loadProgress();
		expect(loaded.has('o_root')).toBe(true);
		expect(loaded.has('p_ballad')).toBe(false);
	});

	it('round-trips an empty set', async () => {
		await saveProgress(new Set(['p_ballad']));
		await saveProgress(new Set());
		const loaded = await loadProgress();
		expect(loaded.size).toBe(0);
	});
});
