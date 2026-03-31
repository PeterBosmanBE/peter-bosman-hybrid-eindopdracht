"use client";

import { useSearchParams } from "next/navigation";
import Content from "@/src/components/dashboard/content";
import { DashboardTabType } from "@/src/types/DashboardTabType";
import Upload from "@/src/components/dashboard/upload";
import { Button } from "@/src/components/ui/button";
import Profile from "@/src/components/dashboard/profile";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const activeTab: DashboardTabType =
    tab === "content" || tab === "upload" || tab === "profile"
      ? tab
      : "content";

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-30 px-6 py-4 border-b bg-white border-nav-border">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="font-serif text-2xl font-bold"
              style={{ color: "#232F3E" }}
            >
              {activeTab === "content" && "My Content"}
              {activeTab === "upload" && "Upload"}
              {activeTab === "profile" && "Profile"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-colors hover:bg-gray-50"
              style={{ borderColor: "#E8E8E8" }}
            >
              <svg
                className="w-5 h-5"
                style={{ color: "#666666" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Content Tab */}
        {activeTab === "content" && (
          <div>
            <Content />
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div>
            <Upload />
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <Profile />
          </div>
        )}
      </div>
    </div>
  );
}
