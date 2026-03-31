"use client";

import { useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/src/components/layout/sidebar";
import { Button } from "@/src/components/ui/button";
import type { DashboardTabType } from "@/src/types/DashboardTabType";

const TABS: DashboardTabType[] = ["content", "upload", "profile"];

export default function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeTab = useMemo<DashboardTabType>(() => {
    if (pathname !== "/dashboard") return "content";

    const tabFromQuery = searchParams.get("tab");
    if (tabFromQuery && TABS.includes(tabFromQuery as DashboardTabType)) {
      return tabFromQuery as DashboardTabType;
    }

    return "content";
  }, [pathname, searchParams]);

  const handleTabChange = (tab: DashboardTabType) => {
    router.push(`/dashboard?tab=${tab}`);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAF8]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={sidebarOpen}
      />

      <Button
        onClick={() => setSidebarOpen((open) => !open)}
        className="lg:hidden fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
        style={{ background: "#F7941D" }}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </Button>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
