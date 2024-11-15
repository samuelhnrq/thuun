ALTER TABLE `game` ADD `author` text;--> statement-breakpoint
UPDATE `game` SET `author` = 'thuun@slva.fr';--> statement-breakpoint
ALTER table `game` alter column `author` to `author` text not null;--> statement-breakpoint
ALTER TABLE `game` ADD `created_at` integer;--> statement-breakpoint
UPDATE `game` SET `created_at` = UNIXEPOCH();--> statement-breakpoint
ALTER table `game` alter column `created_at` to `created_at` integer not null default (UNIXEPOCH());--> statement-breakpoint
CREATE INDEX `game_author` ON `game` (`author`);--> statement-breakpoint
CREATE INDEX `game_author_created_at` ON `game` (`author`,`created_at`);
