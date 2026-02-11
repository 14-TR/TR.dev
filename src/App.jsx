import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, Linkedin, ArrowUpRight, Github, ExternalLink, Star, GitBranch, Database, Workflow } from 'lucide-react'
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

function ProjectCard({ project, index }) {
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
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link project-link--primary">
            <Github size={16} />
            <span>View on GitHub</span>
            <ArrowUpRight size={14} />
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link">
              <ExternalLink size={16} />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

function App() {
  const featuredProjects = [
    {
      title: 'Git-Map',
      tagline: 'Git-like version control for ArcGIS web maps',
      description: 'Enterprise-grade version control system for ArcGIS web maps. Provides Git-style branching, merging, and history tracking for map configurations. Includes CLI tools and REST API for seamless integration into GIS workflows.',
      highlight: '540+ tests, Python monorepo, CLI + API',
      github: 'https://github.com/14-TR/Git-Map',
      tech: ['Python', 'ArcGIS API', 'FastAPI', 'PostgreSQL', 'Pytest'],
      icon: <GitBranch size={24} />
    },
    {
      title: 'Know-Flow',
      tagline: 'Interactive context graphs for AI workflows',
      description: 'Visual knowledge management platform that creates interactive context graphs for AI-powered workflows. Features real-time collaboration, SQLite-backed persistence, and intelligent context retrieval for enhanced AI interactions.',
      highlight: 'React + Express + SQLite, visual knowledge management',
      github: 'https://github.com/14-TR/Know-Flow',
      tech: ['React', 'Express', 'SQLite', 'D3.js', 'WebSockets'],
      icon: <Workflow size={24} />
    },
    {
      title: 'ProjectIQ',
      tagline: 'AI-powered project intelligence platform',
      description: 'Comprehensive project management platform enhanced with AI capabilities. Features process workflows, compliance tracking, decision logging, and intelligent task automation. Includes 56+ specialized tools for project operations.',
      highlight: '170+ tests, 56+ tools, process workflows, compliance tracking',
      github: 'https://github.com/14-TR/tr-jig',
      path: 'skills/projectiq/',
      tech: ['TypeScript', 'React', 'Node.js', 'SQLite', 'OpenAI API'],
      icon: <Database size={24} />
    },
  ]

  const skills = [
    { category: 'Geospatial', items: ['ArcGIS Pro', 'ArcGIS Enterprise', 'QGIS', 'Field Maps', 'Experience Builder'] },
    { category: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'ArcPy'] },
    { category: 'Backend', items: ['FastAPI', 'Express', 'PostgreSQL', 'PostGIS', 'SQLite'] },
    { category: 'AI/ML', items: ['GPT-4', 'OpenAI API', 'LangChain', 'Prompt Engineering'] },
    { category: 'Frontend', items: ['React', 'Vite', 'deck.gl', 'D3.js', 'Framer Motion'] },
    { category: 'DevOps', items: ['GitHub Actions', 'AWS', 'Docker', 'Linux', 'Git'] },
  ]

  const otherProjects = [
    {
      title: 'ForgeIQ Platform',
      description: 'Modular intelligence architecture for spatial decision systems with AI-powered analytics.',
    },
    {
      title: 'ConflictIQ',
      description: 'Real-time geospatial natural language query engine with PostGIS integration.',
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
      date: '2022 - Present',
      title: 'GIS Programmer/Analyst',
      company: 'Cheyenne Board of Public Utilities',
      details: [
        'Engineered scalable municipal GIS infrastructure with ArcGIS Enterprise',
        'Automated asset workflows via ArcGIS API for Python',
        'Built Field Maps, Experience Builder apps, and Portal dashboards',
        'Deployed LSLI workflows for regulatory compliance',
      ],
    },
    {
      date: '2024 - Present',
      title: 'Founder & Architect',
      company: 'ForgeIQ (ConflictIQ + SpendIQ)',
      details: [
        'Built ConflictIQ using OpenAI API + PostGIS + FastAPI for spatial NLQ',
        'Developed SpendIQ with DSPy for agentic query interpretation',
        'Deployed full-stack React frontend and AWS cloud backend',
        'Created secure data pipelines and visual analytics',
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
    {
      date: '2020 - 2022',
      title: 'GIS Conflict Researcher',
      company: 'UCCS',
      details: [
        'Modeled radiation/conflict patterns using predictive spatial analysis',
        'Presented findings at GIS in the Rockies conference',
      ],
    },
  ]

  const education = [
    { degree: 'M.S. in Geospatial Information Science and Technology', school: 'University of Wyoming — Expected 2025' },
    { degree: 'B.A. in Geography', school: 'University of Colorado Colorado Springs — 2022' },
    { degree: 'GIS Certificate', school: 'UCCS — 2022' },
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
            <a href="#contact" className="header__link">Contact</a>
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
              <span>Geospatial AI/ML Engineer</span>
            </div>
            <h1 className="hero__title">
              <span className="hero__title-main">TR Ingram</span>
              <span className="hero__title-gradient">Building intelligent systems</span>
            </h1>
            <p className="hero__subtitle">
              Full-stack systems architect specializing in geospatial AI, version control for GIS, 
              and intelligent spatial analytics. Creator of Git-Map, Know-Flow, and ProjectIQ.
            </p>
          </motion.section>

          <Section id="projects" className="featured-projects-section">
            <motion.div className="section__header section__header--centered" variants={fadeInUp}>
              <p className="section__title">Featured Work</p>
              <h2 className="section__heading">Flagship Projects</h2>
              <p className="section__description">
                Production-grade systems powering GIS workflows, AI knowledge management, and project intelligence
              </p>
            </motion.div>
            <div className="featured-projects">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.title} project={project} index={index} />
              ))}
            </div>
          </Section>

          <Section id="skills">
            <motion.div className="section__header" variants={fadeInUp}>
              <p className="section__title">Skills</p>
              <h2 className="section__heading">Core Technical Stack</h2>
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
              <a href="mailto:tyeingram@gmail.com" className="contact__link">
                <Mail /> tyeingram@gmail.com
              </a>
              <a href="tel:2105523320" className="contact__link">
                <Phone /> 210-552-3320
              </a>
              <a href="https://www.linkedin.com/in/tr-ingram/" target="_blank" rel="noopener noreferrer" className="contact__link">
                <Linkedin /> LinkedIn <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </Section>
        </div>
      </main>

      <footer className="footer">
        <div className="footer__content">
          <p className="footer__text">&copy; {new Date().getFullYear()} TR Ingram. All rights reserved.</p>
          <p className="footer__subtext">Built with React + Vite</p>
        </div>
      </footer>
    </div>
  )
}

export default App
