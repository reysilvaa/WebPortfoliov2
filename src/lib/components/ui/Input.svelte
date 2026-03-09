<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		label?: string;
		error?: string;
	}

	let {
		label,
		error,
		id = 'input-' + Math.random().toString(36).substring(2, 9),
		class: className = '',
		...rest
	}: Props = $props();

	const baseClass = 'h-11 w-full rounded-xl border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/5 placeholder:text-neutral-400';
	const errorClass = 'border-red-500 bg-red-50/10 focus:border-red-500';
</script>

<div class="space-y-1.5 w-full">
	{#if label}
		<label for={id} class="text-[12px] font-semibold text-neutral-500 uppercase tracking-widest ml-1">{label}</label>
	{/if}
	<input
		{id}
		class="{baseClass} {error ? errorClass : ''} {className}"
		{...rest}
	/>
	{#if error}
		<p class="text-[11px] font-medium text-red-600 ml-1">{error}</p>
	{/if}
</div>
