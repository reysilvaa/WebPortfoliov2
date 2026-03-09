<script lang="ts">
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/ui/Button.svelte';

	let { children, data } = $props();

	const links = [
		{ href: '/dashboard', label: m.dashboard_settings_title() },
		{ href: '/dashboard/projects', label: m.dashboard_projects_title() },
		{ href: '/dashboard/certificates', label: m.dashboard_credentials_title() },
		{ href: '/dashboard/skills', label: m.dashboard_skills_title() }
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
		<div class="flex items-center gap-2">
			<a href="/" class="text-[13px] font-bold tracking-tight hover:text-neutral-600 transition-colors uppercase">
				{data.profile?.name || 'REY SILVA'}
			</a>
			<span class="text-[10px] font-bold bg-neutral-900 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Admin</span>
		</div>

		<div class="flex items-center gap-6">
			<span class="hidden text-[12px] text-neutral-400 sm:block">{data.user?.email}</span>
			<Button variant="ghost" size="sm" onclick={logout} isLoading={logoutLoading}>
				{logoutLoading ? 'Signing Out...' : 'Sign Out'}
			</Button>
		</div>
	</header>

	<main class="mx-auto max-w-4xl space-y-12 px-6 pt-16">
		<nav class="flex gap-8 border-b border-neutral-100">
			{#each links as link}
				<a
					href={link.href}
					class="text-[14px] font-medium transition-all pb-4 border-b-2 {isActive(link.href)
						? 'border-neutral-900 text-neutral-900'
						: 'border-transparent text-neutral-400 hover:text-neutral-900'}"
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
