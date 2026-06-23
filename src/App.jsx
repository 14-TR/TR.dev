import { Suspense, lazy, useCallback, useState, useEffect } from 'react'
import ProjectCard from './components/ProjectCard'
import ArticleCard from './components/ArticleCard'
import ArticleModal from './components/ArticleModal'
import './App.css'

const HeroCanvas = lazy(() => import('./components/HeroCanvas'))
const CodeGraphBg = lazy(() => import('./components/CodeGraphBg'))
const CartographicProductShowcase = lazy(() => import('./components/CartographicProductShowcase'))

const NAV_LINKS = [
  { label: 'Work', href: '#projects' },
  { label: 'LiDAR', href: '#cartographic-products-anchor' },
  { label: 'Offers', href: '#starter-packages' },
  { label: 'Writing', href: '#articles' },
]

const HERO_PROOF_POINTS = [
  {
    label: 'Specialty',
    value: 'Geospatial web, mobile, ArcGIS, and GeoAI proof systems',
  },
  {
    label: 'Proof',
    value: 'Parcel products, LiDAR terrain, ArcGIS workflows, agent ops',
  },
  {
    label: 'Stack',
    value: 'React, Python, PostGIS, Mapbox, Esri, Three.js, cloud delivery',
  },
]

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
    description: 'Git-like version control for ArcGIS web maps with clone, pull, commit, branch, and merge workflows. Current proof collects 794 core tests.',
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
    scope: 'Public parcel search, map UX, gated exports, smoke checks',
    impact: '46,000+ public parcel records made inspectable through a live GIS product.',
    link: 'https://parcel-iq.org',
    linkLabel: 'View live site',
    featured: true,
  },
  {
    title: 'Git-Map',
    problem: 'ArcGIS web maps need reviewable history, branching, rollback, and safer trial workflows than the platform exposes by default.',
    artifact: 'A Git-like CLI for ArcGIS web maps with clone, pull, commit, branch, and merge workflows documented for first-user trials on disposable maps.',
    proof: 'Current proof collects 794 core tests plus strict docs-build coverage for the onboarding and trust path.',
    status: 'First-user proof',
    tags: ['ArcGIS', 'CLI', 'Version Control'],
    scope: 'CLI architecture, docs, validation, first-user safety path',
    impact: 'ArcGIS web-map changes get branch, commit, merge, and rollback semantics.',
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
    scope: 'Durable task state, evidence trails, dashboards, native tools',
    impact: 'Agent-assisted project work becomes reviewable after the chat is over.',
    link: 'https://github.com/14-TR/Know-Flow',
    linkLabel: 'View repo',
  },
  {
    title: 'Open World Model',
    problem: 'GeoAI systems need benchmarkable answers with source provenance, trust precedence, and visible uncertainty before anyone can rely on them.',
    artifact: 'A local geospatial reasoning benchmark that replays Denver-area cases, scores provenance completeness, and tests conflict handling across trusted and lower-trust sources.',
    proof: 'Current 26-case replay evidence validates source ranking, replay gates, conflict handling, and public-safe benchmark reporting.',
    status: 'GeoAI benchmark proof',
    tags: ['GeoAI', 'Benchmarks', 'Provenance'],
    scope: 'Source precedence, benchmark replay, conflict handling, trust reporting',
    impact: 'GeoAI answers stay tied to visible provenance before anyone relies on them.',
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

const STARTER_PROOF_PACKAGES = [
  {
    title: 'Parcel / Spatial Data Product Audit',
    audience: 'For operators with spatial data, map viewers, customer questions, or export workflows that need to become a clearer product surface.',
    proof: 'A short product-readiness pass: source inventory, user task, trust gaps, first demo surface, and the one metric that proves whether the idea deserves hardening.',
    decision: 'Ship a focused prototype, pause until data/access is cleaner, or turn the highest-friction step into an automation slice.',
    inquiryLabel: 'Email this audit brief',
    inquirySubject: 'Parcel / spatial data product audit',
  },
  {
    title: 'ArcGIS Workflow Proof',
    audience: 'For GIS teams repeating the same AGOL, Portal, map-update, reporting, or QA handoff steps by hand.',
    proof: 'A narrow local build around one real workflow, with before/after steps, failure modes, and the exact human review gate before production use.',
    decision: 'Automate the step, document a safer manual path, or define the next integration needed for a deployable tool.',
    inquiryLabel: 'Email this workflow brief',
    inquirySubject: 'ArcGIS workflow proof',
  },
  {
    title: 'Agent Ops Review Loop',
    audience: 'For teams trying AI agents but missing durable tasks, blockers, evidence, and review points.',
    proof: 'A lightweight operating loop that turns work into issues, artifacts, verification notes, and approval gates instead of losing decisions in chat.',
    decision: 'Keep the loop private, expand to a project pod, or stop before autonomy adds more risk than leverage.',
    inquiryLabel: 'Email this ops brief',
    inquirySubject: 'Agent ops review loop',
  },
]

const HERO_PROOF_CHOICES = STARTER_PROOF_PACKAGES.map((pkg) => ({
  title: pkg.title,
  summary: pkg.decision,
  inquiryLabel: pkg.inquiryLabel,
  inquirySubject: pkg.inquirySubject,
}))

const PROOF_SPRINT_STEPS = [
  {
    step: '01',
    title: 'Frame the business question',
    detail: 'Name the decision a map, model, automation, or agent loop needs to support, plus the people who will trust or reject it.',
  },
  {
    step: '02',
    title: 'Prove the data path',
    detail: 'Connect the real sources, constraints, and update rhythm before polishing the interface or expanding scope.',
  },
  {
    step: '03',
    title: 'Build the inspection surface',
    detail: 'Ship a narrow page, dashboard, CLI, map, or report that makes the output reviewable by a real operator.',
  },
  {
    step: '04',
    title: 'Leave the launch decision clear',
    detail: 'Separate what is production-ready, what still needs review, and what evidence should be gathered next.',
  },
]

const PROOF_POINTS = [
  {
    value: '46K+',
    label: 'public parcel records mapped into a live search product',
  },
  {
    value: '794+',
    label: 'Git-Map core tests around ArcGIS version-control workflows',
  },
  {
    value: '119',
    label: 'AI operations tools backing durable project work',
  },
]

const FIT_CHECKS = [
  {
    title: 'Good first proof',
    summary: 'A focused GIS / AI build is worth scoping when the decision, operator, and first data path are already visible.',
    items: [
      'A map, dataset, report, or workflow is used often enough that friction compounds',
      'Someone can review a narrow prototype and say what would make it trustworthy',
      'The useful answer is a go / no-go, not a vague exploration deck',
    ],
  },
  {
    title: 'Bring first',
    summary: 'The first message does not need to be polished. It should make the workflow and decision inspectable.',
    items: [
      'Current tools, maps, source systems, or screenshots',
      'The specific handoff, bottleneck, or customer question that keeps repeating',
      'What a credible proof would need to show in the first few weeks',
    ],
  },
  {
    title: 'Not the first move',
    summary: 'Some work should wait until the operating facts are clearer.',
    items: [
      'Public launch, outreach, or monetization before the proof can be checked privately',
      'Sensitive data sharing without a clear review boundary',
      'Broad AI transformation work with no named workflow owner',
    ],
  },
]

const CONTACT_PROMPTS = [
  'The workflow, decision, or handoff that is costing time now',
  'Current maps, data sources, tools, users, and constraints',
  'What a credible first proof should answer in 2-4 weeks',
]

const CONTACT_AREAS = [
  'ArcGIS workflow automation',
  'GIS product or map proof',
  'GeoAI benchmark / decision support',
  'Agent ops and review gates',
]

const CONTACT_NEXT_STEPS = [
  {
    title: 'Rough context first',
    detail: 'Send the workflow, decision, data sources, and any existing screenshots or links.',
  },
  {
    title: 'Proof scope second',
    detail: 'I will look for the smallest build that can prove value without pretending the whole system is solved.',
  },
  {
    title: 'Launch gate last',
    detail: 'You get a clear call on what is ready, what needs review, and what should stay private until hardened.',
  },
]

const ENGAGEMENT_BRIEF = {
  label: 'Typical first proof',
  timeline: 'Usually scoped as a 2-4 week sprint with one decision at the end: build forward, pause, or harden the data/workflow first.',
  bring: [
    'The workflow, customer task, or internal decision that is creating drag',
    'Current tools, maps, datasets, screenshots, or links that show the real operating surface',
    'Any constraints that matter immediately: trust, security, timeline, budget, or review boundaries',
  ],
  receive: [
    'A narrowed proof scope tied to one real decision instead of a vague transformation project',
    'A reviewable artifact such as a map, workflow prototype, report surface, or operating loop',
    'A plain-English handoff that separates what is ready, what is still risky, and what should happen next',
  ],
  outcome: 'You should leave the first proof with a clearer decision, not just a prettier demo.',
}

const FAQ_ITEMS = [
  {
    question: 'What kinds of GIS / GeoAI work fit best here?',
    answer: 'The best fit is work with a named workflow, operator, and decision at stake: ArcGIS automation, parcel or map product proof, GeoAI benchmark work, or team-facing decision support that needs to become inspectable software.',
  },
  {
    question: 'What do you actually deliver in a first proof?',
    answer: 'Usually one narrow artifact with real operating value: a map surface, workflow prototype, report layer, or agent-assisted review loop, plus a handoff that says what is ready, what is still risky, and what should happen next.',
  },
  {
    question: 'What does a 2-4 week proof need to prove?',
    answer: 'It should answer one real decision. That might be whether a spatial data product deserves hardening, whether a repeated GIS workflow should be automated, or whether an AI-assisted process can stay reviewable enough to trust.',
  },
  {
    question: 'What is not the right first move?',
    answer: 'Public launch, broad AI-transformation promises, or outreach before the workflow, data path, and review gate are clear. The useful first move is a scoped proof, not a pretend-finished system.',
  },
]

const CONTACT_BRIEF_MAILTO = 'mailto:tr@ingramgeoai.com?subject=GIS%20/%20AI%20workflow%20brief&body=What%20workflow%20or%20decision%20needs%20to%20improve%3F%0A%0AWhat%20maps%2C%20data%20sources%2C%20tools%2C%20or%20users%20are%20involved%3F%0A%0AWhat%20would%20a%20credible%20first%20proof%20need%20to%20show%20in%202-4%20weeks%3F%0A%0ARelevant%20links%20or%20context%3A'

const CONTACT_CALL_MAILTO = 'mailto:tr@ingramgeoai.com?subject=Consult%20call%20-%20GIS%20/%20AI%20workflow&body=I%27d%20like%20to%20talk%20about%20a%20GIS%20/%20AI%20workflow%20or%20product%20proof.%0A%0ABest%20times%3A%0A%0ATeam%20/%20organization%3A%0A%0AUseful%20context%20before%20the%20call%3A'
const CONTACT_BRIEF_TEMPLATE_PATH = '/gis-ai-workflow-brief-template.md'

const FOOTER_LINKS = [
  { label: 'GitHub', href: 'https://github.com/14-TR', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/tr-ingram', external: true },
  { label: 'Email', href: 'mailto:tr@ingramgeoai.com' },
]

const HASH_SCROLL_REPLAY_DELAYS = [0, 120, 320, 700]
const HASH_SCROLL_OFFSET_PX = 16

function createPackageInquiryMailto(title) {
  const subject = encodeURIComponent(`${title} inquiry`)
  const body = encodeURIComponent(
    `${title}\n\nWorkflow or decision:\n\nCurrent tools, maps, data sources, or users involved:\n\nWhat a credible first proof should answer in 2-4 weeks:\n\nRelevant links or context:\n`
  )

  return `mailto:tr@ingramgeoai.com?subject=${subject}&body=${body}`
}

function DeferredShowcaseSection() {
  const [shouldLoadShowcase, setShouldLoadShowcase] = useState(
    () => typeof window !== 'undefined' && typeof window.IntersectionObserver === 'undefined'
  )

  useEffect(() => {
    if (shouldLoadShowcase || typeof window === 'undefined') return undefined

    const target = document.getElementById('cartographic-products-anchor')
    if (!target || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setShouldLoadShowcase(true)
        observer.disconnect()
      },
      { rootMargin: '240px 0px' }
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [shouldLoadShowcase])

  return (
    <div id="cartographic-products-anchor">
      {shouldLoadShowcase ? (
        <Suspense fallback={null}>
          <CartographicProductShowcase />
        </Suspense>
      ) : (
        <section className="section section-cartographic-preview" aria-labelledby="cartographic-preview-title">
          <div className="container cartographic-preview">
            <div>
              <div className="section-label">// PERFORMANCE-FIRST 3D PREVIEW</div>
              <h2 className="section-title" id="cartographic-preview-title">
                LiDAR terrain demo loads on approach, not on first paint.
              </h2>
              <p className="section-sub cartographic-preview-copy">
                The full 3D surface stays available, but its heavier runtime waits until a visitor actually scrolls toward the showcase. That keeps the trust surface faster for first-time traffic.
              </p>
            </div>
            <div className="cartographic-preview-panel" aria-hidden="true">
              <div className="cartographic-preview-surface" />
              <div className="cartographic-preview-grid" />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default function App() {
  const [articles, setArticles] = useState([])
  const [articlesStatus, setArticlesStatus] = useState('loading')
  const [activeArticle, setActiveArticle] = useState(null)
  const currentYear = new Date().getFullYear()
  const featuredArticle = articles[0] ?? null
  const articleCards = featuredArticle ? articles.slice(1) : articles

  const scrollToCurrentHash = useCallback(() => {
    const hash = window.location.hash.slice(1)

    if (!hash) return false

    let targetId = hash

    try {
      targetId = decodeURIComponent(hash)
    } catch {
      targetId = hash
    }

    const target = document.getElementById(targetId)

    if (!target) return false

    const { documentElement } = document
    const maxScrollTop = Math.max(0, documentElement.scrollHeight - window.innerHeight)
    const nextScrollTop = Math.min(
      Math.max(0, window.scrollY + target.getBoundingClientRect().top - HASH_SCROLL_OFFSET_PX),
      maxScrollTop
    )
    const previousScrollBehavior = documentElement.style.scrollBehavior

    documentElement.style.scrollBehavior = 'auto'
    window.scrollTo({ top: nextScrollTop, behavior: 'auto' })
    window.requestAnimationFrame(() => {
      documentElement.style.scrollBehavior = previousScrollBehavior
    })

    return true
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
    const timers = new Set()
    let frameId

    window.history.scrollRestoration = 'manual'

    // Replay hash landings across early layout shifts so direct deep links stay pinned.
    const settleHashScroll = () => {
      window.cancelAnimationFrame(frameId)
      for (const timerId of timers) {
        window.clearTimeout(timerId)
      }
      timers.clear()

      frameId = window.requestAnimationFrame(() => {
        scrollToCurrentHash()
        for (const delay of HASH_SCROLL_REPLAY_DELAYS) {
          const timerId = window.setTimeout(() => {
            scrollToCurrentHash()
            timers.delete(timerId)
          }, delay)
          timers.add(timerId)
        }
      })
    }

    settleHashScroll()
    window.addEventListener('hashchange', settleHashScroll)
    window.addEventListener('load', settleHashScroll)
    window.addEventListener('resize', settleHashScroll)

    return () => {
      window.history.scrollRestoration = previousScrollRestoration
      window.cancelAnimationFrame(frameId)
      for (const timerId of timers) {
        window.clearTimeout(timerId)
      }
      window.removeEventListener('hashchange', settleHashScroll)
      window.removeEventListener('load', settleHashScroll)
      window.removeEventListener('resize', settleHashScroll)
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

      <header className="site-nav" aria-label="Primary navigation">
        <a className="site-mark" href="#home" aria-label="TR Ingram home">
          <span>TR</span>
          <small>Spatial Software Engineer</small>
        </a>
        <nav className="site-nav-links" aria-label="Site sections">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>
        <a className="site-nav-cta" href="#contact">Contact</a>
      </header>

      <section className="hero" id="home">
        <div className="hero-canvas-wrap">
          <Suspense fallback={<div className="hero-canvas-fallback" aria-hidden="true" />}>
            <HeroCanvas />
          </Suspense>
        </div>

        <div className="hero-grid-overlay" />
        <div className="hero-grain" />

        <div className="hero-content">
          <div className="hero-layout">
            <div className="hero-copy">
              <div className="hero-status">
                <span className="status-dot" />
                PREMIUM SPATIAL SOFTWARE ENGINEER
              </div>

              <h1 className="hero-name">TR INGRAM</h1>
              <p className="hero-sub">
                Geospatial product engineering for maps, terrain, field workflows, and spatial data systems.
              </p>
              <p className="hero-tagline">
                I turn complex geography into production-minded software across React, mobile GPS, ArcGIS, PostGIS, Python automation, GeoAI proof loops, and cloud delivery.
              </p>

              <div className="hero-ctas">
                <a href="#projects" className="btn btn-primary">VIEW CASE STUDIES</a>
                <a href="#contact" className="btn btn-outline">DISCUSS A BUILD</a>
              </div>

              <div className="hero-audience" aria-label="Primary technical focus">
                <span>ArcGIS workflow automation</span>
                <span>parcel and map products</span>
                <span>LiDAR terrain UI</span>
                <span>GeoAI proof builds</span>
              </div>
            </div>

            <aside className="hero-proof-panel" aria-label="Premium spatial software proof points">
              <span className="hero-panel-kicker">Selected signal</span>
              <strong>Spatial systems that are built for operators, analysts, and field teams.</strong>
              <div className="hero-proof-list">
                {HERO_PROOF_POINTS.map((point) => (
                  <div key={point.label}>
                    <span>{point.label}</span>
                    <p>{point.value}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="hero-coords">
            <span>41.1400° N · 104.8197° W</span>
            <span className="divider">|</span>
            <span>Wyoming-based · building from field GIS to product launch</span>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span>WORK BELOW</span>
          <div className="scroll-line" />
        </div>
      </section>

      <main id="content">
        <section className="section section-hero-proof-strip" id="start-here">
          <div className="container">
            <div className="hero-proof-strip">
              <div className="hero-proof-strip-intro">
                <div className="section-label">// START HERE</div>
                <h2 className="section-title">Choose the first proof that matches the decision.</h2>
                <p className="section-sub hero-proof-strip-sub">
                  The best next step is usually one narrow proof package, not a broad discovery call with no operating surface.
                </p>
              </div>

              <div className="hero-proof-strip-grid">
                {HERO_PROOF_CHOICES.map((choice) => (
                  <article className="hero-proof-choice" key={choice.title}>
                    <h3>{choice.title}</h3>
                    <p>{choice.summary}</p>
                    <a
                      className="hero-proof-choice-link"
                      href={createPackageInquiryMailto(choice.inquirySubject)}
                    >
                      {choice.inquiryLabel}
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section className="section" id="projects">
          <div className="container">
            <div className="section-label">// SELECTED CASE STUDIES</div>
            <h2 className="section-title">Spatial products with proof baked in.</h2>
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

        <DeferredShowcaseSection />

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

        {/* ── STARTER PACKAGES ── */}
        <section className="section section-proof-packages" id="starter-packages">
          <div className="container">
            <div className="proof-packages-header">
              <div>
                <div className="section-label">// STARTER PACKAGES</div>
                <h2 className="section-title">Pick the first proof by decision, not by feature list.</h2>
              </div>
              <p className="section-sub proof-packages-sub">
                These are small, reviewable starting points for turning GIS / AI ambiguity into a scoped build decision.
              </p>
            </div>

            <div className="proof-package-grid">
              {STARTER_PROOF_PACKAGES.map((pkg) => (
                <article className="proof-package-card" key={pkg.title}>
                  <h3>{pkg.title}</h3>
                  <dl>
                    <div>
                      <dt>Best for</dt>
                      <dd>{pkg.audience}</dd>
                    </div>
                    <div>
                      <dt>First proof</dt>
                      <dd>{pkg.proof}</dd>
                    </div>
                    <div>
                      <dt>Decision left behind</dt>
                      <dd>{pkg.decision}</dd>
                    </div>
                  </dl>
                  <a
                    className="proof-package-link"
                    href={createPackageInquiryMailto(pkg.inquirySubject)}
                  >
                    {pkg.inquiryLabel}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROOF SPRINT ── */}
        <section className="section section-proof-sprint" id="proof-sprint">
          <div className="container proof-sprint-layout">
            <div className="proof-sprint-copy">
              <div className="section-label">// PROOF SPRINT</div>
              <h2 className="section-title">A useful first build answers one decision.</h2>
              <p className="section-sub">
                The fastest path is a constrained proof with real data, visible tradeoffs, and enough evidence to choose build, pause, or harden.
              </p>
              <a className="btn btn-outline proof-sprint-link" href="#contact">
                SCOPE THE FIRST PROOF
              </a>
            </div>

            <div className="proof-loop" aria-label="Proof sprint shape">
              {PROOF_SPRINT_STEPS.map((item) => (
                <article className="proof-loop-item" key={item.step}>
                  <span className="proof-loop-step">{item.step}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── FIT CHECK ── */}
        <section className="section section-fit-check" id="fit-check">
          <div className="container">
            <div className="fit-check-header">
              <div>
                <div className="section-label">// FIT CHECK</div>
                <h2 className="section-title">Before the first call, make the proof inspectable.</h2>
              </div>
              <p className="section-sub fit-check-sub">
                The best starting point is a small decision-support build with a real reviewer, real constraints, and a clear reason to trust or reject the output.
              </p>
            </div>

            <div className="fit-check-grid">
              {FIT_CHECKS.map((check) => (
                <article className="fit-check-card" key={check.title}>
                  <h3>{check.title}</h3>
                  <p>{check.summary}</p>
                  <ul>
                    {check.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="fit-check-cta">
              <span>Have one of these workflows now?</span>
              <a className="btn btn-outline" href="#contact">SEND THE ROUGH CONTEXT</a>
            </div>
          </div>
        </section>

        <section className="section section-engagement-brief" id="engagement-brief">
          <div className="container engagement-brief-layout">
            <div className="engagement-brief-copy">
              <div className="section-label">// FIRST ENGAGEMENT</div>
              <h2 className="section-title">What the first proof engagement should leave behind</h2>
              <p className="section-sub engagement-brief-sub">
                The goal is not to disappear into discovery. It is to turn rough context into one inspectable proof and one clear next decision.
              </p>
              <div className="engagement-brief-summary">
                <span>{ENGAGEMENT_BRIEF.label}</span>
                <p>{ENGAGEMENT_BRIEF.timeline}</p>
              </div>
              <p className="engagement-brief-outcome">{ENGAGEMENT_BRIEF.outcome}</p>
            </div>

            <div className="engagement-brief-grid">
              <article className="engagement-brief-card">
                <span className="engagement-brief-card-label">Bring first</span>
                <ul>
                  {ENGAGEMENT_BRIEF.bring.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="engagement-brief-card">
                <span className="engagement-brief-card-label">Receive back</span>
                <ul>
                  {ENGAGEMENT_BRIEF.receive.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="section section-faq" id="faq">
          <div className="container faq-layout">
            <div className="faq-copy">
              <div className="section-label">// FAQ</div>
              <h2 className="section-title">Common questions before the first proof</h2>
              <p className="section-sub faq-sub">
                This site is meant to make the engagement model inspectable before anyone commits time to a call, scope, or launch path.
              </p>
            </div>

            <div className="faq-grid">
              {FAQ_ITEMS.map((item) => (
                <article className="faq-card" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
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
                  REQUEST A CALL
                </a>
              </div>
              <div className="contact-template">
                <span className="contact-template-label">Prefer a fill-in template?</span>
                <p>
                  Download the same intake structure as a plain-text brief, fill it in, then email it back with links, screenshots, and the workflow that is actually causing drag.
                </p>
                <a className="contact-template-link" href={CONTACT_BRIEF_TEMPLATE_PATH}>
                  OPEN THE GIS / AI WORKFLOW BRIEF TEMPLATE
                </a>
              </div>
              <div className="contact-next" aria-label="What happens after contact">
                <span className="contact-next-label">What happens next</span>
                <div className="contact-next-grid">
                  {CONTACT_NEXT_STEPS.map((step) => (
                    <article key={step.title}>
                      <h3>{step.title}</h3>
                      <p>{step.detail}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div className="contact-areas" aria-label="Common work areas">
                <span className="contact-areas-label">Common starting points</span>
                <div>
                  {CONTACT_AREAS.map((area) => (
                    <span key={area}>{area}</span>
                  ))}
                </div>
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

            {featuredArticle && (
              <button
                className="featured-article"
                type="button"
                onClick={() => setActiveArticle(featuredArticle)}
                aria-label={`Read latest article: ${featuredArticle.title}`}
              >
                <div className="featured-article-copy">
                  <span className="featured-article-kicker">Latest note</span>
                  <div className="article-date">{featuredArticle.date}</div>
                  <h3 className="featured-article-title">{featuredArticle.title}</h3>
                  <p className="featured-article-excerpt">{featuredArticle.excerpt}</p>
                  <div className="featured-article-tags" aria-label="Latest article tags">
                    {featuredArticle.tags?.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="featured-article-meta" aria-hidden="true">
                  <span className="featured-article-label">Why it matters</span>
                  <p>
                    Growth works better when the launch boundary is visible: real workflow, inspectable artifact, working proof, and a clear next decision.
                  </p>
                  <span className="featured-article-cta">READ THE NOTE</span>
                </div>
              </button>
            )}

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
              {articleCards.map((a) => (
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
