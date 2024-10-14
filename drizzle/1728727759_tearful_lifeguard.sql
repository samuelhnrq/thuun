ALTER TABLE `daily_etity` RENAME COLUMN "entity" TO "entity_id";--> statement-breakpoint
ALTER TABLE `entity` RENAME COLUMN "kind" TO "kind_id";--> statement-breakpoint
ALTER TABLE `entity_prop` RENAME COLUMN "kind" TO "kind_id";--> statement-breakpoint
ALTER TABLE `entity_prop_value` RENAME COLUMN "entity" TO "entity_id";--> statement-breakpoint
ALTER TABLE `entity_prop_value` RENAME COLUMN "prop" TO "prop_id";--> statement-breakpoint
ALTER TABLE `user_guess` RENAME COLUMN "day" TO "dayly_entry_id";--> statement-breakpoint
ALTER TABLE `daily_etity` ALTER COLUMN "entity_id" TO "entity_id" integer NOT NULL REFERENCES entity(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `entity` ALTER COLUMN "kind_id" TO "kind_id" integer NOT NULL REFERENCES entity_kind(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `entity_prop` ALTER COLUMN "kind_id" TO "kind_id" integer NOT NULL REFERENCES entity_kind(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `entity_prop_value` ALTER COLUMN "entity_id" TO "entity_id" integer NOT NULL REFERENCES entity(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `entity_prop_value` ALTER COLUMN "prop_id" TO "prop_id" integer NOT NULL REFERENCES entity_prop(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_guess` ADD `entity_id` integer NOT NULL REFERENCES entity(id);--> statement-breakpoint
ALTER TABLE `user_guess` ALTER COLUMN "dayly_entry_id" TO "dayly_entry_id" integer NOT NULL REFERENCES daily_etity(id) ON DELETE cascade ON UPDATE no action;
