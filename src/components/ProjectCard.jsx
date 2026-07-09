export default function ProjectCard({
  title,
  description,
  problem,
  artifact,
  proof,
  status,
  tags,
  link,
  linkLabel,
  onLinkClick,
  variant = 'project',
}) {
  const isCase = variant === 'case'
  const body = (
    <>
      <div className="project-card-accent" />
      <div className="project-card-body">
        <h3 className="project-title">{title}</h3>
        {isCase ? (
          <div className="case-study-details">
            <p><span>What it is</span>{problem}</p>
            <p><span>My role</span>{artifact}</p>
            <p><span>Result</span>{proof}</p>
            <div className="case-study-footer">
              <span className="case-study-status">{status}</span>
              {link && <span className="case-study-link">{linkLabel || 'View project'}</span>}
            </div>
          </div>
        ) : (
          <>
            {status && <div className="project-status">{status}</div>}
            <p className="project-desc">{description}</p>
          </>
        )}
        <div className="project-tags">
          {tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      <div className="project-card-corner" />
    </>
  )

  if (!link) {
    return <article className={`project-card project-card-static ${isCase ? 'case-study-card' : ''}`}>{body}</article>
  }

  return (
    <a
      href={link}
      className={`project-card ${isCase ? 'case-study-card' : ''}`}
      target="_blank"
      rel="noreferrer"
      onClick={onLinkClick}
      aria-label={`${title} ${isCase ? 'selected work link' : 'project link'}`}
    >
      {body}
    </a>
  )
}
