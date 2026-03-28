"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/src/server/auth/auth-client";
import { orpc } from "@/src/server/orpc/client";import {
  Dialog,
} from "@/src/components/ui/dialog";
import { FilterType } from "@/src/types/FilterType";
import { DashboardTabType } from "@/src/types/DashboardTabType";
import CreateShow from "../create-show";

function formatReleaseDate(date: string | null) {
  if (!date) return "-";
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

export default function Content({ onTabChange }: { onTabChange?: (tab: DashboardTabType) => void }) {  const [createOpen, setCreateOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const contentQuery = useQuery({
    ...orpc.content.list.queryOptions({
      userId: session?.user.id,
      type: activeFilter,
    }),
    enabled: !isSessionPending && Boolean(session?.user.id),
  });

  const items = contentQuery.data?.items ?? [];
  const totals = contentQuery.data?.totals ?? { all: 0, audiobooks: 0, podcasts: 0 };
  return (
    <>
      {/* Create Show/Book Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <CreateShow setCreateOpen={setCreateOpen} />
        {/* <CreateShow setCreateOpen={setCreateOpen} goToUploadTab={() => onTabChange?.('upload')} /> */}
      </Dialog>
      <div>
        <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: activeFilter === "all" ? '#232F3E' : '#F5F5F5', color: activeFilter === "all" ? 'white' : '#666666' }}
                >
                  All ({totals.all})
                </button>
                <button
                  onClick={() => setActiveFilter("audiobook")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: activeFilter === "audiobook" ? '#232F3E' : '#F5F5F5', color: activeFilter === "audiobook" ? 'white' : '#666666' }}
                >
                  Audiobooks ({totals.audiobooks})
                </button>
                <button
                  onClick={() => setActiveFilter("podcast")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: activeFilter === "podcast" ? '#232F3E' : '#F5F5F5', color: activeFilter === "podcast" ? 'white' : '#666666' }}
                >
                  Podcasts ({totals.podcasts})
                </button>
            </div>
            <button 
                onClick={() => setCreateOpen(true)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: '#F7941D', color: 'white' }}
            >
                + New Upload
            </button>
        </div>
        
                      <div className="rounded-xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8' }}>
                        <table className="w-full">
                          <thead>
                            <tr style={{ background: '#F9F9F7' }}>
                              <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: '#666666' }}>Title</th>
                              <th className="text-left px-6 py-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: '#666666' }}>Type</th>
                              <th className="text-left px-6 py-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: '#666666' }}>Author</th>
                              <th className="text-left px-6 py-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: '#666666' }}>Duration</th>
                              <th className="text-left px-6 py-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: '#666666' }}>Release date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contentQuery.isLoading && (
                              <tr>
                                <td colSpan={5} className="px-6 py-8 text-center" style={{ color: '#666666' }}>
                                  Loading your content...
                                </td>
                              </tr>
                            )}

                            {contentQuery.isError && (
                              <tr>
                                <td colSpan={5} className="px-6 py-8 text-center" style={{ color: '#B91C1C' }}>
                                  Could not load your content from the database.
                                </td>
                              </tr>
                            )}

                            {!contentQuery.isLoading && !contentQuery.isError && items.length === 0 && (
                              <tr>
                                <td colSpan={5} className="px-6 py-8 text-center" style={{ color: '#666666' }}>
                                  No content found in your database yet.
                                </td>
                              </tr>
                            )}

                            {items.map((item) => (
                              <tr key={item.id} className="border-t" style={{ borderColor: '#E8E8E8' }}>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12 shrink-0">
                                      <Image
                                        src={item.cover}
                                        alt={item.title}
                                        fill
                                        className="w-12 h-12 rounded-lg object-cover"
                                      />
                                  </div>
                                    <div>
                                      <p className="font-semibold">{item.title}</p>
                                      <div className="flex items-center gap-1 md:hidden">
                                        <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: '#F5F5F5', color: '#666666' }}>
                                          {item.type}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                  <span className="text-sm capitalize" style={{ color: '#666666' }}>{item.type}</span>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                  <span style={{ color: '#232F3E' }}>{item.author}</span>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                  <span style={{ color: '#232F3E' }}>{item.duration}</span>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                  <span style={{ color: '#232F3E' }}>{formatReleaseDate(item.releaseDate)}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    </>
    );
}