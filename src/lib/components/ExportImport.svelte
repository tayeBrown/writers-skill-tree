<script lang="ts">
	import { exportProgress, importProgress } from '$lib/transfer';
	import { skillTreeStore } from '$lib/store.svelte';
	import AuthButton from './AuthButton.svelte';

	let {
		authenticated,
		editUrl,
		publicUrl
	}: { authenticated: boolean; editUrl: string | null; publicUrl: string | null } = $props();

	type ImportState =
		| { phase: 'idle' }
		| { phase: 'confirming'; completed: Set<string>; unknownIds: string[] }
		| { phase: 'error'; message: string };

	let importState = $state<ImportState>({ phase: 'idle' });
	let fileInput: HTMLInputElement;

	function handleExport() {
		exportProgress(skillTreeStore.completed);
	}

	function openFilePicker() {
		fileInput.click();
	}

	async function handleFileSelected(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		// Reset the input so the same file can be re-imported if needed.
		fileInput.value = '';

		const result = await importProgress(file);

		if (!result.ok) {
			importState = { phase: 'error', message: result.error };
			return;
		}

		importState = { phase: 'confirming', completed: result.completed, unknownIds: result.unknownIds };
	}

	async function confirmImport() {
		if (importState.phase !== 'confirming') return;
		await skillTreeStore.replaceProgress(importState.completed);
		importState = { phase: 'idle' };
	}

	function cancelImport() {
		importState = { phase: 'idle' };
	}
</script>

<div class="export-import">
	<button class="action-btn" onclick={handleExport}>Export progress</button>

	{#if authenticated}
		<button class="action-btn" onclick={openFilePicker}>Import progress</button>
	{/if}

	<div class="spacer"></div>
	<AuthButton {authenticated} {editUrl} {publicUrl} />

	<!-- Hidden file input -->
	<input
		bind:this={fileInput}
		type="file"
		accept="application/json,.json"
		data-testid="file-input"
		style="display: none"
		onchange={handleFileSelected}
	/>

	{#if importState.phase === 'error'}
		<div class="notice error" role="alert">
			<span>{importState.message}</span>
			<button class="dismiss" onclick={cancelImport} aria-label="Dismiss">✕</button>
		</div>
	{/if}

	{#if importState.phase === 'confirming'}
		<div class="confirm-overlay" role="dialog" aria-modal="true" aria-label="Confirm import">
			<div class="confirm-box">
				<p class="confirm-warning">
					⚠ This will <strong>replace</strong> your current progress with the imported file.
					This cannot be undone.
				</p>
				<p class="confirm-detail">
					{importState.completed.size} node{importState.completed.size === 1 ? '' : 's'} will be marked complete.
				</p>
				{#if importState.unknownIds.length > 0}
					<p class="confirm-unknown">
						{importState.unknownIds.length} unrecognised node ID{importState.unknownIds.length === 1 ? '' : 's'} in the file will be ignored.
					</p>
				{/if}
				<div class="confirm-actions">
					<button class="btn-confirm" onclick={confirmImport}>Replace progress</button>
					<button class="btn-cancel" onclick={cancelImport}>Cancel</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.export-import {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		background-color: #111827;
		border-top: 1px solid #1f2937;
	}

	.action-btn {
		padding: 5px 12px;
		border-radius: 6px;
		border: 1.5px solid #374151;
		background-color: transparent;
		color: #9ca3af;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.action-btn:hover {
		border-color: #6b7280;
		color: #f9fafb;
	}

	.spacer {
		flex: 1;
	}

	.notice {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 10px;
		border-radius: 6px;
		font-size: 12px;
	}

	.notice.error {
		background-color: #450a0a;
		border: 1px solid #7f1d1d;
		color: #fca5a5;
	}

	.dismiss {
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
		padding: 0;
		font-size: 11px;
		opacity: 0.7;
	}

	.dismiss:hover {
		opacity: 1;
	}

	/* Full-screen overlay */
	.confirm-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.confirm-box {
		background-color: #1f2937;
		border: 1px solid #374151;
		border-radius: 12px;
		padding: 24px;
		max-width: 380px;
		width: 90%;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.confirm-warning {
		color: #f9fafb;
		font-size: 14px;
		margin: 0;
	}

	.confirm-detail {
		color: #9ca3af;
		font-size: 13px;
		margin: 0;
	}

	.confirm-unknown {
		color: #fbbf24;
		font-size: 12px;
		margin: 0;
	}

	.confirm-actions {
		display: flex;
		gap: 8px;
		margin-top: 4px;
	}

	.btn-confirm {
		flex: 1;
		padding: 8px;
		border-radius: 6px;
		border: none;
		background-color: #ef4444;
		color: #fff;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
	}

	.btn-confirm:hover {
		background-color: #dc2626;
	}

	.btn-cancel {
		flex: 1;
		padding: 8px;
		border-radius: 6px;
		border: 1.5px solid #374151;
		background-color: transparent;
		color: #9ca3af;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
	}

	.btn-cancel:hover {
		border-color: #6b7280;
		color: #f9fafb;
	}
</style>
