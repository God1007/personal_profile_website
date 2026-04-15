import { ArticleCard } from "@/components/blog/article-card";
import { siteContent } from "@/data/site-content";
import { getAllPosts, getFeaturedPosts } from "@/lib/blog";

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const featured = getFeaturedPosts()[0];
  const rest = posts.filter((post) => post.slug !== featured?.slug);
  const { writing } = siteContent;

  return (
    <main className="blog-page container">
      <header className="blog-hero">
        <p className="eyebrow">{writing.eyebrow}</p>
        <h1>{writing.title}</h1>
        <p className="section-subtitle">{writing.subtitle}</p>
        <p className="section-intro">{writing.intro}</p>
      </header>

      {featured ? (
        <section className="featured-article surface-panel">
          <p className="eyebrow">Featured</p>
          <h2>Featured Note</h2>
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
