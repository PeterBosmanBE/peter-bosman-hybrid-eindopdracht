"use client";

import { useState } from "react";
import Link from "next/link";
import "./home.css"

const featuredContent = [
  {
    id: 1,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    type: "audiobook",
    duration: "5h 48m",
    cover:
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=400&fit=crop",
    narrator: "Chris Hill",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    type: "audiobook",
    duration: "15h 17m",
    cover:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    narrator: "Derek Perkins",
    rating: 4.7,
  },
  {
    id: 3,
    title: "Atomic Habits",
    author: "James Clear",
    type: "audiobook",
    duration: "5h 35m",
    cover:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop",
    narrator: "James Clear",
    rating: 4.9,
  },
  {
    id: 4,
    title: "Think Again",
    author: "Adam Grant",
    type: "audiobook",
    duration: "6h 40m",
    cover:
      "https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=400&h=400&fit=crop",
    narrator: "Adam Grant",
    rating: 4.6,
  },
];

const continueListening = [
  {
    id: 5,
    title: "Deep Work",
    author: "Cal Newport",
    progress: 65,
    timeLeft: "2h 42m",
    cover:
      "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Range",
    author: "David Epstein",
    progress: 32,
    timeLeft: "6h 48m",
    cover:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop",
  },
];

const podcasts = [
  {
    id: 7,
    title: "StartUp Podcast",
    author: "Gimlet Media",
    type: "podcast",
    episodes: 124,
    cover:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop",
    rating: 4.6,
  },
  {
    id: 8,
    title: "The Tim Ferriss Show",
    author: "Tim Ferriss",
    type: "podcast",
    episodes: 680,
    cover:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=400&fit=crop",
    rating: 4.8,
  },
  {
    id: 9,
    title: "How I Built This",
    author: "Guy Raz",
    type: "podcast",
    episodes: 450,
    cover:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=400&fit=crop",
    rating: 4.7,
  },
  {
    id: 10,
    title: "WorkLife",
    author: "Adam Grant",
    type: "podcast",
    episodes: 89,
    cover:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop",
    rating: 4.5,
  },
];

