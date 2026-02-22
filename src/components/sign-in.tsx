"use client";
import Link from "next/link";
import { authClient } from "../lib/auth-client";
import SignOut from "./sign-out";
export default function SignIn() {
  const { data: session } = authClient.useSession();
  return (
    <>
      <div>
        {session ? <SignOut /> : <Link href={"/sign-in"}>Sign-In</Link>}
      </div>
    </>
  );
}
