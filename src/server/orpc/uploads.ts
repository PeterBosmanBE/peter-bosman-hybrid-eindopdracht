import { db } from "@/src/server/db/client";
import { os } from "@orpc/server";
import { put } from "@vercel/blob";
import * as z from "zod";
import { uploads } from "@/src/server/db/schema";
import { desc } from "drizzle-orm";

export const uploadsRouter = {
  create: os.input(z.file()).handler(async ({ input }) => {
    const isAudio = input.type.startsWith("audio/");
    const isImage = input.type.startsWith("image/");
    const folder = isAudio ? "audio" : isImage ? "images" : "others";

    const { url } = await put(`uploads/${folder}/${input.name}`, input, {
      access: "public",
      addRandomSuffix: true,
      contentType: input.type,
    });

    await db.insert(uploads).values({ url });

    return { url };
  }),
  list: os.handler(async () => {
    const allUploads = await db.select().from(uploads).orderBy(desc(uploads.createdAt));
    return allUploads;
  }),
};