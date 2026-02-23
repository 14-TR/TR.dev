export default function ArticleCard({ title, date, excerpt, onClick }) {
  return (
    <button className="article-card" onClick={onClick}>
      <div className="article-date">{date}</div>
      <h3 className="article-title">{title}</h3>
      <p className="article-excerpt">{excerpt}</p>
      <span className="article-cta">READ MORE →</span>
    </button>
  )
}
