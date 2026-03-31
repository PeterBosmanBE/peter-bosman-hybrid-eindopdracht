'use client';

import { useState, use, useMemo } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orpc } from '@/src/server/orpc/client';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { toast } from 'sonner';

type PageParams = { id: string };

export default function EditPodcastEpisodes({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params);
  
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(orpc.content.detail.queryOptions({ input: { id } }));
  const podcast = data?.content?.type === 'podcast' ? data.content : null;
  
  const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ title: '', description: '' });

  const episodes = useMemo(() => {
    if (!podcast?.episodes) return [];
    return [...podcast.episodes].sort((a, b) => {
      const aDate = a.date ? new Date(a.date).getTime() : 0;
      const bDate = b.date ? new Date(b.date).getTime() : 0;
      return bDate - aDate;
    });
    }, [podcast]);

  const updateEpisodeMutation = useMutation(
    orpc.content.updateEpisode.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.content.detail.queryKey({ input: { id } }) });
        setEditingEpisodeId(null);
        toast.success('Episode updated');
      },
      onError: () => {
        toast.error('Failed to update episode');
      },
    }),
  );

  const deleteEpisodeMutation = useMutation(
    orpc.content.deleteEpisode.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.content.detail.queryKey({ input: { id } }) });
        toast.success('Episode deleted');
      },
      onError: () => {
        toast.error('Failed to delete episode');
      },
    }),
  );

  const handleEditClick = (episodeId: string, title: string, description: string) => {
    setEditingEpisodeId(episodeId);
    setEditValues({ title, description });
  };

  const handleSave = async (episodeId: string) => {
    await updateEpisodeMutation.mutateAsync({
      episodeId,
      title: editValues.title,
      description: editValues.description,
    });
  };

  const handleDelete = async (episodeId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this episode? This action cannot be undone.');
    if (!confirmed) return;
    
    await deleteEpisodeMutation.mutateAsync({
      episodeId,
    });
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading podcast...</p>
        </div>
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Podcast not found</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <Link href="/dashboard" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <div className="flex items-center gap-4 mb-6">
          <img
            src={podcast.cover}
            alt={podcast.title}
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{podcast.title}</h1>
            <p className="text-gray-600">{podcast.author}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold">Episodes ({episodes.length})</h2>
          <Link href={`/dashboard/upload?podcast=${id}`} className="text-blue-600 hover:underline text-sm">
            + Add Episode
          </Link>
        </div>

        {episodes.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No episodes yet. <Link href={`/dashboard/upload?podcast=${id}`} className="text-blue-600 hover:underline">Add one now</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {episodes.map((episode) => (
              <div key={episode.id} className="px-6 py-4">
                {editingEpisodeId === episode.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Episode Title
                      </label>
                      <Input
                        value={editValues.title}
                        onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                        placeholder="Episode name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <Textarea
                        value={editValues.description}
                        onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                        placeholder="Episode description"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSave(episode.id)}
                        disabled={updateEpisodeMutation.isPending}
                        style={{ background: '#F7941D', color: 'white' }}
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingEpisodeId(null)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{episode.title}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(episode.date)} • Duration: {episode.duration}
                        </p>
                      </div>
                    </div>
                    {episode.description && (
                      <p className="text-gray-700 text-sm mb-3">{episode.description}</p>
                    )}
                    <div className="flex gap-2 pt-3">
                      <Button
                        onClick={() => handleEditClick(episode.id, episode.title, episode.description || '')}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(episode.id)}
                        variant="destructive"
                        size="sm"
                        disabled={deleteEpisodeMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
