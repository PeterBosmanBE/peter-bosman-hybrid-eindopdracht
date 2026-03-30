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
import { AUDIOBOOK_TAGS, PODCAST_TAGS } from "@/src/types/Tags";
import { LANGUAGES } from "@/src/types/Languages";
import NoPodcastCover from "@/public/no-podcast-cover.webp";
import NoAudiobookCover from "@/public/no-audiobook-cover.webp";

const APPROVED_TAGS = [...new Set([...PODCAST_TAGS, ...AUDIOBOOK_TAGS])];

const listContentInput = z
  .object({
    userId: z.string().min(1).optional(),
    type: z.enum(["all", "audiobook", "podcast"]).default("all").optional(),
  })
  .optional();

const detailInput = z.object({
  id: z.string().min(1),
});

const createContentInput = z.object({
  userId: z.string().min(1),
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(120),
  description: z.string().max(5000).optional(),
  tags: z
    .array(z.string())
    .optional()
    .refine(
      (values) => !values || values.every((value) => APPROVED_TAGS.includes(value as (typeof APPROVED_TAGS)[number])),
      "One or more tags are not approved",
    ),
  category: z.string().max(120).optional(),
  cover: z.string().url().optional(),
  audio: z.string().url().optional(),
  duration: z.string().max(50).optional(),
  language: z.enum(LANGUAGES).optional(),
  publisher: z.string().max(120).optional(),
});

export const contentRouter = {
  createPodcast: os.input(createContentInput).handler(async ({ input }) => {
    const id = crypto.randomUUID();
    const today = new Date().toISOString().slice(0, 10);

    await db.insert(podcasts).values({
      id,
      userId: input.userId,
      title: input.title,
      author: input.author,
      duration: input.duration?.trim() || "00:00",
      cover: input.cover?.trim() || NoPodcastCover.src,
      description: input.description?.trim() || "",
      tags: input.tags?.join(", ") || null,
      releaseDate: today,
      language: input.language?.trim() || "English",
      publisher: input.publisher?.trim() || input.author,
      category: input.category?.trim() || "General",
    });

    if (input.audio) {
      await db.insert(podcastEpisodes).values({
        id: crypto.randomUUID(),
        podcastId: id,
        title: "Episode 1",
        duration: input.duration?.trim() || "00:00",
        audio: input.audio,
        description: input.description?.trim() || "First episode",
        date: today,
      });
    }

    return { id };
  }),

  createAudiobook: os.input(createContentInput).handler(async ({ input }) => {
    const id = crypto.randomUUID();
    const today = new Date().toISOString().slice(0, 10);

    await db.insert(audiobooks).values({
      id,
      userId: input.userId,
      title: input.title,
      author: input.author,
      narrator: null,
      duration: input.duration?.trim() || "00:00",
      audio: input.audio || "", // Added audio here
      cover: input.cover?.trim() || NoAudiobookCover.src,
      description: input.description?.trim() || "",
      tags: input.tags?.join(", ") || null,
      releaseDate: today,
      language: input.language?.trim() || "English",
      publisher: input.publisher?.trim() || input.author,
      category: input.category?.trim() || "General",
    });

    return { id };
  }),

  createPodcastEpisode: os.input(z.object({
    podcastId: z.string().min(1),
    title: z.string().min(1).max(200),
    description: z.string().max(5000).optional(),
    audio: z.string().url().optional(),
    duration: z.string().max(50).optional(),
  })).handler(async ({ input }) => {
    const today = new Date().toISOString().slice(0, 10);
    const id = crypto.randomUUID();

    await db.insert(podcastEpisodes).values({
      id,
      podcastId: input.podcastId,
      title: input.title,
      duration: input.duration?.trim() || "00:00",
      audio: input.audio || "",
      description: input.description?.trim() || "",
      date: today,
    });

    return { id };
  }),

  list: os.input(listContentInput).handler(async ({ input }) => {
    const type = input?.type ?? "all";

    const shouldFetchAudiobooks = type === "all" || type === "audiobook";
    const shouldFetchPodcasts = type === "all" || type === "podcast";

    const audiobookRows = shouldFetchAudiobooks
      ? await (input?.userId
          ? db.select({
              id: audiobooks.id,
              title: audiobooks.title,
              author: audiobooks.author,
              duration: audiobooks.duration,
              tags: audiobooks.tags,
              language: audiobooks.language,
              cover: audiobooks.cover,
              releaseDate: audiobooks.releaseDate,
            })
            .from(audiobooks)
            .where(eq(audiobooks.userId, input.userId))
            .orderBy(asc(audiobooks.title))
          : db.select({
              id: audiobooks.id,
              title: audiobooks.title,
              author: audiobooks.author,
              duration: audiobooks.duration,
              tags: audiobooks.tags,
              language: audiobooks.language,
              cover: audiobooks.cover,
              releaseDate: audiobooks.releaseDate,
            })
            .from(audiobooks)
            .orderBy(asc(audiobooks.title)))
      : [];

    const podcastRows = shouldFetchPodcasts
      ? await (input?.userId
          ? db.select({
              id: podcasts.id,
              title: podcasts.title,
              author: podcasts.author,
              duration: podcasts.duration,
              tags: podcasts.tags,
              language: podcasts.language,
              cover: podcasts.cover,
              releaseDate: podcasts.releaseDate,
            })
            .from(podcasts)
            .where(eq(podcasts.userId, input.userId))
            .orderBy(asc(podcasts.title))
          : db.select({
              id: podcasts.id,
              title: podcasts.title,
              author: podcasts.author,
              duration: podcasts.duration,
              tags: podcasts.tags,
              language: podcasts.language,
              cover: podcasts.cover,
              releaseDate: podcasts.releaseDate,
            })
            .from(podcasts)
            .orderBy(asc(podcasts.title)))
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
        audio: audiobooks.audio,
        description: audiobooks.description,
        tags: audiobooks.tags,
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
        tags: podcasts.tags,
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
          id: podcastEpisodes.id,
          title: podcastEpisodes.title,
          duration: podcastEpisodes.duration,
          audio: podcastEpisodes.audio,
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