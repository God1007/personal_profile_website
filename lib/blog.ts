import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const blogDirectory = path.join(process.cwd(), "content", "blog");

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  category: string;
  featured: boolean;
  published: boolean;
  content: string;
  html: string;
};

type BlogFrontmatter = Omit<BlogPost, "slug" | "content" | "html">;

function parsePostFile(fileName: string): BlogPost {
  const slug = fileName.replace(/\.md$/, "");
  const fullPath = path.join(blogDirectory, fileName);
  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);
  const frontmatter = data as BlogFrontmatter;

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    summary: frontmatter.summary,
    tags: frontmatter.tags,
    category: frontmatter.category,
    featured: frontmatter.featured,
    published: frontmatter.published,
    content,
    html: marked.parse(content) as string
  };
}

export function getAllPosts(): BlogPost[] {
  return fs
    .readdirSync(blogDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(parsePostFile)
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((post) => post.featured);
}

export function getPostBySlug(slug: string): BlogPost {
  return getAllPosts().find((post) => post.slug === slug)!;
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getAllCategories(): string[] {
  return Array.from(new Set(getAllPosts().map((post) => post.category)));
}

export function getAllTags(): string[] {
  return Array.from(new Set(getAllPosts().flatMap((post) => post.tags)));
}

export function getAdjacentPosts(slug: string) {
  const posts = getAllPosts();
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  return {
    previous: currentIndex > 0 ? posts[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
  };
}

export function getRelatedPosts(slug: string): BlogPost[] {
  const current = getPostBySlug(slug);
  const candidates = getAllPosts().filter((post) => post.slug !== slug);
  const related = candidates.filter(
    (post) =>
      post.category === current.category || post.tags.some((tag) => current.tags.includes(tag))
  );

  return (related.length > 0 ? related : candidates).slice(0, 3);
}
