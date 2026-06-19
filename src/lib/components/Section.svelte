<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children: Snippet;
		class?: string;
		id?: string;
	}

	let { title, children, class: className = '', id }: Props = $props();
</script>

<section {id} class="mt-24 space-y-10 {className}">
	<h2 class="mb-6 text-[28px] font-medium tracking-tight text-brand-text">{title}</h2>
	{@render children()}
</section>
