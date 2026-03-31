import { uploadsRouter } from "./uploads";
import { contentRouter } from "./content";
import { bookmarksRouter } from "./bookmarks";
import { libraryRouter } from "./library";

export const router = {
  uploads: uploadsRouter,
  content: contentRouter,
  bookmarks: bookmarksRouter,
  library: libraryRouter,
};
