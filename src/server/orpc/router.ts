import { uploadsRouter } from "./uploads";
import { contentRouter } from "./content";
import { bookmarksRouter } from "./bookmarks";

export const router = {
  uploads: uploadsRouter,
  content: contentRouter,
  bookmarks: bookmarksRouter,
};