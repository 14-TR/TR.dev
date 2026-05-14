import { Suspense, useState, useEffect } from 'react'
import HeroCanvas from './components/HeroCanvas'
import CodeGraphBg from './components/CodeGraphBg'
import ProjectCard from './components/ProjectCard'
import ArticleCard from './components/ArticleCard'
import ArticleModal from './components/ArticleModal'
import './App.css'

const PROJECTS = [
  {
    title: 'ParcelIQ',
    description: 'Interactive parcel map for Laramie County, Wyoming. 46,000+ parcels with AI natural language search, value symbology, draw & query, CSV export, and aerial imagery.',
    tags: ['GIS', 'Cloudflare', 'MapLibre'],
    link: 'https://parcel-iq.org',
  },
  {
    title: 'ProjectIQ',
    description: 'AI-powered project intelligence native to OpenClaw. SQLite backend, React dashboard, and 119 native tools for projects, tasks, decisions, and knowledge graphs.',
    tags: ['AI', 'React', 'SQLite'],
    link: 'https://github.com/14-TR',
  },
  {
    title: 'OpenWorker',
    description: 'Workforce intelligence platform. Public stats dashboard with live metrics, Cloudflare-hosted, automated daily stat updates. Book consultations directly.',
    tags: ['Cloudflare', 'Dashboard', 'Automation'],
    link: 'https://openworker.org',
  },
  {
    title: 'ConflictIQ',
    description: 'AI-powered conflict analysis and resolution intelligence platform. Structured decision support for complex multi-party disputes and negotiation workflows.',
    tags: ['AI', 'Analysis', 'Python'],
    link: null,
  },
  {
    title: 'Git-Map',
    description: 'Git-like version control for ArcGIS web maps. Branching, merging, commit history for geospatial assets, and 786 passing tests on the current feature branch.',
    tags: ['GIS', 'ArcGIS', 'Python'],
    link: 'https://github.com/14-TR/Git-Map',
  },
  {
    title: 'KnowFlow',
    description: 'Knowledge management and flow system for capturing, linking, and surfacing insights across projects. Absorbed into ProjectIQ as its knowledge graph layer.',
    tags: ['Knowledge', 'Graph', 'React'],
    link: 'https://github.com/14-TR/Know-Flow',
  },
  {
    title: '8bit-Bible',
    description: 'Fully automated daily Bible verse videos published to YouTube. Rendered with Remotion, WEB translation, zero manual intervention.',
    tags: ['Automation', 'Video', 'Remotion'],
    link: 'https://github.com/14-TR',
  },
  {
    title: '8bit-Stoic',
    description: 'Daily stoic philosophy videos, auto-generated and published. Pairs classical wisdom with 8-bit aesthetic pixel art.',
    tags: ['Automation', 'Video', 'Remotion'],
    link: 'https://github.com/14-TR',
  },
  {
    title: 'Mission Control',
    description: 'Personal agent command dashboard. Next.js 16, Tailwind v4, JARVIS theme. Aggregates all pipelines, cron jobs, and system status.',
    tags: ['Next.js', 'AI', 'Dashboard'],
    link: 'https://github.com/14-TR',
  },
  {
    title: 'Agent Arena',
    description: 'AI agents battle in 3D naval combat — turn-based strategy rendered in Three.js. Powered by local Qwen 2.5:14b via Ollama.',
    tags: ['AI', 'Three.js', 'FastAPI'],
    link: 'https://github.com/14-TR',
  },
  {
    title: 'Bookmark Digest',
    description: 'Local AI pipeline that fetches X/Twitter bookmarks, runs expert analysis with Qwen 14b via Ollama, and delivers daily signal-filtered digest reports.',
    tags: ['AI', 'Ollama', 'Python'],
    link: 'https://github.com/14-TR',
  },
]

