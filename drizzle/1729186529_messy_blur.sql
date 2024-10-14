CREATE TABLE `daily_entity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`day` integer NOT NULL,
	`entity_id` integer NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `entity`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_entity_day_unique` ON `daily_entity` (`day`);--> statement-breakpoint
CREATE TABLE `entity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entity_kind` text NOT NULL,
	`name` text NOT NULL,
	`external_id` text NOT NULL,
	`created_at` integer DEFAULT (UNIXEPOCH()) NOT NULL,
	`updated_at` integer DEFAULT (UNIXEPOCH()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `entity_prop` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`prop_kind` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `entity_prop_value` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entity_id` integer NOT NULL,
	`prop_id` integer NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `entity`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`prop_id`) REFERENCES `entity_prop`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_guess` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`entity_id` integer NOT NULL,
	`daily_entity_id` integer NOT NULL,
	`created_at` integer DEFAULT (UNIXEPOCH()) NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `entity`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`daily_entity_id`) REFERENCES `daily_entity`(`id`) ON UPDATE no action ON DELETE cascade
);