const categories = [
  "All",
  "Business",
  "Self-Development",
  "History",
  "Science",
  "Fiction",
  "Biography",
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#FAFAF8",
        fontFamily: "'Source Sans 3', sans-serif",
      }}
    >

      {/* Hero */}
      <section
        className="px-6 py-12 md:py-20"
        style={{
          background: "linear-gradient(180deg, #232F3E 0%, #37475A 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                style={{ background: "#F7941D", color: "white" }}
              >
                Premium Listening
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Stories that move you,
                <br />
                wherever you go
              </h1>
              <p
                className="text-lg mb-8"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Access thousands of audiobooks and podcasts. Listen on any
                device, anytime.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  className="px-8 py-3.5 rounded-full font-semibold transition-all hover:opacity-90"
                  style={{ background: "#F7941D", color: "white" }}
                >
                  Start Free Trial
                </button>
                <button
                  className="px-8 py-3.5 rounded-full font-semibold transition-all border hover:bg-white/10"
                  style={{
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "white",
                  }}
                >
                  Browse Library
                </button>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4">
                {featuredContent.slice(0, 4).map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/details/${item.id}`}
                    className="book-card"
                    style={{
                      transform: index % 2 === 1 ? "translateY(20px)" : "",
                    }}
                  >
                    <div className="relative">
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-32 md:w-40 rounded-lg shadow-2xl"
                        style={{ aspectRatio: "2/3", objectFit: "cover" }}
                      />
                      <div className="book-shadow absolute -bottom-2 left-2 right-2 h-4 rounded-full bg-black/20 blur-md"></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Continue Listening */}
      {continueListening.length > 0 && (
        <section className="px-6 py-10 max-w-7xl mx-auto">
          <h2
            className="font-serif text-2xl font-bold mb-6"
            style={{ color: "#232F3E" }}
          >
            Continue Listening
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {continueListening.map((item) => (
              <Link
                key={item.id}
                href={`/listen/${item.id}`}
                className="flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-lg"
                style={{ background: "#FFFFFF", borderColor: "#E8E8E8" }}
              >
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-serif font-bold truncate"
                    style={{ color: "#232F3E" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm" style={{ color: "#666666" }}>
                    {item.author}
                  </p>
                  <div className="mt-3">
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "#E8E8E8" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.progress}%`,
                          background: "#F7941D",
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: "#666666" }}>
                      {item.timeLeft} left
                    </p>
                  </div>
                </div>
                <button
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-colors shrink-0"
                  style={{ background: "#F7941D" }}
                >
                  <svg
                    className="w-5 h-5 text-white ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all`}
              style={{
                background: activeCategory === cat ? "#232F3E" : "#F5F5F5",
                color: activeCategory === cat ? "white" : "#666666",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Audiobooks */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="font-serif text-2xl font-bold"
            style={{ color: "#232F3E" }}
          >
            Featured Audiobooks
          </h2>
          <Link
            href="/home"
            className="text-sm font-semibold transition-colors"
            style={{ color: "#F7941D" }}
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredContent.map((item) => (
            <Link
              key={item.id}
              href={`/details/${item.id}`}
              className="book-card group"
            >
              <div className="relative mb-4">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full rounded-lg shadow-lg"
                  style={{ aspectRatio: "2/3", objectFit: "cover" }}
                />
                <div className="book-shadow absolute -bottom-2 left-3 right-3 h-4 rounded-full bg-black/20 blur-md"></div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "#F7941D" }}
                  >
                    <svg
                      className="w-6 h-6 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              <h3
                className="font-serif font-bold truncate"
                style={{ color: "#232F3E" }}
              >
                {item.title}
              </h3>
              <p className="text-sm truncate" style={{ color: "#666666" }}>
                {item.author}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-3.5 h-3.5"
                      style={{
                        color:
                          i < Math.floor(item.rating) ? "#F7941D" : "#E8E8E8",
                      }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs" style={{ color: "#666666" }}>
                  {item.duration}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Feature */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <div
          className="rounded-2xl p-8 md:p-12"
          style={{
            background: "linear-gradient(135deg, #232F3E 0%, #37475A 100%)",
          }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                style={{
                  background: "rgba(247, 148, 29, 0.2)",
                  color: "#F7941D",
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />{" "}
                </svg>
                AI-Powered
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                Intelligent Summaries
              </h2>
              <p
                className="text-lg mb-6"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Get instant AI-generated summaries of any audiobook. Perfect for
                deciding what to listen to next or reviewing key insights.
              </p>
              <button
                className="px-8 py-3.5 rounded-full font-semibold transition-all hover:opacity-90"
                style={{ background: "#F7941D", color: "white" }}
              >
                Try It Free
              </button>
            </div>
            <div
              className="rounded-xl p-6"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "#F7941D" }}
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">AI Summary</p>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    The Psychology of Money explores how personal behavior affects financial outcomes more than technical knowledge. Key themes include...
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Behavioral Finance
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Psychology
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Podcasts */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="font-serif text-2xl font-bold"
            style={{ color: "#232F3E" }}
          >
            Popular Podcasts
          </h2>
          <Link
            href="/home"
            className="text-sm font-semibold transition-colors"
            style={{ color: "#F7941D" }}
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {podcasts.map((item) => (
            <Link
              key={item.id}
              href={`/details/${item.id}`}
              className="book-card group"
            >
              <div className="relative mb-4">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full aspect-square rounded-xl shadow-lg object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <button
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "#F7941D" }}
                  >
                    <svg
                      className="w-6 h-6 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              <h3
                className="font-serif font-bold truncate"
                style={{ color: "#232F3E" }}
              >
                {item.title}
              </h3>
              <p className="text-sm truncate" style={{ color: "#666666" }}>
                {item.author}
              </p>
              <p className="text-xs mt-1" style={{ color: "#999999" }}>
                {item.episodes} episodes
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
