<script lang="ts">
	import type { Meta, StoryObj } from '@storybook/svelte';
	import ConfirmModal from './ConfirmModal.svelte';

	const meta = {
		title: 'UI/ConfirmModal',
		component: ConfirmModal,
		tags: ['autodocs'],
		argTypes: {
			isOpen: { control: 'boolean' },
			title: { control: 'text' },
			message: { control: 'text' },
			variant: {
				control: 'select',
				options: ['danger', 'primary']
			},
			isLoading: { control: 'boolean' }
		}
	} satisfies Meta<ConfirmModal>;

	const _meta = meta;
	export default _meta;
	type Story = StoryObj<typeof meta>;

	export const Default: Story = {
		args: {
			isOpen: true,
			title: 'Delete Item?',
			message: 'Are you sure you want to delete this item? This action cannot be undone.',
			onConfirm: () => console.log('Confirmed'),
			onCancel: () => console.log('Cancelled'),
			confirmText: 'Delete',
			cancelText: 'Cancel',
			variant: 'danger',
			isLoading: false
		}
	};

	export const Primary: Story = {
		args: {
			isOpen: true,
			title: 'Save Changes?',
			message: 'Do you want to save your progress before leaving the page?',
			onConfirm: () => console.log('Confirmed'),
			onCancel: () => console.log('Cancelled'),
			confirmText: 'Save Changes',
			cancelText: 'Discard',
			variant: 'primary',
			isLoading: false
		}
	};

	export const Loading: Story = {
		args: {
			isOpen: true,
			title: 'Deleting...',
			message: 'Please wait while we process your request.',
			onConfirm: () => console.log('Confirmed'),
			onCancel: () => console.log('Cancelled'),
			confirmText: 'Delete',
			cancelText: 'Cancel',
			variant: 'danger',
			isLoading: true
		}
	};
</script>
