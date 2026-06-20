<script lang="ts">
	type Certificate = {
		id: string;
		name: string;
		issuer: string;
		issueDate?: Date | string | null;
		credentialUrl?: string | null;
		imageUrl?: string | null;
	};
	let { items }: { items: { certificates: Certificate[] } } = $props();
</script>

{#if items.certificates.length > 0}
	<section id="certificates" class="mt-40">
		<div class="mb-32 text-center">
			<h2
				class="k-anim mask-up font-mono text-4xl font-black tracking-tighter uppercase sm:text-6xl"
			>
				Credentials
			</h2>
			<div class="k-anim stretch-out mx-auto mt-6 h-px w-24 bg-[#222] delay-2"></div>
		</div>

		<div class="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
			{#each items.certificates as cert, i (cert.id || i)}
				{@const url = cert.imageUrl || cert.credentialUrl || ''}
				{@const udemyMatch = url.match(/udemy\.com\/certificate\/(UC-[\w-]+)/)}
				{@const previewUrl = udemyMatch
					? `https://udemy-certificate.s3.amazonaws.com/image/${udemyMatch[1]}.jpg`
					: url}

				<div
					class="k-anim flip-up group flex flex-col border border-[#222]/15 bg-white/40 p-4 shadow-[4px_4px_0_rgba(34,34,34,0.04)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:border-[#222] hover:shadow-[8px_8px_0_#222]"
					style="transition-delay: {(i % 3) * 100}ms"
				>
					<a
						href={cert.credentialUrl || ''}
						target="_blank"
						rel="external noopener noreferrer"
						aria-label="View Credential"
						class="block overflow-hidden border border-[#222]/10 bg-white/50"
					>
						{#if previewUrl}
							<div class="aspect-4/3 w-full overflow-hidden">
								<img
									src={previewUrl}
									alt={cert.name}
									class="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
								/>
							</div>
						{:else}
							<div
								class="flex aspect-4/3 w-full items-center justify-center bg-[#222] font-mono text-[10px] tracking-widest text-[#f3edde] uppercase"
							>
								No Document
							</div>
						{/if}
					</a>
					<div class="mt-5 flex grow flex-col justify-between">
						<h4
							class="line-clamp-2 font-mono text-sm leading-snug font-black tracking-tight text-[#222] uppercase transition-colors group-hover:text-[#666]"
						>
							{cert.name}
						</h4>
						<div
							class="mt-6 flex items-center justify-between border-t border-[#222]/10 pt-4 font-mono text-[9px] font-bold tracking-[0.2em] text-[#555] uppercase"
						>
							<span>{cert.issuer}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}
