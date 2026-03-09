<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		title?: string;
		description?: string;
		class?: string;
		headerSnippet?: Snippet;
		footerSnippet?: Snippet;
	}

	let {
		children,
		title,
		description,
		class: className = '',
		headerSnippet,
		footerSnippet
	}: Props = $props();
</script>

<div class="border-2 border-neutral-900 bg-white shadow-[6px_6px_0px_0px_#171717] overflow-hidden {className}">
	{#if title || description || headerSnippet}
		<div class="border-b-2 border-neutral-900 bg-neutral-50 px-6 py-5">
			<div class="flex items-center justify-between gap-4">
				<div class="space-y-1">
					{#if title}
						<h3 class="text-[18px] font-black uppercase tracking-tight text-neutral-900">{title}</h3>
					{/if}
					{#if description}
						<p class="text-[14px] font-medium text-neutral-500">{description}</p>
					{/if}
				</div>
				{#if headerSnippet}
					{@render headerSnippet()}
				{/if}
			</div>
		</div>
	{/if}

	<div class="p-6">
		{@render children()}
	</div>

	{#if footerSnippet}
		<div class="border-t-2 border-neutral-900 bg-neutral-100 p-5 px-6 flex justify-end">
			{@render footerSnippet()}
		</div>
	{/if}
</div>
