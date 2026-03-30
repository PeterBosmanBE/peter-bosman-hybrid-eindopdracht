import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/src/server/db/client";
import { audiobooks, library, podcasts } from "@/src/server/db/schema";
import { protectedProcedure } from "./context";

const libraryInput = z.object({
  contentId: z.string().min(1),
  contentType: z.enum(["audiobook", "podcast"]),
});

export const libraryRouter = {
  addToLibrary: protectedProcedure
    .input(libraryInput)
    .handler(async ({ input, context }) => {
      const existing = await db
        .select({ id: library.id })
        .from(library)
        .where(
          and(
            eq(library.userId, context.user.id),
            eq(library.contentId, input.contentId),
            eq(library.contentType, input.contentType),
          ),
        )
        .limit(1);

      if (existing[0]) {
        return { id: existing[0].id, alreadyExists: true };
      }

      const inserted = await db
        .insert(library)
        .values({
          id: crypto.randomUUID(),
          userId: context.user.id,
          contentId: input.contentId,
          contentType: input.contentType,
        })
        .returning({ id: library.id });

      return { id: inserted[0]?.id ?? null, alreadyExists: false };
    }),

  removeFromLibrary: protectedProcedure
    .input(libraryInput)
    .handler(async ({ input, context }) => {
      await db
        .delete(library)
        .where(
          and(
            eq(library.userId, context.user.id),
            eq(library.contentId, input.contentId),
            eq(library.contentType, input.contentType),
          ),
        );

      return { removed: true };
    }),

  isInLibrary: protectedProcedure
    .input(libraryInput)
    .handler(async ({ input, context }) => {
      const existing = await db
        .select({ id: library.id })
        .from(library)
        .where(
          and(
            eq(library.userId, context.user.id),
            eq(library.contentId, input.contentId),
            eq(library.contentType, input.contentType),
          ),
        )
        .limit(1);

      return { isInLibrary: Boolean(existing[0]) };
    }),

  listLibrary: protectedProcedure.handler(async ({ context }) => {
    const entries = await db
      .select({
        contentId: library.contentId,
        contentType: library.contentType,
        createdAt: library.createdAt,
      })
      .from(library)
      .where(eq(library.userId, context.user.id))
      .orderBy(desc(library.createdAt));

    if (entries.length === 0) {
      return { items: [] };
    }

    const audiobookIds = entries
      .filter((entry) => entry.contentType === "audiobook")
      .map((entry) => entry.contentId);
    const podcastIds = entries
      .filter((entry) => entry.contentType === "podcast")
      .map((entry) => entry.contentId);

    const audiobookItems = audiobookIds.length
      ? await db
          .select({
            id: audiobooks.id,
            title: audiobooks.title,
            author: audiobooks.author,
            duration: audiobooks.duration,
            cover: audiobooks.cover,
            releaseDate: audiobooks.releaseDate,
          })
          .from(audiobooks)
          .where(inArray(audiobooks.id, audiobookIds))
      : [];

    const podcastItems = podcastIds.length
      ? await db
          .select({
            id: podcasts.id,
            title: podcasts.title,
            author: podcasts.author,
            duration: podcasts.duration,
            cover: podcasts.cover,
            releaseDate: podcasts.releaseDate,
          })
          .from(podcasts)
          .where(inArray(podcasts.id, podcastIds))
      : [];

    const audiobookMap = new Map(audiobookItems.map((item) => [item.id, item]));
    const podcastMap = new Map(podcastItems.map((item) => [item.id, item]));

    const items = entries
      .map((entry) => {
        if (entry.contentType === "audiobook") {
          const item = audiobookMap.get(entry.contentId);
          if (!item) return null;
          return {
            ...item,
            type: "audiobook" as const,
            addedAt: entry.createdAt,
          };
        }

        const item = podcastMap.get(entry.contentId);
        if (!item) return null;
        return {
          ...item,
          type: "podcast" as const,
          addedAt: entry.createdAt,
        };
      })
      .filter(Boolean);

    return { items };
  }),
};
