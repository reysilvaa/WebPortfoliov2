CREATE TABLE `education` (
	`id` text PRIMARY KEY NOT NULL,
	`school` text NOT NULL,
	`degree` text NOT NULL,
	`period` text NOT NULL,
	`location` text,
	`order` integer DEFAULT 0,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`company` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`location` text,
	`company_url` text,
	`employment_type` text,
	`description` text,
	`order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `open_source` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`role` text NOT NULL,
	`repo_url` text,
	`period` text,
	`description` text,
	`order` integer DEFAULT 0,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`bio` text NOT NULL,
	`avatar_url` text,
	`email` text,
	`phone` text,
	`location` text,
	`website` text,
	`github` text,
	`linkedin` text,
	`updated_at` integer
);
--> statement-breakpoint
DROP INDEX "projects_github_id_unique";--> statement-breakpoint
DROP INDEX "account_userId_idx";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "session_userId_idx";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
DROP INDEX "verification_identifier_idx";--> statement-breakpoint
ALTER TABLE `projects` ALTER COLUMN "description" TO "description" text;--> statement-breakpoint
CREATE UNIQUE INDEX `projects_github_id_unique` ON `projects` (`github_id`);--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
ALTER TABLE `projects` ADD `github_id` integer;--> statement-breakpoint
ALTER TABLE `projects` ADD `subtitle` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `period` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `stars` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `projects` ADD `forks` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `projects` ADD `language` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `is_hidden` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `projects` ADD `updated_at` integer;