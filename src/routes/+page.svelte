<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import './portfolio.css';

	import TimelineNav from '$lib/components/portfolio/TimelineNav.svelte';
	import HeroSection from '$lib/components/portfolio/HeroSection.svelte';
	import ExperienceSection from '$lib/components/portfolio/ExperienceSection.svelte';
	import ProjectsSection from '$lib/components/portfolio/ProjectsSection.svelte';
	import SkillsSection from '$lib/components/portfolio/SkillsSection.svelte';
	import CertificatesSection from '$lib/components/portfolio/CertificatesSection.svelte';

	let { data }: { data: PageData } = $props();

	// Fallback if DB is empty
	const fallbackProfile = {
		name: 'Rey Silva.',
		role: 'Full Stack Engineer',
		bio: 'Translating intricate business requirements into robust, high-performing code. I build resilient systems and lead technical workflows with a systematic approach focused on efficiency and impact.',
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
		certificates: data.certificates || [],
		skills: data.skills || [],
		experiences: data.experiences || []
	});

	let scrollY = $state(0);
	let activeSection = $state('hero');

	$effect(() => {
		// Reference items that change the DOM structure so animations re-trigger
		void items;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						if (
							entry.target.id &&
							['hero', 'work', 'projects', 'skills', 'certificates'].includes(entry.target.id)
						) {
							activeSection = entry.target.id;
						}
					}
				});
			},
			{ rootMargin: '-20% 0px -20% 0px', threshold: 0.1 }
		);

		document.querySelectorAll('.k-anim, section[id]').forEach((el) => {
			observer.observe(el);
		});

		return () => observer.disconnect();
	});
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>{profile.name} | Portfolio</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="kalso-theme relative min-h-screen w-full overflow-x-hidden bg-[#f3edde] text-[#222222] selection:bg-[#222] selection:text-[#f3edde]"
>
	<!-- Cardboard Noise Overlay -->
	<div
		class="pointer-events-none fixed inset-0 z-50 opacity-40 mix-blend-multiply"
		style="background-image: url('https://assets.website-files.com/632362a86148e65d0023fa79/632362a86148e6223d23fad9_cardboard.png'); background-size: 400px;"
	></div>

	<TimelineNav {items} {activeSection} />

	<!-- Fixed Logo and Contact Link -->
	<div class="fixed top-8 left-8 z-40 flex flex-col items-start gap-1">
		<a
			href="#hero"
			class="font-mono text-2xl font-black tracking-tighter transition-opacity hover:opacity-70"
			>{profile.name.split(' ')[0]}.</a
		>
		<a
			href="mailto:{profile.email}"
			class="border-b border-[#222] pb-0.5 font-mono text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:tracking-[0.3em] hover:text-[#555]"
			>Contact</a
		>
	</div>

	<!-- GIANT BACKGROUND TEXT (Changes based on section) -->
	<div
		class="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
	>
		<h2
			class="text-[25vw] leading-none font-black text-[#222] opacity-[0.03] transition-all duration-1000 ease-out"
			style="font-family: 'Inconsolata', monospace; letter-spacing: -0.05em;"
		>
			{#if activeSection === 'hero'}
				HELLO
			{:else if activeSection === 'work'}
				WORK
			{:else if activeSection === 'projects'}
				PROJ
			{:else if activeSection === 'skills'}
				TOOL
			{:else if activeSection === 'certificates'}
				CERT
			{/if}
		</h2>
	</div>

	<main class="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-32 sm:px-12 md:px-24">
		<HeroSection {profile} {scrollY} />
		<ExperienceSection {items} />
		<ProjectsSection {items} />
		<SkillsSection {items} />
		<CertificatesSection {items} />

		<!-- FOOTER -->
		<footer
			class="mt-40 flex flex-col items-center justify-between gap-6 border-t border-[#222]/20 pt-10 sm:flex-row"
		>
			<span class="font-mono text-[10px] font-bold tracking-[0.2em] text-[#555] uppercase">
				© {new Date().getFullYear()}
				{profile.name}
			</span>
			<a
				href={resolve('/dashboard')}
				class="k-anim slide-left font-mono text-[10px] font-bold tracking-[0.2em] text-[#222] uppercase transition-all hover:tracking-[0.3em] hover:underline"
			>
				Admin Dashboard
			</a>
		</footer>
	</main>
</div>
