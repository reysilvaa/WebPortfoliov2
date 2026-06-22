<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';
	import type { Snippet } from 'svelte';

	let { 
		id, 
		action = '?/delete', 
		modalTitle, 
		modalMessage, 
		children 
	}: {
		id: string;
		action?: string;
		modalTitle: string;
		modalMessage: string;
		children?: Snippet;
	} = $props();

	let modalOpen = $state(false);
	let loading = $state(false);
	let pendingForm = $state<HTMLFormElement | null>(null);

	function onSubmit(e: Event) {
		e.preventDefault();
		pendingForm = e.target as HTMLFormElement;
		modalOpen = true;
	}

	function handleConfirm() {
		if (pendingForm) {
			pendingForm.requestSubmit();
		}
	}
</script>

<form
	method="POST"
	{action}
	onsubmit={onSubmit}
	use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			await update();
			loading = false;
			modalOpen = false;
		};
	}}
>
	<input type="hidden" name="id" value={id} />
	<Button variant="danger" size="icon" type="submit" title="Delete">
		{#if children}
			{@render children()}
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-trash-2"
			>
				<path d="M3 6h18" />
				<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
				<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
				<line x1="10" x2="10" y1="11" y2="17" />
				<line x1="14" x2="14" y1="11" y2="17" />
			</svg>
		{/if}
	</Button>
</form>

<ConfirmModal
	isOpen={modalOpen}
	title={modalTitle}
	message={modalMessage}
	onConfirm={handleConfirm}
	onCancel={() => (modalOpen = false)}
	isLoading={loading}
/>
