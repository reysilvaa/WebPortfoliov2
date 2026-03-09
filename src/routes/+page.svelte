<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import PublicProjectCard from '$lib/components/PublicProjectCard.svelte';
	import Section from '$lib/components/Section.svelte';

	let { data }: { data: PageData } = $props();

	// Fallback if DB is empty
	const fallbackProfile = {
		name: 'Rey Silva',
		role: 'Full Stack Engineer',
		bio: 'I build high-performance web applications and digital experiences with a focus on precision and scalability. Currently specializing in SvelteKit and modern backend architectures.',
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
		certificates: data.certificates || [],
		skills: data.skills || []
	});
</script>

<svelte:head>
	<title>{profile.name}</title>
	<meta name="description" content={profile.bio} />
</svelte:head>

<div
	class="min-h-screen bg-white pb-32 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900"
>
	<main class="mx-auto max-w-2xl px-6 pt-24 sm:pt-40">
		<!-- Hero -->
		<section class="space-y-6">
			<div class="space-y-2">
				<h1 class="text-2xl font-semibold tracking-tight text-neutral-950">
					{profile.name}
				</h1>
				<p class="text-neutral-500">
					{profile.role}
				</p>
			</div>

			<p class="max-w-lg text-[15px] leading-relaxed text-neutral-600">
				{profile.bio}
			</p>

			<div class="flex items-center gap-5 pt-2">
				<a
					href="mailto:{profile.email}"
					class="text-[13px] font-medium text-neutral-950 transition-colors hover:text-neutral-600"
				>
					Email
				</a>
				<a
					href={profile.github}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[13px] font-medium text-neutral-950 transition-colors hover:text-neutral-600"
				>
					GitHub
				</a>
				<a
					href={profile.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[13px] font-medium text-neutral-950 transition-colors hover:text-neutral-600"
				>
					LinkedIn
				</a>
			</div>
		</section>

		<!-- Projects -->
		<Section title={m.public_projects()}>
			<div class="space-y-10">
				{#each items.projects as project}
					<PublicProjectCard {project} />
				{/each}
			</div>
		</Section>

		{#if items.certificates.length > 0}
			<!-- Credentials -->
			<Section title={m.public_credentials()}>
				<div class="space-y-8">
					{#each items.certificates as cert}
						<div class="group flex items-start justify-between">
							<div class="space-y-1">
								<h3 class="text-[15px] font-medium text-neutral-950">{cert.name}</h3>
								<p class="text-[13px] text-neutral-500">{cert.issuer}</p>
							</div>
							{#if cert.credentialUrl}
								<a
									href={cert.credentialUrl}
									target="_blank"
									class="text-[11px] font-medium tracking-wider text-neutral-400 uppercase transition-colors hover:text-neutral-950"
									>{m.public_verify()}</a
								>
							{/if}
						</div>
					{/each}
				</div>
			</Section>
		{/if}

		<!-- Skills -->
		{#if items.skills.length > 0}
			<Section title={m.public_stack()}>
				<div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
					{#each items.skills as skill}
						<div class="space-y-1">
							<p class="text-[11px] tracking-wider text-neutral-400 uppercase">
								{skill.category || 'Tech'}
							</p>
							<p class="text-[14px] font-medium text-neutral-800">{skill.name}</p>
						</div>
					{/each}
				</div>
			</Section>
		{/if}

		<!-- Footer -->
		<footer
			class="mt-32 flex items-center justify-between border-t border-neutral-100 pt-12 text-neutral-400"
		>
			<p class="text-[12px]">© {new Date().getFullYear()} — {profile.name}</p>
			<a href="/dashboard" class="text-[12px] transition-colors hover:text-neutral-950">
				{m.public_admin()}
			</a>
		</footer>
	</main>
</div>
