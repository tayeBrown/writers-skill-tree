import { page, userEvent } from 'vitest/browser';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import BranchFilter from './BranchFilter.svelte';
import { skillTreeStore } from '$lib/store.svelte';
import { BRANCHES } from '$lib/types';
import type { Branch } from '$lib/types';
import { nodes } from '$lib/data';

beforeEach(() => {
	skillTreeStore.completed = new Set();
});

function renderFilter(activeBranch: Branch | 'all' = 'all') {
	const onchange = vi.fn();
	render(BranchFilter, { activeBranch, onchange });
	return { onchange };
}

describe('BranchFilter', () => {
	it('renders the All button and one button per branch', async () => {
		renderFilter();
		await expect.element(page.getByRole('button', { name: /All/ })).toBeInTheDocument();
		for (const branch of BRANCHES) {
			await expect.element(page.getByRole('button', { name: new RegExp(branch.label) })).toBeInTheDocument();
		}
	});

	it('marks the All button as active when activeBranch is all', async () => {
		renderFilter('all');
		await expect
			.element(page.getByRole('button', { name: /All/ }))
			.toHaveAttribute('aria-pressed', 'true');
	});

	it('marks the correct branch button as active', async () => {
		renderFilter('poetry');
		await expect
			.element(page.getByRole('button', { name: /Poetry/ }))
			.toHaveAttribute('aria-pressed', 'true');
		await expect
			.element(page.getByRole('button', { name: /All/ }))
			.toHaveAttribute('aria-pressed', 'false');
	});

	it('calls onchange with all when the All button is clicked', async () => {
		const { onchange } = renderFilter('poetry');
		await userEvent.click(page.getByRole('button', { name: /All/ }));
		expect(onchange).toHaveBeenCalledWith('all');
	});

	it('calls onchange with the branch id when a branch button is clicked', async () => {
		const { onchange } = renderFilter('all');
		await userEvent.click(page.getByRole('button', { name: /Original Fiction/ }));
		expect(onchange).toHaveBeenCalledWith('original-fiction');
	});

	it('calls onchange once per click', async () => {
		const { onchange } = renderFilter();
		await userEvent.click(page.getByRole('button', { name: /Fanfiction/ }));
		expect(onchange).toHaveBeenCalledTimes(1);
	});

	it('shows 0/N counts when nothing is completed', async () => {
		renderFilter();
		const totalNodes = nodes.length;
		await expect
			.element(page.getByRole('button', { name: /All/ }))
			.toHaveTextContent(`0/${totalNodes}`);
	});

	it('reflects completed nodes in the count for the correct branch', async () => {
		skillTreeStore.completed = new Set(['p_ballad', 'p_triolet']);
		renderFilter();
		await expect
			.element(page.getByRole('button', { name: /Poetry/ }))
			.toHaveTextContent('2/');
	});

	it('reflects completed nodes in the All count', async () => {
		skillTreeStore.completed = new Set(['p_ballad', 'o_root']);
		renderFilter();
		await expect
			.element(page.getByRole('button', { name: /All/ }))
			.toHaveTextContent('2/');
	});
});
