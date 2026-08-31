import { eq } from 'drizzle-orm';
import type { AnySQLiteColumn, AnySQLiteTable } from 'drizzle-orm/sqlite-core';
import { db } from './index';

/**
 * Creates typed add/update/remove operations for a SQLite table,
 * removing the per-entity insert/update/delete boilerplate.
 */
export function createCrud<T extends AnySQLiteTable & { id: AnySQLiteColumn }>(table: T) {
	return {
		add: (data: T['$inferInsert']) => db.insert(table).values(data).returning(),
		update: (id: string, data: Partial<T['$inferInsert']>) =>
			db.update(table).set(data).where(eq(table.id, id)).returning(),
		remove: (id: string) => db.delete(table).where(eq(table.id, id)).returning()
	};
}
