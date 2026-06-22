/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scrollAnimation, createSectionObserver } from './scroll-animation';

describe('scroll-animation', () => {
	let mockElement: HTMLElement;
	let mockObserver: any;

	beforeEach(() => {
		mockElement = document.createElement('div');
		mockElement.getBoundingClientRect = vi.fn().mockReturnValue({ top: 1000, bottom: 1100 });

		mockObserver = {
			observe: vi.fn(),
			disconnect: vi.fn()
		};

		global.IntersectionObserver = vi.fn().mockImplementation(() => mockObserver) as any;
		global.window.innerHeight = 800;
		global.requestAnimationFrame = vi.fn((cb) => {
			cb(0);
			return 1;
		});
		global.cancelAnimationFrame = vi.fn();
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

			const section1 = document.createElement('section');
			section1.id = 'section1';
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
