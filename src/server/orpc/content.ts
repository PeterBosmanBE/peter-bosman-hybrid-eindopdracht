import { os } from "@orpc/server";
import { ORPCError } from "@orpc/server";
import { asc, eq, ne } from "drizzle-orm";
import * as z from "zod";
import { db } from "@/src/server/db/client";
import {
  audiobookChapters,
  audiobooks,
  podcastEpisodes,
  podcasts,
} from "@/src/server/db/schema";

const listContentInput = z
  .object({
    userId: z.string().min(1).optional(),
    type: z.enum(["all", "audiobook", "podcast"]).default("all").optional(),
  })
  .optional();

const detailInput = z.object({
  id: z.string().min(1),
});

export const contentRouter = {
  list: os.input(listContentInput).handler(async ({ input }) => {
    const type = input?.type ?? "all";
    const userId = input?.userId;

    const shouldFetchAudiobooks = type === "all" || type === "audiobook";
    const shouldFetchPodcasts = type === "all" || type === "podcast";

    const audiobookRows = shouldFetchAudiobooks
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
          .where(userId ? eq(audiobooks.userId, userId) : undefined)
          .orderBy(asc(audiobooks.title))
      : [];

    const podcastRows = shouldFetchPodcasts
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
          .where(userId ? eq(podcasts.userId, userId) : undefined)
          .orderBy(asc(podcasts.title))
      : [];

    const items = [
      ...audiobookRows.map((item) => ({
        ...item,
        type: "audiobook" as const,
      })),
      ...podcastRows.map((item) => ({
        ...item,
        type: "podcast" as const,
      })),
    ].sort((a, b) => a.title.localeCompare(b.title));

    return {
      items,
      totals: {
        all: items.length,
        audiobooks: items.filter((item) => item.type === "audiobook").length,
        podcasts: items.filter((item) => item.type === "podcast").length,
      },
    };
  }),

  detail: os.input(detailInput).handler(async ({ input }) => {
    const audiobook = await db
      .select({
        id: audiobooks.id,
        title: audiobooks.title,
        author: audiobooks.author,
        narrator: audiobooks.narrator,
        duration: audiobooks.duration,
        cover: audiobooks.cover,
        description: audiobooks.description,
        releaseDate: audiobooks.releaseDate,
        language: audiobooks.language,
        publisher: audiobooks.publisher,
        category: audiobooks.category,
      })
      .from(audiobooks)
      .where(eq(audiobooks.id, input.id))
      .limit(1);

    if (audiobook[0]) {
      const chapters = await db
        .select({
          title: audiobookChapters.title,
          duration: audiobookChapters.duration,
        })
        .from(audiobookChapters)
        .where(eq(audiobookChapters.audiobookId, input.id))
        .orderBy(asc(audiobookChapters.title));

      const related = await db
        .select({
          id: audiobooks.id,
          title: audiobooks.title,
          author: audiobooks.author,
          cover: audiobooks.cover,
          duration: audiobooks.duration,
        })
        .from(audiobooks)
        .where(ne(audiobooks.id, input.id))
        .orderBy(asc(audiobooks.title))
        .limit(4);

      return {
        content: {
          ...audiobook[0],
          type: "audiobook" as const,
          chapters,
          episodes: [],
        },
        related: related.map((item) => ({ ...item, type: "audiobook" as const })),
      };
    }

    const podcast = await db
      .select({
        id: podcasts.id,
        title: podcasts.title,
        author: podcasts.author,
        duration: podcasts.duration,
        cover: podcasts.cover,
        description: podcasts.description,
        releaseDate: podcasts.releaseDate,
        language: podcasts.language,
        publisher: podcasts.publisher,
        category: podcasts.category,
      })
      .from(podcasts)
      .where(eq(podcasts.id, input.id))
      .limit(1);

    if (podcast[0]) {
      const episodes = await db
        .select({
          title: podcastEpisodes.title,
          duration: podcastEpisodes.duration,
          date: podcastEpisodes.date,
        })
        .from(podcastEpisodes)
        .where(eq(podcastEpisodes.podcastId, input.id))
        .orderBy(asc(podcastEpisodes.date));

      const related = await db
        .select({
          id: podcasts.id,
          title: podcasts.title,
          author: podcasts.author,
          cover: podcasts.cover,
          duration: podcasts.duration,
        })
        .from(podcasts)
        .where(ne(podcasts.id, input.id))
        .orderBy(asc(podcasts.title))
        .limit(4);

      return {
        content: {
          ...podcast[0],
          narrator: null,
          type: "podcast" as const,
          chapters: [],
          episodes,
        },
        related: related.map((item) => ({ ...item, type: "podcast" as const })),
      };
    }

    throw new ORPCError("NOT_FOUND");
  }),
};