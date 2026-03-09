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
		primary: 'bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-400',
		secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 disabled:bg-neutral-50',
		outline: 'border border-neutral-200 bg-transparent hover:border-neutral-900 hover:text-neutral-900 text-neutral-600',
		ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900',
		danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
	};

	const sizes = {
		sm: 'h-8 px-3 text-[11px]',
		md: 'h-10 px-5 text-[13px]',
		lg: 'h-12 px-8 text-[14px]',
		icon: 'h-9 w-9 flex items-center justify-center p-0'
	};

	const baseClass = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none disabled:cursor-not-allowed';
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
