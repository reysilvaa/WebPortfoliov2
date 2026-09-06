import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	githubId: integer('github_id').unique(),
	title: text('title').notNull(),
	subtitle: text('subtitle'),
	period: text('period'),
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
	category: text('category'),
	level: integer('level').default(1),
	order: integer('order').default(0)
});

export const experiences = sqliteTable('experiences', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	role: text('role').notNull(),
	company: text('company').notNull(),
	startDate: text('start_date').notNull(),
	endDate: text('end_date'),
	location: text('location'),
	companyUrl: text('company_url'),
	employmentType: text('employment_type'),
	description: text('description'),
	order: integer('order').default(0)
});

export const profile = sqliteTable('profile', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	role: text('role').notNull(),
	bio: text('bio').notNull(),
	avatarUrl: text('avatar_url'),
	email: text('email'),
	phone: text('phone'),
	location: text('location'),
	website: text('website'),
	github: text('github'),
	linkedin: text('linkedin'),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const education = sqliteTable('education', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	school: text('school').notNull(),
	degree: text('degree').notNull(),
	period: text('period').notNull(),
	location: text('location'),
	order: integer('order').default(0),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date())
});

export const openSource = sqliteTable('open_source', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	role: text('role').notNull(),
	repoUrl: text('repo_url'),
	period: text('period'),
	description: text('description'),
	order: integer('order').default(0),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date())
});

export * from './auth.schema';
