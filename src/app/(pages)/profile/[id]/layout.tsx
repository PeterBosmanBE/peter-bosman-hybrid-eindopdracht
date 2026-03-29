import { db } from "@/src/server/db/client";
import { user } from "@/src/server/db/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const userProfile = await db.query.user.findFirst({
    where: eq(user.id, id),
  });

  return {
    title: userProfile?.name ? `${userProfile.name}'s Profile` : "Profile",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
