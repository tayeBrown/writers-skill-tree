<script lang="ts">
	import { untrack } from 'svelte';
	import { useSvelteFlow } from '@xyflow/svelte';
	import type { Branch } from '$lib/types';

	let { activeBranch }: { activeBranch: Branch | 'all' } = $props();

	const { fitView } = useSvelteFlow();

	$effect(() => {
		// Track activeBranch as the sole dependency, then call fitView outside
		// reactive tracking so the viewport write does not re-trigger this effect.
		void activeBranch;
		untrack(() => fitView({ duration: 400, padding: 0.12 }));
	});
</script>
