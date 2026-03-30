"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/src/server/orpc/client";
import { FilterType } from "@/src/types/FilterType";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";

const PAGE_SIZE = 6;

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

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const typeParam = (searchParams.get("type") as FilterType | null) ?? "all";
  const pageParam = Number(searchParams.get("page") ?? "1");
  const requestedPage = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const typeFilter: FilterType =
    typeParam === "audiobook" || typeParam === "podcast" || typeParam === "all"
      ? typeParam
      : "all";

  const updateSearchParams = (next: { q?: string; type?: FilterType; page?: number; resetPage?: boolean }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (typeof next.q === "string") {
      const trimmed = next.q.trim();
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
    }

    if (next.type) {
      if (next.type === "all") {
        params.delete("type");
      } else {
        params.set("type", next.type);
      }
    }

    if (next.resetPage) {
      params.delete("page");
    } else if (typeof next.page === "number") {
      if (next.page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(next.page));
      }
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  const contentQuery = useQuery(orpc.content.list.queryOptions({ input: { type: "all" } }));

  const items = useMemo(() => contentQuery.data?.items ?? [], [contentQuery.data?.items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesType = typeFilter === "all" || item.type === typeFilter;

      if (!matchesType) return false;
      if (!normalizedQuery) return true;

      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.author.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [items, query, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  const totalMatches = filteredItems.length;

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "'Source Sans 3', sans-serif" }}>
      <section
        className="px-6 py-10 border-b"
        style={{ background: "linear-gradient(180deg, #232F3E 0%, #37475A 100%)", borderColor: "#37475A" }}
      >
        <div className="max-w-7xl mx-auto">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(247, 148, 29, 0.2)", color: "#F7941D" }}
          >
            Search Library
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Find Your Next Listen</h1>
          <p className="text-sm md:text-base mb-6" style={{ color: "rgba(255,255,255,0.75)" }}>
            Search audiobooks and podcasts by title or author.
          </p>

          <div className="max-w-2xl relative">
            <input
              type="text"
              value={query}
              onChange={(e) => updateSearchParams({ q: e.target.value, type: typeFilter, resetPage: true })}
              placeholder="Try: Morgan Housel, Sapiens, Atomic Habits..."
              className="w-full py-3.5 px-5 pr-12 rounded-full text-sm focus:outline-none border"
              style={{ background: "#FFFFFF", borderColor: "rgba(255,255,255,0.3)", color: "#232F3E" }}
            />
            <svg
              className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: "#666666" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <aside
              className="w-full lg:w-56 lg:shrink-0 rounded-xl border p-4 lg:sticky lg:top-24"
              style={{ background: "#FFFFFF", borderColor: "#E8E8E8" }}
            >
              <h2 className="font-serif text-lg font-bold mb-4" style={{ color: "#232F3E" }}>
                Filter By Type
              </h2>
              <div className="flex lg:flex-col gap-2">
                {(["all", "audiobook", "podcast"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => updateSearchParams({ q: query, type: filter, resetPage: true })}
                    className="px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors text-left"
                    style={{
                      background: typeFilter === filter ? "#232F3E" : "#F5F5F5",
                      color: typeFilter === filter ? "#FFFFFF" : "#666666",
                    }}
                  >
                    {filter === "all" ? "All" : `${filter}s`}
                  </button>
                ))}
              </div>
            </aside>

            <div className="flex-1 w-full">
              <div className="mb-6">
                <p className="text-sm" style={{ color: "#666666" }}>
                  {contentQuery.isLoading ? "Searching..." : `${totalMatches} result${totalMatches === 1 ? "" : "s"}`}
                </p>
              </div>

              {contentQuery.isLoading && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div key={index} className="rounded-xl border p-4" style={{ background: "#FFFFFF", borderColor: "#E8E8E8" }}>
                      <div className="w-full rounded-lg mb-4 animate-pulse" style={{ background: "#F1F1EE", aspectRatio: "2/3" }} />
                      <div className="h-5 w-3/4 rounded mb-2 animate-pulse" style={{ background: "#F1F1EE" }} />
                      <div className="h-4 w-1/2 rounded mb-3 animate-pulse" style={{ background: "#F1F1EE" }} />
                      <div className="h-3 w-1/3 rounded animate-pulse" style={{ background: "#F1F1EE" }} />
                    </div>
                  ))}
                </div>
              )}

              {contentQuery.isError && (
                <div className="rounded-xl border p-6" style={{ background: "#FFFFFF", borderColor: "#FECACA" }}>
                  <h2 className="font-serif text-xl font-bold mb-2" style={{ color: "#7F1D1D" }}>
                    Could not load search results
                  </h2>
                  <p style={{ color: "#991B1B" }}>There was an error loading content from the database.</p>
                </div>
              )}

              {!contentQuery.isLoading && !contentQuery.isError && filteredItems.length === 0 && (
                <div className="rounded-xl border p-8 text-center" style={{ background: "#FFFFFF", borderColor: "#E8E8E8" }}>
                  <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: "#232F3E" }}>
                    No matches found
                  </h2>
                  <p style={{ color: "#666666" }}>
                    Try a different keyword or switch filters to find more content.
                  </p>
                </div>
              )}

              {!contentQuery.isLoading && !contentQuery.isError && filteredItems.length > 0 && (
                <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {paginatedItems.map((item) => {
                    const href = item.type === "audiobook" ? `/audiobook/${item.id}` : `/podcasts/${item.id}`;

                    return (
                      <Link
                        key={item.id}
                        href={href}
                        className="group rounded-xl border p-4 transition-all hover:shadow-lg"
                        style={{ background: "#FFFFFF", borderColor: "#E8E8E8" }}
                      >
                        <div className="relative w-full rounded-lg overflow-hidden mb-4">
                          <Image
                            src={item.cover}
                            alt={item.title}
                            width={300}
                            height={450}
                            className="w-full transition-transform group-hover:scale-[1.02]"
                            style={{ aspectRatio: "2/3", objectFit: "cover" }}
                          />
                        </div>

                        <span
                          className="inline-block px-2 py-1 rounded-full text-[11px] font-semibold uppercase mb-2"
                          style={{ background: "#F5F5F5", color: "#666666" }}
                        >
                          {item.type}
                        </span>

                        <h3 className="font-serif text-lg font-bold line-clamp-1" style={{ color: "#232F3E" }}>
                          {item.title}
                        </h3>
                        <p className="text-sm line-clamp-1 mb-2" style={{ color: "#666666" }}>
                          {item.author}
                        </p>

                        <div className="flex items-center justify-between text-xs" style={{ color: "#777777" }}>
                          <span>{item.duration}</span>
                          <span>{formatDate(item.releaseDate)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {filteredItems.length > PAGE_SIZE && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                              updateSearchParams({ q: query, type: typeFilter, page: currentPage - 1 });
                            }
                          }}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              updateSearchParams({ q: query, type: typeFilter, page });
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                              updateSearchParams({ q: query, type: typeFilter, page: currentPage + 1 });
                            }
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}