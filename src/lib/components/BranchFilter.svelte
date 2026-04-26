<script lang="ts">
	import { BRANCHES } from '$lib/types';
	import type { Branch } from '$lib/types';
	import { skillTreeStore } from '$lib/store.svelte';
	import { nodes } from '$lib/data';

	let {
		activeBranch,
		onchange
	}: {
		activeBranch: Branch | 'all';
		onchange: (branch: Branch | 'all') => void;
	} = $props();

	const branchTotals = new Map<Branch | 'all', number>([
		['all', nodes.length],
		...BRANCHES.map((b) => [b.id, nodes.filter((n) => n.data.branch === b.id).length] as const)
	]);

	let branchCompleted = $derived.by(() => {
		const counts = new Map<Branch | 'all', number>([['all', skillTreeStore.completed.size]]);
		for (const node of nodes) {
			if (skillTreeStore.completed.has(node.id)) {
				counts.set(node.data.branch, (counts.get(node.data.branch) ?? 0) + 1);
			}
		}
		return counts;
	});
</script>

<nav class="branch-filter" aria-label="Filter by branch">
	<button
		class="pill"
		class:active={activeBranch === 'all'}
		onclick={() => onchange('all')}
		aria-pressed={activeBranch === 'all'}
	>
		<span class="pill-label">All</span>
		<span class="pill-count">
			{branchCompleted.get('all') ?? 0}/{branchTotals.get('all')}
		</span>
	</button>

	{#each BRANCHES as branch (branch.id)}
		<button
			class="pill"
			class:active={activeBranch === branch.id}
			style="--branch-color: {branch.color}"
			onclick={() => onchange(branch.id)}
			aria-pressed={activeBranch === branch.id}
		>
			<span class="pill-label">{branch.label}</span>
			<span class="pill-count">
				{branchCompleted.get(branch.id) ?? 0}/{branchTotals.get(branch.id)}
			</span>
		</button>
	{/each}
</nav>

<style>
	.branch-filter {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		padding: 12px 16px;
		background-color: #111827;
		border-bottom: 1px solid #1f2937;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 5px 12px;
		border-radius: 9999px;
		border: 1.5px solid #374151;
		background-color: transparent;
		color: #9ca3af;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		transition:
			background-color 0.15s,
			border-color 0.15s,
			color 0.15s;
		white-space: nowrap;
	}

	.pill:hover {
		border-color: #6b7280;
		color: #f9fafb;
	}

	.pill.active {
		background-color: var(--branch-color, #4b5563);
		border-color: var(--branch-color, #4b5563);
		color: #fff;
	}

	.pill-count {
		font-size: 10px;
		opacity: 0.8;
		font-variant-numeric: tabular-nums;
	}
</style>
