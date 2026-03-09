<script lang="ts">
	import type { Meta, StoryObj } from '@storybook/svelte';
	import Section from './Section.svelte';

	const meta = {
		title: 'Layout/Section',
		component: Section,
		tags: ['autodocs'],
		argTypes: {
			title: { control: 'text' },
			class: { control: 'text' }
		}
	} satisfies Meta<Section>;

	const _meta = meta;
export default _meta;
	type Story = StoryObj<typeof meta>;

	export const Default: Story = {
		args: {
			title: 'Projects',
			children: () =>
				'Section content goes here. This could be a list of projects or other elements.'
		}
	};
</script>
