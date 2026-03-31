import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";

import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import { NewContentType } from "@/src/types/FilterType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/src/server/auth/auth-client";
import { orpc } from "@/src/server/orpc/client";
import { Dropzone } from "./dropzone";
import Image from "next/image";
import { AUDIOBOOK_TAGS, PODCAST_TAGS } from "@/src/types/Tags";
import { LANGUAGES } from "@/src/types/Languages";
import type { Language } from "@/src/types/Languages";

export default function CreateShow({
  setCreateOpen,
}: {
  setCreateOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const [newType, setNewType] = useState<NewContentType>("podcast");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLanguage, setNewLanguage] = useState<Language>("English");
  const [languageQuery, setLanguageQuery] = useState("");
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagQuery, setTagQuery] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState("");

  const canCreate = Boolean(session?.user.id) && Boolean(newTitle.trim());

  const createPodcastMutation = useMutation(
    orpc.content.createPodcast.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.content.list.queryKey(),
        });
        setCreateOpen(false);
        setNewTitle("");
        setNewDescription("");
        setNewLanguage("English");
        setLanguageQuery("");
        setNewTags([]);
        setTagQuery("");
        setNewLogoUrl("");
      },
    }),
  );

  const createAudiobookMutation = useMutation(
    orpc.content.createAudiobook.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.content.list.queryKey(),
        });
        setCreateOpen(false);
        setNewTitle("");
        setNewDescription("");
        setNewLanguage("English");
        setLanguageQuery("");
        setNewTags([]);
        setTagQuery("");
        setNewLogoUrl("");
      },
    }),
  );

  const uploadLogoMutation = useMutation(orpc.uploads.create.mutationOptions());

  const isCreating =
    createPodcastMutation.isPending || createAudiobookMutation.isPending;

  const isUploadingLogo = uploadLogoMutation.isPending;

  async function handleLogoDrop(files: File[]) {
    const file = files[0];
    if (!file) return;
    const result = await uploadLogoMutation.mutateAsync(file);
    setNewLogoUrl(result.url);
  }

  function toggleTag(tag: string) {
    setNewTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  }

  const availableTags = newType === "podcast" ? PODCAST_TAGS : AUDIOBOOK_TAGS;

  const normalizedTagQuery = tagQuery.trim().toLowerCase();
  const filteredPodcastTags = normalizedTagQuery
    ? availableTags
        .filter(
          (tag) =>
            !newTags.includes(tag) &&
            tag.toLowerCase().includes(normalizedTagQuery),
        )
        .slice(0, 12)
    : [];

  const normalizedLanguageQuery = languageQuery.trim().toLowerCase();
  const filteredLanguages = normalizedLanguageQuery
    ? LANGUAGES.filter((language) =>
        language.toLowerCase().includes(normalizedLanguageQuery),
      ).slice(0, 12)
    : [];

  async function handleCreateContent() {
    if (!session?.user.id || !newTitle.trim()) return;

    const payload = {
      userId: session.user.id,
      title: newTitle.trim(),
      author: session.user.name || "Unknown",
      description: newDescription.trim(),
      language: newLanguage,
      tags: newTags,
      cover: newLogoUrl || undefined,
    };

    if (newType === "podcast") {
      await createPodcastMutation.mutateAsync(payload);
      return;
    }

    await createAudiobookMutation.mutateAsync(payload);
  }
  return (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Content</DialogTitle>
        <DialogDescription>
          Create a new podcast or audiobook.
        </DialogDescription>
      </DialogHeader>
      <div className="p-2 flex flex-col gap-4 bg-[#FAFAF8]">
        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            type="button"
            onClick={() => setNewType("podcast")}
            className="rounded-lg border px-3 py-2 text-sm font-semibold transition-colors"
            style={{
              borderColor: newType === "podcast" ? "#232F3E" : "#E8E8E8",
              background: newType === "podcast" ? "#232F3E" : "#FFFFFF",
              color: newType === "podcast" ? "#FFFFFF" : "#232F3E",
            }}
          >
            Podcast
          </Button>
          <Button
            type="button"
            onClick={() => setNewType("audiobook")}
            className="rounded-lg border px-3 py-2 text-sm font-semibold transition-colors"
            style={{
              borderColor: newType === "audiobook" ? "#232F3E" : "#E8E8E8",
              background: newType === "audiobook" ? "#232F3E" : "#FFFFFF",
              color: newType === "audiobook" ? "#FFFFFF" : "#232F3E",
            }}
          >
            Audiobook
          </Button>
        </div>

        <>
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase text-[#666666]">
                Title
              </p>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={
                  newType === "podcast" ? "Podcast title" : "Audiobook title"
                }
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase text-[#666666]">
                Language
              </p>
              <Input
                value={languageQuery}
                onChange={(e) => setLanguageQuery(e.target.value)}
                placeholder="Search languages..."
              />
              {filteredLanguages.length > 0 && (
                <div className="max-h-32 overflow-y-auto rounded-md border border-[#E8E8E8] bg-white p-2 flex flex-wrap gap-2">
                  {filteredLanguages.map((language) => (
                    <Button
                      key={language}
                      type="button"
                      variant="outline"
                      className="h-8 px-3"
                      onClick={() => {
                        setNewLanguage(language);
                        setLanguageQuery("");
                      }}
                      style={{
                        background:
                          newLanguage === language ? "#232F3E" : "#FFFFFF",
                        color: newLanguage === language ? "#FFFFFF" : "#232F3E",
                        borderColor:
                          newLanguage === language ? "#232F3E" : "#E8E8E8",
                      }}
                    >
                      {language}
                    </Button>
                  ))}
                </div>
              )}
              {!normalizedLanguageQuery && (
                <p className="text-xs text-[#666666]">
                  Type to search languages
                </p>
              )}
              <Button>{newLanguage}</Button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase text-[#666666]">
                Tags
              </p>
              <Input
                value={tagQuery}
                onChange={(e) => setTagQuery(e.target.value)}
                placeholder="Search Tags..."
              />
              {filteredPodcastTags.length > 0 && (
                <div className="max-h-32 overflow-y-auto rounded-md border border-[#E8E8E8] bg-white p-2 flex flex-wrap gap-2">
                  {filteredPodcastTags.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      className="h-8 px-3"
                      onClick={() => {
                        toggleTag(tag);
                        setTagQuery("");
                      }}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              )}
              {!normalizedTagQuery && (
                <p className="text-xs text-[#666666]">
                  Type to search approved tags
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {newTags.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    className="h-8 px-3"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag} x
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase text-[#666666]">
                Description
              </p>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Short description"
                rows={3}
              />
            </div>

            <p className="font-semibold uppercase text-[#666666]">
              {newType === "podcast" ? "Podcast logo" : "Audiobook cover"}
            </p>
            <div className="border-2 border-dashed border-[#E8E8E8] rounded-lg p-4 text-center">
              <Dropzone
                accept={{ "image/*": [] }}
                onFileSelected={handleLogoDrop}
                idleTitle={
                  newType === "podcast"
                    ? "Drag & drop your podcast logo"
                    : "Drag & drop your audiobook cover"
                }
                activeTitle={
                  newType === "podcast"
                    ? "Release to upload your podcast logo"
                    : "Release to upload your audiobook cover"
                }
                activeSubtitle="Great, we are uploading your image."
                buttonLabel="or click to choose an image"
                footerText="PNG, JPG, WEBP up to 10MB"
              />
            </div>
            {isUploadingLogo && (
              <p className="text-xs text-[#666666]">Uploading image...</p>
            )}
            {newLogoUrl && (
              <div className="rounded-lg border border-[#E8E8E8] p-2 flex items-center gap-3">
                <Image
                  src={newLogoUrl}
                  alt={
                    newType === "podcast"
                      ? "Podcast logo preview"
                      : "Audiobook cover preview"
                  }
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#666666] truncate">
                    Image uploaded
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewLogoUrl("")}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              disabled={!canCreate || isCreating}
              onClick={handleCreateContent}
            >
              {isCreating
                ? "Creating..."
                : newType === "podcast"
                  ? "Create Podcast"
                  : "Create Audiobook"}
            </Button>
          </div>
        </>
      </div>
    </DialogContent>
  );
}
