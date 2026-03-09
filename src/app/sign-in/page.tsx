"use client";

import SignInSocials from "@/src/components/sign-in-socials";
import { authClient } from "@/src/lib/auth-client";
import { Turnstile } from "@marsidev/react-turnstile";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { useState } from "react";

export default function SocialLogin() {
  const { data: session } = authClient.useSession();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  if (session) {
    redirect("/", RedirectType.push);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(180deg, #232F3E 0%, #37475A 100%)",
        fontFamily: "'Source Sans 3', sans-serif",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "#F7941D" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <span
            className="font-serif text-2xl font-bold text-white"
            style={{ fontFamily: "'Merriweather', Georgia, serif" }}
          >
            Chapter
          </span>
        </Link>

        {/* Card */}
        <div
          className="rounded-xl p-8"
          style={{ background: "#FFFFFF", border: "1px solid #E8E8E8" }}
        >
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-bold mb-2"
              style={{
                color: "#232F3E",
                fontFamily: "'Merriweather', Georgia, serif",
              }}
            >
              Welcome back
            </h1>
            <p style={{ color: "#666666", fontSize: "15px" }}>
              Sign in to continue listening to your favorite audiobooks & podcasts.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <SignInSocials name={"GitHub"} provider="github" icon="github" turnstileToken={turnstileToken} />
            <SignInSocials name={"Discord"} provider="discord" icon="discord" turnstileToken={turnstileToken} />
          </div>

          <div className="mt-6 flex justify-center">
            <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onSuccess={setTurnstileToken} />
          </div>
        </div>

        {/* Footer text */}
        <p
          className="text-center mt-6 text-sm"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          By signing in, you agree to our{" "}
          <span style={{ color: "#F7941D" }} className="cursor-pointer hover:underline">
            Terms of Service
          </span>{" "}
          and{" "}
          <span style={{ color: "#F7941D" }} className="cursor-pointer hover:underline">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}
