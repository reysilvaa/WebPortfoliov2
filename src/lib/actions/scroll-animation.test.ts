/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scrollAnimation, createSectionObserver } from './scroll-animation';

class MockClassList {
	private classes = new Set<string>();
	add(name: string) {
		this.classes.add(name);
	}
	remove(name: string) {
		this.classes.delete(name);
	}
	contains(name: string) {
		return this.classes.has(name);
	}
}

function createMockElement(id = ''): any {
	const classList = new MockClassList();
	return {
		id,
		classList,
		getBoundingClientRect: vi.fn().mockReturnValue({ top: 1000, bottom: 1100 })
	};
}

describe('scroll-animation', () => {
	let mockElement: any;
	let mockObserver: any;
	const elementsById = new Map<string, any>();

	beforeEach(() => {
		elementsById.clear();
		mockElement = createMockElement();

		mockObserver = {
			observe: vi.fn(),
			disconnect: vi.fn()
		};

		const MockIntersectionObserver = vi.fn(function (this: any) {
			return mockObserver;
		});

		(global as any).IntersectionObserver = MockIntersectionObserver;
		(global as any).window = { innerHeight: 800 };
		(global as any).requestAnimationFrame = vi.fn((cb) => {
			cb(0);
			return 1;
		});
		(global as any).cancelAnimationFrame = vi.fn();

		(global as any).document = {
			createElement: vi.fn(() => createMockElement()),
			getElementById: vi.fn((id: string) => elementsById.get(id) || null),
			body: {
				appendChild: vi.fn((el: any) => {
					if (el.id) elementsById.set(el.id, el);
					return el;
				}),
				removeChild: vi.fn((el: any) => {
					if (el.id) elementsById.delete(el.id);
					return el;
				})
			}
		};
	});

	it('should observe element when initialized', () => {
		const action = scrollAnimation(mockElement);
		expect(global.IntersectionObserver).toHaveBeenCalled();
		expect(mockObserver.observe).toHaveBeenCalledWith(mockElement);
		expect(typeof action.destroy).toBe('function');
	});

	it('should add class immediately if immediate is true', () => {
		scrollAnimation(mockElement, { immediate: true });
		expect(mockElement.classList.contains('is-visible')).toBe(true);
		expect(global.requestAnimationFrame).toHaveBeenCalled();
	});

	it('should clean up observer on destroy', () => {
		const action = scrollAnimation(mockElement);
		action.destroy();
		expect(mockObserver.disconnect).toHaveBeenCalled();
	});

	describe('createSectionObserver', () => {
		it('should create observer and observe sections', () => {
			const mockCb = vi.fn();

			const section1 = createMockElement('section1');
			document.body.appendChild(section1);

			const observer = createSectionObserver(mockCb, ['section1']);

			expect(global.IntersectionObserver).toHaveBeenCalled();
			expect(mockObserver.observe).toHaveBeenCalledWith(section1);

			observer.destroy();
			expect(mockObserver.disconnect).toHaveBeenCalled();

			document.body.removeChild(section1);
		});
	});
});
