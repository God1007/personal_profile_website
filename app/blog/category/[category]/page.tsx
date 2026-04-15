import { ArticleCard } from "@/components/blog/article-card";
import { siteContent } from "@/data/site-content";
import { getAllCategories, getPostsByCategory } from "@/lib/blog";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  const { writing } = siteContent;

  return (
    <main className="blog-page container">
      <header className="blog-hero">
        <p className="eyebrow">Archive</p>
        <h1>{writing.title}</h1>
        <p className="section-subtitle">Category / {category}</p>
      </header>
      <section className="article-list">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}
