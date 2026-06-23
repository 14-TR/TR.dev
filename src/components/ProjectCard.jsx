export default function ProjectCard({
  title,
  description,
  problem,
  artifact,
  proof,
  impact,
  scope,
  status,
  tags,
  link,
  linkLabel,
  featured = false,
  variant = 'project',
}) {
  const isCase = variant === 'case'
  const className = [
    'project-card',
    isCase ? 'case-study-card' : '',
    featured ? 'project-card-featured' : '',
    !link ? 'project-card-static' : '',
  ].filter(Boolean).join(' ')

  const body = (
    <>
      <div className="project-card-accent" />
      <div className="project-card-body">
        <div className="project-card-header">
          {featured && <span className="case-feature-label">Flagship case</span>}
          <h3 className="project-title">{title}</h3>
        </div>
        {isCase ? (
          <div className="case-study-details">
            <div className="case-study-copy">
              <p><span>What it is</span>{problem}</p>
              <p><span>My role</span>{artifact}</p>
              <p><span>Result</span>{proof}</p>
            </div>
            {(impact || scope) && (
              <div className="case-study-proof" aria-label={`${title} scope and impact`}>
                {scope && (
                  <div>
                    <span>Scope</span>
                    <strong>{scope}</strong>
                  </div>
                )}
                {impact && (
                  <div>
                    <span>Impact</span>
                    <strong>{impact}</strong>
                  </div>
                )}
              </div>
            )}
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
    return <article className={className}>{body}</article>
  }

  return (
    <a
      href={link}
      className={className}
      target="_blank"
      rel="noreferrer"
      aria-label={`${title} ${isCase ? 'selected work link' : 'project link'}`}
    >
      {body}
    </a>
  )
}
