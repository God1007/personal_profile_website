type ArticleMetaProps = {
  date: string;
  category: string;
  tags?: string[];
};

export function ArticleMeta({ date, category, tags = [] }: ArticleMetaProps) {
  return (
    <div className="article-meta">
      <span>{date}</span>
      <span>{category}</span>
      {tags.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  );
}
