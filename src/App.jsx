import { Suspense } from 'react'
import HeroCanvas from './components/HeroCanvas'
import ProjectCard from './components/ProjectCard'
import ArticleCard from './components/ArticleCard'
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
    description: 'AI-powered project intelligence native to OpenClaw. SQLite backend, React dashboard, 56+ tools for projects, tasks, decisions, and knowledge graphs.',
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
    description: 'Git-like version control for ArcGIS web maps. Branching, merging, commit history for geospatial assets. 450+ tests.',
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

const STACK = [
  'Python', 'React', 'Next.js', 'Three.js', 'ArcGIS', 'AGOL',
  'PostgreSQL', 'SQLite', 'Ollama / LLMs', 'Remotion', 'FastAPI',
  'Discord Bots', 'Automation', 'OpenClaw', 'Node.js',
]

const ARTICLES = [
  {
    title: 'Building Mission Control: How Our AI Agent System Works',
    date: 'Feb 15, 2026',
    excerpt: 'A deep dive into the architecture behind a personal AI agent running 24/7 on a Mac Mini — cron jobs, skills, memory, and pipelines that actually ship work.',
    link: '#',
  },
]

export default function App() {
  return (
    <div className="app">
      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-canvas-wrap">
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
        </div>

        <div className="hero-grid-overlay" />
        <div className="hero-grain" />

        <div className="hero-content">
          <div className="hero-status">
            <span className="status-dot" />
            SYSTEMS ONLINE
          </div>

          <h1 className="hero-name">TR INGRAM</h1>
          <p className="hero-sub">
            GIS Professional&nbsp;&nbsp;·&nbsp;&nbsp;AI Systems Builder&nbsp;&nbsp;·&nbsp;&nbsp;Wyoming
          </p>
          <p className="hero-tagline">
            Building the infrastructure for tomorrow's automated workflows.
          </p>

          <div className="hero-ctas">
            <a href="#projects" className="btn btn-primary">VIEW PROJECTS</a>
            <a href="#articles" className="btn btn-outline">READ ARTICLES</a>
          </div>

          <div className="hero-coords">
            <span>41.1400° N · 104.8197° W</span>
            <span className="divider">|</span>
            <span>github.com/14-TR</span>
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
          <div className="section-label">// PROJECTS</div>
          <h2 className="section-title">What I Build</h2>
          <p className="section-sub">
            Automated systems, AI pipelines, and geospatial tooling.
          </p>

          <div className="projects-grid">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.title} {...p} />
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
            {ARTICLES.map((a) => (
              <ArticleCard key={a.title} {...a} />
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
            <a href="#" rel="noreferrer">LinkedIn</a>
          </div>

          <div className="footer-right">
            <span>Built with React + Three.js · tr.dev</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
