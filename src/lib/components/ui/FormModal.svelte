<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from './Button.svelte';
	import type { Snippet } from 'svelte';

	let {
		isOpen = $bindable(false),
		title,
		description,
		action = '?/update',
		submitLabel = 'Save Changes',
		onSubmitted,
		onCancel,
		children
	}: {
		isOpen: boolean;
		title: string;
		description: string;
		action?: string;
		submitLabel?: string;
		onSubmitted?: () => void;
		onCancel?: () => void;
		children: Snippet;
	} = $props();

	let loading = $state(false);

	function cancel() {
		onCancel?.();
		isOpen = false;
	}
</script>

{#if isOpen}
	<div
		role="dialog"
		aria-modal="true"
		class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
	>
		<!-- Backdrop -->
		<button
			type="button"
			class="fixed inset-0 h-full w-full cursor-default border-none bg-neutral-900/60 backdrop-blur-sm"
			onclick={cancel}
			aria-label="Close modal"
		></button>

		<!-- Modal -->
		<form
			method="POST"
			{action}
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
					isOpen = false;
					onSubmitted?.();
				};
			}}
			class="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl"
		>
			<div class="mb-6">
				<h2 class="mb-2 text-[24px] font-semibold tracking-tight text-brand-text">{title}</h2>
				<p class="text-[14px] text-neutral-500">{description}</p>
			</div>

			{@render children()}

			<div class="mt-8 flex justify-end gap-4">
				<Button variant="outline" type="button" onclick={cancel}>Cancel</Button>
				<Button type="submit" isLoading={loading}>{submitLabel}</Button>
			</div>
		</form>
	</div>
{/if}
