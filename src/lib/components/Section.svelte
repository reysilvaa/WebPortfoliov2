<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children: Snippet;
		class?: string;
	}

	let { title, children, class: className = '' }: Props = $props();
</script>

<section class="mt-24 space-y-12 {className}">
	<h2 class="text-[13px] font-semibold tracking-widest text-neutral-400 uppercase">{title}</h2>
	{@render children()}
</section>
