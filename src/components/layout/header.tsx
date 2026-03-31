"use client";
import Link from "next/link";
import AvatarDropdown from "../avatar-dropdown";
import { useState } from "react";
import Logo from "../ui/logo";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import SignIn from "../sign-in";
import { authClient } from "@/src/server/auth/auth-client";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const runSearch = (value: string) => {
    const trimmed = value.trim();
    const params = new URLSearchParams();

    if (trimmed) {
      params.set("q", trimmed);
    }

    const target = params.toString()
      ? `/search?${params.toString()}`
      : "/search";
    router.push(target);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white border-nav-border">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Logo isMainHeader={true} />

            {/* Search */}
            <div className="flex-1 max-w-xl mx-8 hidden md:block">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for audiobooks, podcasts, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      runSearch(searchQuery);
                    }
                  }}
                  className="w-full py-3 px-5 pr-12 rounded-full text-sm focus:outline-none border"
                  style={{
                    background: "#F5F5F5",
                    borderColor: "#E8E8E8",
                    color: "#232F3E",
                  }}
                />
                <Button
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  variant="ghost"
                  size="icon"
                  onClick={() => runSearch(searchQuery)}
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <AvatarDropdown />
              <Button
                className="md:hidden bg-transparent"
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
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden px-6 pb-4 border-t border-nav-border">
              <Input
                type="text"
                placeholder="Search..."
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    runSearch(mobileSearchQuery);
                  }
                }}
                className="w-full mt-4 py-3 px-4 rounded-lg text-sm border"
                style={{ background: "#F5F5F5", borderColor: "#E8E8E8" }}
              />
              <Button
                className="w-full mt-3"
                onClick={() => runSearch(mobileSearchQuery)}
              >
                Search
              </Button>
              {session ? (
                <div>
                  <p>My Account</p>
                  <div>
                    <Link href="/dashboard">Dashboard</Link>
                  </div>
                  <div>
                    <Link href={`/profile/${session.user.id}`}>Profile</Link>
                  </div>
                </div>
              ) : (
                <Button className="w-full md:hidden bg-transparent text-black">
                  <SignIn />
                </Button>
              )}
              {session ? (
                <div onClick={() => authClient.signOut()}>Sign Out</div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
