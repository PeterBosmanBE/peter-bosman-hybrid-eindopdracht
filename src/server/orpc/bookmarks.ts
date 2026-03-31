import { z } from "zod";
import { protectedProcedure } from "./context";
import { db } from "@/src/server/db/client";
import { bookmarks } from "@/src/server/db/schema";
import { eq, and } from "drizzle-orm";

export const bookmarksRouter = {
  addBookmark: protectedProcedure
    .input(
      z.object({
        contentId: z.string().min(1),
        contentType: z.enum(["audiobook", "podcast"]),
        positionSeconds: z.number().min(0),
        title: z.string().optional(),
      }),
    )
    .handler(async ({ input, context }) => {
      const result = await db
        .insert(bookmarks)
        .values({
          id: crypto.randomUUID(),
          userId: context.user.id,
          contentId: input.contentId,
          contentType: input.contentType,
          positionSeconds: Math.floor(input.positionSeconds),
        })
        .returning();
      return result[0];
    }),

  getBookmarks: protectedProcedure
    .input(
      z.object({
        contentId: z.string().min(1),
        contentType: z.enum(["audiobook", "podcast"]),
      }),
    )
    .handler(async ({ input, context }) => {
      return db
        .select()
        .from(bookmarks)
        .where(
          and(
            eq(bookmarks.userId, context.user.id),
            eq(bookmarks.contentId, input.contentId),
            eq(bookmarks.contentType, input.contentType),
          ),
        )
        .orderBy(bookmarks.positionSeconds);
    }),
};