const CASE_STUDIES = [
  {
    title: 'ParcelIQ',
    problem: 'County parcel research is split across map viewers, property tables, and manual export workflows.',
    artifact: 'A public parcel intelligence surface for Laramie County with map search, value symbology, draw/query workflows, aerial context, and gated CSV/GeoJSON exports.',
    proof: '46,000+ parcels indexed; production JSON /bbox smoke returns HTTP 200; anonymous exports remain Pro-gated.',
    status: 'Live product proof',
    tags: ['GIS', 'Parcel Data', 'Cloudflare'],
    link: 'https://parcel-iq.org',
    linkLabel: 'View live site',
  },
  {
    title: 'Git-Map',
    problem: 'ArcGIS web maps need reviewable version history, branching, and rollback patterns that normal GIS tooling does not expose cleanly.',
    artifact: 'A Git-like CLI for ArcGIS web maps with clone, pull, commit, branch, and merge workflows documented for safe first-user trials.',
    proof: 'Current focused docs PR passed strict MkDocs build; core test suite has 786 passing tests on the feature branch.',
    status: 'First-user proof',
    tags: ['ArcGIS', 'CLI', 'Version Control'],
    link: 'https://github.com/14-TR/Git-Map',
    linkLabel: 'View repo',
  },
  {
    title: 'ProjectIQ / OpenClaw',
    problem: 'AI-assisted projects lose context unless decisions, tasks, memory, and agent runs are made durable.',
    artifact: 'A local-first operating system for AI-assisted project work: durable tasks, decision history, memory, and operating dashboards.',
    proof: 'Validated with 99/99 Vitest, API build, client typecheck/build, and seeded health checks across the project workspace.',
    status: 'Working prototype',
    tags: ['AI Ops', 'SQLite', 'React'],
    link: 'https://github.com/14-TR/Know-Flow',
    linkLabel: 'View repo',
  },
  {
    title: 'Content Automation Pipeline',
    problem: 'Daily content channels fail when rendering, dependencies, upload state, and checks are handled manually.',
    artifact: 'Automated 8bit Bible production pipeline with doctor/preflight gates, Remotion rendering, upload scheduling, and local readiness reporting.',
    proof: 'Daily scheduled uploads recovered for May 12-13; weekly readiness routine reports 8bit Bible green from local checks.',
    status: 'Operating pipeline',
    tags: ['Remotion', 'YouTube', 'Automation'],
    link: 'https://github.com/14-TR',
    linkLabel: 'View GitHub',
  },
]

const STACK = [
  'Python', 'React', 'Next.js', 'Three.js', 'ArcGIS', 'AGOL',
  'PostgreSQL', 'SQLite', 'Ollama / LLMs', 'Remotion', 'FastAPI',
  'Discord Bots', 'Automation', 'OpenClaw', 'Node.js',
]

const PROOF_POINTS = [
  {
    value: '46K+',
    label: 'public parcel records mapped in ParcelIQ',
  },
  {
    value: 'ArcGIS',
    label: 'version-control workflow shipped for web maps',
  },
  {
    value: 'Ops',
    label: 'durable project workflows, checks, and handoffs',
  },
]

const CONTACT_PROMPTS = [
  'What GIS / AI workflow needs to become less manual',
  'Which systems, maps, data sources, or users are involved',
  'What a useful first proof would show in 2-4 weeks',
]

