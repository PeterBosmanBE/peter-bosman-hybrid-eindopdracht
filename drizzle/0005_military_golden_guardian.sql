ALTER TABLE "audiobooks" ADD COLUMN "audio" text NOT NULL;--> statement-breakpoint
ALTER TABLE "podcast_episodes" ADD COLUMN "audio" text NOT NULL;--> statement-breakpoint
ALTER TABLE "podcast_episodes" ADD COLUMN "description" text NOT NULL;