<script lang="ts">
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let { children, data } = $props();

	const links = [
		{ href: '/dashboard', label: 'Settings' },
		{ href: '/dashboard/projects', label: 'Projects' },
		{ href: '/dashboard/certificates', label: 'Credentials' },
		{ href: '/dashboard/skills', label: 'Stack' }
	];

	function isActive(href: string) {
		return page.url.pathname === href;
	}

	let logoutLoading = $state(false);
	async function logout() {
		if (logoutLoading) return;
		logoutLoading = true;
		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						if (browser) goto('/dashboard/login');
					}
				}
			});
		} catch (e) {
			console.error('Logout failed', e);
			logoutLoading = false;
		}
	}
</script>

<div class="min-h-screen bg-white pb-32 font-sans text-neutral-900 antialiased">
	<header class="flex h-16 items-center justify-between border-b border-neutral-100 px-6">
		<a href="/" class="text-[13px] font-semibold tracking-tight">REY SILVA</a>

		<div class="flex items-center gap-6">
			<span class="hidden text-[12px] text-neutral-400 sm:block">{data.user?.email}</span>
			<button
				onclick={logout}
				disabled={logoutLoading}
				class="text-[12px] font-medium text-neutral-950 transition-colors hover:text-neutral-500 disabled:opacity-50"
			>
				{logoutLoading ? 'Signing Out...' : 'Sign Out'}
			</button>
		</div>
	</header>

	<main class="mx-auto max-w-2xl space-y-12 px-6 pt-16">
		<nav class="flex gap-6 border-b border-neutral-100 pb-4">
			{#each links as link}
				<a
					href={link.href}
					class="text-[13px] font-medium transition-colors {isActive(link.href)
						? '-mb-4 border-b-2 border-neutral-900 pb-4 text-neutral-900'
						: 'text-neutral-400 hover:text-neutral-900'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="pt-4">
			{@render children()}
		</div>
	</main>
</div>
