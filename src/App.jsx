import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import ProjectCard from './components/ProjectCard'
import ArticleCard from './components/ArticleCard'
import ArticleModal from './components/ArticleModal'
import './App.css'

const HeroCanvas = lazy(() => import('./components/HeroCanvas'))
const CodeGraphBg = lazy(() => import('./components/CodeGraphBg'))
const CartographicProductShowcase = lazy(() => import('./components/CartographicProductShowcase'))

const BLOCKED_ARTICLE_TERMS = ['barkie', 'granite', 'narkie']

const CORE_SKILLS = [
  'JavaScript, TypeScript, Python, SQL',
  'React, React Native / Expo, HTML, CSS, responsive UI design',
  'REST APIs, front-end integration patterns, application architecture',
  'Mobile geospatial UX, GPS workflows, Mapbox-based map interfaces, GeoJSON/vector map layers',
  'ArcGIS Maps SDK for JavaScript, ArcGIS API for Python, ArcPy, ArcGIS Enterprise, ArcGIS Online',
  'ArcGIS Pro, Experience Builder, Calcite, Field Maps, Dashboards, StoryMaps',
  'PostgreSQL, PostGIS, enterprise geodatabases, relationship classes, spatial data pipelines',
  'Python automation, ETL, geoprocessing workflows',
  'Git, CI/CD quality gates, peer review, Docker, Linux, cloud-native delivery',
  'Agile delivery, cross-functional collaboration, stakeholder demos',
]

const TECHNICAL_HIGHLIGHTS = [
  {
    title: 'Git-Map',
    problem: 'Version control for ArcGIS web map configurations across ArcGIS Online and Portal.',
    artifact: 'Designed and built a Git-like workflow for clone, branch, diff, merge, and push operations on web maps.',
    proof: 'Added onboarding material, diagnostics, validation checks, and safety rails for first-user trials.',
    status: 'ArcGIS version control',
    tags: ['Python', 'ArcGIS', 'CLI'],
    link: 'https://github.com/14-TR/Git-Map',
    linkLabel: 'View repo',
  },
  {
    title: 'ParcelIQ',
    problem: 'Interactive parcel search, mapping, filtering, export checks, and legal-description spatial review.',
    artifact: 'Architected a parcel-focused web application with ArcGIS mapping, Python data pipelines, Cloudflare Workers, D1, and R2.',
    proof: 'Built parcel detail views, export authorization paths, browser smoke coverage, and spatial validation workflows.',
    status: 'Parcel web application',
    tags: ['ArcGIS SDK', 'Cloudflare', 'Python'],
    link: 'https://parcel-iq.org',
    linkLabel: 'View live site',
  },
  {
    title: 'ProjectIQ',
    problem: 'Graph-aware project tracking for work that needs clearer context, state, and decision support.',
    artifact: 'Built a React and TypeScript dashboard with graph exploration, tracker views, brief generation, and command-center UI patterns.',
    proof: 'Improved routing, dashboard flows, data views, and demo reliability for product iteration.',
    status: 'React / TypeScript dashboard',
    tags: ['React', 'TypeScript', 'Graphs'],
    link: null,
    linkLabel: 'Private project',
  },
  {
    title: 'Barkie',
    problem: 'Front-end geospatial engineering for an App Store-shipped golf GPS product.',
    artifact: 'Work across React Native / Expo, mobile map UX, course maps, tee and hole workflows, GPS interactions, and Mapbox-based rendering.',
    proof: 'Public details are intentionally high-level because the work is client-confidential.',
    status: 'Current contract role',
    tags: ['React Native', 'Expo', 'Mapbox'],
    link: 'https://apps.apple.com/us/app/barkie-ai-golf-caddie/id6754779305',
    linkLabel: 'View App Store',
  },
]

