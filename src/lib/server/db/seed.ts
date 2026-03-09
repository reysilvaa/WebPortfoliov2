import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.ts';
import 'dotenv/config';

if (!process.env.DATABASE_URL || !process.env.DATABASE_AUTH_TOKEN) {
	throw new Error('DATABASE_URL or DATABASE_AUTH_TOKEN is missing in .env');
}

const client = createClient({
	url: process.env.DATABASE_URL,
	authToken: process.env.DATABASE_AUTH_TOKEN
});

const db = drizzle(client, { schema });

async function main() {
	console.log('🌱 Seeding database...');

	// Clear existing data (be careful with this in production!)
	// await db.delete(schema.projects);
	// await db.delete(schema.certificates);
	// await db.delete(schema.skills);

	console.log('Inserting projects...');
	await db
		.insert(schema.projects)
		.values([
			{
				title: 'Oopedia Adaptive',
				description: 'Intelligent learning platform with dynamic module progression rules.',
				tags: 'SvelteKit, PHP, TS',
				order: 1
			},
			{
				title: 'Degan Analytics',
				description: 'Real-time order management and inventory system for retail.',
				tags: 'Drizzle, SQLite, Tailwind',
				order: 2
			}
		])
		.onConflictDoNothing();

	console.log('Inserting certificates...');
	await db
		.insert(schema.certificates)
		.values([
			{
				name: 'Meta Front-End Developer',
				issuer: 'Coursera / Meta',
				issueDate: new Date('2024-01-01'),
				order: 1
			}
		])
		.onConflictDoNothing();

	console.log('Inserting skills...');
	await db
		.insert(schema.skills)
		.values([
			{ name: 'SvelteKit', category: 'Frontend', level: 5, order: 1 },
			{ name: 'TypeScript', category: 'Backend', level: 5, order: 2 },
			{ name: 'Drizzle ORM', category: 'Database', level: 4, order: 3 }
		])
		.onConflictDoNothing();

	console.log('✅ Seeding complete.');
}

main().catch((err) => {
	console.error('❌ Seeding failed:');
	console.error(err);
	process.exit(1);
});
