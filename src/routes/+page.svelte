<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import PublicProjectCard from '$lib/components/PublicProjectCard.svelte';
	import Section from '$lib/components/Section.svelte';

	let { data }: { data: PageData } = $props();

	// Fallback if DB is empty
	const fallbackProfile = {
		name: 'Rey Silva.',
		role: 'Full Stack Engineer & Designer',
		bio: 'Crafting digital experiences with precision. Specializing in highly performant architectures, minimal aesthetics, and scalable engineering.',
		avatarUrl: 'https://github.com/reysilvaa.png',
		email: 'contact@reysilva.com',
		github: 'https://github.com/reysilvaa',
		linkedin: 'https://linkedin.com/in/reysilvaa'
	};

	const profile = $derived({
		...fallbackProfile,
		...(data.profile || {})
	});

	const items = $derived({
		projects: data.projects || [],
		pagination: data.pagination,
		certificates: data.certificates || [],
		skills: data.skills || [],
		experiences: data.experiences || []
	});

	let activeSection = $state('home');

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				});
			},
			{ rootMargin: '-20% 0px -60% 0px', threshold: 0.1 }
		);

		document.querySelectorAll('header[id], section[id]').forEach((sec) => {
			observer.observe(sec);
		});

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>{profile.name}</title>
	<meta name="description" content={profile.bio} />
</svelte:head>

