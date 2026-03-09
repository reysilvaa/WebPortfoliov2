<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		children: Snippet;
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg' | 'icon';
		isLoading?: boolean;
	}

	let {
		children,
		variant = 'primary',
		size = 'md',
		isLoading = false,
		class: className = '',
		disabled,
		type = 'button',
		...rest
	}: Props = $props();

	const variants = {
		primary: 'bg-neutral-900 text-white hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#171717] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none border-2 border-transparent hover:border-neutral-900',
		secondary: 'bg-[#FFDE59] text-neutral-900 border-2 border-neutral-900 shadow-[4px_4px_0px_0px_#171717] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#171717] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:bg-neutral-50',
		outline: 'bg-white border-2 border-neutral-900 shadow-[4px_4px_0px_0px_#171717] text-neutral-900 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#171717] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
		ghost: 'bg-transparent text-neutral-900 hover:bg-neutral-100 border-2 border-transparent hover:border-neutral-900 hover:shadow-[2px_2px_0px_0px_#171717] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
		danger: 'bg-[#FF90E8] text-neutral-900 border-2 border-neutral-900 shadow-[4px_4px_0px_0px_#171717] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#171717] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none'
	};

	const sizes = {
		sm: 'h-8 px-4 text-[12px]',
		md: 'h-11 px-6 text-[14px]',
		lg: 'h-14 px-8 text-[16px]',
		icon: 'h-10 w-10 flex items-center justify-center p-0'
	};

	const baseClass = 'inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
</script>

<button
	{type}
	class="{baseClass} {variants[variant]} {sizes[size]} {className}"
	disabled={disabled || isLoading}
	{...rest}
>
	{#if isLoading}
		<svg class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
			<circle
				class="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				stroke-width="4"
				fill="none"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	{/if}
	{@render children()}
</button>
