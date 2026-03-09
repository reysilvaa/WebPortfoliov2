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
		'h-12 w-full border-2 border-neutral-900 bg-white px-4 text-[15px] font-medium transition-all outline-none focus:border-neutral-900 focus:shadow-[4px_4px_0px_0px_#171717] focus:-translate-y-0.5 placeholder:text-neutral-400 placeholder:font-normal';
	const errorClass = 'border-red-500 bg-red-50 focus:border-red-500 focus:shadow-[4px_4px_0px_0px_#ef4444]';
</script>

<div class="w-full space-y-2">
	{#if label}
		<label
			for={id}
			class="ml-1 inline-block text-[13px] font-black tracking-widest text-neutral-900 uppercase"
			>{label}</label
		>
	{/if}
	<input {id} bind:value class="{baseClass} {error ? errorClass : ''} {className}" {...rest} />
	{#if error}
		<p class="ml-1 font-bold text-[12px] text-red-600 uppercase tracking-widest">{error}</p>
	{/if}
</div>
