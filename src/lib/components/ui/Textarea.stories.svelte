<script lang="ts">
	import type { Meta, StoryObj } from '@storybook/svelte';
	import Textarea from './Textarea.svelte';

	const meta = {
		title: 'UI/Textarea',
		component: Textarea,
		tags: ['autodocs'],
		argTypes: {
			label: { control: 'text' },
			error: { control: 'text' },
			placeholder: { control: 'text' }
		}
	} satisfies Meta<Textarea>;

	const _meta = meta;
export default _meta;
	type Story = StoryObj<typeof meta>;

	export const Default: Story = {
		args: {
			placeholder: 'Write your content here...'
		}
	};

	export const WithLabel: Story = {
		args: {
			label: 'Bio',
			placeholder: 'Tell us about yourself...'
		}
	};

	export const WithError: Story = {
		args: {
			label: 'Bio',
			placeholder: 'Tell us about yourself...',
			error: 'Bio must be at least 10 characters'
		}
	};
</script>
