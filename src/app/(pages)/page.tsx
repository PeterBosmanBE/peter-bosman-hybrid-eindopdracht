import Link from "next/link";
import "./home.css"
import Image from "next/image";
import { db } from "@/src/server/db/client";
import { audiobooks, podcasts as podcastsTable } from "@/src/server/db/schema";
import { authClient } from "@/src/server/auth/auth-client";

async function getRandomItems<T>(items: T[], count: number): Promise<T[]> {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default async function Home() {
  const audioList = await db.select().from(audiobooks).limit(20);
  const podcastList = await db.select().from(podcastsTable).limit(20);
  
  const featuredContent = await getRandomItems(audioList, 4);
  const podcastsData = await getRandomItems(podcastList, 4);
  
  const session = await authClient.getSession();
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
                {session ? (
                  <Link
                    href="/library"
                    className="px-8 py-3.5 rounded-full font-semibold transition-all hover:opacity-90 inline-block"
                    style={{ background: "#F7941D", color: "white" }}
                  >
                    My Library
                  </Link>
                  ) : (
                  <Link
                    href="/sign-in"
                    className="px-8 py-3.5 rounded-full font-semibold transition-all hover:opacity-90 inline-block"
                    style={{ background: "#F7941D", color: "white" }}
                  >
                    Create a free account!
                  </Link>
                  )
                }
                <Link
                  href="/search"
                  className="px-8 py-3.5 rounded-full font-semibold transition-all border hover:bg-white/10 inline-block"
                  style={{
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "white",
                  }}
                >
                  {session ? "Search for some adventure" : "Browse Library"}
                </Link>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4">
                {featuredContent.slice(0, 4).map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/audiobook/${item.id}`}
                    className="book-card"
                    style={{
                      transform: index % 2 === 1 ? "translateY(20px)" : "",
                    }}
                  >
                    <div className="relative">
                      <Image
                        src={item.cover}
                        alt={item.title}
                        width={160}
                        height={240}
                        className="rounded-lg shadow-2xl"
                        style={{ objectFit: "cover" }}
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

      {/* Featured Audiobooks */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="font-serif text-2xl font-bold text-[#232F3E]"
          >
            Featured Audiobooks
          </h2>
          <Link
            href="/search?type=audiobook"
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
              href={`/audiobook/${item.id}`}
              className="book-card group"
            >
              <div className="relative mb-4">
                <Image
                  src={item.cover}
                  alt={item.title}
                  width={200}
                  height={300}
                  className="w-full rounded-lg shadow-lg"
                  style={{ objectFit: "cover" }}
                />
                <div className="book-shadow absolute -bottom-2 left-3 right-3 h-4 rounded-full bg-black/20 blur-md"></div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button
                    className="w-14 h-14 rounded-full flex items-center justify-center bg-[#F7941D]"
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
                className="font-serif font-bold truncate text-[#232F3E]"
              >
                {item.title}
              </h3>
              <p className="text-sm truncate text-[#666666]">
                {item.author}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-[#666666]">
                  {item.duration}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Podcasts */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="font-serif text-2xl font-bold text-[#232F3E]"
          >
            Popular Podcasts
          </h2>
          <Link
            href="/search?type=podcast"
            className="text-sm font-semibold transition-colors"
            style={{ color: "#F7941D" }}
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {podcastsData.map((item) => (
            <Link
              key={item.id}
              href={`/podcasts/${item.id}`}
              className="book-card group"
            >
              <div className="relative mb-4">
                <Image
                  src={item.cover}
                  alt={item.title}
                  width={200}
                  height={200}
                  className="w-full rounded-xl shadow-lg object-cover"
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
                {item.category}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
