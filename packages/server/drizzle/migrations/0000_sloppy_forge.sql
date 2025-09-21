CREATE TABLE `admins` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`salt` text NOT NULL,
	`hash` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`version` integer DEFAULT 1,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
CREATE INDEX `idx_admins_org` ON `admins` (`organization_id`);--> statement-breakpoint
CREATE TABLE `agents` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`access_token` text,
	`decay_factor` real DEFAULT 1,
	`failure_rate` real DEFAULT 1,
	`status` text DEFAULT 'active',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`version` integer DEFAULT 1,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_agents_org` ON `agents` (`organization_id`);--> statement-breakpoint
CREATE TABLE `memory_episodes` (
	`id` text PRIMARY KEY NOT NULL,
	`agent_id` text NOT NULL,
	`organization_id` text NOT NULL,
	`content` text NOT NULL,
	`concept_tags` text,
	`recency_score` real DEFAULT 1,
	`access_frequency` integer DEFAULT 0,
	`last_accessed_at` text,
	`is_factual` integer DEFAULT false,
	`is_irrelevant` integer DEFAULT false,
	`environment` text,
	`task_type` text,
	`extra` text,
	`success_rate` real DEFAULT 0,
	`positive` integer DEFAULT 0,
	`negative` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`version` integer DEFAULT 1,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_memory_agent_org` ON `memory_episodes` (`agent_id`,`organization_id`);--> statement-breakpoint
CREATE INDEX `idx_memory_recency` ON `memory_episodes` (`recency_score`);--> statement-breakpoint
CREATE INDEX `idx_memory_access` ON `memory_episodes` (`access_frequency`);--> statement-breakpoint
CREATE INDEX `idx_success_rate` ON `memory_episodes` (`success_rate`);--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`version` integer DEFAULT 1
);
