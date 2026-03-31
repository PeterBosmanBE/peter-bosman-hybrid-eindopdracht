"use client";
import { authClient } from "@/src/server/auth/auth-client";

export default function SignOut() {
  return (
    <>
      <button onClick={() => authClient.signOut()}>Sign Out</button>
    </>
  );
}
