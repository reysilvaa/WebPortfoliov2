<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>{page.status === 404 ? 'Page Not Found' : 'Error'} | Reynald Silva</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="description" content="The page you are looking for could not be found." />
</svelte:head>

<div
	class="flex min-h-screen flex-col items-center justify-center gap-6 bg-brand-bg px-6 text-center font-sans text-brand-text"
>
	<p class="font-mono text-sm font-bold tracking-[0.3em] text-brand-text-muted uppercase">Error</p>
	<h1 class="font-mono text-7xl font-black tracking-tighter uppercase">{page.status}</h1>
	<p class="max-w-md text-sm leading-relaxed text-brand-text-muted">
		The page you are looking for could not be found.
	</p>
	<a
		href={resolve('/')}
		class="mt-2 border border-brand-text bg-brand-text px-6 py-2.5 font-mono text-xs font-bold tracking-widest text-brand-bg uppercase transition-all hover:bg-transparent hover:text-brand-text"
	>
		Back Home
	</a>
</div>
