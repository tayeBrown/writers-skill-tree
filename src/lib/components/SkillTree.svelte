<script lang="ts">
	import { setContext } from 'svelte';
	import { SvelteFlow, Controls, Background, BackgroundVariant, MarkerType } from '@xyflow/svelte';
	import { nodes as allNodes, edges as allEdges } from '$lib/data';
	import { BRANCH_COLOR_MAP, FALLBACK_COLOR } from '$lib/types';
	import type { Branch } from '$lib/types';
	import { skillTreeStore } from '$lib/store.svelte';
	import { nodeMap } from '$lib/state';
	import SkillNode from './SkillNode.svelte';
	import FlowController from './FlowController.svelte';

	let { activeBranch, authenticated }: { activeBranch: Branch | 'all'; authenticated: boolean } =
		$props();

	setContext('authenticated', () => authenticated);

	const nodeTypes = { skill: SkillNode };

	let filteredNodes = $derived(
		activeBranch === 'all' ? allNodes : allNodes.filter((node) => node.data.branch === activeBranch)
	);

	let filteredNodeIds = $derived(new Set(filteredNodes.map((node) => node.id)));

	let filteredEdges = $derived.by(() => {
		const nodeStates = skillTreeStore.nodeStates;
		const baseEdges =
			activeBranch === 'all'
				? allEdges
				: allEdges.filter(
						(edge) => filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
					);

		return baseEdges.map((edge) => {
			const sourceNode = nodeMap.get(edge.source);
			const branchColor = sourceNode
				? (BRANCH_COLOR_MAP.get(sourceNode.data.branch) ?? FALLBACK_COLOR)
				: FALLBACK_COLOR;
			const sourceState = nodeStates.get(edge.source) ?? 'locked';
			const color = sourceState === 'locked' ? '#374151' : branchColor;
			const opacity = sourceState === 'locked' ? 0.4 : 1;

			return {
				...edge,
				style: `stroke: ${color}; stroke-width: 2; opacity: ${opacity};`,
				markerEnd: {
					type: MarkerType.ArrowClosed,
					color,
					width: 16,
					height: 16
				}
			};
		});
	});
</script>

<div class="flow-container">
	<SvelteFlow
		nodes={filteredNodes}
		edges={filteredEdges}
		{nodeTypes}
		nodesDraggable={false}
		nodesConnectable={false}
		elementsSelectable={false}
		fitView
		minZoom={0.2}
		maxZoom={2}
		colorMode="dark"
	>
		<FlowController {activeBranch} />
		<Controls />
		<Background variant={BackgroundVariant.Dots} gap={24} size={1} patternColor="#374151" />
	</SvelteFlow>
</div>

<style>
	.flow-container {
		width: 100%;
		height: 100%;
	}
</style>
