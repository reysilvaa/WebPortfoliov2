import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { and, eq } from 'drizzle-orm';
import * as schema from './schema';
import 'dotenv/config';

if (!process.env.DATABASE_URL || !process.env.DATABASE_AUTH_TOKEN) {
	throw new Error('DATABASE_URL or DATABASE_AUTH_TOKEN is missing in .env');
}

const client = createClient({
	url: process.env.DATABASE_URL,
	authToken: process.env.DATABASE_AUTH_TOKEN
});

const db = drizzle(client, { schema });

async function ensureSchema() {
	console.log('🔄 Checking and migrating database schema...');

	// Create education table if not exists
	await client.execute(`
		CREATE TABLE IF NOT EXISTS "education" (
			"id" text PRIMARY KEY NOT NULL,
			"school" text NOT NULL,
			"degree" text NOT NULL,
			"period" text NOT NULL,
			"location" text,
			"order" integer DEFAULT 0,
			"created_at" integer,
			"updated_at" integer
		);
	`);

	// Create open_source table if not exists
	await client.execute(`
		CREATE TABLE IF NOT EXISTS "open_source" (
			"id" text PRIMARY KEY NOT NULL,
			"title" text NOT NULL,
			"role" text NOT NULL,
			"repo_url" text,
			"period" text,
			"description" text,
			"order" integer DEFAULT 0,
			"created_at" integer,
			"updated_at" integer
		);
	`);

	// Ensure profile table columns exist
	const profileCols = ['phone', 'location', 'website'];
	for (const col of profileCols) {
		try {
			await client.execute(`ALTER TABLE "profile" ADD COLUMN "${col}" text;`);
		} catch {
			// Column already exists, safe to ignore
		}
	}

	// Ensure experiences table columns exist
	const expCols = ['location', 'company_url', 'employment_type'];
	for (const col of expCols) {
		try {
			await client.execute(`ALTER TABLE "experiences" ADD COLUMN "${col}" text;`);
		} catch {
			// Column already exists, safe to ignore
		}
	}

	// Ensure projects table columns exist
	const projCols = ['subtitle', 'period'];
	for (const col of projCols) {
		try {
			await client.execute(`ALTER TABLE "projects" ADD COLUMN "${col}" text;`);
		} catch {
			// Column already exists, safe to ignore
		}
	}
}

