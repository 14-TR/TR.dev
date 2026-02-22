export default function ArticleCard({ title, date, excerpt, link }) {
  return (
    <a href={link || '#'} className="article-card">
      <div className="article-date">{date}</div>
      <h3 className="article-title">{title}</h3>
      <p className="article-excerpt">{excerpt}</p>
      <span className="article-cta">READ MORE →</span>
    </a>
  )
}
