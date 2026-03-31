'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orpc } from '@/src/server/orpc/client';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { toast } from 'sonner';

type PageParams = { id: string };

export default function EditAudiobookChapters({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params);
  
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(orpc.content.detail.queryOptions({ input: { id } }));
  const audiobook = data?.content?.type === 'audiobook' ? data.content : null;
  
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ title: '', description: '', narrator: '' });

  const chapters = audiobook?.chapters || [];

  const updateChapterMutation = useMutation(
    orpc.content.updateChapter.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.content.detail.queryKey({ input: { id } }) });
        setEditingChapterId(null);
        toast.success('Chapter updated');
      },
      onError: () => {
        toast.error('Failed to update chapter');
      },
    }),
  );

  const deleteChapterMutation = useMutation(
    orpc.content.deleteChapter.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.content.detail.queryKey({ input: { id } }) });
        toast.success('Chapter deleted');
      },
      onError: () => {
        toast.error('Failed to delete chapter');
      },
    }),
  );

  const handleEditClick = (chapterId: string, title: string, description: string, narrator: string) => {
    setEditingChapterId(chapterId);
    setEditValues({ title, description, narrator });
  };

  const handleSave = async (chapterId: string) => {
    await updateChapterMutation.mutateAsync({
      chapterId,
      title: editValues.title,
      description: editValues.description,
      narrator: editValues.narrator,
    });
  };

  const handleDelete = async (chapterId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this chapter? This action cannot be undone.');
    if (!confirmed) return;
    
    await deleteChapterMutation.mutateAsync({
      chapterId,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading audiobook...</p>
        </div>
      </div>
    );
  }

  if (!audiobook) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Audiobook not found</p>
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
            src={audiobook.cover}
            alt={audiobook.title}
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{audiobook.title}</h1>
            <p className="text-gray-600">{audiobook.author}</p>
            {audiobook.narrator && <p className="text-gray-500 text-sm">Narrated by {audiobook.narrator}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold">Chapters ({chapters.length})</h2>
          <Link href={`/dashboard/upload?audiobook=${id}`} className="text-blue-600 hover:underline text-sm">
            + Add Chapter
          </Link>
        </div>

        {chapters.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No chapters yet. <Link href={`/dashboard/upload?audiobook=${id}`} className="text-blue-600 hover:underline">Add one now</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {chapters.map((chapter, index) => (
              <div key={chapter.id} className="px-6 py-4">
                {editingChapterId === chapter.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chapter {index + 1}: Title
                      </label>
                      <Input
                        value={editValues.title}
                        onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                        placeholder="Chapter name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <Textarea
                        value={editValues.description}
                        onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                        placeholder="Chapter description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Narrator
                      </label>
                      <Input
                        value={editValues.narrator}
                        onChange={(e) => setEditValues({ ...editValues, narrator: e.target.value })}
                        placeholder="Narrator name"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSave(chapter.id)}
                        disabled={updateChapterMutation.isPending}
                        style={{ background: '#F7941D', color: 'white' }}
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingChapterId(null)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">Chapter {index + 1}: {chapter.title}</h3>
                        <p className="text-sm text-gray-500">Duration: {chapter.duration}</p>
                      </div>
                    </div>
                    {chapter.description && (
                      <p className="text-gray-700 text-sm mb-3">{chapter.description}</p>
                    )}
                    {chapter.narrator && (
                      <p className="text-gray-600 text-sm mb-3">Narrator: {chapter.narrator}</p>
                    )}
                    <div className="flex gap-2 pt-3">
                      <Button
                        onClick={() => handleEditClick(chapter.id, chapter.title, chapter.description || '', chapter.narrator || '')}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(chapter.id)}
                        variant="destructive"
                        size="sm"
                        disabled={deleteChapterMutation.isPending}
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
