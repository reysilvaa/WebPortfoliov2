interface ScrollAnimationOptions {
	rootMargin?: string;
	threshold?: number;
	immediate?: boolean;
}

export function scrollAnimation(
	node: Element,
	options: ScrollAnimationOptions = {}
): { destroy: () => void } {
	const { rootMargin = '-10% 0px -10% 0px', threshold = 0.1, immediate = false } = options;

	if (node.classList.contains('is-visible')) {
		return { destroy: () => {} };
	}

	if (immediate) {
		const raf = requestAnimationFrame(() => {
			node.classList.add('is-visible');
		});
		return { destroy: () => cancelAnimationFrame(raf) };
	}

	const rect = node.getBoundingClientRect();
	const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
	if (inViewport) {
		const raf = requestAnimationFrame(() => {
			node.classList.add('is-visible');
		});
		return { destroy: () => cancelAnimationFrame(raf) };
	}

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
