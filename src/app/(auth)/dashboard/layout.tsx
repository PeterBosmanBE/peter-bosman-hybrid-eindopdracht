import { auth } from "@/src/server/auth/auth";
import { Source_Sans_3 } from "next/font/google";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <main className={`${sourceSans.className} font-sans antialiased`}>
      {children}
    </main>
  );
}
