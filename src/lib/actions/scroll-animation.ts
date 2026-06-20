/**
 * Svelte action: scroll-animation
 *
 * Usage: <div use:scrollAnimation class="k-anim fade-up">
 *
 * Each element manages its own IntersectionObserver lifecycle.
 * No global state, no race conditions, no MutationObserver needed.
 * Works for initial render, filtered lists, and paginated content.
 */

interface ScrollAnimationOptions {
	/** rootMargin for IntersectionObserver. Default: '-10% 0px -10% 0px' */
	rootMargin?: string;
	/** threshold for IntersectionObserver. Default: 0.1 */
	threshold?: number;
	/** If true, element becomes visible immediately without waiting for intersection. Useful for above-the-fold content. */
	immediate?: boolean;
}

export function scrollAnimation(
	node: Element,
	options: ScrollAnimationOptions = {}
): { destroy: () => void } {
	const { rootMargin = '-10% 0px -10% 0px', threshold = 0.1, immediate = false } = options;

	// Already visible — nothing to do
	if (node.classList.contains('is-visible')) {
		return { destroy: () => {} };
	}

	// For above-the-fold elements (hero), make visible immediately
	if (immediate) {
		// Use requestAnimationFrame so CSS transition has a chance to start
		const raf = requestAnimationFrame(() => {
			node.classList.add('is-visible');
		});
		return { destroy: () => cancelAnimationFrame(raf) };
	}

	// Check if already in viewport when action is first applied
	// (handles dynamically added elements like Show More, skill filter)
	const rect = node.getBoundingClientRect();
	const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
	if (inViewport) {
		const raf = requestAnimationFrame(() => {
			node.classList.add('is-visible');
		});
		return { destroy: () => cancelAnimationFrame(raf) };
	}

	// Not in viewport — use IntersectionObserver
	let observer: IntersectionObserver | null = new IntersectionObserver(
		(entries) => {
			const entry = entries[0];
			if (entry.isIntersecting) {
				node.classList.add('is-visible');
				observer?.disconnect();
				observer = null;
			}
		},
		{ rootMargin, threshold }
	);

	observer.observe(node);

	return {
		destroy() {
			observer?.disconnect();
			observer = null;
		}
	};
}

/**
 * Dedicated IntersectionObserver for tracking which section is active.
 * Used exclusively by +page.svelte for the TimelineNav active state.
 * Separate from scroll-animation to avoid coupling.
 */
export function createSectionObserver(
	onActive: (sectionId: string) => void,
	sectionIds: string[]
): { destroy: () => void } {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && entry.target.id && sectionIds.includes(entry.target.id)) {
					onActive(entry.target.id);
				}
			});
		},
		{ rootMargin: '-30% 0px -30% 0px', threshold: 0 }
	);

	// Observe immediately — sections exist from SSR
	sectionIds.forEach((id) => {
		const el = document.getElementById(id);
		if (el) observer.observe(el);
	});

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
