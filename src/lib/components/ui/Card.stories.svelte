<script lang="ts">
	import type { Meta, StoryObj } from '@storybook/svelte';
	import Card from './Card.svelte';

	const meta = {
		title: 'UI/Card',
		component: Card,
		tags: ['autodocs'],
		argTypes: {
			title: { control: 'text' },
			description: { control: 'text' }
		}
	} satisfies Meta<Card>;

	export default meta;
	type Story = StoryObj<typeof meta>;

	export const Default: Story = {
		args: {
			children: () => 'Card Content'
		}
	};

	export const WithHeader: Story = {
		args: {
			title: 'Card Title',
			description: 'Card Description',
			children: () => 'Card Content'
		}
	};

	export const WithFooter: Story = {
		args: {
			title: 'Settings',
			description: 'Update your profile information.',
			children: () => 'Settings form content goes here.',
			footerSnippet: () => 'Save Changes'
		}
	};
</script>
