import { Suspense, lazy, useCallback, useState, useEffect } from 'react'
import ProjectCard from './components/ProjectCard'
import ArticleCard from './components/ArticleCard'
import ArticleModal from './components/ArticleModal'
import './App.css'

const HeroCanvas = lazy(() => import('./components/HeroCanvas'))
const CodeGraphBg = lazy(() => import('./components/CodeGraphBg'))

const PROJECTS = [
  {
    title: 'ParcelIQ',
    status: 'Live GIS product',
    description: 'Laramie County parcel intelligence with 46,000+ public records, map search, value symbology, draw/query workflows, aerial context, and Pro-gated exports.',
    tags: ['GIS', 'Cloudflare', 'MapLibre'],
    link: 'https://parcel-iq.org',
  },
  {
    title: 'Git-Map',
    status: 'First-user proof',
    description: 'Git-like version control for ArcGIS web maps with clone, pull, commit, branch, and merge workflows. Current branch carries 786 passing tests.',
    tags: ['GIS', 'ArcGIS', 'Python'],
    link: 'https://github.com/14-TR/Git-Map',
  },
  {
    title: 'ProjectIQ / OpenClaw',
    status: 'AI ops system',
    description: 'Local-first project intelligence for agent-assisted work: durable tasks, decisions, memory, dashboards, and 119 native OpenClaw tools.',
    tags: ['AI Ops', 'React', 'SQLite'],
    link: 'https://github.com/14-TR/Know-Flow',
  },
  {
    title: '8bit Bible',
    status: 'Operating pipeline',
    description: 'Automated daily Bible verse video pipeline with readiness checks, duplicate-upload protection, Remotion rendering, and scheduled YouTube publishing.',
    tags: ['Automation', 'Video', 'Remotion'],
    link: 'https://github.com/14-TR',
  },
  {
    title: 'Resume Engine',
    status: 'Released engine',
    description: 'Multi-backend resume analysis and tailoring engine with structured validation, trust scoring, and a completed 26-item product roadmap.',
    tags: ['Python', 'LLMs', 'CLI'],
    link: 'https://github.com/14-TR/resume-engine',
  },
  {
    title: 'Realm',
    status: 'Research system',
    description: 'Private geospatial simulation workbench focused on reproducible evaluation, Census input discipline, and benchmarked model improvement.',
    tags: ['Science', 'Canvas', 'USGS'],
    link: null,
  },
  {
    title: 'Sudokish',
    status: 'iOS release prep',
    description: 'SwiftUI Killer Sudoku app with Metal shader polish, release-preflight automation, and local iPhone install testing path.',
    tags: ['SwiftUI', 'Metal', 'iOS'],
    link: null,
  },
  {
    title: 'The Broken Mask',
    status: 'Private writing system',
    description: 'Novel Forge workflow for chapter production, validation gates, private reader updates, and durable story-state tracking.',
    tags: ['Writing', 'Agents', 'Workflow'],
    link: null,
  },
  {
    title: 'Barkie.ai Map R&D',
    status: 'Contract product work',
    description: 'Golf map research across fullscreen mobile map UX, raster/LiDAR preprocessing, wind surfaces, and 3D course analysis prototypes.',
    tags: ['React Native', 'Mapbox', '3D'],
    link: null,
  },
  {
    title: 'Bookmark Digest',
    status: 'Signal pipeline',
    description: 'Local AI digest that turns saved links and bookmarks into ranked build-now, watch, and ignore signals for product strategy.',
    tags: ['Research', 'Ollama', 'Python'],
    link: 'https://github.com/14-TR',
  },
  {
    title: 'Agent Cockpit',
    status: 'Control plane',
    description: 'Operations surface for sessions, routines, task runs, mobile cockpit views, and durable issue-control experiments.',
    tags: ['OpenClaw', 'Ops', 'Dashboard'],
    link: null,
  },
]

