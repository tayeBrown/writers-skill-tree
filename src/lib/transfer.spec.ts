import { describe, it, expect } from 'vitest';
import { importProgress } from './transfer';

function makeFile(content: string): File {
	return new File([content], 'progress.json', { type: 'application/json' });
}

const validPayload = {
	version: 1,
	exportedAt: '2026-01-01T00:00:00.000Z',
	completedNodes: ['p_ballad', 'p_triolet']
};

describe('importProgress', () => {
	it('accepts a valid progress file', async () => {
		const result = await importProgress(makeFile(JSON.stringify(validPayload)));
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.completed.has('p_ballad')).toBe(true);
		expect(result.completed.has('p_triolet')).toBe(true);
		expect(result.unknownIds).toEqual([]);
	});

	it('rejects a file containing invalid JSON', async () => {
		const result = await importProgress(makeFile('not json'));
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.error).toMatch(/JSON/i);
	});

	it('rejects a file missing the completedNodes field', async () => {
		const result = await importProgress(
			makeFile(JSON.stringify({ version: 1, exportedAt: '2026-01-01T00:00:00.000Z' }))
		);
		expect(result.ok).toBe(false);
	});

	it('rejects a file with the wrong version', async () => {
		const result = await importProgress(
			makeFile(JSON.stringify({ ...validPayload, version: 99 }))
		);
		expect(result.ok).toBe(false);
	});

	it('rejects a file where completedNodes contains non-strings', async () => {
		const result = await importProgress(
			makeFile(JSON.stringify({ ...validPayload, completedNodes: [1, 2, 3] }))
		);
		expect(result.ok).toBe(false);
	});

	it('silently drops unknown node IDs and reports them', async () => {
		const payload = { ...validPayload, completedNodes: ['p_ballad', 'not_a_real_node'] };
		const result = await importProgress(makeFile(JSON.stringify(payload)));
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.completed.has('p_ballad')).toBe(true);
		expect(result.completed.has('not_a_real_node')).toBe(false);
		expect(result.unknownIds).toContain('not_a_real_node');
	});

	it('returns an empty completed set for an empty completedNodes array', async () => {
		const payload = { ...validPayload, completedNodes: [] };
		const result = await importProgress(makeFile(JSON.stringify(payload)));
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.completed.size).toBe(0);
	});

	it('rejects a completely empty file', async () => {
		const result = await importProgress(makeFile(''));
		expect(result.ok).toBe(false);
	});
});