async function main() {
	await ensureSchema();
	console.log('🌱 Seeding database with authentic CV & Portfolio data...');

	console.log('Upserting profile...');
	await db
		.insert(schema.profile)
		.values({
			id: 'main',
			name: 'Moch. Reynald Silva Baktiar',
			role: 'Fullstack Software Engineer',
			bio: 'Final-year Informatics Engineering student (D-IV, graduating 2026) with 3+ years of hands-on fullstack & mobile development experience across Laravel, Flutter, React/Next.js, SvelteKit, Node.js, and FastAPI. Independently built, launched, and continuously operate RosantiBike Motorent—a production-grade rental platform improving process efficiency by 60%, an offline-first multi-platform POS app (Dodolanku), as well as multi-tier loan approval systems for public manufacturing corporations. Strong in RESTful API architectures, database design (PostgreSQL, MySQL, SQLite), robust state management, AI integration (LLM & Computer Vision), and CI/CD VPS deployment via Docker and Nginx.',
			avatarUrl: 'https://github.com/reysilvaa.png',
			email: 'reynaldsilva123@gmail.com',
			phone: '+62 852-3215-2313',
			location: 'Malang, Indonesia',
			website: 'https://www.reynaldsilva.my.id',
			github: 'https://github.com/reysilvaa',
			linkedin: 'https://www.linkedin.com/in/reynald-silva/'
		})
		.onConflictDoUpdate({
			target: schema.profile.id,
			set: {
				name: 'Moch. Reynald Silva Baktiar',
				role: 'Fullstack Software Engineer',
				bio: 'Final-year Informatics Engineering student (D-IV, graduating 2026) with 3+ years of hands-on fullstack & mobile development experience across Laravel, Flutter, React/Next.js, SvelteKit, Node.js, and FastAPI. Independently built, launched, and continuously operate RosantiBike Motorent—a production-grade rental platform improving process efficiency by 60%, an offline-first multi-platform POS app (Dodolanku), as well as multi-tier loan approval systems for public manufacturing corporations. Strong in RESTful API architectures, database design (PostgreSQL, MySQL, SQLite), robust state management, AI integration (LLM & Computer Vision), and CI/CD VPS deployment via Docker and Nginx.',
				avatarUrl: 'https://github.com/reysilvaa.png',
				email: 'reynaldsilva123@gmail.com',
				phone: '+62 852-3215-2313',
				location: 'Malang, Indonesia',
				website: 'https://www.reynaldsilva.my.id',
				github: 'https://github.com/reysilvaa',
				linkedin: 'https://www.linkedin.com/in/reynald-silva/'
			}
		});

	console.log('Inserting skills...');
	const skillsData = [
		// Programming Languages
		{ name: 'PHP', category: 'Programming Languages', order: 1 },
		{ name: 'Dart', category: 'Programming Languages', order: 2 },
		{ name: 'JavaScript', category: 'Programming Languages', order: 3 },
		{ name: 'TypeScript', category: 'Programming Languages', order: 4 },
		{ name: 'Python', category: 'Programming Languages', order: 5 },
		{ name: 'SQL', category: 'Programming Languages', order: 6 },
		{ name: 'Rust (Basic)', category: 'Programming Languages', order: 7 },
		// Mobile & Frontend
		{ name: 'Flutter', category: 'Mobile & Frontend', order: 8 },
		{ name: 'Riverpod', category: 'Mobile & Frontend', order: 9 },
		{ name: 'React.js', category: 'Mobile & Frontend', order: 10 },
		{ name: 'Next.js', category: 'Mobile & Frontend', order: 11 },
		{ name: 'Svelte 5 / SvelteKit', category: 'Mobile & Frontend', order: 12 },
		{ name: 'Tailwind CSS v4', category: 'Mobile & Frontend', order: 13 },
		{ name: 'PWA', category: 'Mobile & Frontend', order: 14 },
		// Backend Frameworks
		{ name: 'Laravel', category: 'Backend Frameworks', order: 15 },
		{ name: 'Node.js', category: 'Backend Frameworks', order: 16 },
		{ name: 'NestJS (Fastify)', category: 'Backend Frameworks', order: 17 },
		{ name: 'Express.js', category: 'Backend Frameworks', order: 18 },
		{ name: 'FastAPI', category: 'Backend Frameworks', order: 19 },
		{ name: 'RESTful API design', category: 'Backend Frameworks', order: 20 },
		{ name: 'Drizzle ORM', category: 'Backend Frameworks', order: 21 },
		// Databases & Caching
		{ name: 'PostgreSQL', category: 'Databases & Caching', order: 22 },
		{ name: 'MySQL', category: 'Databases & Caching', order: 23 },
		{ name: 'MariaDB', category: 'Databases & Caching', order: 24 },
		{ name: 'SQLite (sqflite)', category: 'Databases & Caching', order: 25 },
		{ name: 'Redis', category: 'Databases & Caching', order: 26 },
		{ name: 'Vector Database (Orama)', category: 'Databases & Caching', order: 27 },
		// AI & Job Queues
		{ name: 'Google Gemini API', category: 'AI & Job Queues', order: 28 },
		{ name: 'Hugging Face', category: 'AI & Job Queues', order: 29 },
		{ name: 'RAG Pipelines', category: 'AI & Job Queues', order: 30 },
		{ name: 'YOLOv8', category: 'AI & Job Queues', order: 31 },
		{ name: 'BullMQ', category: 'AI & Job Queues', order: 32 },
		{ name: 'Socket.io (WebSocket)', category: 'AI & Job Queues', order: 33 },
		// DevOps & Practices
		{ name: 'Docker', category: 'DevOps & Practices', order: 34 },
		{ name: 'CI/CD (GitHub Actions)', category: 'DevOps & Practices', order: 35 },
		{ name: 'GitLab CI', category: 'DevOps & Practices', order: 36 },
		{ name: 'Nginx', category: 'DevOps & Practices', order: 37 },
		{ name: 'VPS Deployment', category: 'DevOps & Practices', order: 38 },
		{ name: 'Git', category: 'DevOps & Practices', order: 39 },
		{ name: 'Agile / Scrum', category: 'DevOps & Practices', order: 40 }
	];

	for (const s of skillsData) {
		const existing = await db
			.select()
			.from(schema.skills)
			.where(eq(schema.skills.name, s.name))
			.limit(1);
		if (existing.length > 0) {
			await db.update(schema.skills).set(s).where(eq(schema.skills.id, existing[0].id));
		} else {
			await db.insert(schema.skills).values(s);
		}
	}

	console.log('Inserting experiences...');
	const experiencesData = [
		{
			role: 'Founder & Sole Fullstack Developer',
			company: 'RosantiBike Motorent',
			location: 'Malang',
			companyUrl: 'https://rosantibikemotorent.com',
			employmentType: 'Part-time / Remote',
			startDate: 'Jan 2023',
			endDate: 'Present',
			description: `- Production Rental Platform: Independently engineered, launched, and maintain an end-to-end motorbike booking platform (rosantibikemotorent.com) actively serving real commercial daily operations for over 3 years. [Visit Website](https://rosantibikemotorent.com)
- High-Throughput Backend Architecture: Architected the backend with NestJS on Fastify (delivering higher API throughput than Express), paired with Drizzle ORM and PostgreSQL for type-safe execution and low latency.
- Background Queues & Real-Time Sync: Engineered an event-driven BullMQ (Redis) pipeline for automated QRIS payment webhooks and WhatsApp dispatch, alongside Socket.io for live order tracking.
- RAG-Powered AI Customer Support: Built an intelligent automated CS assistant utilizing Google Gemini API + Hugging Face backed by Orama hybrid vector search to instantly handle fleet availability inquiries.
- Interactive Admin & Modern Frontend: Created an interactive dashboard (SvelteKit + Svelte Flow + Tiptap CMS) and an SEO-optimized landing page (Svelte 5 + Tailwind CSS v4 + typesafe-i18n).
- Business Impact & DevOps: Improved booking process efficiency by 60%, eliminated booking errors, and established a zero-downtime CI/CD deployment pipeline on a VPS with Docker and Nginx.`,
			order: 1
		},
		{
			role: 'Fullstack Programmer Intern',
			company: 'PT Multi Spunindo Jaya Tbk (Employee Cooperative)',
			location: 'Sidoarjo',
			companyUrl: '',
			employmentType: 'Internship / On-site',
			startDate: 'Jul 2025',
			endDate: 'Dec 2025',
			description: `- Multi-Tier Loan Approval System: Engineered an internal cooperative loan application using Laravel 12 featuring a strict 3-stage authorization workflow (Admin, Credit Reviewer, and Chairman).
- RBAC Security & Database Design: Structured a granular Role-Based Access Control system mapped to corporate hierarchy and modeled highly normalized MySQL schemas for audit compliance.
- CLI Automation Tooling: Independently initiated custom Laravel CLI commands for automated module scaffolding, accelerating team velocity and eliminating manual errors.`,
			order: 2
		},
		{
			role: 'Fullstack Programmer (Client Project)',
			company: 'MSME Digital Queue Platform',
			location: 'Malang City',
			companyUrl: '',
			employmentType: 'Freelance / Remote',
			startDate: 'Feb 2026',
			endDate: 'Mar 2026',
			description: `- Progressive Web App (PWA): Developed an ultra-responsive digital queue management PWA using SvelteKit with ascending auto-sorting, eliminating missed orders for local merchants.`,
			order: 3
		},
		{
			role: 'Programmer Intern',
			company: 'PT Cendana Teknika Utama',
			location: 'Malang',
			companyUrl: '',
			employmentType: 'Internship / Hybrid',
			startDate: 'Jun 2021',
			endDate: 'Sep 2021',
			description: `- Odoo ERP Customization: Configured and extended modular enterprise Odoo ERP workflows for hospital management information systems and automated library cataloging.`,
			order: 4
		}
	];

	for (const exp of experiencesData) {
		const existing = await db
			.select()
			.from(schema.experiences)
			.where(
				and(
					eq(schema.experiences.company, exp.company),
					eq(schema.experiences.role, exp.role)
				)
			)
			.limit(1);
		if (existing.length > 0) {
			await db.update(schema.experiences).set(exp).where(eq(schema.experiences.id, existing[0].id));
		} else {
			await db.insert(schema.experiences).values(exp);
		}
	}

	console.log('Inserting projects...');
	const projectsData = [
		{
			title: 'Dodolanku',
			subtitle: 'Cross-Platform Offline-First POS Application (Flutter & SQLite)',
			period: '2025 – 2026',
			description: `- Offline-First Cross-Platform POS: Engineered a full-featured retail POS application with Flutter (Android, iOS, Web, Windows) utilizing SQLite (sqflite) for complete zero-internet offline operation.
- Hardware & Automated Transactions: Integrated camera-based barcode scanning, automated change calculation, Bluetooth thermal receipt printing, accounts receivable tracking, and sales analytics.
- State Architecture & Cloud Sync: Implemented a feature-based architecture with Riverpod state management, automated Google Drive backups, and an in-app auto-update checker for small retail management.`,
			tags: 'Flutter, SQLite, Riverpod, Dart, Offline-First',
			order: 1
		},
		{
			title: 'ReySkripsi',
			subtitle: 'Academic Formatting Microsoft Word Add-in with AI Integration',
			period: '2026',
			liveUrl: 'https://rey-skripsi.vercel.app',
			description: `- Automated KBBI & Typography Standards: Engineered an intelligent Word Add-in (rey-skripsi.vercel.app) with an automated text scanner to detect and batch-italicize non-standard Indonesian loanwords. [View App](https://rey-skripsi.vercel.app)
- Native Word SEQ Fields: Engineered automated chapter-based caption numbering (e.g., Table 1.1, Figure 2.3) directly integrated with Word Native SEQ Fields.
- AI Assistant & Token Optimization: Integrated Google Gemini 3 API for contextual manuscript analysis (Ask AI) and single-batch requests for token-efficient table/figure caption summarization.
- Client-Side Data Encryption: Implemented client-side encrypted local storage utilizing IndexedDB to safeguard sensitive user API credentials.`,
			tags: 'Word Add-in, Gemini API, TypeScript, React, IndexedDB',
			order: 2
		},
		{
			title: 'Acne Detection Mobile App (Machine Learning)',
			subtitle: 'Computer Vision Application — Flutter & FastAPI',
			period: '2023 – 2024',
			description: `- Edge Computer Vision: Built a Flutter mobile app integrated with YOLOv8 deep learning models for real-time facial acne classification and tailored skincare recommendations.`,
			tags: 'Flutter, FastAPI, YOLOv8, Python, Deep Learning',
			order: 3
		},
		{
			title: 'SIKEP',
			subtitle: 'Citizen Administration & Social Aid DSS (RT/RW Gadingkasri)',
			period: '2023 – 2024',
			description: `- Decision Support System: Digitalized local administrative records and implemented MEREC and MABAC algorithms for objective social aid scoring.`,
			tags: 'PHP, Laravel, MySQL, DSS, MEREC, MABAC',
			order: 4
		}
	];

	for (const proj of projectsData) {
		const existing = await db
			.select()
			.from(schema.projects)
			.where(eq(schema.projects.title, proj.title))
			.limit(1);
		if (existing.length > 0) {
			await db.update(schema.projects).set(proj).where(eq(schema.projects.id, existing[0].id));
		} else {
			await db.insert(schema.projects).values(proj);
		}
	}

	console.log('Inserting open source contributions...');
	const openSourceData = [
		{
			title: 'lean-ctx',
			role: 'Contributor',
			period: '2026',
			repoUrl: 'https://github.com/lean-ctx',
			description: `- Critical MCP Core Bug Fix (Rust): Resolved issue #1454 regarding silent EOF crashes on the stdio MCP server during the pre-initialization handshake. Implemented standard JSON-RPC -32601 error responses and authored e2e regression tests in Rust (PR #1463). [View PR #1463](https://github.com/lean-ctx)`,
			order: 1
		},
		{
			title: 'aroman-dss',
			role: 'Author & Maintainer',
			period: '2025',
			repoUrl: 'https://www.npmjs.com/package/aroman-dss',
			description: `- MCDM Decision Algorithm: Published a modular open-source JavaScript library (aroman-dss on npm) implementing the AROMAN method for multi-criteria decision making with built-in data normalization. [npm package](https://www.npmjs.com/package/aroman-dss)`,
			order: 2
		},
		{
			title: 'merec-dss',
			role: 'Author & Maintainer',
			period: '2025',
			repoUrl: 'https://www.npmjs.com/package/merec-dss',
			description: `- Objective Weighting Algorithm: Published an open-source implementation of the MEREC algorithm (merec-dss on npm) for objective criteria weighting in decision support systems. [npm package](https://www.npmjs.com/package/merec-dss)`,
			order: 3
		}
	];

	for (const os of openSourceData) {
		const existing = await db
			.select()
			.from(schema.openSource)
			.where(eq(schema.openSource.title, os.title))
			.limit(1);
		if (existing.length > 0) {
			await db.update(schema.openSource).set(os).where(eq(schema.openSource.id, existing[0].id));
		} else {
			await db.insert(schema.openSource).values(os);
		}
	}

	console.log('Inserting education...');
	const educationData = [
		{
			school: 'Politeknik Negeri Malang',
			degree: 'D-IV Informatics Engineering (Bachelor of Applied Science)',
			period: '2022 – 2026',
			location: 'Malang, Indonesia',
			order: 1
		},
		{
			school: 'SMK Telkom Malang',
			degree: 'Vocational High School, Computer Network Engineering',
			period: '2019 – 2022',
			location: 'Malang, Indonesia',
			order: 2
		}
	];

	for (const edu of educationData) {
		const existing = await db
			.select()
			.from(schema.education)
			.where(
				and(
					eq(schema.education.school, edu.school),
					eq(schema.education.degree, edu.degree)
				)
			)
			.limit(1);
		if (existing.length > 0) {
			await db.update(schema.education).set(edu).where(eq(schema.education.id, existing[0].id));
		} else {
			await db.insert(schema.education).values(edu);
		}
	}

	console.log('Inserting certificates...');
	const certificatesData = [
		{
			name: 'Certified Database Practitioner',
			issuer: 'DB Academy',
			issueDate: new Date('2026-01-01'),
			order: 1
		},
		{
			name: 'Docker & Kubernetes for Beginners',
			issuer: 'Udemy',
			issueDate: new Date('2026-01-01'),
			order: 2
		},
		{
			name: 'Web Design with HTML, CSS & WordPress',
			issuer: 'Udemy',
			issueDate: new Date('2026-01-01'),
			order: 3
		}
	];

	for (const cert of certificatesData) {
		const existing = await db
			.select()
			.from(schema.certificates)
			.where(
				and(
					eq(schema.certificates.name, cert.name),
					eq(schema.certificates.issuer, cert.issuer)
				)
			)
			.limit(1);
		if (existing.length > 0) {
			await db.update(schema.certificates).set(cert).where(eq(schema.certificates.id, existing[0].id));
		} else {
			await db.insert(schema.certificates).values(cert);
		}
	}

	console.log('✅ Seeding complete with authentic portfolio data!');
}

main().catch((err) => {
	console.error('❌ Seeding failed:');
	console.error(err);
	process.exit(1);
});
