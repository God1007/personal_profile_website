import { ArticleCard } from "@/components/blog/article-card";
import { getAllTags, getPostsByTag } from "@/lib/blog";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  return (
    <main className="blog-page container">
      <header className="blog-hero">
        <p className="eyebrow">Tag</p>
        <h1>标签：{tag}</h1>
      </header>
      <section className="article-list">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}
