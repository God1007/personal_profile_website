import { ArticleCard } from "@/components/blog/article-card";
import { siteContent } from "@/data/site-content";
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
  const { writing } = siteContent;

  return (
    <main className="blog-page container">
      <header className="blog-hero">
        <p className="eyebrow">Archive</p>
        <h1>{writing.title}</h1>
        <p className="section-subtitle">Tag / {tag}</p>
      </header>
      <section className="article-list">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}
