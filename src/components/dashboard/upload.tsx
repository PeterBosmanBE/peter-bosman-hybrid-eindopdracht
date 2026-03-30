"use client";

import { useState, useCallback } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { cn } from "@/src/lib/utils";
import { Dropzone } from "../dropzone";
import { Icons } from "@/src/components/icons";
import { useQuery, useMutation } from "@tanstack/react-query";
import { orpc } from "@/src/server/orpc/client";
import { authClient } from "@/src/server/auth/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Progress } from "@/src/components/ui/progress";
import { upload } from "@vercel/blob/client";
type AudioType = "podcast" | "audiobook" | null;

interface UploadData {
  file: File | null;
  title: string;
  description: string;
  audioType: AudioType;
  podcastId: string;
  audiobookId: string;
  narrator: string;
}

function formatSecondsToDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function getAudioDurationSeconds(file: File) {
  return new Promise<number>((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const audio = document.createElement("audio");
    audio.preload = "metadata";

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      audio.remove();
    };

    audio.onloadedmetadata = () => {
      const durationSeconds = Number.isFinite(audio.duration)
        ? Math.max(0, Math.floor(audio.duration))
        : 0;
      cleanup();
      resolve(durationSeconds);
    };

    audio.onerror = () => {
      cleanup();
      resolve(0);
    };

    audio.src = objectUrl;
  });
}

const steps = [
  { id: 1, label: "Upload File" },
  { id: 2, label: "Details" },
];

