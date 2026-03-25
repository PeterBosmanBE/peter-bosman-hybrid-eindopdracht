"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { authClient } from "@/src/server/auth/auth-client";
import { Skeleton } from "@/src/components/ui/skeleton";
import SignIn from "./sign-in";
import Link from "next/link";

export default function AvatarDropdown() {
  const { data: session } = authClient.useSession();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage
              src={session?.user.image || "/icon.webp"}
              alt={session ? session?.user.name + "'s Icon" : "User's Icon"}
            />
            <AvatarFallback>
              <Skeleton className="size-10 shrink-0 rounded-full" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {session ? (
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/profile/${session.user.id}`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
          ) : (
            <DropdownMenuItem>
              <SignIn />
            </DropdownMenuItem>
          )}
          {session ? (
            <DropdownMenuItem onClick={() => authClient.signOut()}>
              Sign Out
            </DropdownMenuItem>
          ) : (
            ""
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
