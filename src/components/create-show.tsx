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

export default function CreateShow({
  setCreateOpen,
}: {
  setCreateOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { data: session } =
    authClient.useSession();

  const [newType, setNewType] = useState<NewContentType>("podcast");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");

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
        setNewCategory("");
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
        setNewCategory("");
      },
    }),
  );

  const isCreating =
    createPodcastMutation.isPending || createAudiobookMutation.isPending;

  async function handleCreateContent() {
    if (!session?.user.id || !newTitle.trim()) return;

    const payload = {
      userId: session.user.id,
      title: newTitle.trim(),
      author: session.user.name || "Unknown",
      description: newDescription.trim(),
      category: newCategory.trim(),
    };

    if (newType === "podcast") {
      await createPodcastMutation.mutateAsync(payload);
      return;
    }

    await createAudiobookMutation.mutateAsync(payload);
  }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Content</DialogTitle>
        <DialogDescription>
          Create a new podcast or audiobook.
        </DialogDescription>
      </DialogHeader>
      <div
        className="p-2 flex flex-col gap-4"
        style={{ background: "#FAFAF8" }}
      >
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

        <div className="space-y-3">
          <div className="space-y-1">
            <p
              className="text-xs font-semibold uppercase"
              style={{ color: "#666666" }}
            >
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

          <div className="space-y-1">
            <p
              className="text-xs font-semibold uppercase"
              style={{ color: "#666666" }}
            >
              Category
            </p>
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="General"
            />
          </div>

          <div className="space-y-1">
            <p
              className="text-xs font-semibold uppercase"
              style={{ color: "#666666" }}
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
              : `Create ${newType === "podcast" ? "Podcast" : "Audiobook"}`}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
