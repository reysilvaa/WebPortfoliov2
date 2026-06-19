<script lang="ts">
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/ui/Button.svelte';

	let error = $state('');
	let loading = $state(false);

	async function loginWithGithub() {
		if (loading) return;
		loading = true;
		error = '';

		try {
			await authClient.signIn.social({
				provider: 'github',
				callbackURL: '/dashboard'
			});
		} catch (err: unknown) {
			error = (err as Error).message || 'Github connection failed';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Login</title>
</svelte:head>

<div
	class="relative flex min-h-screen items-center justify-center bg-brand-surface p-6 font-sans text-brand-text selection:bg-brand-text selection:text-brand-bg"
>
	<main class="w-full max-w-[400px]">
		<div
			class="space-y-8 rounded-2xl border border-neutral-200 bg-white p-10 shadow-sm"
		>
			<div class="space-y-2 pb-4">
				<h1 class="text-[28px] leading-none font-semibold tracking-tight text-brand-text">
					{m.public_admin()}
				</h1>
				<p class="text-[14px] text-neutral-500">
					Please authenticate to continue.
				</p>
			</div>

			{#if error}
				<div
					class="rounded-lg bg-red-50 p-4 text-[13px] font-medium text-red-700"
				>
					{error}
				</div>
			{/if}

			<Button
				onclick={loginWithGithub}
				isLoading={loading}
				class="h-12 w-full gap-3"
				size="lg"
			>
				{#if !loading}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="square"
						><path
							d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
						/><path d="M9 18c-4.51 2-5-2-7-2"></path></svg
					>
				{/if}
				{loading ? m.common_loading() : 'Login with GitHub'}
			</Button>

			<div class="pt-4 text-center">
				<a
					href={resolve('/')}
					class="inline-block border-b border-transparent text-[14px] font-medium text-neutral-400 transition-all hover:border-neutral-900 hover:text-neutral-900"
				>
					&larr; Back Home
				</a>
			</div>
		</div>
	</main>
</div>
