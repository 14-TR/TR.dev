import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, Linkedin, ArrowUpRight, Github, ExternalLink, Star, GitBranch, Database, Workflow, Zap, Globe, Server, Play, X, Calendar } from 'lucide-react'
import './App.css'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
}

function Section({ children, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.section
      ref={ref}
      className={`section ${className}`}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
    >
      {children}
    </motion.section>
  )
}

function VideoModal({ video, onClose }) {
  return (
    <motion.div
      className="video-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="video-modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="video-modal__close" onClick={onClose}>
          <X size={24} />
        </button>
        <video controls autoPlay className="video-modal__video">
          <source src={video} type="video/mp4" />
        </video>
      </div>
    </motion.div>
  )
}

function ProjectCard({ project, index, onPlayVideo }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.article
      ref={ref}
      className={`featured-project featured-project--${index + 1}`}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={scaleIn}
      transition={{ delay: index * 0.15 }}
    >
      <div className="featured-project__gradient"></div>
      <div className="featured-project__content">
        <div className="featured-project__header">
          <div className="featured-project__icon">{project.icon}</div>
          <h3 className="featured-project__title">{project.title}</h3>
          <p className="featured-project__tagline">{project.tagline}</p>
        </div>
        
        <p className="featured-project__description">{project.description}</p>
        
        <div className="featured-project__highlight">
          <span className="featured-project__highlight-label">Highlight:</span>
          <span className="featured-project__highlight-text">{project.highlight}</span>
        </div>
        
        <div className="featured-project__tech">
          {project.tech.map((tech) => (
            <span key={tech} className="tech-badge">{tech}</span>
          ))}
        </div>
        
        <div className="featured-project__links">
          {project.video && (
            <button onClick={() => onPlayVideo(project.video)} className="project-link project-link--video">
              <Play size={16} />
              <span>Watch Demo</span>
            </button>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link project-link--primary">
              <Github size={16} />
              <span>View on GitHub</span>
              <ArrowUpRight size={14} />
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link project-link--primary">
              <ExternalLink size={16} />
              <span>{project.demoLabel || 'Live Site'}</span>
              <ArrowUpRight size={14} />
            </a>
          )}
          {project.booking && (
            <a href={project.booking} target="_blank" rel="noopener noreferrer" className="project-link project-link--booking">
              <Calendar size={16} />
              <span>Book a Call</span>
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

const BASE_URL = import.meta.env.BASE_URL || '/'

function App() {
  const [activeVideo, setActiveVideo] = useState(null)

  const featuredProjects = [
    {
      title: 'ProjectIQ',
      tagline: 'AI-powered project intelligence platform',
      description: 'Comprehensive project management platform enhanced with AI capabilities. Features process workflows, compliance tracking, decision logging, and intelligent task automation. Native OpenClaw skill with 67+ specialized tools.',
      highlight: '170+ tests, 67 tools, React dashboard, process workflows',
      tech: ['TypeScript', 'React', 'Python', 'SQLite', 'OpenClaw'],
      icon: <Database size={24} />,
      video: `${BASE_URL}videos/ProjectIQ.mp4`
    },
    {
      title: 'Know-Flow',
      tagline: 'Interactive context graphs for AI workflows',
      description: 'Visual knowledge management platform that creates interactive context graphs for AI-powered workflows. Features real-time collaboration, SQLite-backed persistence, and intelligent context retrieval for enhanced AI interactions.',
      highlight: 'React + Express + SQLite, visual knowledge management',
      github: 'https://github.com/14-TR/Know-Flow',
      tech: ['React', 'Express', 'SQLite', 'D3.js', 'WebSockets'],
      icon: <Workflow size={24} />,
      video: `${BASE_URL}videos/KnowFlow.mp4`
    },
    {
      title: 'OpenWorker',
      tagline: 'Custom AI Agents on Cloudflare\'s Edge',
      description: 'Multi-agent automation platform deployed on Cloudflare Workers. Autonomous agents that run 24/7 with sub-50ms global latency. Handles shell operations, browser automation, and multi-channel messaging (Slack, WhatsApp, Discord).',
      highlight: 'Edge computing, Zero Trust auth, live at openworker.org',
      demo: 'https://openworker.org',
      demoLabel: 'openworker.org',
      booking: 'https://calendar.app.google/JauXioh8u8J5yLMv9',
      tech: ['Cloudflare Workers', 'R2', 'AI Gateway', 'TypeScript', 'Zero Trust'],
      icon: <Zap size={24} />,
      video: `${BASE_URL}videos/OpenWorker.mp4`
    },
    {
      title: 'Git-Map',
      tagline: 'Git-like version control for ArcGIS web maps',
      description: 'Enterprise-grade version control system for ArcGIS web maps. Provides Git-style branching, merging, and history tracking for map configurations. Includes CLI tools and REST API for seamless integration into GIS workflows.',
      highlight: '540+ tests, Python monorepo, CLI + API',
      github: 'https://github.com/14-TR/Git-Map',
      tech: ['Python', 'ArcGIS API', 'FastAPI', 'PostgreSQL', 'Pytest'],
      icon: <GitBranch size={24} />,
      video: `${BASE_URL}videos/GitMap.mp4`
    },
    {
      title: 'ConflictIQ',
      tagline: 'Natural Language Spatial Analytics Engine',
      description: 'GeoAI system that converts natural-language queries into executable SQL over enterprise PostGIS databases. Enables non-technical users to perform complex spatial analytics through conversation.',
      highlight: 'Production enterprise system, NLQ → SQL → PostGIS',
      tech: ['Python', 'FastAPI', 'PostGIS', 'OpenAI API', 'React'],
      icon: <Globe size={24} />,
      video: `${BASE_URL}videos/ConflictIQ.mp4`
    },
  ]

  const skills = [
    { category: 'AI & ML', items: ['LLM Integration', 'Multi-Agent Orchestration', 'Prompt Engineering', 'OpenAI/Claude APIs'] },
    { category: 'Edge & Cloud', items: ['Cloudflare Workers', 'R2', 'AI Gateway', 'Zero Trust', 'Docker'] },
    { category: 'Languages', items: ['Python', 'TypeScript', 'SQL', 'PostgreSQL/PostGIS'] },
    { category: 'Backend', items: ['FastAPI', 'REST APIs', 'Browser Rendering', 'Serverless'] },
    { category: 'Geospatial', items: ['ArcGIS Enterprise', 'PostGIS', 'Spatial Analytics', 'Web Maps'] },
    { category: 'Frontend', items: ['React', 'Vite', 'D3.js', 'Data Visualization'] },
  ]

  const otherProjects = [
    {
      title: 'ForgeIQ Platform',
      description: 'Modular intelligence architecture for spatial decision systems with AI-powered analytics.',
    },
    {
      title: 'SpendIQ',
      description: 'DSPy-based query intelligence for spatial finance data with agentic interpretation.',
    },
    {
      title: 'NASA DEVELOP',
      description: 'Satellite-informed agricultural technology policy using NDVI and Landsat analysis.',
    },
  ]

  const experience = [
    {
      date: '2024 - Present',
      title: 'AI Engineer & Founder',
      company: 'OpenWorker',
      details: [
        'Architected multi-agent distributed system on Cloudflare\'s edge infrastructure',
        'Built spec-based handoff protocol ensuring deterministic execution',
        'Implemented Zero Trust Access for authentication and secure credential management',
        'Operates via cron triggers, webhooks, and automated channel classification',
      ],
    },
    {
      date: '2022 - Present',
      title: 'Geospatial Developer',
      company: 'Cheyenne Board of Public Utilities',
      details: [
        'Lead development of enterprise data pipelines supporting critical utility infrastructure',
        'Built and optimized PostgreSQL/PostGIS data stores for scalable analytics',
        'Developed executive dashboards and analytic applications using ArcGIS Enterprise',
        'Containerized analytics using Docker for reproducible distributed workflows',
      ],
    },
    {
      date: '2024',
      title: 'AI Systems Architect',
      company: 'ConflictIQ (Enterprise)',
      details: [
        'Built GeoAI system converting natural-language to executable SQL over PostGIS',
        'Designed cloud-native pipelines for large-scale spatiotemporal analysis',
        'Delivered predictive analytics for engineering teams and executive stakeholders',
      ],
    },
    {
      date: '2022',
      title: 'Project Lead',
      company: 'NASA DEVELOP',
      details: [
        'Led NDVI + Landsat analysis for USDA tech adoption',
        'Delivered dashboards and policy recommendations to NASA',
        'Research resulted in NASA publication',
      ],
    },
  ]

  const education = [
    { degree: 'M.S. in Geographic Information Science and Technology', school: 'University of Wyoming' },
    { degree: 'B.A. in Geography', school: 'University of Colorado Colorado Springs' },
  ]

  return (
    <div className="app">
      <header className="header">
        <div className="header__inner">
          <a href="#" className="header__logo">
            <span className="header__logo-text">TR</span>
            <span className="header__logo-dot">.</span>
            <span className="header__logo-text">dev</span>
          </a>
          <nav className="header__nav">
            <a href="#projects" className="header__link">Projects</a>
            <a href="#skills" className="header__link">Skills</a>
            <a href="#experience" className="header__link">Experience</a>
            <a href="https://openworker.org" target="_blank" rel="noopener noreferrer" className="header__link header__link--cta">
              <Zap size={14} />
              OpenWorker
            </a>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <motion.section
            className="hero"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="hero__badge">
              <span className="hero__badge-icon">⚡</span>
              <span>AI Engineer | Distributed Systems & Edge AI</span>
            </div>
            <h1 className="hero__title">
              <span className="hero__title-main">TR Ingram</span>
              <span className="hero__title-gradient">Building AI systems at the edge</span>
            </h1>
            <p className="hero__subtitle">
              5+ years building production systems that integrate machine learning, distributed architectures, 
              and cloud-native infrastructure. Currently shipping AI automation on Cloudflare's edge stack.
            </p>
            <div className="hero__cta">
              <a href="https://openworker.org" target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                <Zap size={16} />
                Visit OpenWorker.org
              </a>
              <a href="https://github.com/14-TR" target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
                <Github size={16} />
                GitHub
              </a>
            </div>
          </motion.section>

          <Section id="projects" className="featured-projects-section">
            <motion.div className="section__header section__header--centered" variants={fadeInUp}>
              <p className="section__title">Featured Work</p>
              <h2 className="section__heading">Flagship Projects</h2>
              <p className="section__description">
                Production systems powering edge AI automation, GIS version control, and spatial analytics
              </p>
            </motion.div>
            <div className="featured-projects">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.title} project={project} index={index} onPlayVideo={setActiveVideo} />
              ))}
            </div>
            
            {activeVideo && (
              <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
            )}
          </Section>

          <Section id="skills">
            <motion.div className="section__header" variants={fadeInUp}>
              <p className="section__title">Core Expertise</p>
              <h2 className="section__heading">Technical Stack</h2>
            </motion.div>
            <div className="skills__grid">
              {skills.map((skill, index) => (
                <motion.div key={skill.category} className="skill" variants={fadeInUp}>
                  <span className="skill__category">{skill.category}</span>
                  <div className="skill__items">
                    {skill.items.map((item) => (
                      <span key={item} className="skill__tag">{item}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>

          <Section id="other-projects">
            <motion.div className="section__header" variants={fadeInUp}>
              <p className="section__title">Additional Work</p>
              <h2 className="section__heading">Other Projects</h2>
            </motion.div>
            <div className="projects__grid">
              {otherProjects.map((project, index) => (
                <motion.article key={project.title} className="project" variants={fadeInUp}>
                  <h3 className="project__title">{project.title}</h3>
                  <p className="project__description">{project.description}</p>
                </motion.article>
              ))}
            </div>
          </Section>

          <Section id="experience">
            <motion.div className="section__header" variants={fadeInUp}>
              <p className="section__title">Experience</p>
              <h2 className="section__heading">Work History</h2>
            </motion.div>
            <div className="experience__list">
              {experience.map((exp, index) => (
                <motion.article key={index} className="experience__item" variants={fadeInUp}>
                  <span className="experience__date">{exp.date}</span>
                  <div className="experience__content">
                    <h3>{exp.title}</h3>
                    <p className="experience__company">{exp.company}</p>
                    <ul className="experience__details">
                      {exp.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              ))}
            </div>
          </Section>

          <Section id="education">
            <motion.div className="section__header" variants={fadeInUp}>
              <p className="section__title">Education</p>
            </motion.div>
            <div className="education__list">
              {education.map((edu, index) => (
                <motion.div key={index} className="education__item" variants={fadeInUp}>
                  <h3>{edu.degree}</h3>
                  <p>{edu.school}</p>
                </motion.div>
              ))}
            </div>
          </Section>

          <Section id="contact">
            <motion.div className="section__header" variants={fadeInUp}>
              <p className="section__title">Contact</p>
              <h2 className="section__heading">Get in Touch</h2>
            </motion.div>
            <motion.div className="contact__links" variants={fadeInUp}>
              <a href="mailto:tr@ingramgeoai.com" className="contact__link">
                <Mail /> tr@ingramgeoai.com
              </a>
              <a href="https://calendar.app.google/JauXioh8u8J5yLMv9" target="_blank" rel="noopener noreferrer" className="contact__link contact__link--booking">
                <Calendar /> Book a Call <ArrowUpRight size={14} />
              </a>
              <a href="https://www.linkedin.com/in/tr-ingram/" target="_blank" rel="noopener noreferrer" className="contact__link">
                <Linkedin /> LinkedIn <ArrowUpRight size={14} />
              </a>
              <a href="https://github.com/14-TR" target="_blank" rel="noopener noreferrer" className="contact__link">
                <Github /> GitHub <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </Section>
        </div>
      </main>

      <footer className="footer">
        <div className="footer__content">
          <p className="footer__text">&copy; {new Date().getFullYear()} TR Ingram. All rights reserved.</p>
          <p className="footer__subtext">Built with React + Vite | <a href="https://openworker.org" target="_blank" rel="noopener noreferrer">openworker.org</a></p>
        </div>
      </footer>
    </div>
  )
}

export default App
