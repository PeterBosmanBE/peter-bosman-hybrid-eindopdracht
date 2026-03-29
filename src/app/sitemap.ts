import { url } from "@/src/lib/url";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: url("/"),
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
		{
			url: url("/profile/*"),
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
	];
}