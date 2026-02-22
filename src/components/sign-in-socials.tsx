"use client";
import { authClient } from "../lib/auth-client";

type SignInOptions = {
  name: string;
  provider: "github";
};

export default function SignInSocials({ name, provider }: SignInOptions) {
  return (
    <>
      <button
        onClick={() =>
          authClient.signIn.social({
            provider: provider,
          })
        }
      >
        Login to {name}
      </button>
    </>
  );
}
