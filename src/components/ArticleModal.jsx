import { useEffect } from 'react'

export default function ArticleModal({ article, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Simple markdown-ish renderer (headings, bold, paragraphs)
  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="modal-h2">{line.slice(3)}</h2>
      if (line.startsWith('### ')) return <h3 key={i} className="modal-h3">{line.slice(4)}</h3>
      if (line.startsWith('- ')) {
        const inner = line.slice(2).replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong>${m}</strong>`)
        return <li key={i} className="modal-li" dangerouslySetInnerHTML={{ __html: inner }} />
      }
      if (line.trim() === '') return <br key={i} />
      const html = line.replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong>${m}</strong>`)
        .replace(/`(.+?)`/g, (_, m) => `<code class="modal-code">${m}</code>`)
      return <p key={i} className="modal-p" dangerouslySetInnerHTML={{ __html: html }} />
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕ CLOSE</button>
        <div className="modal-date">{article.date}</div>
        <h1 className="modal-title">{article.title}</h1>
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
