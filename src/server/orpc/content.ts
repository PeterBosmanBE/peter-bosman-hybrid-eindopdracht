import { os } from "@orpc/server";
import { ORPCError } from "@orpc/server";
import { and, asc, eq, ne } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";
import * as z from "zod";
import { db } from "@/src/server/db/client";
import {
  audiobookChapters,
  audiobooks,
  bookmarks,
  podcastEpisodes,
  podcasts,
} from "@/src/server/db/schema";
import { AUDIOBOOK_TAGS, PODCAST_TAGS } from "@/src/types/Tags";
import { LANGUAGES } from "@/src/types/Languages";
import NoPodcastCover from "@/public/no-podcast-cover.webp";
import NoAudiobookCover from "@/public/no-audiobook-cover.webp";

const APPROVED_TAGS = [...new Set([...PODCAST_TAGS, ...AUDIOBOOK_TAGS])];

function parseDurationToSeconds(duration: string | null | undefined) {
  if (!duration) return 0;

  const value = duration.trim();
  if (!value) return 0;

  if (value.includes(":")) {
    const parts = value
      .split(":")
      .map((part) => Number.parseInt(part, 10))
      .filter((part) => Number.isFinite(part));

    if (parts.length === 3) {
      return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    }

    if (parts.length === 2) {
      return (parts[0] * 60) + parts[1];
    }
  }

  const hoursMatch = value.match(/(\d+)\s*h/i);
  const minutesMatch = value.match(/(\d+)\s*m/i);
  const secondsMatch = value.match(/(\d+)\s*s/i);

  if (hoursMatch || minutesMatch || secondsMatch) {
    const hours = Number.parseInt(hoursMatch?.[1] ?? "0", 10);
    const minutes = Number.parseInt(minutesMatch?.[1] ?? "0", 10);
    const seconds = Number.parseInt(secondsMatch?.[1] ?? "0", 10);
    return (hours * 3600) + (minutes * 60) + seconds;
  }

  const numeric = Number.parseInt(value, 10);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatSecondsToDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

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

const updateContentInput = z.object({
  userId: z.string().min(1),
  id: z.string().min(1),
  type: z.enum(["audiobook", "podcast"]),
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
  cover: z.string().url().optional(),
  duration: z.string().max(50).optional(),
  language: z.enum(LANGUAGES).optional(),
});

const deleteContentInput = z.object({
  userId: z.string().min(1),
  id: z.string().min(1),
  type: z.enum(["audiobook", "podcast"]),
});

type ChapterUpdatePayload = Partial<
  Pick<InferInsertModel<typeof audiobookChapters>, "title" | "description" | "narrator">
>;

type EpisodeUpdatePayload = Partial<
  Pick<InferInsertModel<typeof podcastEpisodes>, "title" | "description">
>;

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
      duration: null,
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

  createAudiobookChapter: os.input(z.object({
    audiobookId: z.string().min(1),
    title: z.string().max(200).optional(),
    description: z.string().max(5000).optional(),
    audio: z.string().url().optional(),
    duration: z.string().max(50).optional(),
    narrator: z.string().max(120).optional(),
  })).handler(async ({ input }) => {
    const id = crypto.randomUUID();
    const chapterDuration = input.duration?.trim() || "00:00";

    const existingChapters = await db
      .select({ id: audiobookChapters.id })
      .from(audiobookChapters)
      .where(eq(audiobookChapters.audiobookId, input.audiobookId));

    const nextChapterNumber = existingChapters.length + 1;
    const chapterTitle = input.title?.trim() || `Chapter ${nextChapterNumber}`;

    await db.insert(audiobookChapters).values({
      id,
      audiobookId: input.audiobookId,
      title: chapterTitle,
      duration: chapterDuration,
      audio: input.audio || "",
      description: input.description?.trim() || "",
      narrator: input.narrator?.trim() || null,
    });

    const allChapters = await db
      .select({ duration: audiobookChapters.duration })
      .from(audiobookChapters)
      .where(eq(audiobookChapters.audiobookId, input.audiobookId));

    const totalDurationSeconds = allChapters.reduce(
      (sum, chapter) => sum + parseDurationToSeconds(chapter.duration),
      0,
    );

    await db
      .update(audiobooks)
      .set({ duration: formatSecondsToDuration(totalDurationSeconds) })
      .where(eq(audiobooks.id, input.audiobookId));

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
    const episodeDuration = input.duration?.trim() || "00:00";

    await db.insert(podcastEpisodes).values({
      id,
      podcastId: input.podcastId,
      title: input.title,
      duration: episodeDuration,
      audio: input.audio || "",
      description: input.description?.trim() || "",
      date: today,
    });

    await db
      .update(podcasts)
      .set({ duration: episodeDuration })
      .where(eq(podcasts.id, input.podcastId));

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
              description: audiobooks.description,
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
              description: audiobooks.description,
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
              description: podcasts.description,
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
              description: podcasts.description,
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
          id: audiobookChapters.id,
          title: audiobookChapters.title,
          duration: audiobookChapters.duration,
          audio: audiobookChapters.audio,
          description: audiobookChapters.description,
          narrator: audiobookChapters.narrator,
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
          description: podcastEpisodes.description,
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

  update: os.input(updateContentInput).handler(async ({ input }) => {
    const payload = {
      title: input.title.trim(),
      author: input.author.trim(),
      description: input.description?.trim() || "",
      duration: input.duration?.trim() || "00:00",
      language: input.language?.trim() || "English",
      cover: input.cover?.trim(),
      tags: input.tags?.length ? input.tags.join(", ") : null,
    };

    if (input.type === "audiobook") {
      const result = await db
        .update(audiobooks)
        .set(payload)
        .where(and(eq(audiobooks.id, input.id), eq(audiobooks.userId, input.userId)))
        .returning({ id: audiobooks.id });

      if (!result[0]) {
        throw new ORPCError("NOT_FOUND");
      }

      return { id: result[0].id };
    }

    const result = await db
      .update(podcasts)
      .set(payload)
      .where(and(eq(podcasts.id, input.id), eq(podcasts.userId, input.userId)))
      .returning({ id: podcasts.id });

    if (!result[0]) {
      throw new ORPCError("NOT_FOUND");
    }

    return { id: result[0].id };
  }),

  delete: os.input(deleteContentInput).handler(async ({ input }) => {
    if (input.type === "audiobook") {
      const owned = await db
        .select({ id: audiobooks.id })
        .from(audiobooks)
        .where(and(eq(audiobooks.id, input.id), eq(audiobooks.userId, input.userId)))
        .limit(1);

      if (!owned[0]) {
        throw new ORPCError("NOT_FOUND");
      }

      await db.delete(audiobookChapters).where(eq(audiobookChapters.audiobookId, input.id));
      await db
        .delete(bookmarks)
        .where(and(eq(bookmarks.contentId, input.id), eq(bookmarks.contentType, "audiobook")));
      await db.delete(audiobooks).where(eq(audiobooks.id, input.id));

      return { id: input.id };
    }

    const owned = await db
      .select({ id: podcasts.id })
      .from(podcasts)
      .where(and(eq(podcasts.id, input.id), eq(podcasts.userId, input.userId)))
      .limit(1);

    if (!owned[0]) {
      throw new ORPCError("NOT_FOUND");
    }

    await db.delete(podcastEpisodes).where(eq(podcastEpisodes.podcastId, input.id));
    await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.contentId, input.id), eq(bookmarks.contentType, "podcast")));
    await db.delete(podcasts).where(eq(podcasts.id, input.id));

    return { id: input.id };
  }),

  updateChapter: os.input(z.object({
    chapterId: z.string().min(1),
    title: z.string().max(200).optional(),
    description: z.string().max(5000).optional(),
    narrator: z.string().max(120).optional(),
  })).handler(async ({ input }) => {
    const payload: ChapterUpdatePayload = {};
    if (input.title !== undefined) payload.title = input.title.trim();
    if (input.description !== undefined) payload.description = input.description.trim();
    if (input.narrator !== undefined) payload.narrator = input.narrator.trim() || null;

    const result = await db
      .update(audiobookChapters)
      .set(payload)
      .where(eq(audiobookChapters.id, input.chapterId))
      .returning({ id: audiobookChapters.id });

    if (!result[0]) {
      throw new ORPCError("NOT_FOUND");
    }

    return { id: result[0].id };
  }),

  deleteChapter: os.input(z.object({
    chapterId: z.string().min(1),
  })).handler(async ({ input }) => {
    const chapter = await db
      .select({ audiobookId: audiobookChapters.audiobookId })
      .from(audiobookChapters)
      .where(eq(audiobookChapters.id, input.chapterId))
      .limit(1);

    if (!chapter[0]) {
      throw new ORPCError("NOT_FOUND");
    }

    await db.delete(bookmarks).where(eq(bookmarks.contentId, input.chapterId));
    await db.delete(audiobookChapters).where(eq(audiobookChapters.id, input.chapterId));

    const remainingChapters = await db
      .select({ duration: audiobookChapters.duration })
      .from(audiobookChapters)
      .where(eq(audiobookChapters.audiobookId, chapter[0].audiobookId));

    const totalDurationSeconds = remainingChapters.reduce(
      (sum, ch) => sum + parseDurationToSeconds(ch.duration),
      0,
    );

    await db
      .update(audiobooks)
      .set({ duration: formatSecondsToDuration(totalDurationSeconds) })
      .where(eq(audiobooks.id, chapter[0].audiobookId));

    return { id: input.chapterId };
  }),

  updateEpisode: os.input(z.object({
    episodeId: z.string().min(1),
    title: z.string().max(200).optional(),
    description: z.string().max(5000).optional(),
  })).handler(async ({ input }) => {
    const payload: EpisodeUpdatePayload = {};
    if (input.title !== undefined) payload.title = input.title.trim();
    if (input.description !== undefined) payload.description = input.description.trim();

    const result = await db
      .update(podcastEpisodes)
      .set(payload)
      .where(eq(podcastEpisodes.id, input.episodeId))
      .returning({ id: podcastEpisodes.id });

    if (!result[0]) {
      throw new ORPCError("NOT_FOUND");
    }

    return { id: result[0].id };
  }),

  deleteEpisode: os.input(z.object({
    episodeId: z.string().min(1),
  })).handler(async ({ input }) => {
    const episode = await db
      .select({ podcastId: podcastEpisodes.podcastId })
      .from(podcastEpisodes)
      .where(eq(podcastEpisodes.id, input.episodeId))
      .limit(1);

    if (!episode[0]) {
      throw new ORPCError("NOT_FOUND");
    }

    await db.delete(bookmarks).where(eq(bookmarks.contentId, input.episodeId));
    await db.delete(podcastEpisodes).where(eq(podcastEpisodes.id, input.episodeId));

    return { id: input.episodeId };
  }),
};