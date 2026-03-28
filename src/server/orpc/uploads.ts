import { db } from "@/src/server/db/client";
import { os } from "@orpc/server";
import { put } from "@vercel/blob";
import * as z from "zod";
import { desc } from "drizzle-orm";

export const uploadsRouter = {
  create: os.input(z.any()).handler(async ({ input }) => {
    // Note: The input from FormData needs to handle File properly, using z.any() here 
    // because standard z.file() validator can have limitations depending on the ORPC setup.
    const file = input as File;
    const isAudio = file.type.startsWith("audio/");
    const isImage = file.type.startsWith("image/");
    const folder = isAudio ? "audio" : isImage ? "images" : "others";

    const { url } = await put(`uploads/${folder}/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });

    // Don't log to uploads table anymore, just return what was generated
    return { url };
  }),
};