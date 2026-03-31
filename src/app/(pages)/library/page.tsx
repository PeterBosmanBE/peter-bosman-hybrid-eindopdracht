"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/src/server/auth/auth-client";
import { orpc } from "@/src/server/orpc/client";
import { redirect } from "next/navigation";

function formatDate(value: string | null) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function LibraryPage() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const libraryQuery = useQuery({
    ...orpc.library.listLibrary.queryOptions(),
    enabled: Boolean(session?.user?.id),
  });

  if (isSessionPending) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FAFAF8" }}
      >
        <p style={{ color: "#666666" }}>Loading library...</p>
      </div>
    );
  }

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const items = (libraryQuery.data?.items ?? []).filter(
    (item): item is NonNullable<typeof item> => Boolean(item),
  );

  return (
    <div
      className="min-h-screen px-6 py-10"
      style={{
        background: "#FAFAF8",
        fontFamily: "'Source Sans 3', sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h1
          className="font-serif text-3xl md:text-4xl font-bold mb-2"
          style={{ color: "#232F3E" }}
        >
          My Library
        </h1>
        <p className="mb-8" style={{ color: "#666666" }}>
          Your saved audiobooks and podcasts.
        </p>

        {libraryQuery.isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-xl border p-4"
                style={{ background: "#FFFFFF", borderColor: "#E8E8E8" }}
              >
                <div
                  className="w-full rounded-lg mb-4 animate-pulse"
                  style={{ background: "#F1F1EE", aspectRatio: "2/3" }}
                />
                <div
                  className="h-5 w-3/4 rounded mb-2 animate-pulse"
                  style={{ background: "#F1F1EE" }}
                />
                <div
                  className="h-4 w-1/2 rounded animate-pulse"
                  style={{ background: "#F1F1EE" }}
                />
              </div>
            ))}
          </div>
        )}

        {!libraryQuery.isLoading && items.length === 0 && (
          <div
            className="rounded-xl border p-8 text-center"
            style={{ background: "#FFFFFF", borderColor: "#E8E8E8" }}
          >
            <h2
              className="font-serif text-2xl font-bold mb-2"
              style={{ color: "#232F3E" }}
            >
              Your library is empty
            </h2>
            <p style={{ color: "#666666" }}>
              Open an audiobook or podcast and click Add to Library.
            </p>
          </div>
        )}

        {!libraryQuery.isLoading && items.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => {
              const href =
                item.type === "audiobook"
                  ? `/audiobook/${item.id}`
                  : `/podcasts/${item.id}`;

              return (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={href}
                  className="group rounded-xl border p-4 transition-all hover:shadow-lg"
                  style={{ background: "#FFFFFF", borderColor: "#E8E8E8" }}
                >
                  <div
                    className="relative w-full rounded-lg overflow-hidden mb-4"
                    style={{ aspectRatio: "2/3" }}
                  >
                    <Image
                      src={item.cover}
                      alt={item.title}
                      fill
                      className="transition-transform group-hover:scale-[1.02] object-cover"
                    />
                  </div>

                  <span
                    className="inline-block px-2 py-1 rounded-full text-[11px] font-semibold uppercase mb-2"
                    style={{ background: "#F5F5F5", color: "#666666" }}
                  >
                    {item.type}
                  </span>

                  <h3
                    className="font-serif text-lg font-bold line-clamp-1"
                    style={{ color: "#232F3E" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm line-clamp-1 mb-2"
                    style={{ color: "#666666" }}
                  >
                    {item.author}
                  </p>

                  <div
                    className="flex items-center justify-between text-xs"
                    style={{ color: "#777777" }}
                  >
                    <span>{item.duration}</span>
                    <span>{formatDate(item.releaseDate)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
