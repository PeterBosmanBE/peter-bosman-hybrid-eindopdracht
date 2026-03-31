import { url } from "@/src/lib/url";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/sign-in", "/api/*", "/listen/*", "/search/*"],
    },
    sitemap: url("/sitemap.xml"),
  };
}