export default function App() {
  const [articles, setArticles] = useState([])
  const [activeArticle, setActiveArticle] = useState(null)

  useEffect(() => {
    fetch('/articles.json')
      .then(r => r.json())
      .then(setArticles)
      .catch(() => setArticles([]))
  }, [])
  return (
    <div className="app">
      <a className="skip-link" href="#projects">Skip to proof of work</a>
      {/* ── CODE GRAPH AMBIENT BACKGROUND ── */}
      <CodeGraphBg />
      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-canvas-wrap">
          <Suspense fallback={<div className="hero-canvas-fallback" aria-hidden="true" />}>
            <HeroCanvas />
          </Suspense>
        </div>

        <div className="hero-grid-overlay" />
        <div className="hero-grain" />

        <div className="hero-content">
          <div className="hero-status">
            <span className="status-dot" />
            GIS / GEOAI SYSTEMS
          </div>

          <h1 className="hero-name">TR INGRAM</h1>
          <p className="hero-sub">
            GIS Professional&nbsp;&nbsp;·&nbsp;&nbsp;GeoAI Product Builder&nbsp;&nbsp;·&nbsp;&nbsp;Wyoming
          </p>
          <p className="hero-tagline">
            I build practical geospatial software and AI-assisted operations for teams that need maps, data, and automation to turn into working products.
          </p>

          <div className="hero-ctas">
            <a href="#contact" className="btn btn-primary">START A GIS / AI CONSULT</a>
            <a href="#projects" className="btn btn-outline">SEE PROOF</a>
          </div>

          <div className="hero-audience" aria-label="Primary audience and offer">
            <span>For GIS teams</span>
            <span>AI workflow builders</span>
            <span>product evaluators</span>
          </div>

          <div className="hero-coords">
            <span>41.1400° N · 104.8197° W</span>
            <span className="divider">|</span>
            <span>GIS systems, product proofs, automation loops</span>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span>SCROLL</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="section" id="projects">
        <div className="container">
          <div className="section-label">// PROOF</div>
          <h2 className="section-title">Case Studies</h2>
          <p className="section-sub">
            Evidence-led snapshots of shipped geospatial products, agent systems, and automation pipelines.
          </p>

          <div className="case-grid">
            {CASE_STUDIES.map((study) => (
              <ProjectCard key={study.title} variant="case" {...study} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="section section-project-index" id="project-index">
        <div className="container">
          <div className="section-label">// PROJECT INDEX</div>
          <h2 className="section-title">Broader Build Surface</h2>
          <p className="section-sub">
            Additional tools, experiments, and systems that support the GIS / AI operating stack.
          </p>

          <div className="projects-grid">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="section section-contact" id="contact">
        <div className="container contact-grid">
          <div>
            <div className="section-label">// CONTACT</div>
            <h2 className="section-title">Start with the workflow.</h2>
            <p className="section-sub contact-sub">
              Best fit: parcel intelligence, ArcGIS workflow automation, internal AI operations, product proof builds, and decision-support systems that need to become real software.
            </p>
            <div className="contact-actions">
              <a className="btn btn-primary" href="mailto:tr@ingramgeoai.com?subject=GIS%20/%20AI%20systems%20consult&body=What%20workflow%20are%20you%20trying%20to%20improve%3F%0A%0AWhat%20maps%2C%20data%2C%20or%20systems%20are%20involved%3F%0A%0AWhat%20would%20a%20useful%20first%20proof%20show%3F">
                EMAIL TR
              </a>
              <a className="btn btn-outline" href="mailto:tr@ingramgeoai.com?subject=Booking%20request%20-%20GIS%20/%20AI%20consult&body=I%27d%20like%20to%20book%20a%20short%20call%20about%3A%0A%0ABest%20times%3A%0A%0ARelevant%20links%20or%20context%3A">
                REQUEST A CALL
              </a>
            </div>
            <div className="contact-intake" aria-label="Lead intake prompts">
              <span className="contact-intake-label">Helpful context</span>
              {CONTACT_PROMPTS.map((prompt) => (
                <span key={prompt}>{prompt}</span>
              ))}
            </div>
            <p className="contact-note">
              Send a quick note with the workflow, data sources, and the first result you want to see. I will reply with the smallest useful proof to build first.
            </p>
          </div>

          <div className="proof-panel" aria-label="Selected proof metrics">
            {PROOF_POINTS.map((point) => (
              <div className="proof-item" key={point.value}>
                <span className="proof-value">{point.value}</span>
                <span className="proof-label">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STACK ── */}
      <section className="section section-dark" id="stack">
        <div className="container">
          <div className="section-label">// STACK</div>
          <h2 className="section-title">Tools & Technologies</h2>

          <div className="stack-grid">
            {STACK.map((s) => (
              <div key={s} className="stack-badge">{s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section className="section" id="articles">
        <div className="container">
          <div className="section-label">// ARTICLES</div>
          <h2 className="section-title">How Our System Works</h2>
          <p className="section-sub">
            Weekly deep-dives into the architecture behind the automation stack.
          </p>

          <div className="articles-grid">
            {articles.map((a) => (
              <ArticleCard key={a.title} {...a} onClick={() => setActiveArticle(a)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-left">
            <span className="footer-name">TR INGRAM</span>
            <span className="footer-copy">© 2026</span>
          </div>

          <div className="footer-links">
            <a href="https://github.com/14-TR" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://x.com/tr_jig" target="_blank" rel="noreferrer">X / @tr_jig</a>
            <a href="https://linkedin.com/in/tr-ingram" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>

          <div className="footer-right">
            <span>Built with React + Three.js · tr.dev</span>
          </div>
        </div>
      </footer>

      {activeArticle && (
        <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
      )}
    </div>
  )
}
