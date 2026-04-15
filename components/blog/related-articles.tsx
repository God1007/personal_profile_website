import { ArticleCard } from "@/components/blog/article-card";
import type { BlogPost } from "@/lib/blog";

type RelatedArticlesProps = {
  posts: BlogPost[];
};

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="related-articles">
      <h2>推荐阅读</h2>
      <div className="article-list">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
