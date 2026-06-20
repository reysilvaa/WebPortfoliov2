<script lang="ts">
	let {
		items,
		activeSection
	}: {
		items: {
			experiences: unknown[];
			projects: unknown[];
			skills: unknown[];
			certificates: unknown[];
		};
		activeSection: string;
	} = $props();

	const navItems = $derived(
		[
			{ id: 'hero', label: 'Intro', show: true },
			{ id: 'work', label: 'Experience', show: items.experiences.length > 0 },
			{ id: 'projects', label: 'Projects', show: items.projects.length > 0 },
			{ id: 'skills', label: 'Toolbox', show: items.skills.length > 0 },
			{ id: 'certificates', label: 'Credentials', show: items.certificates.length > 0 }
		].filter((n) => n.show)
	);
</script>

<nav
	aria-label="Portfolio sections"
	class="pointer-events-auto fixed top-1/2 right-8 z-40 hidden -translate-y-1/2 flex-col items-end xl:flex"
>
	{#each navItems as item (item.id)}
		{@const isActive = activeSection === item.id}
		<a
			href={`#${item.id}`}
			aria-label="Go to {item.label}"
			aria-current={isActive ? 'true' : undefined}
			class="group flex items-center gap-3 py-5"
		>
			<!-- Label -->
			<span
				class="font-mono text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 {isActive
					? 'text-[#222] opacity-100'
					: 'text-[#222] opacity-0 group-hover:opacity-50'}"
			>
				{item.label}
			</span>

			<!-- Line indicator -->
			<span
				class="block h-0.5 origin-right transition-all duration-300 {isActive
					? 'w-8 bg-[#222]'
					: 'w-3 bg-[#222]/25 group-hover:w-5 group-hover:bg-[#222]/60'}"
			></span>
		</a>
	{/each}
</nav>
