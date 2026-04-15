import { describe, expect, it } from "vitest";
import {
  getAllPosts,
  getAdjacentPosts,
  getFeaturedPosts,
  getPostBySlug,
  getPostsByCategory,
  getPostsByTag,
  getRelatedPosts
} from "@/lib/blog";

describe("blog content utilities", () => {
  it("returns published posts sorted by date descending", () => {
    const posts = getAllPosts();

    expect(posts.map((post) => post.slug)).toEqual([
      "demo",
      "building-jared-home",
      "network-debugging-notes"
    ]);
  });

  it("returns featured posts only", () => {
    const featured = getFeaturedPosts();

    expect(featured).toHaveLength(2);
    expect(featured.every((post) => post.featured)).toBe(true);
  });

  it("loads a single post by slug", () => {
    const post = getPostBySlug("demo");

    expect(post.title).toContain("AI Intelligent Network Diagnostics");
    expect(post.category).toBe("Project Log");
  });

  it("filters posts by category", () => {
    const posts = getPostsByCategory("Build Log");

    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe("building-jared-home");
  });

  it("filters posts by tag", () => {
    const posts = getPostsByTag("Linux");

    expect(posts).toHaveLength(2);
    expect(posts.map((post) => post.slug)).toEqual(["demo", "network-debugging-notes"]);
  });

  it("returns previous and next posts for a slug", () => {
    const adjacent = getAdjacentPosts("building-jared-home");

    expect(adjacent.previous?.slug).toBe("demo");
    expect(adjacent.next?.slug).toBe("network-debugging-notes");
  });

  it("returns related posts based on category or tags", () => {
    const related = getRelatedPosts("demo");

    expect(related.map((post) => post.slug)).toEqual(["network-debugging-notes"]);
  });
});