const CASE_STUDIES = [
  {
    title: 'ParcelIQ',
    problem: 'Parcel research usually jumps between county map viewers, property tables, screenshots, and manual export work.',
    artifact: 'A public Laramie County parcel intelligence product with map search, value symbology, draw/query workflows, aerial context, and CSV/GeoJSON export paths.',
    proof: '46,000+ public parcel records indexed; live production smoke confirms JSON /bbox works while anonymous exports stay Pro-gated.',
    status: 'Live product proof',
    tags: ['GIS', 'Parcel Data', 'Cloudflare'],
    link: 'https://parcel-iq.org',
    linkLabel: 'View live site',
  },
  {
    title: 'Git-Map',
    problem: 'ArcGIS web maps need reviewable history, branching, rollback, and safer trial workflows than the platform exposes by default.',
    artifact: 'A Git-like CLI for ArcGIS web maps with clone, pull, commit, branch, and merge workflows documented for first-user trials on disposable maps.',
    proof: 'Current feature branch carries 786 passing tests plus strict docs-build coverage for the onboarding and trust path.',
    status: 'First-user proof',
    tags: ['ArcGIS', 'CLI', 'Version Control'],
    link: 'https://github.com/14-TR/Git-Map',
    linkLabel: 'View repo',
  },
  {
    title: 'ProjectIQ / OpenClaw',
    problem: 'AI-assisted GIS and product work stalls when decisions, handoffs, blockers, and verification evidence live only in chat.',
    artifact: 'A local-first operations layer for agent-assisted project work: durable issues, memory, decision history, run evidence, dashboards, and native tools.',
    proof: 'ProjectIQ native now has 119 tools and 1,149+ tests; dashboard and smoke gates verify the local work surface.',
    status: 'AI ops proof',
    tags: ['AI Ops', 'SQLite', 'React'],
    link: 'https://github.com/14-TR/Know-Flow',
    linkLabel: 'View repo',
  },
  {
    title: 'Open World Model',
    problem: 'GeoAI systems need benchmarkable answers with source provenance, trust precedence, and visible uncertainty before anyone can rely on them.',
    artifact: 'A local geospatial reasoning benchmark that replays Denver-area cases, scores provenance completeness, and tests conflict handling across trusted and lower-trust sources.',
    proof: '25-case fixture plus BENCH-026 trust-precedence conflict coverage now validate source ranking, replay gates, and public-safe benchmark evidence.',
    status: 'GeoAI benchmark proof',
    tags: ['GeoAI', 'Benchmarks', 'Provenance'],
    link: null,
    linkLabel: 'Content checklist',
  },
]

const STACK_GROUPS = [
  {
    title: 'GIS and Spatial Data',
    outcome: 'Map products, ArcGIS workflows, parcel intelligence, and reproducible GeoAI inputs.',
    tools: ['ArcGIS Pro', 'ArcGIS Online', 'MapLibre', 'Mapbox', 'USGS 3DEP', 'GeoJSON', 'PostGIS'],
  },
  {
    title: 'AI and Agent Operations',
    outcome: 'Local-first agents with durable tasks, memory, verification evidence, and human review gates.',
    tools: ['OpenClaw', 'ProjectIQ', 'Issue boards', 'Ollama', 'LLM pipelines', 'SQLite', 'Discord workflows'],
  },
  {
    title: 'Product Interfaces',
    outcome: 'Fast proof surfaces for maps, dashboards, mobile tools, and 3D spatial experiences.',
    tools: ['React', 'Vite', 'React Native', 'SwiftUI', 'Three.js', 'Metal', 'Canvas'],
  },
  {
    title: 'Backend and Deployment',
    outcome: 'Small services and reliable release paths for APIs, data jobs, static sites, and gated exports.',
    tools: ['Python', 'Node.js', 'FastAPI', 'Cloudflare Workers', 'D1', 'GitHub Actions', 'GitHub Pages'],
  },
  {
    title: 'Automation and Media Systems',
    outcome: 'Repeatable pipelines for research digests, readiness checks, generated video, and operations reports.',
    tools: ['Remotion', 'ffmpeg', 'Cron', 'GitHub CLI', 'Playwright', 'shell automation'],
  },
]

const ENGAGEMENT_PATHS = [
  {
    title: 'Workflow Audit',
    fit: 'For teams losing time to repeated ArcGIS, parcel, reporting, or handoff steps.',
    firstProof: 'Map the current process, identify the highest-friction step, and produce a small automation or decision-support proof.',
    outcome: 'A scoped build path with evidence, risks, and the next decision clearly separated.',
  },
  {
    title: 'GIS Product Proof',
    fit: 'For founders or operators turning spatial data into a product, dashboard, or customer-facing tool.',
    firstProof: 'Ship a narrow local or private prototype that proves the data path, user task, and verification gate.',
    outcome: 'A demo surface that can be inspected before public launch, paid plans, or production hardening.',
  },
  {
    title: 'Agent Ops Setup',
    fit: 'For technical teams experimenting with AI agents but missing durable tasks, memory, blockers, and review gates.',
    firstProof: 'Create an operating loop where agents leave issues, artifacts, test evidence, and human review points behind.',
    outcome: 'A controlled system that improves throughput without hiding decisions inside chat transcripts.',
  },
]

const PROOF_POINTS = [
  {
    value: '46K+',
    label: 'public parcel records mapped into a live search product',
  },
  {
    value: '786',
    label: 'passing Git-Map tests around ArcGIS version-control workflows',
  },
  {
    value: '119',
    label: 'AI operations tools backing durable project work',
  },
]

