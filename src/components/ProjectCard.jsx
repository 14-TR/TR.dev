export default function ProjectCard({ title, description, tags, link }) {
  return (
    <a
      href={link || '#'}
      className="project-card"
      target={link ? '_blank' : '_self'}
      rel="noreferrer"
    >
      <div className="project-card-accent" />
      <div className="project-card-body">
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{description}</p>
        <div className="project-tags">
          {tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      <div className="project-card-corner" />
    </a>
  )
}
