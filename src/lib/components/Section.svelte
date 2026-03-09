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

<section {id} class="mt-32 space-y-12 {className}">
	<h2 class="text-[20px] font-black tracking-widest text-neutral-900 uppercase inline-block border-b-4 border-neutral-900 pb-2 mb-4">{title}</h2>
	{@render children()}
</section>
