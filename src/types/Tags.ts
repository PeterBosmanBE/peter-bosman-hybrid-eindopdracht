export const PODCAST_TAGS = [
  "Celebrities",
  "Comedy",
  "Film",
  "Hobby's",
  "Technology",
  "True Crime",
  "News",
  "Education",
  "Health",
  "Business",
  "Sports",
  "Music",
  "History",
  "Science",
  "Fiction",
  "Religion",
] as const;

export const AUDIOBOOK_TAGS = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Thriller",
  "Romance",
  "Biography",
  "Self-Help",
  "History",
  "Children's",
  "Religion",
] as const;

export type PodcastTags = (typeof PODCAST_TAGS)[number];
export type AudiobookTags = (typeof AUDIOBOOK_TAGS)[number];
