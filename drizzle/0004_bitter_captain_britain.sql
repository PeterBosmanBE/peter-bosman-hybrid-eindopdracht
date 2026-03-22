ALTER TABLE "uploads" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "audiobooks" ALTER COLUMN "publisher" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "audiobook_chapters" ADD COLUMN "narrator" text;--> statement-breakpoint
ALTER TABLE "audiobooks" ADD CONSTRAINT "audiobooks_author_user_name_fk" FOREIGN KEY ("author") REFERENCES "public"."user"("name") ON DELETE cascade ON UPDATE no action;