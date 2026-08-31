/**
 * Builds the standard add/update/delete form actions shared by the dashboard
 * CRUD pages. Parses form data for the given field lists and delegates to
 * the provided service callbacks.
 */
export function createCrudActions<
	TAdd extends Record<string, unknown>,
	TUpdate extends Record<string, unknown>
>({
	addFields,
	updateFields,
	add,
	update,
	remove
}: {
	addFields?: string[];
	updateFields: string[];
	add?: (data: TAdd) => Promise<unknown>;
	update: (id: string, data: TUpdate) => Promise<unknown>;
	remove: (id: string) => Promise<unknown>;
}) {
	function parse(formData: FormData, fields: string[]): Record<string, string | null> {
		const out: Record<string, string | null> = {};
		for (const field of fields) {
			out[field] = formData.get(field) as string | null;
		}
		return out;
	}

	const actions: Record<string, (event: { request: Request }) => Promise<{ success: true }>> = {};

	if (add && addFields) {
		actions.add = async ({ request }) => {
			const formData = await request.formData();
			await add(parse(formData, addFields) as TAdd);
			return { success: true };
		};
	}

	actions.update = async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		await update(id, parse(formData, updateFields) as TUpdate);
		return { success: true };
	};

	actions.delete = async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		await remove(id);
		return { success: true };
	};

	return actions;
}
