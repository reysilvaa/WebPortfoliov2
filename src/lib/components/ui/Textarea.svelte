<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface Props extends HTMLTextareaAttributes {
		label?: string;
		error?: string;
	}

	let {
		label,
		error,
		id = 'textarea-' + Math.random().toString(36).substring(2, 9),
		class: className = '',
		...rest
	}: Props = $props();

	const baseClass = 'h-32 w-full rounded-xl border border-neutral-200 px-4 py-3 text-[14px] transition-all outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/5 placeholder:text-neutral-400';
	const errorClass = 'border-red-500 bg-red-50/10 focus:border-red-500';
</script>

<div class="space-y-1.5 w-full">
	{#if label}
		<label for={id} class="text-[12px] font-semibold text-neutral-500 uppercase tracking-widest ml-1">{label}</label>
	{/if}
	<textarea
		{id}
		class="{baseClass} {error ? errorClass : ''} {className}"
		{...rest}
	></textarea>
	{#if error}
		<p class="text-[11px] font-medium text-red-600 ml-1">{error}</p>
	{/if}
</div>
