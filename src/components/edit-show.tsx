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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/src/server/auth/auth-client";
import { orpc } from "@/src/server/orpc/client";
import { Dropzone } from "./dropzone";
import Image from "next/image";
import { AUDIOBOOK_TAGS, PODCAST_TAGS } from "@/src/types/Tags";
import { LANGUAGES } from "@/src/types/Languages";
import type { Language } from "@/src/types/Languages";
import { toast } from "sonner";

type EditableItem = {
  id: string;
  type: "podcast" | "audiobook";
  title: string;
  author: string;
  description: string;
  duration: string;
  tags: string | null;
  language: string | null;
  cover: string;
};

export default function EditShow({
  item,
  setEditOpen,
}: {
  item: EditableItem;
  setEditOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const [newTitle, setNewTitle] = useState(item.title);
  const [newDescription, setNewDescription] = useState(item.description ?? "");
  const [newLanguage, setNewLanguage] = useState<Language>(
    (LANGUAGES.includes((item.language ?? "English") as Language)
      ? item.language
      : "English") as Language,
  );
  const [languageQuery, setLanguageQuery] = useState("");
  const [newTags, setNewTags] = useState<string[]>(
    (item.tags ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  );
  const [tagQuery, setTagQuery] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState(item.cover ?? "");

  const canEdit = Boolean(session?.user.id) && Boolean(newTitle.trim());

  const updateContentMutation = useMutation(
    orpc.content.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.content.list.queryKey(),
        });
        setEditOpen(false);
        toast.success("Content updated");
      },
      onError: () => {
        toast.error("Failed to update content");
      },
    }),
  );

  const uploadLogoMutation = useMutation(orpc.uploads.create.mutationOptions());

  const isUpdating = updateContentMutation.isPending;

  const isUploadingLogo = uploadLogoMutation.isPending;

  async function handleLogoDrop(files: File[]) {
    const file = files[0];
    if (!file) return;
    const result = await uploadLogoMutation.mutateAsync(file);
    setNewLogoUrl(result.url);
  }

  function togglePodcastTag(tag: string) {
    setNewTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  }

  const tagOptions = item.type === "podcast" ? PODCAST_TAGS : AUDIOBOOK_TAGS;

  const normalizedTagQuery = tagQuery.trim().toLowerCase();
  const filteredTags = normalizedTagQuery
    ? tagOptions.filter(
        (tag) => !newTags.includes(tag) && tag.toLowerCase().includes(normalizedTagQuery),
      ).slice(0, 12)
    : [];

  const normalizedLanguageQuery = languageQuery.trim().toLowerCase();
  const filteredLanguages = normalizedLanguageQuery
    ? LANGUAGES.filter((language) =>
        language.toLowerCase().includes(normalizedLanguageQuery),
      ).slice(0, 12)
    : [];

  async function handleEditContent() {
    if (!session?.user.id || !newTitle.trim()) return;

    await updateContentMutation.mutateAsync({
      userId: session.user.id,
      id: item.id,
      type: item.type,
      title: newTitle.trim(),
      author: item.author,
      description: newDescription.trim(),
      duration: item.duration,
      language: newLanguage,
      tags: newTags,
      cover: newLogoUrl || undefined,
    });
  }

  return (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Content</DialogTitle>
        <DialogDescription>
          Update your podcast or audiobook details.
        </DialogDescription>
      </DialogHeader>
      <div
        className="p-2 flex flex-col gap-4 bg-[#FAFAF8]"
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            type="button"
            disabled
            className="rounded-lg border px-3 py-2 text-sm font-semibold transition-colors"
            style={{
              borderColor: item.type === "podcast" ? "#232F3E" : "#E8E8E8",
              background: item.type === "podcast" ? "#232F3E" : "#FFFFFF",
              color: item.type === "podcast" ? "#FFFFFF" : "#232F3E",
            }}
          >
            Podcast
          </Button>
          <Button
            type="button"
            disabled
            className="rounded-lg border px-3 py-2 text-sm font-semibold transition-colors"
            style={{
              borderColor: item.type === "audiobook" ? "#232F3E" : "#E8E8E8",
              background: item.type === "audiobook" ? "#232F3E" : "#FFFFFF",
              color: item.type === "audiobook" ? "#FFFFFF" : "#232F3E",
            }}
          >
            Audiobook
          </Button>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <p
              className="text-xs font-semibold uppercase text-[#666666]"
            >
              Title
            </p>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={`${item.type === "podcast" ? "Podcast" : "Audiobook"} title`}
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
                      background: newLanguage === language ? "#232F3E" : "#FFFFFF",
                      color: newLanguage === language ? "#FFFFFF" : "#232F3E",
                      borderColor: newLanguage === language ? "#232F3E" : "#E8E8E8",
                    }}
                  >
                    {language}
                  </Button>
                ))}
              </div>
            )}
            {!normalizedLanguageQuery && (
              <p className="text-xs text-[#666666]">Type to search languages</p>
            )}
            <Button type="button">{newLanguage}</Button>
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
            {filteredTags.length > 0 && (
              <div className="max-h-32 overflow-y-auto rounded-md border border-[#E8E8E8] bg-white p-2 flex flex-wrap gap-2">
                {filteredTags.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant="outline"
                    className="h-8 px-3"
                    onClick={() => {
                      togglePodcastTag(tag);
                      setTagQuery("");
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            )}
            {!normalizedTagQuery && (
              <p className="text-xs text-[#666666]">Type to search approved tags</p>
            )}
            <div className="flex flex-wrap gap-2">
              {newTags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  className="h-8 px-3"
                  onClick={() => togglePodcastTag(tag)}
                >
                  {tag} x
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p
              className="text-xs font-semibold uppercase text-[#666666]"
            >
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
            {item.type === "podcast" ? "Podcast logo" : "Audiobook cover"}
          </p>
          <div className="border-2 border-dashed border-[#E8E8E8] rounded-lg p-4 text-center">
            <Dropzone
              accept={{ "image/*": [] }}
              onFileSelected={handleLogoDrop}
              idleTitle={item.type === "podcast" ? "Drag & drop your podcast logo" : "Drag & drop your audiobook cover"}
              activeTitle={item.type === "podcast" ? "Release to upload your podcast logo" : "Release to upload your audiobook cover"}
              activeSubtitle="Great, we are uploading your cover image."
              buttonLabel="or click to choose an image"
              footerText="PNG, JPG, WEBP up to 10MB"
            />
          </div>
          {isUploadingLogo && (
            <p className="text-xs text-[#666666]">Uploading cover...</p>
          )}
          {newLogoUrl && (
            <div className="rounded-lg border border-[#E8E8E8] p-2 flex items-center gap-3">
              <Image
                src={newLogoUrl}
                alt="Cover preview"
                width={56}
                height={56}
                className="w-14 h-14 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#666666] truncate">Cover uploaded</p>
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
            onClick={() => setEditOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-full"
            disabled={!canEdit || isUpdating}
            onClick={handleEditContent}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
