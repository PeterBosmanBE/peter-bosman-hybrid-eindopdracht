import { db } from "@/src/server/db/client";
import { user, audiobooks, podcasts } from "@/src/server/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Headphones, Mic2, CalendarDays } from "lucide-react";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch the user information
  const userProfile = await db.query.user.findFirst({
    where: eq(user.id, id),
  });

  if (!userProfile) {
    return notFound();
  }

  // Fetch their audiobooks and podcasts
  const userAudiobooks = await db.query.audiobooks.findMany({
    where: eq(audiobooks.userId, id),
  });

  const userPodcasts = await db.query.podcasts.findMany({
    where: eq(podcasts.userId, id),
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Banner & Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-48 sm:h-64 w-full relative" />

      <div className="container mx-auto px-4 max-w-5xl -mt-20 sm:-mt-24 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-12 border border-gray-100">
          <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-white shadow-md bg-white">
            <AvatarImage
              src={userProfile.image || ""}
              alt={userProfile.name}
              className="object-cover"
            />
            <AvatarFallback className="text-4xl bg-gray-100 text-gray-600">
              {userProfile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left mb-2 sm:mb-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              {userProfile.name}
            </h1>

            {userProfile.bio && (
              <p className="text-gray-600 mb-4 max-w-2xl mx-auto sm:mx-0 break-words">
                {userProfile.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-600 font-medium">
              <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                <CalendarDays size={16} />
                Joined{" "}
                {new Date(userProfile.createdAt).toLocaleDateString(undefined, {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                <Headphones size={16} />
                {userAudiobooks.length} Audiobooks
              </span>
              <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                <Mic2 size={16} />
                {userPodcasts.length} Podcasts
              </span>
            </div>
          </div>
        </div>

        {/* Audiobooks Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-100 p-2.5 rounded-xl">
              <Headphones className="text-blue-600" size={24} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Audiobooks ({userAudiobooks.length})
            </h2>
          </div>

          {userAudiobooks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
              <Headphones className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 font-medium">
                This user hasn&apos;t published any audiobooks yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {userAudiobooks.map((audiobook) => (
                <Link
                  href={`/audiobook/${audiobook.id}`}
                  key={audiobook.id}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-square mb-4 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100 group-hover:shadow-xl group-hover:shadow-blue-900/10 transition-all duration-300 transform group-hover:-translate-y-1">
                    <Image
                      src={audiobook.cover}
                      alt={audiobook.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                    {audiobook.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1 font-medium">
                    By {audiobook.author}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Podcasts Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-purple-100 p-2.5 rounded-xl">
              <Mic2 className="text-purple-600" size={24} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Podcasts ({userPodcasts.length})
            </h2>
          </div>

          {userPodcasts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
              <Mic2 className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 font-medium">
                This user hasn&apos;t published any podcasts yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {userPodcasts.map((podcast) => (
                <Link
                  href={`/podcasts/${podcast.id}`}
                  key={podcast.id}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-square mb-4 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100 group-hover:shadow-xl group-hover:shadow-purple-900/10 transition-all duration-300 transform group-hover:-translate-y-1">
                    <Image
                      src={podcast.cover}
                      alt={podcast.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1 mb-1">
                    {podcast.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1 font-medium">
                    By {podcast.author}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
