import Link from "next/link";
import { ArticleMeta } from "@/components/blog/article-meta";
import type { BlogPost } from "@/lib/blog";

type ArticleCardProps = {
  post: BlogPost;
};

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="article-card surface-panel">
      <ArticleMeta date={post.date} category={post.category} tags={post.tags} />
      <h2>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>
      <p>{post.summary}</p>
    </article>
  );
}
