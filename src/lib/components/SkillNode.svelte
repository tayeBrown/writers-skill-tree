<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
	import type { NodeProps } from '@xyflow/svelte';
	import { BRANCH_COLOR_MAP, FALLBACK_COLOR } from '$lib/types';
	import type { SkillNode } from '$lib/types';
	import { skillTreeStore } from '$lib/store.svelte';

	let { id, data }: NodeProps<SkillNode> = $props();

	let nodeState = $derived(skillTreeStore.nodeStates.get(id) ?? 'locked');
	let branchColor = $derived(BRANCH_COLOR_MAP.get(data.branch) ?? FALLBACK_COLOR);
	let showConfirm = $state(false);

	function handleClick() {
		if (nodeState === 'available') {
			skillTreeStore.completeNode(id);
		} else if (nodeState === 'completed') {
			showConfirm = true;
		}
	}

	function confirmUncheck() {
		showConfirm = false;
		skillTreeStore.uncompleteNode(id);
	}

	function cancelUncheck() {
		showConfirm = false;
	}
</script>

<div
	class="skill-node"
	class:locked={nodeState === 'locked'}
	class:available={nodeState === 'available'}
	class:completed={nodeState === 'completed'}
	style="--branch-color: {branchColor}"
	role="button"
	tabindex={nodeState === 'locked' ? -1 : 0}
	aria-disabled={nodeState === 'locked'}
	aria-pressed={nodeState === 'completed'}
	onclick={handleClick}
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
>
	<Handle type="target" position={Position.Left} class="handle" />

	{#if nodeState === 'completed'}
		<span class="check" aria-hidden="true">✓</span>
	{/if}

	<span class="label">{data.label}</span>

	{#if data.terminal}
		<span class="terminal-marker" aria-label="terminal node" title="Terminal node">⭐</span>
	{/if}

	<Handle type="source" position={Position.Right} class="handle" />

	{#if showConfirm}
		<div
			class="confirm-popover"
			role="dialog"
			aria-label="Confirm uncheck"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<p>Uncheck this node?</p>
			<div class="confirm-actions">
				<button onclick={confirmUncheck}>Confirm</button>
				<button onclick={cancelUncheck}>Cancel</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.skill-node {
		position: relative;
		display: flex;
		align-items: center;
		gap: 6px;
		width: 160px;
		min-height: 44px;
		padding: 8px 12px;
		border-radius: 8px;
		border: 2px solid transparent;
		font-size: 12px;
		font-weight: 500;
		line-height: 1.3;
		transition:
			background-color 0.15s,
			border-color 0.15s,
			opacity 0.15s;
		box-sizing: border-box;
		user-select: none;
	}

	.skill-node.locked {
		background-color: #1f2937;
		border-color: #374151;
		color: #6b7280;
		opacity: 0.55;
		cursor: not-allowed;
	}

	.skill-node.available {
		background-color: #1f2937;
		border-color: var(--branch-color);
		color: #f9fafb;
		cursor: pointer;
	}

	.skill-node.available:hover {
		background-color: #273344;
	}

	.skill-node.completed {
		background-color: var(--branch-color);
		border-color: var(--branch-color);
		color: #fff;
		cursor: pointer;
	}

	.skill-node.completed:hover {
		filter: brightness(1.1);
	}

	.label {
		flex: 1;
	}

	.check {
		font-size: 14px;
		flex-shrink: 0;
	}

	.terminal-marker {
		font-size: 11px;
		flex-shrink: 0;
	}

	:global(.handle) {
		opacity: 0;
		pointer-events: none;
	}

	.confirm-popover {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		background-color: #111827;
		border: 1px solid #374151;
		border-radius: 8px;
		padding: 10px 12px;
		white-space: nowrap;
		z-index: 10;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
		color: #f9fafb;
		font-size: 12px;
	}

	.confirm-popover p {
		margin: 0 0 8px;
	}

	.confirm-actions {
		display: flex;
		gap: 6px;
	}

	.confirm-actions button {
		flex: 1;
		padding: 4px 8px;
		border-radius: 4px;
		border: none;
		font-size: 11px;
		font-weight: 600;
		cursor: pointer;
	}

	.confirm-actions button:first-child {
		background-color: #ef4444;
		color: #fff;
	}

	.confirm-actions button:last-child {
		background-color: #374151;
		color: #f9fafb;
	}
</style>
