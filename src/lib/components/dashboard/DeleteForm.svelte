<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
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
			<Icon name="trash" />
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
