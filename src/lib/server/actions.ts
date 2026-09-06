import { redirect } from '@sveltejs/kit';

// ponytail: hard cap on form field size — revisit only if >10k-char fields become legit.
const MAX_FIELD_LENGTH = 10_000;

type AdminEvent = { request: Request; locals: { user?: unknown } };

export function requireOwner(event: AdminEvent): void {
	if (!event.locals.user) redirect(303, '/dashboard/login');
}

export function parseFormData<T extends Record<string, unknown> = Record<string, string | null>>(
	formData: FormData,
	fields: string[]
): T {
	const out: Record<string, string | null> = {};
	for (const field of fields) {
		const value = formData.get(field) as string | null;
		out[field] =
			value && value.length > MAX_FIELD_LENGTH ? value.slice(0, MAX_FIELD_LENGTH) : value;
	}
	return out as T;
}

export function createCrudActions<
	TAdd extends Record<string, unknown>,
	TUpdate extends Record<string, unknown>
>({
	addFields,
	updateFields,
	add,
	update,
	remove,
	authorize = requireOwner
}: {
	addFields?: string[];
	updateFields: string[];
	add?: (data: TAdd) => Promise<unknown>;
	update: (id: string, data: TUpdate) => Promise<unknown>;
	remove: (id: string) => Promise<unknown>;
	authorize?: (event: AdminEvent) => void;
}) {
	const actions: Record<string, (event: AdminEvent) => Promise<{ success: true }>> = {};

	if (add && addFields) {
		actions.add = async (event) => {
			authorize(event);
			const formData = await event.request.formData();
			await add(parseFormData<TAdd>(formData, addFields));
			return { success: true };
		};
	}

	actions.update = async (event) => {
		authorize(event);
		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		await update(id, parseFormData<TUpdate>(formData, updateFields));
		return { success: true };
	};

	actions.delete = async (event) => {
		authorize(event);
		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		await remove(id);
		return { success: true };
	};

	return actions;
}
