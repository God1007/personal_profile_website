import type { MetadataRoute } from "next";
import { getAllCategories, getAllPosts, getAllTags } from "@/lib/blog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://example.com";
  const posts = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
    lastModified: new Date(post.date)
  }));

  const categories = getAllCategories().map((category) => ({
    url: `${baseUrl}/blog/category/${encodeURIComponent(category)}`,
    lastModified: new Date()
  }));

  const tags = getAllTags().map((tag) => ({
    url: `${baseUrl}/blog/tag/${encodeURIComponent(tag)}`,
    lastModified: new Date()
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date()
    },
    ...posts,
    ...categories,
    ...tags
  ];
}
