import { Fragment, useEffect, useId } from 'react'

export default function ArticleModal({ article, onClose }) {
  const titleId = useId()

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const renderInline = (text) => {
    const parts = text.split(/(\*\*.+?\*\*|`.+?`)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="modal-code">{part.slice(1, -1)}</code>
      }
      return <Fragment key={i}>{part}</Fragment>
    })
  }

  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="modal-h2">{line.slice(3)}</h2>
      if (line.startsWith('### ')) return <h3 key={i} className="modal-h3">{line.slice(4)}</h3>
      if (line.startsWith('- ')) {
        return <li key={i} className="modal-li">{renderInline(line.slice(2))}</li>
      }
      if (line.trim() === '') return <br key={i} />
      return <p key={i} className="modal-p">{renderInline(line)}</p>
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close article"
        >
          CLOSE
        </button>
        <div className="modal-date">{article.date}</div>
        <h1 className="modal-title" id={titleId}>{article.title}</h1>
        <div className="modal-tags">
          {article.tags?.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <div className="modal-body">
          {renderContent(article.content || article.excerpt)}
        </div>
      </div>
    </div>
  )
}
