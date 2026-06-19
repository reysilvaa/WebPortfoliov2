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

<div class="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm {className}">
	{#if title || description || headerSnippet}
		<div class="border-b border-neutral-100 bg-white px-6 py-5">
			<div class="flex items-center justify-between gap-4">
				<div class="space-y-1">
					{#if title}
						<h3 class="text-[16px] font-semibold text-brand-text">
							{title}
						</h3>
					{/if}
					{#if description}
						<p class="text-[14px] text-neutral-500">{description}</p>
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
		<div class="flex justify-end border-t border-neutral-100 bg-neutral-50/50 p-5 px-6">
			{@render footerSnippet()}
		</div>
	{/if}
</div>