<div class="relative min-h-screen overflow-x-hidden pb-32">
	<!-- Minimalist Navigation (Right Side or Top) -->
	<nav
		class="pointer-events-auto fixed top-1/2 right-8 z-50 hidden -translate-y-1/2 flex-col gap-8 lg:flex xl:right-16"
	>
		<a href="{resolve('/')}#home" class="group flex items-center justify-end gap-3 transition-all">
			<span
				class="text-[11px] tracking-widest uppercase transition-all {activeSection === 'home' ||
				activeSection === ''
					? 'text-brand-text opacity-100'
					: 'text-neutral-500 opacity-0 group-hover:opacity-100'}">Home</span
			>
			<div
				class="h-px transition-all {activeSection === 'home' || activeSection === ''
					? 'w-8 bg-brand-text'
					: 'w-4 bg-neutral-300 group-hover:w-6 group-hover:bg-neutral-500'}"
			></div>
		</a>

		{#if items.experiences && items.experiences.length > 0}
			<a
				href="{resolve('/')}#experience"
				class="group flex items-center justify-end gap-3 transition-all"
			>
				<span
					class="text-[11px] tracking-widest uppercase transition-all {activeSection ===
					'experience'
						? 'text-brand-text opacity-100'
						: 'text-neutral-500 opacity-0 group-hover:opacity-100'}">Experience</span
				>
				<div
					class="h-px transition-all {activeSection === 'experience'
						? 'w-8 bg-brand-text'
						: 'w-4 bg-neutral-300 group-hover:w-6 group-hover:bg-neutral-500'}"
				></div>
			</a>
		{/if}

		<a
			href="{resolve('/')}#projects"
			class="group flex items-center justify-end gap-3 transition-all"
		>
			<span
				class="text-[11px] tracking-widest uppercase transition-all {activeSection === 'projects'
					? 'text-brand-text opacity-100'
					: 'text-neutral-500 opacity-0 group-hover:opacity-100'}">Projects</span
			>
			<div
				class="h-px transition-all {activeSection === 'projects'
					? 'w-8 bg-brand-text'
					: 'w-4 bg-neutral-300 group-hover:w-6 group-hover:bg-neutral-500'}"
			></div>
		</a>

		{#if items.certificates.length > 0}
			<a
				href="{resolve('/')}#credentials"
				class="group flex items-center justify-end gap-3 transition-all"
			>
				<span
					class="text-[11px] tracking-widest uppercase transition-all {activeSection ===
					'credentials'
						? 'text-brand-text opacity-100'
						: 'text-neutral-500 opacity-0 group-hover:opacity-100'}">Credentials</span
				>
				<div
					class="h-px transition-all {activeSection === 'credentials'
						? 'w-8 bg-brand-text'
						: 'w-4 bg-neutral-300 group-hover:w-6 group-hover:bg-neutral-500'}"
				></div>
			</a>
		{/if}

		{#if items.skills.length > 0}
			<a
				href="{resolve('/')}#skills"
				class="group flex items-center justify-end gap-3 transition-all"
			>
				<span
					class="text-[11px] tracking-widest uppercase transition-all {activeSection === 'skills'
						? 'text-brand-text opacity-100'
						: 'text-neutral-500 opacity-0 group-hover:opacity-100'}">Stack</span
				>
				<div
					class="h-px transition-all {activeSection === 'skills'
						? 'w-8 bg-brand-text'
						: 'w-4 bg-neutral-300 group-hover:w-6 group-hover:bg-neutral-500'}"
				></div>
			</a>
		{/if}
	</nav>

	<!-- Main Content Area -->
	<main class="mx-auto max-w-5xl px-6 pt-24 sm:pt-32 lg:pr-32">
		<header id="home" class="mb-32 flex flex-col items-start gap-12">
			{#if profile.avatarUrl}
				<div class="h-24 w-24 overflow-hidden rounded-full ring-1 ring-black/5 sm:h-32 sm:w-32">
					<img
						src={profile.avatarUrl}
						alt={profile.name}
						class="h-full w-full object-cover opacity-90 transition-all duration-700 hover:opacity-100"
					/>
				</div>
			{/if}

			<div class="max-w-2xl space-y-6">
				<h1
					class="font-sans text-5xl leading-tight font-medium tracking-tight text-brand-text sm:text-7xl"
				>
					{profile.name}
				</h1>
				<p class="text-[18px] font-medium tracking-wide text-neutral-600">
					{profile.role}
				</p>
				<p class="text-[16px] leading-relaxed text-balance text-brand-text-muted">
					{profile.bio}
				</p>
			</div>

			<div class="flex items-center gap-6 pt-6">
				<a
					href="mailto:{profile.email}"
					rel="external"
					class="group flex items-center gap-3 text-sm font-medium text-neutral-500 transition-colors hover:text-brand-text"
					title="Email"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="transition-transform group-hover:-translate-y-0.5"
						><rect width="20" height="16" x="2" y="4" rx="2" /><path
							d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
						/></svg
					>
					<span class="hidden sm:inline">Email</span>
				</a>
				<a
					href={profile.github}
					target="_blank"
					rel="noopener noreferrer external"
					class="group flex items-center gap-3 text-sm font-medium text-neutral-500 transition-colors hover:text-brand-text"
					title="GitHub"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="transition-transform group-hover:-translate-y-0.5"
						><path
							d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
						/><path d="M9 18c-4.51 2-5-2-7-2" /></svg
					>
					<span class="hidden sm:inline">GitHub</span>
				</a>
				<a
					href={profile.linkedin}
					target="_blank"
					rel="noopener noreferrer external"
					class="group flex items-center gap-3 text-sm font-medium text-neutral-500 transition-colors hover:text-brand-text"
					title="LinkedIn"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="transition-transform group-hover:-translate-y-0.5"
						><path
							d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
						/><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg
					>
					<span class="hidden sm:inline">LinkedIn</span>
				</a>
			</div>
		</header>

		<!-- Experience Section -->
		{#if items.experiences && items.experiences.length > 0}
			<Section id="experience" title="Experience">
				<div class="flex flex-col gap-10">
					{#each items.experiences as exp (exp.id)}
						<div class="group flex flex-col gap-3 transition-opacity">
							<div class="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
								<h3 class="text-[18px] font-medium text-brand-text">{exp.role}</h3>
								<div class="flex items-center gap-3">
									<span class="text-[14px] text-neutral-400">{exp.company}</span>
									<span class="text-[12px] tracking-wide text-neutral-600"
										>{exp.startDate} - {exp.endDate}</span
									>
								</div>
							</div>
							{#if exp.description}
								<p class="max-w-3xl text-[15px] leading-relaxed text-neutral-500">
									{exp.description}
								</p>
							{/if}
						</div>
					{/each}
				</div>
			</Section>
		{/if}

		<!-- Projects Section -->
		<Section id="projects" title={m.public_projects()}>
			<div class="grid grid-cols-1 gap-8 transition-all duration-700 md:grid-cols-2">
				{#each items.projects as project (project.id)}
					<article class="h-full">
						<PublicProjectCard {project} />
					</article>
				{/each}
			</div>

			{#if items.pagination && items.pagination.totalPages > 1}
				<div class="mt-16 flex flex-wrap items-center justify-center gap-2">
					{#each Array.from({ length: items.pagination.totalPages }, (_, i) => i + 1) as p (p)}
						<a
							href="{resolve('/')}?page={p}#projects"
							class="flex h-10 w-10 items-center justify-center rounded-full text-[14px] transition-all
								{items.pagination.page === p
								? 'border border-neutral-200 bg-brand-surface-light font-medium text-brand-text'
								: 'text-neutral-500 hover:bg-black/5 hover:text-brand-text'}"
						>
							{p}
						</a>
					{/each}
				</div>
			{/if}
		</Section>

		<!-- Credentials Section -->
		{#if items.certificates.length > 0}
			<Section id="credentials" title={m.public_credentials()}>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					{#each items.certificates as cert (cert.id)}
						{@const url = cert.imageUrl || cert.credentialUrl || ''}
						{@const udemyMatch = url.match(/udemy\.com\/certificate\/(UC-[\w-]+)/)}
						{@const isDirectImage = url.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i)}
						{@const previewUrl = udemyMatch
							? `https://udemy-certificate.s3.amazonaws.com/image/${udemyMatch[1]}.jpg`
							: isDirectImage
								? url
								: `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`}

						<div
							class="group flex cursor-pointer flex-col gap-4 rounded-3xl border border-neutral-200/60 bg-brand-surface p-6 transition-all hover:border-neutral-300 hover:bg-brand-surface-light"
						>
							{#if cert.credentialUrl}
								<a
									href={cert.credentialUrl}
									target="_blank"
									rel="noopener noreferrer external"
									class="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-neutral-100"
								>
									<img
										src={previewUrl}
										alt={cert.name}
										class="h-full w-full object-cover opacity-90 transition-all duration-700 group-hover:opacity-100"
									/>
								</a>
							{/if}

							<div class="mt-2 flex flex-col gap-1">
								<h3 class="line-clamp-1 text-[16px] font-medium">{cert.name}</h3>
								<span class="text-[13px] text-neutral-500 group-hover:text-neutral-600"
									>{cert.issuer}</span
								>
							</div>
						</div>
					{/each}
				</div>
			</Section>
		{/if}

		<!-- Skills Section -->
		{#if items.skills.length > 0}
			<Section id="skills" title={m.public_stack()}>
				<div class="flex flex-wrap gap-3">
					{#each items.skills as skill (skill.id)}
						<div
							class="flex items-center rounded-full border border-neutral-200/60 bg-brand-surface px-4 py-2 transition-colors hover:border-neutral-300 hover:bg-black/5"
						>
							<span class="text-[13px] font-medium text-brand-text">
								{skill.name}
							</span>
							{#if skill.category}
								<span class="ml-3 text-[11px] tracking-widest text-neutral-500 uppercase">
									{skill.category}
								</span>
							{/if}
						</div>
					{/each}
				</div>
			</Section>
		{/if}

		<!-- Footer -->
		<footer class="mt-40 flex flex-col items-center justify-between gap-6 py-8 sm:flex-row">
			<p class="text-[13px] text-neutral-500">© {new Date().getFullYear()} — {profile.name}</p>

			<a
				href={resolve('/dashboard')}
				class="group flex items-center gap-2 text-[13px] text-neutral-500 transition-colors hover:text-brand-text"
			>
				<span>{m.public_admin()}</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="transition-transform group-hover:translate-x-1"
					><path d="M5 12h14M12 5l7 7-7 7" /></svg
				>
			</a>
		</footer>
	</main>
</div>
