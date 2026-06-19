<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import Button from './Button.svelte';
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
			class="fixed inset-0 h-full w-full cursor-default border-none bg-neutral-900/60 backdrop-blur-sm"
			transition:fade={{ duration: 200 }}
			onclick={onCancel}
			aria-label="Close modal"
		></button>

		<!-- Modal -->
		<div
			class="relative w-full max-w-md border-4 border-neutral-900 bg-white p-8 shadow-[12px_12px_0px_0px_#171717]"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<div class="mb-6">
				<h2 class="mb-2 text-2xl font-black tracking-tighter text-neutral-900 uppercase">
					{title}
				</h2>
				<p class="text-[14px] leading-relaxed font-bold tracking-widest text-neutral-500 uppercase">
					{message}
				</p>
			</div>

			<div class="flex flex-col justify-end gap-4 sm:flex-row">
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
