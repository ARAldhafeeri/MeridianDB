CREATE TABLE `admins` (
	`id` text PRIMARY KEY NOT NULL,
	`organizationId` text NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`email` text NOT NULL,
	`salt` text NOT NULL,
	`hash` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	`version` integer DEFAULT 1,
	FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
CREATE INDEX `idx_admins_org` ON `admins` (`organizationId`);--> statement-breakpoint
CREATE TABLE `agents` (
	`id` text PRIMARY KEY NOT NULL,
	`organizationId` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`capabilities` text,
	`stabilityThreshold` real DEFAULT 0.15,
	`halfLifeHours` real DEFAULT 168,
	`timeWeight` real DEFAULT 0.6,
	`frequencyWeight` real DEFAULT 0.4,
	`decayCurve` text DEFAULT 'hybird',
	`successRate` real DEFAULT 0.85,
	`isActive` integer DEFAULT false,
	`metadata` text DEFAULT '{}',
	`accessToken` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP,
	`version` integer DEFAULT 1,
	FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_agents_org` ON `agents` (`organizationId`);--> statement-breakpoint
CREATE TABLE `memory_episodes` (
	`id` text PRIMARY KEY NOT NULL,
	`agentId` text NOT NULL,
	`organizationId` text NOT NULL,
	`content` text NOT NULL,
	`conceptTags` text,
	`recencyScore` real DEFAULT 1,
	`accessFrequency` integer DEFAULT 0,
	`lastAccessedAt` text,
	`isFactual` integer DEFAULT false,
	`isIrrelevant` integer DEFAULT false,
	`environment` text,
	`taskType` text,
	`extra` text,
	`successRate` real DEFAULT 0,
	`positive` integer DEFAULT 0,
	`negative` integer DEFAULT 0,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP,
	`version` integer DEFAULT 1,
	FOREIGN KEY (`agentId`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_memory_agent_org` ON `memory_episodes` (`agentId`,`organizationId`);--> statement-breakpoint
CREATE INDEX `idx_memory_recency` ON `memory_episodes` (`recencyScore`);--> statement-breakpoint
CREATE INDEX `idx_memory_access` ON `memory_episodes` (`accessFrequency`);--> statement-breakpoint
CREATE INDEX `idx_success_rate` ON `memory_episodes` (`successRate`);--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP,
	`version` integer DEFAULT 1
);
