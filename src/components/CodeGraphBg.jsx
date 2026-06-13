const NODES = [
  { left: '9%', top: '14%', size: '0.7rem' },
  { left: '22%', top: '32%', size: '0.48rem' },
  { left: '15%', top: '68%', size: '0.62rem' },
  { left: '37%', top: '18%', size: '0.56rem' },
  { left: '44%', top: '49%', size: '0.82rem' },
  { left: '58%', top: '22%', size: '0.52rem' },
  { left: '61%', top: '74%', size: '0.72rem' },
  { left: '76%', top: '39%', size: '0.64rem' },
  { left: '87%', top: '17%', size: '0.5rem' },
  { left: '82%', top: '79%', size: '0.76rem' },
]

export default function CodeGraphBg() {
  return (
    <div className="code-graph-lite" aria-hidden="true">
      <svg className="code-graph-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M9 14 L22 32 L37 18 L58 22 L76 39 L87 17" />
        <path d="M22 32 L44 49 L61 74 L82 79" />
        <path d="M15 68 L44 49 L76 39" />
        <path d="M37 18 L44 49 L61 74" />
      </svg>
      {NODES.map((node) => (
        <span
          key={`${node.left}-${node.top}`}
          className="code-graph-node"
          style={{ left: node.left, top: node.top, width: node.size, height: node.size }}
        />
      ))}
    </div>
  )
}
