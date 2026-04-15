type ArticleMetaProps = {
  date: string;
  category: string;
  tags?: string[];
};

export function ArticleMeta({ date, category, tags = [] }: ArticleMetaProps) {
  return (
    <div className="article-meta">
      <span className="meta-pill meta-pill-muted">{date}</span>
      <span className="meta-pill">{category}</span>
      {tags.map((tag) => (
        <span key={tag} className="meta-pill meta-pill-soft">
          {tag}
        </span>
      ))}
    </div>
  );
}
