"use client";
import { Button } from "@/src/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { Icon } from "./ui/icons";

type SignInOptions = {
  name: string;
  icon: "github";
  provider: "github";
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
