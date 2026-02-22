"use client";
import { authClient } from "@/src/lib/auth-client";

export default function SignOut() {
  return (
    <>
      <button
        onClick={() =>
          authClient.signOut()
        }
      >
        Sign Out
      </button>
    </>
  );
}
