<script lang="ts">
	import { onMount } from 'svelte';
	import { skillTreeStore } from '$lib/store.svelte';
	import BranchFilter from '$lib/components/BranchFilter.svelte';
	import SkillTree from '$lib/components/SkillTree.svelte';
	import ExportImport from '$lib/components/ExportImport.svelte';
	import type { Branch } from '$lib/types';

	let { data } = $props();

	let activeBranch = $state<Branch | 'all'>('all');
	let ready = $state(false);

	onMount(async () => {
		await skillTreeStore.initialize();
		ready = true;
	});
</script>

<svelte:head>
	<title>Writing Skill Tree</title>
</svelte:head>

<div class="layout">
	<BranchFilter {activeBranch} onchange={(branch) => (activeBranch = branch)} />

	<main class="tree-area">
		{#if skillTreeStore.loadError}
			<div class="loading error" role="alert">{skillTreeStore.loadError}</div>
		{:else if ready}
			<SkillTree {activeBranch} authenticated={data.authenticated} />
		{:else}
			<div class="loading" aria-live="polite">Loading…</div>
		{/if}
	</main>

	<ExportImport
		authenticated={data.authenticated}
		editUrl={data.editUrl}
		publicUrl={data.publicUrl}
	/>
</div>

<style>
	:global(html, body) {
		height: 100%;
		margin: 0;
		background-color: #030712;
		color: #f9fafb;
	}

	.layout {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.tree-area {
		flex: 1;
		min-height: 0;
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #6b7280;
		font-size: 14px;
	}

	.loading.error {
		color: #fca5a5;
	}
</style>
