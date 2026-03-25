"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/src/lib/query-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
