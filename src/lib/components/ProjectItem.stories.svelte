<script lang="ts">
	import type { Meta, StoryObj } from '@storybook/svelte';
	import ProjectItem from './ProjectItem.svelte';

	const meta = {
		title: 'Components/ProjectItem',
		component: ProjectItem,
		tags: ['autodocs'],
		argTypes: {
			project: { control: 'object' }
		}
	} satisfies Meta<ProjectItem>;

	const _meta = meta;
export default _meta;
	type Story = StoryObj<typeof meta>;

	export const Default: Story = {
		args: {
			project: {
				id: '123',
				title: 'Project Title',
				description: 'This is a description of the project.',
				language: 'TypeScript',
				tags: 'svelte, tailwind',
				stars: 42,
				forks: 7,
				isHidden: false
			}
		}
	};

	export const Hidden: Story = {
		args: {
			project: {
				id: '124',
				title: 'Secret Project',
				description: 'This project is hidden from the public portfolio.',
				language: 'Python',
				tags: 'machine-learning',
				stars: 0,
				forks: 0,
				isHidden: true
			}
		}
	};
</script>
