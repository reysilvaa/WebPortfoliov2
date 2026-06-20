<!-- eslint-disable @inlang/paraglide-js/no-unresolved-href -->
<!-- eslint-disable @inlang/paraglide-js/no-unresolved-goto -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/ui/Button.svelte';

	let { children, data } = $props();

	const links = [
		{ href: '/dashboard' as const, label: m.dashboard_settings_title() },
		{ href: '/dashboard/projects' as const, label: m.dashboard_projects_title() },
		{ href: '/dashboard/experiences' as const, label: 'Experiences' },
		{ href: '/dashboard/certificates' as const, label: m.dashboard_credentials_title() },
		{ href: '/dashboard/skills' as const, label: m.dashboard_skills_title() }
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
						if (browser) goto(resolve('/dashboard/login'));
					}
				}
			});
		} catch (e) {
			console.error('Logout failed', e);
			logoutLoading = false;
		}
	}
</script>

<div
	class="flex min-h-screen bg-brand-bg font-sans text-brand-text antialiased selection:bg-brand-text selection:text-brand-bg"
>
	<!-- Left Sidebar Navigation -->
	<aside
		class="hidden w-64 shrink-0 flex-col justify-between border-r border-neutral-200 bg-brand-surface md:flex"
	>
		<div>
			<div class="flex h-24 items-center px-8">
				<a
					href={resolve('/')}
					class="flex items-center gap-2 text-[16px] font-semibold tracking-tight text-brand-text"
				>
					{data.profile?.name || 'REY SILVA'}
					<span
						class="rounded bg-brand-text px-1.5 py-0.5 text-[9px] tracking-widest text-brand-bg uppercase"
						>Admin</span
					>
				</a>
			</div>
			<nav class="space-y-1 px-4">
				{#each links as link (link.href)}
					<a
						href={resolve(link.href)}
						class="block rounded-lg px-4 py-2.5 text-[13px] font-medium transition-all
							{isActive(link.href)
							? 'bg-neutral-200/50 text-brand-text'
							: 'text-neutral-600 hover:bg-neutral-100 hover:text-brand-text'}"
					>
						{link.label}
					</a>
				{/each}
			</nav>
		</div>
		<div class="border-t border-neutral-200 bg-brand-surface p-4">
			<Button
				variant="ghost"
				size="md"
				class="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
				onclick={logout}
				isLoading={logoutLoading}
			>
				{logoutLoading ? 'Signing Out...' : 'Sign Out'}
			</Button>
		</div>
	</aside>

	<!-- Main Content Area -->
	<main class="flex h-screen flex-1 flex-col overflow-hidden bg-brand-surface-light">
		<!-- Mobile Header (Hidden on Desktop) -->
		<header
			class="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-brand-surface px-4 md:hidden"
		>
			<a href={resolve('/')} class="text-[15px] font-semibold tracking-tight text-brand-text">
				{data.profile?.name || 'REY SILVA'}
			</a>
			<Button
				variant="ghost"
				size="sm"
				class="text-red-600"
				onclick={logout}
				isLoading={logoutLoading}>Out</Button
			>
		</header>

		<!-- Mobile Nav (Temp Solution) -->
		<nav
			class="flex shrink-0 overflow-x-auto border-b border-neutral-200 bg-brand-surface md:hidden"
		>
			{#each links as link (link.href)}
				<a
					href={resolve(link.href)}
					class="shrink-0 px-4 py-3 text-[13px] font-medium {isActive(link.href)
						? 'border-b-2 border-brand-text text-brand-text'
						: 'text-neutral-600'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<!-- Content scrollable area -->
		<div class="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
			<div class="mx-auto max-w-6xl">
				{@render children()}
			</div>
		</div>
	</main>
</div>