export default function Upload() {
  const { data: session } = authClient.useSession();
  const podcastsQuery = useQuery({
    ...orpc.content.list.queryOptions({
      input: {
        userId: session?.user?.id ?? "",
        type: "podcast",
      },
    }),
    enabled: !!session?.user?.id,
  });
  const audiobooksQuery = useQuery({
    ...orpc.content.list.queryOptions({
      input: {
        userId: session?.user?.id ?? "",
        type: "audiobook",
      },
    }),
    enabled: !!session?.user?.id,
  });
  const userPodcasts = podcastsQuery.data?.items ?? [];
  const userAudiobooks = audiobooksQuery.data?.items ?? [];

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileDuration, setFileDuration] = useState("00:00");
  const [data, setData] = useState<UploadData>({
    file: null,
    title: "",
    description: "",
    audioType: null,
    podcastId: "",
    audiobookId: "",
    narrator: "",
  });

  const selectFile = useCallback(async (file: File) => {
    setData((prev) => ({ ...prev, file }));
    const durationSeconds = await getAudioDurationSeconds(file);
    setFileDuration(formatSecondsToDuration(durationSeconds));
  }, []);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      void selectFile(file);
    },
    [selectFile],
  );

  const canProceedToStep2 = data.file !== null;
  const canSubmit =
    data.title.trim() &&
    data.audioType &&
    (data.audioType === "audiobook"
      ? data.audiobookId
      : data.audioType === "podcast" && data.podcastId) &&
    !isSubmitting;
  const router = useRouter();

  const createPodcastMutation = useMutation(
    orpc.content.createPodcastEpisode.mutationOptions({
      onSuccess: () => {
        toast.success("Upload complete! Your audio has been submitted.");
        router.push(`/podcasts/${data.podcastId}`);
      },
      onError: () => {
        toast.error("Failed to submit episode.");
      },
    }),
  );

  const createAudiobookChapterMutation = useMutation(
    orpc.content.createAudiobookChapter.mutationOptions({
      onSuccess: () => {
        toast.success("Upload complete! Your chapter has been submitted.");
        router.push(`/audiobook/${data.audiobookId}`);
      },
      onError: () => {
        toast.error("Failed to submit chapter.");
      },
    }),
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setUploadProgress(0);
    try {
      let audioUrl = "";
      let finalDuration = fileDuration;

      if (data.file) {
        const durationSeconds = await getAudioDurationSeconds(data.file);
        finalDuration = formatSecondsToDuration(durationSeconds);
        setFileDuration(finalDuration);

        toast.info("Uploading audio...");
        const newBlob = await upload(data.file.name, data.file, {
          access: "public",
          handleUploadUrl: "/api/client-upload",
          onUploadProgress: (progressEvent) => {
            setUploadProgress(progressEvent.percentage);
          },
        });
        audioUrl = newBlob.url;
      }
      setUploadProgress(100);

      if (data.audioType === "podcast" && data.podcastId) {
        await createPodcastMutation.mutateAsync({
          podcastId: data.podcastId,
          title: data.title,
          description: data.description,
          audio: audioUrl,
          duration: finalDuration,
        });
      } else if (data.audioType === "audiobook" && data.audiobookId) {
        await createAudiobookChapterMutation.mutateAsync({
          audiobookId: data.audiobookId,
          title: data.title,
          description: data.description,
          audio: audioUrl,
          duration: finalDuration,
          narrator: data.narrator || undefined,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-all",
                  currentStep === step.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep > step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground",
                )}
              >
                {currentStep > step.id ? (
                  <Icons.check className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={cn(
                  "font-medium uppercase tracking-wide text-sm",
                  currentStep >= step.id
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <Icons.chevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Upload File */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wide mb-2">
              Step 1: Upload Audio File
            </h2>
            <p className="text-muted-foreground">
              Upload your audio file. Supported formats: MP3, WAV, M4A, FLAC
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={cn(
              "border-2 rounded-sm p-8 text-center transition-all",
              !data.file
                ? "border-dashed border-border hover:border-primary/50"
                : "border-solid border-primary bg-primary/5",
            )}
          >
            {!data.file ? (
              <Dropzone
                onFileSelected={(files) => {
                  if (files?.[0]) {
                    void selectFile(files[0]);
                  }
                }}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Icons.audio className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold text-foreground">
                      {data.file.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(data.file.size / 1_000_000).toFixed(2)} MB
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {fileDuration}
                    </p>
                  </div>
                </div>

                {/* Replace File Button */}
                <label className="cursor-pointer">
                  <span className="text-sm text-primary hover:underline">
                    Choose a different file
                  </span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* 
            ============================================
            YOUR UPLOAD CODE PLACEHOLDER
            ============================================
            Replace the simulateUpload() function above with your actual upload logic.
            You can integrate your existing upload code here.
            
            Example:
            const handleFileUpload = async (file: File) => {
              // Your upload logic here
              // Update uploadProgress as the file uploads
              // Call setUploadProgress(percentage) to update the progress bar
            }
            ============================================
          */}

          {/* Continue Button */}
          <Button
            onClick={() => setCurrentStep(2)}
            disabled={!canProceedToStep2}
            className="w-full uppercase tracking-wide font-semibold"
            size="lg"
          >
            Continue to Details
            <Icons.chevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 2: Details */}
      {currentStep === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wide mb-2">
              Step 2: Audio Details
            </h2>
            <p className="text-muted-foreground">
              Add information about your audio content
            </p>
          </div>

          {/* Uploaded File Info */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-sm border border-border">
            <Icons.audio className="w-6 h-6 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {data.file?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {data.file && (data.file.size / 1_000_000).toFixed(2)} MB
              </p>
              <p className="text-sm text-muted-foreground">
                Duration: {fileDuration}
              </p>
            </div>
            <Icons.check className="w-5 h-5 text-primary" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Title *
            </label>
            <Input
              placeholder="Enter a title for your audio"
              value={data.title}
              onChange={(e) =>
                setData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="border-2 border-border focus:border-primary"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Description
            </label>
            <Textarea
              placeholder="Describe your audio content..."
              value={data.description}
              onChange={(e) =>
                setData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={4}
              className="border-2 border-border focus:border-primary resize-none"
            />
          </div>

          {data.audioType === "audiobook" && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-semibold uppercase tracking-wide text-foreground">
                Select Audiobook *
              </label>
              {audiobooksQuery.isLoading ? (
                <div className="p-3 text-sm text-muted-foreground border-2 border-border rounded-sm">
                  Loading audiobooks...
                </div>
              ) : userAudiobooks.length > 0 ? (
                <select
                  aria-label="Select an audiobook"
                  title="Select an audiobook"
                  className="w-full p-3 border-2 border-border rounded-sm bg-background focus:border-primary outline-none transition-colors"
                  value={data.audiobookId}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, audiobookId: e.target.value }))
                  }
                >
                  <option value="" disabled>
                    Select an audiobook
                  </option>
                  {userAudiobooks.map((audiobook) => (
                    <option key={audiobook.id} value={audiobook.id}>
                      {audiobook.title}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 text-sm text-destructive border-2 border-destructive/20 rounded-sm bg-destructive/5">
                  You don&apos;t have any audiobooks yet. Please create one first!
                </div>
              )}
            </div>
          )}

          {data.audioType === "audiobook" && (
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wide text-foreground">
                Narrator
              </label>
              <Input
                placeholder="Optional narrator name"
                value={data.narrator}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, narrator: e.target.value }))
                }
                className="border-2 border-border focus:border-primary"
              />
            </div>
          )}

          {/* Audio Type */}
          <div className="space-y-3">
            <label className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Audio Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setData((prev) => ({ ...prev, audioType: "podcast" }))
                }
                className={cn(
                  "p-4 border-2 rounded-sm text-left transition-all",
                  data.audioType === "podcast"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                <Icons.mic
                  className={cn(
                    "w-6 h-6 mb-2",
                    data.audioType === "podcast"
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
                <p className="font-semibold text-foreground">Podcast</p>
                <p className="text-sm text-muted-foreground">
                  Episodes, interviews, discussions
                </p>
              </button>
              <button
                type="button"
                onClick={() =>
                  setData((prev) => ({ ...prev, audioType: "audiobook" }))
                }
                className={cn(
                  "p-4 border-2 rounded-sm text-left transition-all",
                  data.audioType === "audiobook"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                <Icons.bookOpen
                  className={cn(
                    "w-6 h-6 mb-2",
                    data.audioType === "audiobook"
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
                <p className="font-semibold text-foreground">Audiobook</p>
                <p className="text-sm text-muted-foreground">
                  Books, stories, narrations
                </p>
              </button>
            </div>
          </div>

          {/* Podcast Selection */}
          {data.audioType === "podcast" && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-semibold uppercase tracking-wide text-foreground">
                Select Podcast *
              </label>
              {podcastsQuery.isLoading ? (
                <div className="p-3 text-sm text-muted-foreground border-2 border-border rounded-sm">
                  Loading podcasts...
                </div>
              ) : userPodcasts.length > 0 ? (
                <select
                  aria-label="Select a podcast"
                  title="Select a podcast"
                  className="w-full p-3 border-2 border-border rounded-sm bg-background focus:border-primary outline-none transition-colors"
                  value={data.podcastId}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, podcastId: e.target.value }))
                  }
                >
                  <option value="" disabled>
                    Select a podcast
                  </option>
                  {userPodcasts.map((podcast) => (
                    <option key={podcast.id} value={podcast.id}>
                      {podcast.title}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 text-sm text-destructive border-2 border-destructive/20 rounded-sm bg-destructive/5">
                  You don&apos;t have any podcasts yet. Please create one first!
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-4">
            {isSubmitting && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground font-medium">
                  <span>Uploading {data.file?.name}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="flex-1 uppercase tracking-wide font-semibold border-2"
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="flex-1 uppercase tracking-wide font-semibold"
                size="lg"
              >
                {isSubmitting ? "Publishing..." : "Publish Audio"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
