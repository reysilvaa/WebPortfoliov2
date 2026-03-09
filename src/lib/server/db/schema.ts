import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	description: text('description').notNull(),
	imageUrl: text('image_url'),
	repoUrl: text('repo_url'),
	liveUrl: text('live_url'),
	tags: text('tags'), // Stored as comma-separated or JSON
	order: integer('order').default(0),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const certificates = sqliteTable('certificates', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	issuer: text('issuer').notNull(),
	issueDate: integer('issue_date', { mode: 'timestamp' }),
	credentialUrl: text('credential_url'),
	imageUrl: text('image_url'),
	order: integer('order').default(0)
});

export const skills = sqliteTable('skills', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	category: text('category'), // e.g., 'Frontend', 'Backend', 'Tools'
	level: integer('level').default(1), // 1-5 or similar
	order: integer('order').default(0)
});

export * from './auth.schema.ts';
