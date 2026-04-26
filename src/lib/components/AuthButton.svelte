<script lang="ts">
	let { authenticated }: { authenticated: boolean } = $props();
</script>

{#if authenticated}
	<a href="/cdn-cgi/access/logout" class="auth-btn">Log out</a>
{:else}
	<a href="/cdn-cgi/access/login" class="auth-btn">Log in</a>
{/if}

<style>
	.auth-btn {
		padding: 5px 12px;
		border-radius: 6px;
		border: 1.5px solid #374151;
		background-color: transparent;
		color: #9ca3af;
		font-size: 12px;
		font-weight: 500;
		text-decoration: none;
		white-space: nowrap;
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.auth-btn:hover {
		border-color: #6b7280;
		color: #f9fafb;
	}
</style>
