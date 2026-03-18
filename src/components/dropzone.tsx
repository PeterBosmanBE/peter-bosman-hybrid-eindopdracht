"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export function Dropzone() {
  const onDrop = useCallback(() => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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
            Release to upload your audio file
          </p>
          <p className="text-sm" style={{ color: "#666666" }}>
            Nice, we are ready to receive it.
          </p>
        </>
      ) : (
        <>
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: "rgba(247, 148, 29, 0.1)" }}
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
            Drag & drop your audio file
          </p>
          <p className="text-sm" style={{ color: "#666666" }}>
            or click to browse
          </p>
          <p className="text-xs mt-2" style={{ color: "#999999" }}>
            MP3, WAV, M4A up to 500MB
          </p>
        </>
      )}
    </div>
  );
}
