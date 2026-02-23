CREATE TABLE "audiobook_chapters" (
	"id" text PRIMARY KEY NOT NULL,
	"audiobook_id" text NOT NULL,
	"title" text NOT NULL,
	"duration" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audiobooks" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"narrator" text,
	"duration" text NOT NULL,
	"cover" text NOT NULL,
	"description" text NOT NULL,
	"release_date" date NOT NULL,
	"language" text NOT NULL,
	"publisher" text NOT NULL,
	"category" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "podcast_episodes" (
	"id" text PRIMARY KEY NOT NULL,
	"podcast_id" text NOT NULL,
	"title" text NOT NULL,
	"duration" text NOT NULL,
	"date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "podcasts" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"duration" text NOT NULL,
	"cover" text NOT NULL,
	"description" text NOT NULL,
	"release_date" date NOT NULL,
	"language" text NOT NULL,
	"publisher" text NOT NULL,
	"category" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audiobook_chapters" ADD CONSTRAINT "audiobook_chapters_audiobook_id_audiobooks_id_fk" FOREIGN KEY ("audiobook_id") REFERENCES "public"."audiobooks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_episodes" ADD CONSTRAINT "podcast_episodes_podcast_id_podcasts_id_fk" FOREIGN KEY ("podcast_id") REFERENCES "public"."podcasts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audiobook_chapters_audiobook_id_idx" ON "audiobook_chapters" USING btree ("audiobook_id");--> statement-breakpoint
CREATE INDEX "audiobooks_title_idx" ON "audiobooks" USING btree ("title");--> statement-breakpoint
CREATE INDEX "podcast_episodes_podcast_id_idx" ON "podcast_episodes" USING btree ("podcast_id");--> statement-breakpoint
CREATE INDEX "podcasts_title_idx" ON "podcasts" USING btree ("title");