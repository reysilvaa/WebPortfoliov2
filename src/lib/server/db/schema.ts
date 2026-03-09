import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	githubId: integer('github_id').unique(),
	title: text('title').notNull(),
	description: text('description'),
	imageUrl: text('image_url'),
	repoUrl: text('repo_url'),
	liveUrl: text('live_url'),
	stars: integer('stars').default(0),
	forks: integer('forks').default(0),
	language: text('language'),
	tags: text('tags'),
	isHidden: integer('is_hidden', { mode: 'boolean' }).default(false),
	order: integer('order').default(0),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date())
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

export const profile = sqliteTable('profile', {
	id: text('id').primaryKey(), // We'll just use 'main' as ID
	name: text('name').notNull(),
	role: text('role').notNull(),
	bio: text('bio').notNull(),
	email: text('email'),
	github: text('github'),
	linkedin: text('linkedin'),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export * from './auth.schema.ts';
