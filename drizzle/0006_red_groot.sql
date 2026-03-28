ALTER TABLE "uploads" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "uploads" CASCADE;--> statement-breakpoint
ALTER TABLE "audiobooks" DROP CONSTRAINT "audiobooks_author_user_name_fk";
