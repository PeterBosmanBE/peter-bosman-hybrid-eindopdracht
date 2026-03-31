import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, date, integer } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    contentId: text("content_id").notNull(),
    contentType: text("content_type").notNull(),
    positionSeconds: integer("position_seconds").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("bookmarks_userId_idx").on(table.userId)]
);

export const library = pgTable(
  "library",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    contentId: text("content_id").notNull(),
    contentType: text("content_type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("library_userId_idx").on(table.userId)]
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const audiobooks = pgTable(
  "audiobooks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    author: text("author").notNull(),
    narrator: text("narrator"),
    duration: text("duration"),
    cover: text("cover").notNull(),
    description: text("description").notNull(),
    tags: text("tags"),
    releaseDate: date("release_date").notNull(),
    language: text("language").notNull(),
    publisher: text("publisher"),
    category: text("category").notNull(),
  },
  (table) => [
    index("audiobooks_title_idx").on(table.title),
    index("audiobooks_user_id_idx").on(table.userId),
  ]
);

export const audiobookChapters = pgTable(
  "audiobook_chapters",
  {
    id: text("id").primaryKey(),
    audiobookId: text("audiobook_id").references(() => audiobooks.id).notNull(),
    sortOrder: integer("sort_order").notNull().default(1),
    title: text("title").notNull(),
    duration: text("duration").notNull(),
    audio: text("audio").notNull(),
    description: text("description").notNull(),
    narrator: text("narrator"),
  },
  (table) => [index("audiobook_chapters_audiobook_id_idx").on(table.audiobookId)]
);

export const podcasts = pgTable(
  "podcasts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    author: text("author").notNull(),
    duration: text("duration").notNull(),
    cover: text("cover").notNull(),
    description: text("description").notNull(),
    tags: text("tags"),
    releaseDate: date("release_date").notNull(),
    language: text("language").notNull(),
    publisher: text("publisher").notNull(),
    category: text("category").notNull(),
  },
  (table) => [
    index("podcasts_title_idx").on(table.title),
    index("podcasts_user_id_idx").on(table.userId),
  ]
);

export const podcastEpisodes = pgTable(
  "podcast_episodes",
  {
    id: text("id").primaryKey(),
    podcastId: text("podcast_id").references(() => podcasts.id).notNull(),
    sortOrder: integer("sort_order").notNull().default(1),
    title: text("title").notNull(),
    duration: text("duration").notNull(),
    audio: text("audio").notNull(),
    description: text("description").notNull(),
    date: date("date").notNull(),
  },
  (table) => [index("podcast_episodes_podcast_id_idx").on(table.podcastId)]
);

export const uploads = pgTable("uploads", (t) => ({
  id: t.serial().primaryKey(),
  url: t.text().notNull(),
  createdAt: t.timestamp().defaultNow(),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  audiobooks: many(audiobooks),
  podcasts: many(podcasts),
  bookmarks: many(bookmarks),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(user, {
    fields: [bookmarks.userId],
    references: [user.id],
  }),
}));

export const audiobooksRelations = relations(audiobooks, ({ one, many }) => ({
  user: one(user, {
    fields: [audiobooks.userId],
    references: [user.id],
  }),
  chapters: many(audiobookChapters),
}));

export const audiobookChaptersRelations = relations(audiobookChapters, ({ one }) => ({
  audiobook: one(audiobooks, {
    fields: [audiobookChapters.audiobookId],
    references: [audiobooks.id],
  }),
}));

export const podcastsRelations = relations(podcasts, ({ one, many }) => ({
  user: one(user, {
    fields: [podcasts.userId],
    references: [user.id],
  }),
  episodes: many(podcastEpisodes),
}));

export const podcastEpisodesRelations = relations(podcastEpisodes, ({ one }) => ({
  podcast: one(podcasts, {
    fields: [podcastEpisodes.podcastId],
    references: [podcasts.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