const EXPERIENCE = [
  {
    role: 'GIS Analyst Programmer',
    org: 'Cheyenne Board of Public Utilities',
    place: 'Cheyenne, WY',
    dates: 'Oct 2022 - Present',
    bullets: [
      'Design and deliver end-to-end spatial solutions across the Esri stack, including web applications, dashboards, enterprise data pipelines, and field workflows.',
      'Build user-facing applications that turn complex infrastructure and geospatial data into clear workflows for inspection, asset management, and operational decision-making.',
      'Build PostgreSQL-backed enterprise geodatabases in ArcGIS Pro, including feature classes, domains, subtypes, relationship classes, permissions, attachments, and versioning workflows.',
      'Build Experience Builder applications and custom widget workflows with map selection, REST attachment queries, related-record display, embedded images, and modal UI behavior.',
      'Develop PostgreSQL/PostGIS-backed data workflows and Python automation that reduce manual GIS effort and improve repeatability.',
    ],
  },
  {
    role: 'Front-End / Geospatial Mobile Engineer',
    org: 'Barkie',
    place: 'Remote',
    dates: 'Mar 2026 - Present',
    bullets: [
      'Serve as a front-end and geospatial mobile engineering contributor for an App Store-shipped React Native / Expo golf GPS application.',
      'Support mobile-first map controls, course map workflows, GPS interactions, and Mapbox-based rendering patterns.',
      'Shape frontend requirements for elevation, slope, wind, and plays-like surfaces.',
      'Keep public descriptions high-level for client confidentiality.',
    ],
  },
  {
    role: 'Team Lead, NASA DEVELOP National Program',
    org: 'NASA / USGS EROS Center',
    place: '',
    dates: 'May 2022 - Oct 2022',
    bullets: [
      'Led a 4-person interdisciplinary team using Earth observation and geospatial analysis to answer a real-world decision support problem for partner stakeholders.',
      'Coordinated scope, deliverables, and technical execution while presenting findings and recommendations to scientists and agency partners.',
      'Contributed to research outputs that resulted in NASA publication.',
    ],
  },
  {
    role: 'Research Assistant',
    org: 'University of Colorado Colorado Springs',
    place: '',
    dates: 'Aug 2020 - May 2022',
    bullets: [
      'Built spatial analysis workflows for conflict and violence datasets, surfacing patterns across geography, time, and incident type.',
      'Managed geospatial data pipelines that connected research questions to usable maps, summaries, and decision-oriented outputs.',
      'Supported long-term application development for natural-language spatial analysis of conflict and remote sensing data.',
    ],
  },
  {
    role: 'USGS Wildland Firefighter',
    org: 'Flathead Hotshots',
    place: '',
    dates: 'May 2020 - Aug 2020',
    bullets: [
      'Served on a federal wildland fire crew supporting field operations in high-risk, rapidly changing environments.',
      'Built operational discipline around situational awareness, communication, safety procedures, and coordinated team execution.',
    ],
  },
  {
    role: 'Crew Chief, KC-135 / KC-46',
    org: 'United States Air Force',
    place: '',
    dates: 'May 2014 - May 2020',
    bullets: [
      'Led junior personnel through complex maintenance and operational workflows under time-sensitive conditions.',
      'Followed strict technical procedures, documentation standards, inspection workflows, and safety controls in mission-critical aviation environments.',
    ],
  },
]

const EDUCATION = [
  {
    degree: 'Master of Science, Geographic Information Science and Technology',
    school: 'University of Wyoming',
    dates: 'Jan 2024 - May 2025',
  },
  {
    degree: 'Bachelor of Arts, Geography and Environmental Studies',
    school: 'University of Colorado',
    dates: '',
  },
  {
    degree: 'Undergraduate Certificate, Geographic Information Science',
    school: 'University of Colorado',
    dates: '',
  },
]

