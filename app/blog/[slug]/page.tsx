import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleMeta } from "@/components/blog/article-meta";
import { RelatedArticles } from "@/components/blog/related-articles";
import { getAdjacentPosts, getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const adjacent = getAdjacentPosts(slug);
  const related = getRelatedPosts(slug);

  return (
    <main className="article-page container">
      <article className="article-layout">
        <p className="eyebrow">{post.category}</p>
        <h1>{post.title}</h1>
        <p className="article-summary">{post.summary}</p>
        <ArticleMeta date={post.date} category={post.category} tags={post.tags} />
        <div className="article-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>

      <nav className="article-pagination" aria-label="Article pagination">
        {adjacent.previous ? (
          <Link href={`/blog/${adjacent.previous.slug}`}>上一篇：{adjacent.previous.title}</Link>
        ) : (
          <span />
        )}
        {adjacent.next ? <Link href={`/blog/${adjacent.next.slug}`}>下一篇：{adjacent.next.title}</Link> : null}
      </nav>

      <RelatedArticles posts={related} />
    </main>
  );
}
