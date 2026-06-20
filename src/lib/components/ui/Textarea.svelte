<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface Props extends HTMLTextareaAttributes {
		label?: string;
		error?: string;
	}

	let {
		label,
		error,
		value = $bindable(),
		id = 'textarea-' + Math.random().toString(36).substring(2, 9),
		class: className = '',
		...rest
	}: Props & { value?: string } = $props();

	const baseClass =
		'h-32 w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-[14px] transition-all outline-none focus:border-brand-text focus:ring-1 focus:ring-brand-text placeholder:text-neutral-400';
	const errorClass = 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50';
</script>

<div class="w-full space-y-2">
	{#if label}
		<label
			for={id}
			class="ml-1 inline-block text-[12px] font-medium tracking-wide text-neutral-600 uppercase"
			>{label}</label
		>
	{/if}
	<textarea {id} bind:value class="{baseClass} {error ? errorClass : ''} {className}" {...rest}
	></textarea>
	{#if error}
		<p class="ml-1 text-[12px] text-red-600">{error}</p>
	{/if}
</div>