const CONTACT_PROMPTS = [
  'The workflow, decision, or handoff that is costing time now',
  'Current maps, data sources, tools, users, and constraints',
  'What a credible first proof should answer in 2-4 weeks',
]

const CONTACT_BRIEF_MAILTO = 'mailto:tr@ingramgeoai.com?subject=GIS%20/%20AI%20workflow%20brief&body=What%20workflow%20or%20decision%20needs%20to%20improve%3F%0A%0AWhat%20maps%2C%20data%20sources%2C%20tools%2C%20or%20users%20are%20involved%3F%0A%0AWhat%20would%20a%20credible%20first%20proof%20need%20to%20show%20in%202-4%20weeks%3F%0A%0ARelevant%20links%20or%20context%3A'

const CONTACT_CALL_MAILTO = 'mailto:tr@ingramgeoai.com?subject=Consult%20call%20-%20GIS%20/%20AI%20workflow&body=I%27d%20like%20to%20talk%20about%20a%20GIS%20/%20AI%20workflow%20or%20product%20proof.%0A%0ABest%20times%3A%0A%0ATeam%20/%20organization%3A%0A%0AUseful%20context%20before%20the%20call%3A'

const FOOTER_LINKS = [
  { label: 'GitHub', href: 'https://github.com/14-TR', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/tr-ingram', external: true },
  { label: 'Email', href: 'mailto:tr@ingramgeoai.com' },
]

export default function App() {
  const [articles, setArticles] = useState([])
  const [articlesStatus, setArticlesStatus] = useState('loading')
  const [activeArticle, setActiveArticle] = useState(null)
  const currentYear = new Date().getFullYear()

  const scrollToCurrentHash = useCallback(() => {
    const hash = window.location.hash.slice(1)

    if (!hash) return

    let targetId = hash

    try {
      targetId = decodeURIComponent(hash)
    } catch {
      targetId = hash
    }

    document.getElementById(targetId)?.scrollIntoView({ block: 'start' })
  }, [])

  useEffect(() => {
    fetch('/articles.json')
      .then(r => r.json())
      .then((data) => {
        const nextArticles = Array.isArray(data) ? data : []
        setArticles(nextArticles)
        setArticlesStatus(nextArticles.length > 0 ? 'ready' : 'empty')
      })
      .catch(() => {
        setArticles([])
        setArticlesStatus('error')
      })
  }, [])

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    let frameId
    let timerId

    window.history.scrollRestoration = 'manual'

    const settleHashScroll = () => {
      window.clearTimeout(timerId)
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(scrollToCurrentHash)
      timerId = window.setTimeout(scrollToCurrentHash, 250)
    }

    settleHashScroll()
    window.addEventListener('hashchange', settleHashScroll)
    window.addEventListener('load', settleHashScroll)

    return () => {
      window.history.scrollRestoration = previousScrollRestoration
      window.clearTimeout(timerId)
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('hashchange', settleHashScroll)
      window.removeEventListener('load', settleHashScroll)
    }
  }, [scrollToCurrentHash])

  useEffect(() => {
    if (articlesStatus !== 'loading') {
      window.setTimeout(scrollToCurrentHash, 0)
    }
  }, [articlesStatus, scrollToCurrentHash])

  return (
    <div className="app">
      <a className="skip-link" href="#content">Skip to main content</a>
      {/* ── CODE GRAPH AMBIENT BACKGROUND ── */}
      <Suspense fallback={null}>
        <CodeGraphBg />
      </Suspense>
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
            GIS / GEOAI PRODUCT SYSTEMS
          </div>

          <h1 className="hero-name">TR INGRAM</h1>
          <p className="hero-sub">
            GIS systems builder for maps, data products, and agent-assisted operations
          </p>
          <p className="hero-tagline">
            I turn messy geospatial workflows into working software: parcel intelligence, ArcGIS automation, GeoAI prototypes, and team-facing tools with proof you can inspect.
          </p>

          <div className="hero-ctas">
            <a href="#projects" className="btn btn-primary">SEE SHIPPED PROOF</a>
            <a href="#contact" className="btn btn-outline">START A GIS / AI CONSULT</a>
          </div>

          <div className="hero-audience" aria-label="Primary audience and offer">
            <span>ArcGIS workflow automation</span>
            <span>parcel and map products</span>
            <span>GeoAI proof builds</span>
          </div>

          <div className="hero-coords">
            <span>41.1400° N · 104.8197° W</span>
            <span className="divider">|</span>
            <span>Wyoming-based · building from field GIS to product launch</span>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span>PROOF BELOW</span>
          <div className="scroll-line" />
        </div>
      </section>

      <main id="content">
        {/* ── PROJECTS ── */}
        <section className="section" id="projects">
          <div className="container">
            <div className="section-label">// PROOF</div>
            <h2 className="section-title">Case Studies</h2>
            <p className="section-sub">
              Evidence-led snapshots of shipped GIS products, ArcGIS workflow tools, GeoAI benchmarks, and the operating systems behind them.
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

        {/* ── ENGAGEMENT PATHS ── */}
        <section className="section section-engagement" id="engagement">
          <div className="container">
            <div className="section-label">// ENGAGEMENT PATHS</div>
            <h2 className="section-title">Where the work usually starts</h2>
            <p className="section-sub engagement-sub">
              Three practical entry points for GIS / AI work: diagnose the workflow, prove the product surface, or make agent-assisted execution reviewable.
            </p>

            <div className="engagement-grid">
              {ENGAGEMENT_PATHS.map((path) => (
                <article className="engagement-card" key={path.title}>
                  <h3>{path.title}</h3>
                  <dl>
                    <div>
                      <dt>Best fit</dt>
                      <dd>{path.fit}</dd>
                    </div>
                    <div>
                      <dt>First proof</dt>
                      <dd>{path.firstProof}</dd>
                    </div>
                    <div>
                      <dt>Outcome</dt>
                      <dd>{path.outcome}</dd>
                    </div>
                  </dl>
                </article>
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
                Best fit: parcel intelligence, ArcGIS workflow automation, GeoAI proof builds, and team-facing decision-support tools that need to move from messy process to working software.
              </p>
              <div className="contact-actions">
                <a className="btn btn-primary" href={CONTACT_BRIEF_MAILTO}>
                  EMAIL A BRIEF
                </a>
                <a className="btn btn-outline" href={CONTACT_CALL_MAILTO}>
                  BOOK A CALL
                </a>
              </div>
              <div className="contact-intake" aria-label="Lead intake prompts">
                <span className="contact-intake-label">Helpful context</span>
                {CONTACT_PROMPTS.map((prompt) => (
                  <span key={prompt}>{prompt}</span>
                ))}
              </div>
              <p className="contact-note">
                Send the rough context first. I will look for the smallest useful proof: something scoped enough to build, specific enough to verify, and honest about what it does not prove yet.
              </p>
            </div>

            <div className="proof-panel" aria-label="Selected proof metrics">
              <div className="proof-panel-header">
                <span>Selected proof</span>
                <strong>Built systems, not slideware.</strong>
              </div>
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
            <p className="section-sub stack-sub">
              Organized around what the work needs to prove: spatial truth, agent-assisted execution, usable product surfaces, and a release path that can be checked.
            </p>

            <div className="stack-groups">
              {STACK_GROUPS.map((group) => (
                <section className="stack-group" key={group.title}>
                  <div className="stack-group-copy">
                    <h3>{group.title}</h3>
                    <p>{group.outcome}</p>
                  </div>
                  <div className="stack-grid" aria-label={`${group.title} tools`}>
                    {group.tools.map((tool) => (
                      <span key={tool} className="stack-badge">{tool}</span>
                    ))}
                  </div>
                </section>
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
              Field notes from the systems behind the public work: product slices, verification gates, and the operating layer that keeps agent-assisted projects honest.
            </p>

            <div className="articles-grid">
              {articlesStatus === 'loading' && (
                <div className="article-card article-card-static" role="status">
                  <div className="article-date">LOADING</div>
                <h3 className="article-title">Loading current system notes</h3>
                <p className="article-excerpt">
                  Pulling the current article feed for this section.
                </p>
              </div>
            )}
              {(articlesStatus === 'empty' || articlesStatus === 'error') && (
                <div className="article-card article-card-static">
                  <div className="article-date">CONTENT CHECKLIST</div>
                  <h3 className="article-title">Next system-writing queue</h3>
                  <p className="article-excerpt">
                    Publish the next note from shipped proof: TR.dev positioning, Git-Map first-user docs, ParcelIQ production hardening, or ProjectIQ durable-agent operations.
                  </p>
                </div>
              )}
              {articles.map((a) => (
                <ArticleCard key={a.title} {...a} onClick={() => setActiveArticle(a)} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-left">
            <span className="footer-name">TR INGRAM</span>
            <span className="footer-copy">&copy; {currentYear} TR Ingram</span>
          </div>

          <nav className="footer-links" aria-label="Footer links">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="footer-right">
            <span>GIS / GeoAI systems by TR Ingram</span>
          </div>
        </div>
      </footer>

      {activeArticle && (
        <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
      )}
    </div>
  )
}
