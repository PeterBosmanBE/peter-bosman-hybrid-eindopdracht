"use client";

import { orpc } from "@/src/server/orpc/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import type { Accept } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Icons } from "./icons";

type DropzoneProps = {
  onFileSelected?: (files: File[]) => void;
  accept?: Accept;
  idleTitle?: string;
  activeTitle?: string;
  activeSubtitle?: string;
  buttonLabel?: string;
  footerText?: string;
};

export function Dropzone({
  onFileSelected,
  accept = {
    "audio/*": [],
  },
  idleTitle = "Drag & drop your audio file",
  activeTitle = "Release to upload your audio file",
  activeSubtitle = "Nice, we are ready to receive it.",
  buttonLabel = "or click to browse",
  footerText = "MP3, WAV, M4A up to 500MB",
}: DropzoneProps) {
  const uploadMutation = useMutation(
    orpc.uploads.create.mutationOptions({
      onSuccess: () => {
        toast.success("File uploaded successfully!");
      },
      onError: (error) => {
        toast.error("Upload failed");
        console.error(error);
      },
    }),
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (onFileSelected) {
        onFileSelected(acceptedFiles);
      } else {
        acceptedFiles.forEach((file) => {
          uploadMutation.mutate(file);
        });
      }
    },
    [uploadMutation, onFileSelected],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <>
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: "rgba(247, 148, 29, 0.18)" }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: "#F7941D" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p className="font-semibold mb-1" style={{ color: "#232F3E" }}>
            {activeTitle}
          </p>
          <p className="text-sm" style={{ color: "#666666" }}>
            {activeSubtitle}
          </p>
        </>
      ) : (
        <>
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: "rgba(247, 148, 29, 0.1)" }}
          >
            <Icons.upload className="w-8 h-8" style={{ color: "#F7941D" }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: "#232F3E" }}>
            {idleTitle}
          </p>
          <div>
            <label className="cursor-pointer">
              <span className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold uppercase tracking-wide rounded-sm hover:bg-primary/90 transition-colors">
                {buttonLabel}
              </span>
            </label>
          </div>

          <p className="text-xs mt-2" style={{ color: "#999999" }}>
            {footerText}
          </p>
        </>
      )}
    </div>
  );
}
