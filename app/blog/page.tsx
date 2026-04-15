import { ArticleCard } from "@/components/blog/article-card";
import { getAllPosts, getFeaturedPosts } from "@/lib/blog";

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const featured = getFeaturedPosts()[0];
  const rest = posts.filter((post) => post.slug !== featured?.slug);

  return (
    <main className="blog-page container">
      <header className="blog-hero">
        <p className="eyebrow">Blog</p>
        <h1>文章</h1>
        <p className="section-intro">
          这里会记录我的项目复盘、技术学习、网络调试经验，以及一些阶段性的思考。
        </p>
      </header>

      {featured ? (
        <section className="featured-article">
          <p className="eyebrow">Featured</p>
          <h2>精选文章</h2>
          <ArticleCard post={featured} />
        </section>
      ) : null}

      <section className="article-list">
        {rest.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}
