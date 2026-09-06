<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { formatPortfolioToCV } from '$lib/utils/cv';
	import Button from '$lib/components/ui/Button.svelte';

	let { data }: { data: PageData } = $props();

	const cv = $derived(formatPortfolioToCV(data.content));
</script>

<svelte:head>
	<title>Curriculum Vitae | Admin Preview</title>
</svelte:head>

<div class="space-y-8 pb-20">
	<!-- Control Bar (Hidden when printing) -->
	<header
		class="no-print flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
	>
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-brand-text">Curriculum Vitae</h1>
				<span class="rounded bg-[#0F3B7D]/10 px-2 py-0.5 text-xs font-semibold text-[#0F3B7D]">
					ATS Harvard Tech
				</span>
			</div>
			<p class="mt-1 text-sm text-neutral-500">
				Auto-generated from your live database entities & types. Updates here reflect instantly
				across your portfolio.
			</p>
		</div>

		<div class="flex flex-wrap items-center gap-3">
			<a href="/api/resume" download="Moch_Reynald_Silva_Baktiar_CV.pdf" rel="external">
				<Button variant="primary" class="bg-[#0F3B7D] text-white hover:bg-[#0c2e61]">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-2"
						><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
							points="7 10 12 15 17 10"
						/><line x1="12" y1="15" x2="12" y2="3" /></svg
					>
					Download ATS PDF
				</Button>
			</a>

			<Button
				variant="outline"
				onclick={() => window.print()}
				class="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="mr-2"
					><polyline points="6 9 6 2 18 2 18 9" /><path
						d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
					/><rect width="12" height="8" x="6" y="14" /></svg
				>
				Print / Save as PDF
			</Button>
		</div>
	</header>

	<!-- Quick Jump Shortcuts to Manage Each Section (Hidden on Print) -->
	<div
		class="no-print flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs"
	>
		<span class="font-semibold tracking-wider text-neutral-500 uppercase">Quick Edit:</span>
		<a
			href={resolve('/dashboard')}
			class="rounded border border-neutral-200 bg-white px-2.5 py-1 font-medium text-neutral-700 shadow-sm hover:bg-neutral-100"
			>Profile & Contacts</a
		>
		<a
			href={resolve('/dashboard/experiences')}
			class="rounded border border-neutral-200 bg-white px-2.5 py-1 font-medium text-neutral-700 shadow-sm hover:bg-neutral-100"
			>Experiences</a
		>
		<a
			href={resolve('/dashboard/projects')}
			class="rounded border border-neutral-200 bg-white px-2.5 py-1 font-medium text-neutral-700 shadow-sm hover:bg-neutral-100"
			>Projects</a
		>
		<a
			href={resolve('/dashboard/open-source')}
			class="rounded border border-neutral-200 bg-white px-2.5 py-1 font-medium text-neutral-700 shadow-sm hover:bg-neutral-100"
			>Open Source</a
		>
		<a
			href={resolve('/dashboard/education')}
			class="rounded border border-neutral-200 bg-white px-2.5 py-1 font-medium text-neutral-700 shadow-sm hover:bg-neutral-100"
			>Education</a
		>
		<a
			href={resolve('/dashboard/skills')}
			class="rounded border border-neutral-200 bg-white px-2.5 py-1 font-medium text-neutral-700 shadow-sm hover:bg-neutral-100"
			>Skills</a
		>
		<a
			href={resolve('/dashboard/certificates')}
			class="rounded border border-neutral-200 bg-white px-2.5 py-1 font-medium text-neutral-700 shadow-sm hover:bg-neutral-100"
			>Certificates</a
		>
	</div>

	<!-- A4 CV Canvas Container -->
	<div class="flex justify-center overflow-x-auto">
		<article
			id="cv-printable-document"
			class="w-full max-w-205 border border-neutral-200 bg-white p-8 text-[#1F2937] shadow-2xl selection:bg-[#0F3B7D] selection:text-white sm:p-14"
			style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;"
		>
			<!-- 1. Header (Centered Name, Role, Contacts) -->
			<header class="text-center">
				<h1 class="text-[22px] font-bold tracking-tight text-[#0F3B7D] uppercase">
					{cv.personal.fullName}
				</h1>
				<p class="mt-0.5 text-[12px] font-semibold tracking-wide text-[#2B3E50] uppercase">
					{cv.personal.jobTitle}
				</p>
				<div
					class="mt-2 flex flex-wrap items-center justify-center gap-x-2 text-[10.5px] text-[#4B5563]"
				>
					{#if cv.personal.location}
						<span>{cv.personal.location}</span>
					{/if}
					{#if cv.personal.phone}
						<span class="text-neutral-300">|</span>
						<span>{cv.personal.phone}</span>
					{/if}
					{#if cv.personal.email}
						<span class="text-neutral-300">|</span>
						<a
							href="mailto:{cv.personal.email}"
							rel="external"
							class="text-[#0F3B7D] underline hover:opacity-80"
						>
							{cv.personal.email}
						</a>
					{/if}
					{#if cv.personal.website}
						<span class="text-neutral-300">|</span>
						<a
							href={cv.personal.website}
							target="_blank"
							rel="external noopener noreferrer"
							class="text-[#0F3B7D] underline hover:opacity-80"
						>
							{cv.personal.website.replace(/^https?:\/\//, '')}
						</a>
					{/if}
					{#if cv.personal.linkedin}
						<span class="text-neutral-300">|</span>
						<a
							href={cv.personal.linkedin}
							target="_blank"
							rel="external noopener noreferrer"
							class="text-[#0F3B7D] underline hover:opacity-80"
						>
							{cv.personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
						</a>
					{/if}
				</div>
			</header>

			<!-- 2. Professional Summary -->
			{#if cv.personal.summary}
				<section class="mt-5">
					<h2 class="text-[12px] font-bold tracking-wider text-[#0F3B7D] uppercase">Summary</h2>
					<div class="mt-0.5 mb-2 h-px w-full bg-[#0F3B7D]"></div>
					<p class="text-justify text-[10.5px] leading-relaxed text-[#1F2937]">
						{cv.personal.summary}
					</p>
				</section>
			{/if}

			<!-- 3. Technical Skills -->
			{#if cv.skillGroups.length > 0}
				<section class="mt-4">
					<h2 class="text-[12px] font-bold tracking-wider text-[#0F3B7D] uppercase">
						Technical Skills
					</h2>
					<div class="mt-0.5 mb-2 h-px w-full bg-[#0F3B7D]"></div>
					<div class="space-y-1 text-[10.5px] leading-snug">
						{#each cv.skillGroups as group (group.category)}
							<div>
								<span class="font-bold text-brand-text">{group.category}:</span>
								<span class="ml-1 text-[#1F2937]">{group.skills.join(', ')}</span>
							</div>
						{/each}
					</div>
				</section>
			{/if}

			<!-- 4. Work Experience -->
			{#if cv.experiences.length > 0}
				<section class="mt-4">
					<h2 class="text-[12px] font-bold tracking-wider text-[#0F3B7D] uppercase">
						Work Experience
					</h2>
					<div class="mt-0.5 mb-2.5 h-px w-full bg-[#0F3B7D]"></div>
					<div class="space-y-3.5">
						{#each cv.experiences as exp (exp.company + exp.role)}
							<div>
								<div class="flex items-baseline justify-between text-[11px]">
									<div>
										<span class="font-bold text-brand-text">{exp.company}</span>
										<span class="text-neutral-600"> — {exp.role}</span>
									</div>
									<div class="shrink-0 text-[10px] font-medium text-neutral-500">
										{exp.startDate} – {exp.endDate}
										{exp.location ? `| ${exp.location}` : ''}
									</div>
								</div>
								{#if exp.bullets.length > 0}
									<ul class="mt-1 space-y-1 pl-4 text-[10.5px] leading-normal text-[#1F2937]">
										{#each exp.bullets as bullet, i (i)}
											<li class="list-disc">
												{#if bullet.prefix}
													<strong class="font-semibold text-brand-text">{bullet.prefix}:</strong>
												{/if}
												<span>{bullet.text}</span>
												{#if bullet.linkText && bullet.linkUrl}
													<a
														href={bullet.linkUrl}
														target="_blank"
														rel="external noopener noreferrer"
														class="ml-1 text-[#0F3B7D] underline"
													>
														{bullet.linkText}
													</a>
												{/if}
											</li>
										{/each}
									</ul>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/if}

			<!-- 5. Selected Projects -->
			{#if cv.projects.length > 0}
				<section class="mt-4">
					<h2 class="text-[12px] font-bold tracking-wider text-[#0F3B7D] uppercase">
						Selected Projects
					</h2>
					<div class="mt-0.5 mb-2.5 h-px w-full bg-[#0F3B7D]"></div>
					<div class="space-y-3.5">
						{#each cv.projects as proj (proj.title)}
							<div>
								<div class="flex items-baseline justify-between text-[11px]">
									<div>
										<span class="font-bold text-brand-text">{proj.title}</span>
										{#if proj.subtitle}
											<span class="text-neutral-600"> | {proj.subtitle}</span>
										{/if}
									</div>
									{#if proj.period}
										<div class="shrink-0 text-[10px] font-medium text-neutral-500">
											{proj.period}
										</div>
									{/if}
								</div>
								{#if proj.bullets.length > 0}
									<ul class="mt-1 space-y-1 pl-4 text-[10.5px] leading-normal text-[#1F2937]">
										{#each proj.bullets as bullet, i (i)}
											<li class="list-disc">
												{#if bullet.prefix}
													<strong class="font-semibold text-brand-text">{bullet.prefix}:</strong>
												{/if}
												<span>{bullet.text}</span>
												{#if bullet.linkText && bullet.linkUrl}
													<a
														href={bullet.linkUrl}
														target="_blank"
														rel="external noopener noreferrer"
														class="ml-1 text-[#0F3B7D] underline"
													>
														{bullet.linkText}
													</a>
												{/if}
											</li>
										{/each}
									</ul>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/if}

			<!-- 6. Open-Source Contributions -->
			{#if cv.openSource.length > 0}
				<section class="mt-4">
					<h2 class="text-[12px] font-bold tracking-wider text-[#0F3B7D] uppercase">
						Open-Source Contributions
					</h2>
					<div class="mt-0.5 mb-2.5 h-px w-full bg-[#0F3B7D]"></div>
					<div class="space-y-3.5">
						{#each cv.openSource as os (os.title)}
							<div>
								<div class="flex items-baseline justify-between text-[11px]">
									<div>
										<span class="font-bold text-brand-text">{os.title}</span>
										{#if os.role}
											<span class="text-neutral-600"> ({os.role})</span>
										{/if}
									</div>
									{#if os.period}
										<div class="shrink-0 text-[10px] font-medium text-neutral-500">
											{os.period}
										</div>
									{/if}
								</div>
								{#if os.bullets.length > 0}
									<ul class="mt-1 space-y-1 pl-4 text-[10.5px] leading-normal text-[#1F2937]">
										{#each os.bullets as bullet, i (i)}
											<li class="list-disc">
												{#if bullet.prefix}
													<strong class="font-semibold text-brand-text">{bullet.prefix}:</strong>
												{/if}
												<span>{bullet.text}</span>
												{#if bullet.linkText && bullet.linkUrl}
													<a
														href={bullet.linkUrl}
														target="_blank"
														rel="external noopener noreferrer"
														class="ml-1 text-[#0F3B7D] underline"
													>
														{bullet.linkText}
													</a>
												{/if}
											</li>
										{/each}
									</ul>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/if}

			<!-- 7. Education -->
			{#if cv.education.length > 0}
				<section class="mt-4">
					<h2 class="text-[12px] font-bold tracking-wider text-[#0F3B7D] uppercase">Education</h2>
					<div class="mt-0.5 mb-2 h-px w-full bg-[#0F3B7D]"></div>
					<div class="space-y-2">
						{#each cv.education as edu (edu.school + edu.degree)}
							<div class="text-[10.5px]">
								<div class="flex items-baseline justify-between">
									<span class="font-bold text-brand-text">{edu.school}</span>
									<span class="text-[10px] font-medium text-neutral-500">{edu.period}</span>
								</div>
								<div class="flex items-baseline justify-between text-neutral-600">
									<span>{edu.degree}</span>
									{#if edu.location}
										<span class="text-[10px] text-neutral-500">{edu.location}</span>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/if}

			<!-- 8. Certifications -->
			{#if cv.certificates.length > 0}
				<section class="mt-4">
					<h2 class="text-[12px] font-bold tracking-wider text-[#0F3B7D] uppercase">
						Certifications
					</h2>
					<div class="mt-0.5 mb-2 h-px w-full bg-[#0F3B7D]"></div>
					<div class="space-y-1 text-[10.5px]">
						{#each cv.certificates as cert (cert.name)}
							<div class="flex items-baseline justify-between">
								<div>
									<span class="font-bold text-brand-text">{cert.name}</span>
									<span class="text-neutral-600"> — {cert.issuer}</span>
								</div>
								{#if cert.issueDate}
									<span class="text-[10px] font-medium text-neutral-500">{cert.issueDate}</span>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/if}
		</article>
	</div>
</div>

<style>
	@media print {
		:global(aside),
		:global(header.no-print),
		:global(nav),
		.no-print {
			display: none !important;
		}

		:global(body),
		:global(main) {
			background: white !important;
			margin: 0 !important;
			padding: 0 !important;
			overflow: visible !important;
		}

		#cv-printable-document {
			border: none !important;
			box-shadow: none !important;
			max-width: 100% !important;
			padding: 0 !important;
			margin: 0 !important;
		}
	}
</style>
