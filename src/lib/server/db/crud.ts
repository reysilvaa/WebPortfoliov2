import { eq, asc, desc } from 'drizzle-orm';
import type { AnySQLiteColumn, AnySQLiteTable } from 'drizzle-orm/sqlite-core';
import { db } from './index';

/**
 * Generic BaseRepository providing type-safe OOP CRUD operations.
 */
export class BaseRepository<T extends AnySQLiteTable & { id: AnySQLiteColumn }> {
	constructor(public readonly table: T) {}

	async getAll(orderColumn?: AnySQLiteColumn, direction: 'asc' | 'desc' = 'asc') {
		const query = db.select().from(this.table);
		if (orderColumn) {
			return query.orderBy(direction === 'asc' ? asc(orderColumn) : desc(orderColumn));
		}
		return query;
	}

	async getById(id: string): Promise<T['$inferSelect'] | null> {
		const result = await db.select().from(this.table).where(eq(this.table.id, id)).limit(1);
		return (result[0] as T['$inferSelect']) || null;
	}

	async add(data: T['$inferInsert']) {
		return db.insert(this.table).values(data).returning();
	}

	async update(id: string, data: Partial<T['$inferInsert']>) {
		return db.update(this.table).set(data).where(eq(this.table.id, id)).returning();
	}

	async remove(id: string) {
		return db.delete(this.table).where(eq(this.table.id, id)).returning();
	}
}
