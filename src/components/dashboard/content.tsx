"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/src/server/auth/auth-client";
import { orpc } from "@/src/server/orpc/client";
import {
  Dialog,
} from "@/src/components/ui/dialog";
import { FilterType } from "@/src/types/FilterType";
import { DashboardTabType } from "@/src/types/DashboardTabType";
import CreateShow from "../create-show";
import { Button } from "../ui/button";
import EditShow from "../edit-show";
import { toast } from "sonner";

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

type DashboardItem = {
  id: string;
  type: "audiobook" | "podcast";
  title: string;
  author: string;
  description: string;
  duration: string;
  tags: string | null;
  language: string | null;
  cover: string;
  releaseDate: string | null;
};


export default function Content({ onTabChange: _onTabChange }: { onTabChange?: (tab: DashboardTabType) => void }) {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [editingItem, setEditingItem] = useState<DashboardItem | null>(null);

  const { data: session, isPending: isSessionPending } = authClient.useSession();

  // Always fetch totals with type: 'all'
  const totalsQuery = useQuery({
    ...orpc.content.list.queryOptions({
      input: {
        userId: session?.user?.id,
        type: "all",
      },
    }),
    enabled: !isSessionPending && Boolean(session?.user?.id),
    select: (data) => data?.totals ?? { all: 0, audiobooks: 0, podcasts: 0 },
  });

  // Fetch filtered items as before
  const contentQuery = useQuery({
    ...orpc.content.list.queryOptions({
      input: {
        userId: session?.user?.id,
        type: activeFilter,
      },
    }),
    enabled: !isSessionPending && Boolean(session?.user?.id),
  });

  const deleteContentMutation = useMutation(
    orpc.content.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.content.list.queryKey() });
        toast.success("Content deleted");
      },
      onError: () => {
        toast.error("Failed to delete content");
      },
    }),
  );

  const items: DashboardItem[] = (contentQuery.data?.items ?? []).map((item) => ({
    ...item,
    duration: item.duration ?? "00:00",
  }));
  const totals = totalsQuery.data ?? { all: 0, audiobooks: 0, podcasts: 0 };

  function openEditDialog(item: DashboardItem) {
    setEditingItem(item);
    setEditOpen(true);
  }

  async function handleDelete(item: DashboardItem) {
    if (!session?.user?.id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete \"${item.title}\"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    await deleteContentMutation.mutateAsync({
      userId: session.user.id,
      id: item.id,
      type: item.type,
    });
  }

  const isDeleting = deleteContentMutation.isPending;

  return (
    <>
      {/* Create Show/Book Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <CreateShow setCreateOpen={setCreateOpen} />
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        {editingItem && (
          <EditShow
            item={editingItem}
            setEditOpen={(open) => {
              setEditOpen(open);
              if (!open) {
                setEditingItem(null);
              }
            }}
          />
        )}
      </Dialog>

      <div>
        <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
                <Button
                  onClick={() => setActiveFilter("all")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: activeFilter === "all" ? '#232F3E' : '#F5F5F5', color: activeFilter === "all" ? 'white' : '#666666' }}
                >
                  All ({totals.all})
                </Button>
                <Button
                  onClick={() => setActiveFilter("audiobook")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: activeFilter === "audiobook" ? '#232F3E' : '#F5F5F5', color: activeFilter === "audiobook" ? 'white' : '#666666' }}
                >
                  Audiobooks ({totals.audiobooks})
                </Button>
                <Button
                  onClick={() => setActiveFilter("podcast")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: activeFilter === "podcast" ? '#232F3E' : '#F5F5F5', color: activeFilter === "podcast" ? 'white' : '#666666' }}
                >
                  Podcasts ({totals.podcasts})
                </Button>
            </div>
            <Button 
                onClick={() => setCreateOpen(true)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: '#F7941D', color: 'white' }}
            >
                + New Upload
            </Button>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E8E8E8' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: '#F9F9F7' }}>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: '#666666' }}>Title</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: '#666666' }}>Type</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: '#666666' }}>Author</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: '#666666' }}>Language</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: '#666666' }}>Release date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: '#666666' }}>Actions</th>
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
                                      <Link href={`/dashboard/${item.type}/${item.id}`} className="font-semibold hover:text-blue-600 transition-colors">
                                        {item.title}
                                      </Link>
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
                                  <span style={{ color: '#232F3E' }}>{item.language || '-'}</span>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                  <span style={{ color: '#232F3E' }}>{formatReleaseDate(item.releaseDate)}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openEditDialog(item)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDelete(item)}
                                      disabled={isDeleting}
                                    >
                                      Delete
                                    </Button>
                                  </div>
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