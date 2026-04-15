import { ArticleCard } from "@/components/blog/article-card";
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

  return (
    <main className="blog-page container">
      <header className="blog-hero">
        <p className="eyebrow">Category</p>
        <h1>分类：{category}</h1>
      </header>
      <section className="article-list">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}
