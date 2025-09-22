PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_admins` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text,
	`last_name` text,
	`email` text NOT NULL,
	`salt` text NOT NULL,
	`hash` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`version` integer DEFAULT 1
);
--> statement-breakpoint
INSERT INTO `__new_admins`("id", "first_name", "last_name", "email", "salt", "hash", "created_at", "updated_at", "version") SELECT "id", "first_name", "last_name", "email", "salt", "hash", "created_at", "updated_at", "version" FROM `admins`;--> statement-breakpoint
DROP TABLE `admins`;--> statement-breakpoint
ALTER TABLE `__new_admins` RENAME TO `admins`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
ALTER TABLE `agents` ADD `isActive` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `agents` DROP COLUMN `status`;