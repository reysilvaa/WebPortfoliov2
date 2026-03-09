<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		label?: string;
		error?: string;
	}

	let {
		label,
		error,
		value = $bindable(),
		id = 'input-' + Math.random().toString(36).substring(2, 9),
		class: className = '',
		...rest
	}: Props & { value?: string | number | string[] } = $props();

	const baseClass =
		'h-11 w-full rounded-xl border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/5 placeholder:text-neutral-400';
	const errorClass = 'border-red-500 bg-red-50/10 focus:border-red-500';
</script>

<div class="w-full space-y-1.5">
	{#if label}
		<label
			for={id}
			class="ml-1 text-[12px] font-semibold tracking-widest text-neutral-500 uppercase"
			>{label}</label
		>
	{/if}
	<input {id} bind:value class="{baseClass} {error ? errorClass : ''} {className}" {...rest} />
	{#if error}
		<p class="ml-1 text-[11px] font-medium text-red-600">{error}</p>
	{/if}
</div>
