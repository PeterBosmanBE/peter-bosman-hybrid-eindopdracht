import Link from "next/link";
import AvatarDropdown from "./avatar-dropdown";
import { useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{ background: "#FFFFFF", borderColor: "#E8E8E8" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link href="/home" className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "#F7941D" }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                </svg>
              </div>
              <span
                className="font-serif text-2xl font-bold"
                style={{ color: "#232F3E" }}
              >
                Chapter
              </span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-xl mx-8 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for audiobooks, podcasts, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 px-5 pr-12 rounded-full text-sm focus:outline-none border"
                  style={{
                    background: "#F5F5F5",
                    borderColor: "#E8E8E8",
                    color: "#232F3E",
                  }}
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="nav-item hidden md:block text-sm font-semibold transition-colors"
                style={{ color: "#232F3E" }}
              >
                Library
              </Link>
              <Link
                href="/dashboard"
                className="nav-item hidden md:block text-sm font-semibold transition-colors"
                style={{ color: "#232F3E" }}
              >
                Dashboard
              </Link>
              <AvatarDropdown />
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: "#232F3E" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div
              className="md:hidden px-6 pb-4 border-t"
              style={{ borderColor: "#E8E8E8" }}
            >
              <input
                type="text"
                placeholder="Search..."
                className="w-full mt-4 py-3 px-4 rounded-lg text-sm border"
                style={{ background: "#F5F5F5", borderColor: "#E8E8E8" }}
              />
              <div className="flex flex-col gap-3 mt-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold"
                  style={{ color: "#232F3E" }}
                >
                  Library
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold"
                  style={{ color: "#232F3E" }}
                >
                  Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