const TECHNICAL_ENVIRONMENT = [
  'JavaScript',
  'TypeScript',
  'Python',
  'SQL',
  'React',
  'React Native',
  'Expo',
  'REST APIs',
  'Mapbox',
  '@rnmapbox/maps',
  'GeoJSON',
  'Turf',
  'Zustand',
  'PostgreSQL',
  'PostGIS',
  'Enterprise geodatabases',
  'ArcGIS Maps SDK',
  'ArcGIS API for Python',
  'ArcGIS Enterprise',
  'ArcGIS Online',
  'ArcGIS Pro',
  'Experience Builder',
  'Calcite',
  'Dashboards',
  'StoryMaps',
  'Field Maps',
  'Docker',
  'Linux',
  'Git',
  'CI/CD',
  'Cloud-native infrastructure',
  'Spatial analytics',
]

const FOOTER_LINKS = [
  { label: 'GitHub', href: 'https://github.com/14-TR', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/tr-ingram', external: true },
  { label: 'Email', href: 'mailto:tr@ingramgeoai.com' },
]

function articleMentionsBlockedSubject(article) {
  const haystack = [
    article.title,
    article.excerpt,
    article.content,
    ...(article.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return BLOCKED_ARTICLE_TERMS.some((term) => haystack.includes(term))
}

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
      .then((r) => r.json())
      .then((data) => {
        const safeArticles = Array.isArray(data)
          ? data.filter((article) => !articleMentionsBlockedSubject(article))
          : []

        setArticles(safeArticles)
        setArticlesStatus(safeArticles.length > 0 ? 'ready' : 'empty')
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

      <Suspense fallback={null}>
        <CodeGraphBg />
      </Suspense>

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
            SOFTWARE ENGINEER / GIS PROFESSIONAL
          </div>

          <h1 className="hero-name">TR INGRAM</h1>
          <p className="hero-sub">
            Software engineer and GIS professional building spatial applications, responsive interfaces, and ArcGIS workflows
          </p>
          <p className="hero-tagline">
            I design and deliver geospatial software across web, mobile, data, and automation: ArcGIS applications, parcel tools, GPS map workflows, graph-based dashboards, and Python data pipelines.
          </p>

          <div className="hero-ctas">
            <a href="#projects" className="btn btn-primary">VIEW SELECTED HIGHLIGHTS</a>
            <a href="#experience" className="btn btn-outline">SEE EXPERIENCE</a>
          </div>

          <div className="hero-audience" aria-label="Primary technical focus">
            <span>ArcGIS solution delivery</span>
            <span>front-end geospatial UI</span>
            <span>mobile GPS workflows</span>
            <span>spatial data pipelines</span>
          </div>

          <div className="hero-coords">
            <span>Cheyenne, WY</span>
            <span className="divider">|</span>
            <span>GitHub: 14-TR</span>
            <span className="divider">|</span>
            <span>ingramgeoai.com</span>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span>WORK BELOW</span>
          <div className="scroll-line" />
        </div>
      </section>

      <main id="content">
        <section className="section section-resume-summary" id="summary">
          <div className="container resume-summary-panel">
            <div>
              <div className="section-label">// PROFESSIONAL SUMMARY</div>
              <h2 className="section-title">Spatial software from field workflows to decision support.</h2>
            </div>
            <p>
              I work across JavaScript, TypeScript, Python, React, SQL, REST integration, and the Esri stack, with a front-end focus on clarity, performance, and maintainability. My work spans production and prototype systems for infrastructure data, parcel mapping, mobile GPS experiences, graph dashboards, and spatial decision support.
            </p>
          </div>
        </section>

        <section className="section section-dark" id="skills">
          <div className="container">
            <div className="section-label">// CORE SKILLS</div>
            <h2 className="section-title">Core skills</h2>
            <div className="resume-skill-list" aria-label="Core skills">
              {CORE_SKILLS.map((skill) => (
                <div className="resume-skill-item" key={skill}>{skill}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="projects">
          <div className="container">
            <div className="section-label">// SELECTED TECHNICAL HIGHLIGHTS</div>
            <h2 className="section-title">Selected work</h2>
            <p className="section-sub">
              A focused look at public and client-safe work across ArcGIS workflows, parcel applications, graph-aware dashboards, and mobile geospatial engineering.
            </p>

            <div className="case-grid">
              {TECHNICAL_HIGHLIGHTS.map((project) => (
                <ProjectCard key={project.title} variant="case" {...project} />
              ))}
            </div>
          </div>
        </section>

        <Suspense fallback={null}>
          <CartographicProductShowcase />
        </Suspense>

        <section className="section section-experience" id="experience">
          <div className="container">
            <div className="section-label">// PROFESSIONAL EXPERIENCE</div>
            <h2 className="section-title">Experience</h2>
            <div className="experience-timeline">
              {EXPERIENCE.map((item) => (
                <article className="experience-item" key={`${item.role}-${item.org}`}>
                  <div className="experience-kicker">{item.dates}</div>
                  <div className="experience-body">
                    <h3>{item.role}</h3>
                    <p className="experience-org">
                      {item.org}{item.place ? ` | ${item.place}` : ''}
                    </p>
                    <ul className="experience-bullets">
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="education">
          <div className="container education-layout">
            <div>
              <div className="section-label">// EDUCATION</div>
              <h2 className="section-title">Education</h2>
              <div className="education-grid">
                {EDUCATION.map((item) => (
                  <article className="education-card" key={item.degree}>
                    <h3>{item.degree}</h3>
                    <p>{item.school}</p>
                    {item.dates && <span>{item.dates}</span>}
                  </article>
                ))}
              </div>
            </div>

            <div>
              <div className="section-label">// TECHNICAL ENVIRONMENT</div>
              <h2 className="section-title">Tools and platforms</h2>
              <div className="tech-cloud" aria-label="Technical environment">
                {TECHNICAL_ENVIRONMENT.map((tool) => (
                  <span className="stack-badge" key={tool}>{tool}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="articles">
          <div className="container">
            <div className="section-label">// ARTICLES</div>
            <h2 className="section-title">Writing</h2>
            <p className="section-sub">
              Notes on public GIS projects, software delivery, spatial interfaces, and the engineering habits behind reliable geospatial tools.
            </p>

            <div className="articles-grid">
              {articlesStatus === 'loading' && (
                <div className="article-card article-card-static" role="status">
                  <div className="article-date">LOADING</div>
                  <h3 className="article-title">Loading current public notes</h3>
                  <p className="article-excerpt">
                    Pulling the current article feed for this section.
                  </p>
                </div>
              )}
              {(articlesStatus === 'empty' || articlesStatus === 'error') && (
                <div className="article-card article-card-static">
                  <div className="article-date">PUBLIC NOTES</div>
                  <h3 className="article-title">No public article feed available</h3>
                  <p className="article-excerpt">
                    Future notes should stay limited to public GIS, ArcGIS, parcel, and engineering process topics.
                  </p>
                </div>
              )}
              {articles.map((article) => (
                <ArticleCard key={article.title} {...article} onClick={() => setActiveArticle(article)} />
              ))}
            </div>
          </div>
        </section>

        <section className="section section-contact" id="contact">
          <div className="container contact-simple">
            <div>
              <div className="section-label">// CONTACT</div>
              <h2 className="section-title">TR Ingram</h2>
              <p className="section-sub contact-sub">
                Cheyenne, WY based software engineer and GIS professional focused on spatial applications, responsive interfaces, automation workflows, and ArcGIS-based solution delivery.
              </p>
            </div>
            <div className="contact-link-list">
              <a className="btn btn-primary" href="mailto:tr@ingramgeoai.com">EMAIL</a>
              <a className="btn btn-outline" href="https://github.com/14-TR" target="_blank" rel="noreferrer">GITHUB</a>
              <a className="btn btn-outline" href="https://linkedin.com/in/tr-ingram" target="_blank" rel="noreferrer">LINKEDIN</a>
            </div>
          </div>
        </section>
      </main>

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
            <span>Software engineering / GIS / spatial applications</span>
          </div>
        </div>
      </footer>

      {activeArticle && (
        <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
      )}
    </div>
  )
}
