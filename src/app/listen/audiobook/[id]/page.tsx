"use client";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import Logo from "@/src/components/ui/logo";
import { orpc } from "@/src/server/orpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

type PageParams = { id: string };

export default function ListenAudiobook({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { id } = use(params);

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(
    orpc.content.detail.queryOptions({ input: { id } }),
  );
  const content = data?.content;
  const audiobookChapters =
    content?.type === "audiobook" ? content.chapters : [];

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(80);
  const [showChapters, setShowChapters] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [localBookmarks, setLocalBookmarks] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);

  const currentChapterId = audiobookChapters[currentChapter]?.id || "";
  const { data: dbBookmarks } = useQuery({
    ...orpc.bookmarks.getBookmarks.queryOptions({
      input: { contentId: currentChapterId, contentType: "audiobook" },
    }),
    enabled: !!currentChapterId,
  });

  const audioUrl = audiobookChapters[currentChapter]?.audio;

  const bookmarks = Array.from(
    new Set([
      ...(dbBookmarks?.map((b) => b.positionSeconds) || []),
      ...localBookmarks,
    ]),
  ).sort((a, b) => a - b);

  useEffect(() => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
    } else if (audioRef.current.src !== audioUrl) {
      audioRef.current.src = audioUrl;
    }

    const audio = audioRef.current;

    const setAudioData = () => {
      setDuration(audio.duration);
      setIsReady(true);
    };
    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };
    const setAudioEnd = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", setAudioEnd);

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", setAudioEnd);
    };
  }, [audioUrl]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && isReady) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isReady]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipForward = () => {
    handleSeek(Math.min(duration, currentTime + 30));
  };

  const skipBackward = () => {
    handleSeek(Math.max(0, currentTime - 30));
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const addBookmarkMutation = useMutation(
    orpc.bookmarks.addBookmark.mutationOptions({
      onSuccess: () => {
        // Refetch bookmarks after a new one is added
        if (currentChapterId) {
          queryClient.invalidateQueries({
            queryKey: orpc.bookmarks.getBookmarks.key({
              input: { contentId: currentChapterId, contentType: "audiobook" },
            }),
          });
        }
      },
    }),
  );

  const addBookmark = () => {
    const current = Math.floor(currentTime);
    if (!bookmarks.includes(current) && currentChapterId) {
      setLocalBookmarks((prev) => [...prev, current]);
      addBookmarkMutation.mutate({
        contentId: currentChapterId,
        contentType: "audiobook",
        positionSeconds: current,
        title: `Bookmark at ${formatTime(currentTime)}`,
      });
    }
  };

  if (isLoading || !content) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center space-y-4"
        style={{ background: "#121212" }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="text-white text-lg">Loading audiobook...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#121212",
        fontFamily: "'Source Sans 3', sans-serif",
      }}
    >
      <nav
        className="flex items-center justify-between px-6 py-4"
        style={{ background: "#1A1A1A" }}
      >
        <Logo isMainHeader={false} />
        <button
          onClick={() => setShowChapters(!showChapters)}
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: showChapters ? "#F7941D" : "rgba(255,255,255,0.6)" }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          Chapters
        </button>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        <div
          className={`flex-1 flex flex-col items-center justify-center p-8 transition-all overflow-y-auto ${showChapters ? "lg:mr-80" : ""}`}
        >
          <div className="relative mb-10">
            <div
              className={`absolute inset-0 rounded-full ${isPlaying ? "pulse-ring" : ""}`}
              style={{
                background: "#F7941D",
                filter: "blur(60px)",
                opacity: 0.2,
              }}
            ></div>
            <img
              src={content.cover || ""}
              alt={content.title}
              className="w-64 md:w-80 rounded-xl shadow-2xl relative z-10"
              style={{ aspectRatio: "1/1", objectFit: "cover" }}
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
              {content.title}
            </h1>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.6)" }}>
              {content.author}
            </p>
            {content.narrator && (
              <p
                className="text-sm mt-1"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Narrated by {content.narrator}
              </p>
            )}
          </div>

          {audiobookChapters.length > 0 && (
            <div className="text-center mb-6">
              <p className="text-sm font-semibold" style={{ color: "#F7941D" }}>
                Chapter {currentChapter + 1}:{" "}
                {audiobookChapters[currentChapter]?.title || "Chapter"}
              </p>
            </div>
          )}

          <div className="w-full max-w-xl mb-4">
            <div
              className="relative h-1.5 rounded-full cursor-pointer group"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{ width: `${progress}%`, background: "#F7941D" }}
              />
              {bookmarks.map((bm, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full cursor-pointer hover:scale-150 transition-transform"
                  style={{
                    left: `${(bm / duration) * 100}%`,
                    background: "#FF6B35",
                  }}
                  title={formatTime(bm)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSeek(bm);
                  }}
                />
              ))}
              <Input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>
            <div
              className="flex justify-between mt-2 text-sm"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(duration - currentTime)}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <button
              onClick={skipBackward}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors relative"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
                />
              </svg>
              <span className="absolute -bottom-1 text-xs text-white font-semibold">
                30
              </span>
            </button>

            <button
              onClick={() => {
                setCurrentChapter((prev) => Math.max(0, prev - 1));
                setCurrentTime(0);
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ background: "#F7941D" }}
            >
              {isPlaying ? (
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => {
                setCurrentChapter((prev) =>
                  Math.min((audiobookChapters.length || 1) - 1, prev + 1),
                );
                setCurrentTime(0);
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>

            <button
              onClick={skipForward}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors relative"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
                />
              </svg>
              <span className="absolute -bottom-1 text-xs text-white font-semibold">
                30
              </span>
            </button>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const currentIndex = speeds.indexOf(playbackSpeed);
                  const nextIndex = (currentIndex + 1) % speeds.length;
                  setPlaybackSpeed(speeds[nextIndex]);
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#F7941D",
                }}
              >
                {playbackSpeed}x
              </button>
            </div>

            <button
              onClick={addBookmark}
              className="p-2 rounded-lg transition-colors"
              style={{ background: "rgba(255,255,255,0.1)" }}
              title="Add bookmark"
            >
              <svg
                className="w-5 h-5"
                style={{ color: "rgba(255,255,255,0.6)" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                style={{ color: "rgba(255,255,255,0.6)" }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
              <Input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24"
                style={{
                  background: `linear-gradient(90deg, #F7941D ${volume}%, rgba(255,255,255,0.1) ${volume}%)`,
                }}
              />
            </div>
          </div>
        </div>

        {showChapters && (
          <div
            className="fixed right-0 top-0 bottom-0 w-80 overflow-y-auto border-l z-20"
            style={{
              background: "#1A1A1A",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg font-bold text-white">
                  Chapters
                </h3>
                <button onClick={() => setShowChapters(false)} className="p-1">
                  <svg
                    className="w-5 h-5"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-1">
                {audiobookChapters.length > 0 ? (
                  audiobookChapters.map((chapter, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentChapter(index);
                        setCurrentTime(0);
                      }}
                      className={`w-full text-left p-4 rounded-lg transition-colors ${currentChapter === index ? "bg-white/10" : "hover:bg-white/5"}`}
                    >
                      <div className="flex items-center gap-3">
                        {currentChapter === index && isPlaying ? (
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: "#F7941D" }}
                          >
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        ) : (
                          <span
                            className="w-6 h-6 text-sm font-semibold flex items-center justify-center"
                            style={{
                              color:
                                currentChapter === index
                                  ? "#F7941D"
                                  : "rgba(255,255,255,0.4)",
                            }}
                          >
                            {index + 1}
                          </span>
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-semibold truncate ${currentChapter === index ? "text-white" : ""}`}
                            style={{
                              color:
                                currentChapter === index
                                  ? "white"
                                  : "rgba(255,255,255,0.7)",
                            }}
                          >
                            {chapter.title}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                          >
                            {chapter.duration}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <p
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    No chapters available.
                  </p>
                )}
              </div>

              {bookmarks.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-serif text-lg font-bold text-white mb-4">
                    Bookmarks
                  </h3>
                  <div className="space-y-2">
                    {bookmarks.map((bm, index) => (
                      <button
                        key={index}
                        onClick={() => handleSeek(bm)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-white/5"
                      >
                        <svg
                          className="w-4 h-4"
                          style={{ color: "#F7941D" }}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        <span
                          className="text-sm"
                          style={{ color: "rgba(255,255,255,0.7)" }}
                        >
                          {formatTime(bm)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
