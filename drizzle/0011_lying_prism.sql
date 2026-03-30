ALTER TABLE "audiobook_chapters" ADD COLUMN "audio" text NOT NULL;--> statement-breakpoint
ALTER TABLE "audiobook_chapters" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "audiobooks" DROP COLUMN "audio";