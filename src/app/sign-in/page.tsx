"use client";
import SignInSocials from "@/src/components/sign-in-socials";
import { authClient } from "@/src/lib/auth-client";
import { Turnstile } from "@marsidev/react-turnstile";
import { redirect, RedirectType } from "next/navigation";
import { useState } from "react";

export default function SocialLogin() {
  const { data: session } = authClient.useSession();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  if (session) {
    redirect("/", RedirectType.push);
  }

  return (
    <div>
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="gap-3">
          <SignInSocials name={"GitHub"} provider="github" icon="github" turnstileToken={turnstileToken} />
        </div>
        <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onSuccess={setTurnstileToken} />
      </section>
    </div>
  );
}
