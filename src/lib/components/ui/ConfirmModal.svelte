<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import * as m from '$lib/paraglide/messages';

	interface Props {
		isOpen: boolean;
		title: string;
		message: string;
		onConfirm: () => void;
		onCancel: () => void;
		confirmText?: string;
		cancelText?: string;
		variant?: 'danger' | 'primary';
		isLoading?: boolean;
	}

	let {
		isOpen,
		title,
		message,
		onConfirm,
		onCancel,
		confirmText = m.common_delete(),
		cancelText = m.common_cancel(),
		variant = 'danger',
		isLoading = false
	}: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) onCancel();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<div
		role="dialog"
		aria-modal="true"
		class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
	>
		<!-- Backdrop -->
		<button
			type="button"
			class="fixed inset-0 h-full w-full cursor-default border-none bg-neutral-900/50 backdrop-blur-sm"
			transition:fade={{ duration: 150 }}
			onclick={onCancel}
			aria-label="Close modal"
		></button>

		<!-- Modal -->
		<div
			class="relative w-full max-w-md rounded-2xl border border-neutral-100 bg-white p-6 shadow-2xl sm:p-8"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<div class="mb-6 flex items-start gap-4">
				{#if variant === 'danger'}
					<div
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"
					>
						<Icon name="trash" class="h-5 w-5" />
					</div>
				{/if}
				<div>
					<h2 class="text-xl font-semibold tracking-tight text-neutral-900">
						{title}
					</h2>
					<p class="mt-1.5 text-sm leading-relaxed text-neutral-500">
						{message}
					</p>
				</div>
			</div>

			<div class="flex flex-col-reverse justify-end gap-3 sm:flex-row">
				<Button variant="outline" onclick={onCancel} disabled={isLoading}>
					{cancelText}
				</Button>
				<Button {variant} onclick={onConfirm} {isLoading}>
					{confirmText}
				</Button>
			</div>
		</div>
	</div>
{/if}
