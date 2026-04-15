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

    expect(posts.map((post) => post.slug)).toEqual(["demo"]);
  });

  it("returns featured posts only", () => {
    const featured = getFeaturedPosts();

    expect(featured).toHaveLength(1);
    expect(featured.every((post) => post.featured)).toBe(true);
  });

  it("loads a single post by slug", () => {
    const post = getPostBySlug("demo");

    expect(post.title).toContain("这是一个示例文章");
    expect(post.category).toBe("项目记录");
  });

  it("filters posts by category", () => {
    const posts = getPostsByCategory("项目记录");

    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe("demo");
  });

  it("filters posts by tag", () => {
    const posts = getPostsByTag("Linux");

    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe("demo");
  });

  it("returns previous and next posts for a slug", () => {
    const adjacent = getAdjacentPosts("demo");

    expect(adjacent.previous).toBeNull();
    expect(adjacent.next).toBeNull();
  });

  it("returns related posts based on category or tags", () => {
    const related = getRelatedPosts("demo");

    expect(related).toHaveLength(0);
  });
});
