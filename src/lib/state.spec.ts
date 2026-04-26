import { describe, it, expect } from 'vitest';
import { computeNodeStates, getAffectedDescendants } from './state';
import { nodes } from './data';

describe('computeNodeStates', () => {
	it('marks root nodes as available when nothing is completed', () => {
		const states = computeNodeStates(new Set());
		expect(states.get('p_ballad')).toBe('available');
		expect(states.get('o_root')).toBe('available');
		expect(states.get('f_root')).toBe('available');
		expect(states.get('pr_7days')).toBe('available');
		expect(states.get('pp_root')).toBe('available');
	});

	it('marks nodes with unmet prerequisites as locked', () => {
		const states = computeNodeStates(new Set());
		expect(states.get('p_triolet')).toBe('locked');
		expect(states.get('p_crown')).toBe('locked');
		expect(states.get('o_reread')).toBe('locked');
	});

	it('marks a completed node as completed', () => {
		const states = computeNodeStates(new Set(['p_ballad']));
		expect(states.get('p_ballad')).toBe('completed');
	});

	it('unlocks direct children when their prerequisite is completed', () => {
		const states = computeNodeStates(new Set(['p_ballad']));
		expect(states.get('p_triolet')).toBe('available');
		expect(states.get('p_spoken')).toBe('available');
		expect(states.get('p_free')).toBe('available');
	});

	it('does not unlock a node when only some prerequisites are met', () => {
		// o_reread requires o_root — completing something else doesn't unlock it
		const states = computeNodeStates(new Set(['p_ballad']));
		expect(states.get('o_reread')).toBe('locked');
	});

	it('keeps a node locked if its prerequisite chain is incomplete', () => {
		// p_rondel requires p_triolet, which requires p_ballad
		const states = computeNodeStates(new Set(['p_ballad']));
		expect(states.get('p_rondel')).toBe('locked');
	});

	it('unlocks a node once its full prerequisite chain is satisfied', () => {
		const states = computeNodeStates(new Set(['p_ballad', 'p_triolet']));
		expect(states.get('p_rondel')).toBe('available');
	});

	it('handles the parallel Genre nodes — each unlocks independently', () => {
		const states = computeNodeStates(new Set(['o_root']));
		expect(states.get('o_romance')).toBe('available');
		expect(states.get('o_fantasy')).toBe('available');
		expect(states.get('o_mystery')).toBe('available');
	});

	it('marks all nodes as completed when all IDs are in the set', () => {
		const allIds = new Set(nodes.map((node) => node.id));
		const states = computeNodeStates(allIds);
		for (const [, state] of states) {
			expect(state).toBe('completed');
		}
	});
});

describe('getAffectedDescendants', () => {
	it('returns empty array when no completed nodes depend on the given node', () => {
		const affected = getAffectedDescendants('p_ballad', new Set());
		expect(affected).toEqual([]);
	});

	it('returns direct completed children', () => {
		const affected = getAffectedDescendants('p_ballad', new Set(['p_triolet']));
		expect(affected).toContain('p_triolet');
	});

	it('returns all completed descendants recursively', () => {
		const completed = new Set(['p_triolet', 'p_rondel']);
		const affected = getAffectedDescendants('p_ballad', completed);
		expect(affected).toContain('p_triolet');
		expect(affected).toContain('p_rondel');
	});

	it('does not include nodes that are not completed', () => {
		const affected = getAffectedDescendants('p_ballad', new Set(['p_triolet']));
		expect(affected).not.toContain('p_rondel');
	});

	it('returns no duplicates', () => {
		const completed = new Set(['p_triolet', 'p_rondel']);
		const affected = getAffectedDescendants('p_ballad', completed);
		expect(affected.length).toBe(new Set(affected).size);
	});
});
