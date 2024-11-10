ALTER TABLE `daily_entity` RENAME TO `game`;--> statement-breakpoint
ALTER TABLE `game` RENAME COLUMN "day" TO "game_key";--> statement-breakpoint
ALTER TABLE `user_guess` RENAME COLUMN "daily_entity_id" TO "game_id";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_game` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`game_key` text NOT NULL,
	`entity_id` integer NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `entity`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_game`("id", "game_key", "entity_id") SELECT "id", "game_key", "entity_id" FROM `game`;--> statement-breakpoint
DROP TABLE `game`;--> statement-breakpoint
ALTER TABLE `__new_game` RENAME TO `game`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `game_game_key_unique` ON `game` (`game_key`);--> statement-breakpoint
DROP INDEX IF EXISTS `user_guess_daily_entity_id_entity_id_user_id_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_guess_game_id_entity_id_user_id_unique` ON `user_guess` (`game_id`,`entity_id`,`user_id`);--> statement-breakpoint
ALTER TABLE `user_guess` ALTER COLUMN "game_id" TO "game_id" integer NOT NULL REFERENCES game(id) ON DELETE cascade ON UPDATE no action;