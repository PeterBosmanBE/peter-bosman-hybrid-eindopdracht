ALTER TABLE "audiobooks" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "podcasts" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "audiobooks" ADD CONSTRAINT "audiobooks_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcasts" ADD CONSTRAINT "podcasts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audiobooks_user_id_idx" ON "audiobooks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "podcasts_user_id_idx" ON "podcasts" USING btree ("user_id");