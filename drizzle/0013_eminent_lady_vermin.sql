ALTER TABLE "audiobook_chapters" ADD COLUMN "sort_order" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "podcast_episodes" ADD COLUMN "sort_order" integer DEFAULT 1 NOT NULL;