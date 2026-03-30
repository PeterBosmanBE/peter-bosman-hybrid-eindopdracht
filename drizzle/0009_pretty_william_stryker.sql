CREATE TABLE "uploads" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "audiobooks" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "podcasts" ADD COLUMN "tags" text;