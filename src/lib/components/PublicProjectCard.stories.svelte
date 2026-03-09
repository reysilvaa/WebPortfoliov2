<script lang="ts">
	import type { Meta, StoryObj } from '@storybook/svelte';
	import PublicProjectCard from './PublicProjectCard.svelte';

	const meta = {
		title: 'Components/PublicProjectCard',
		component: PublicProjectCard,
		tags: ['autodocs'],
		argTypes: {
			project: { control: 'object' }
		}
	} satisfies Meta<PublicProjectCard>;

	const _meta = meta;
export default _meta;
	type Story = StoryObj<typeof meta>;

	export const Default: Story = {
		args: {
			project: {
				title: 'Awesome Open Source Project',
				description: 'A very cool project that does amazing things with some technology.',
				liveUrl: 'https://example.com',
				repoUrl: 'https://github.com/example/repo',
				tags: 'svelte, typescript, tailwind'
			}
		}
	};

	export const NoTags: Story = {
		args: {
			project: {
				title: 'Simple Utility Script',
				description: 'Just a small script.',
				liveUrl: null,
				repoUrl: 'https://github.com/example/utility',
				tags: null
			}
		}
	};
</script>
