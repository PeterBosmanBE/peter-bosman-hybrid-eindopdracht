"use client";
import { Button } from "@/src/components/ui/button";
import { authClient } from "@/src/server/auth/auth-client";
import { Icon } from "./icons";

type SignInOptions = {
  name: string;
  icon: "discord" | "github";
  provider: "discord" | "github";
  turnstileToken: string | null;
};

export default function SignInSocials({ name, icon, provider }: SignInOptions) {
  return (
    <>
      <Button
        variant="outline"
        className="h-12 rounded-lg border-border bg-secondary text-foreground hover:bg-muted transition-colors gap-3 font-medium"
        onClick={() =>
          authClient.signIn.social({
            provider: provider,
          })
        }
      >
        <Icon name={icon} />
        {name}
      </Button>
    </>
  );
}
