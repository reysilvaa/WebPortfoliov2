<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		children
	}: {
		title: string;
		description?: string;
		children?: Snippet;
	} = $props();
</script>

<header
	class="mt-2 mb-8 flex flex-col justify-between gap-6 border-b border-neutral-200 pb-6 md:flex-row md:items-end"
>
	<div class="space-y-2">
		<h1 class="text-[28px] font-medium tracking-tight text-brand-text">
			{title}
		</h1>
		{#if description}
			<p class="text-[14px] text-neutral-500">
				{description}
			</p>
		{/if}
	</div>
	{#if children}
		<div class="flex items-center gap-2">
			{@render children()}
		</div>
	{/if}
</header>
