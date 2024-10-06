CREATE TABLE `daily_etity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`day` integer NOT NULL,
	`entity` integer NOT NULL,
	FOREIGN KEY (`entity`) REFERENCES `entity`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `entity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` integer NOT NULL,
	`name` text NOT NULL,
	`external_id` text NOT NULL,
	`created_at` integer DEFAULT UNIXEPOCH() NOT NULL,
	`updated_at` integer DEFAULT UNIXEPOCH() NOT NULL,
	FOREIGN KEY (`kind`) REFERENCES `entity_kind`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `entity_kind` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `entity_prop` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`kind` integer NOT NULL,
	FOREIGN KEY (`kind`) REFERENCES `entity_kind`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `entity_prop_value` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entity` integer NOT NULL,
	`prop` integer NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`entity`) REFERENCES `entity`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`prop`) REFERENCES `entity_prop`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_guess` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`day` integer NOT NULL,
	`created_at` integer DEFAULT UNIXEPOCH() NOT NULL,
	FOREIGN KEY (`day`) REFERENCES `daily_etity`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entity_kind_name_unique` ON `entity_kind` (`name`);