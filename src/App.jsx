import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, Linkedin, ArrowUpRight } from 'lucide-react'
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

function App() {
  const skills = [
    { category: 'Geospatial', items: ['ArcGIS Pro', 'ArcGIS Enterprise', 'QGIS', 'Field Maps', 'Experience Builder'] },
    { category: 'Languages', items: ['Python', 'JavaScript', 'SQL', 'ArcPy', 'GLSL'] },
    { category: 'Backend', items: ['FastAPI', 'PostgreSQL', 'PostGIS', 'DuckDB', 'Elasticsearch'] },
    { category: 'AI/ML', items: ['GPT-4', 'DSPy', 'LangChain', 'Prompt Engineering', 'AI-to-SQL'] },
    { category: 'Frontend', items: ['React', 'deck.gl', 'D3.js', 'Tailwind', 'Chart.js'] },
    { category: 'Cloud', items: ['AWS EC2', 'Lambda', 'S3', 'RDS', 'GitHub Actions'] },
  ]

  const projects = [
    {
      title: 'ForgeIQ Platform',
      description: 'Modular intelligence architecture for spatial decision systems. Full-stack geospatial platform with AI-powered analytics.',
    },
    {
      title: 'ConflictIQ',
      description: 'Real-time geospatial natural language query engine with AI-enhanced querying and PostGIS integration.',
    },
    {
      title: 'SpendIQ',
      description: 'DSPy-based next-generation query intelligence for spatial finance data with agentic interpretation.',
    },
    {
      title: 'NASA DEVELOP',
      description: 'Satellite-informed agricultural technology policy intelligence using NDVI and Landsat analysis.',
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
          <a href="#" className="header__logo">TR.dev</a>
          <nav className="header__nav">
            <a href="#about" className="header__link">About</a>
            <a href="#skills" className="header__link">Skills</a>
            <a href="#projects" className="header__link">Projects</a>
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
            <h1 className="hero__title">TR Ingram</h1>
            <p className="hero__subtitle">
              Geospatial AI/ML Engineer & Full-Stack GIS Systems Architect.
              Building intelligent spatial systems that transform data into decisions.
            </p>
          </motion.section>

          <Section id="about">
            <motion.div className="section__header" variants={fadeInUp}>
              <p className="section__title">About</p>
            </motion.div>
            <motion.p className="about__text" variants={fadeInUp}>
              Full-stack geospatial systems architect specializing in end-to-end GIS solutions,
              scalable cloud deployment, and intelligent spatial analytics. Builder of the ForgeIQ platform,
              including the AI-powered ConflictIQ and SpendIQ modules. Trusted by municipal, federal,
              and research partners for data-driven, secure, and automation-enhanced systems.
            </motion.p>
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

          <Section id="projects">
            <motion.div className="section__header" variants={fadeInUp}>
              <p className="section__title">Projects</p>
              <h2 className="section__heading">Proof of Work</h2>
            </motion.div>
            <div className="projects__grid">
              {projects.map((project, index) => (
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
        <p className="footer__text">&copy; {new Date().getFullYear()} TR Ingram. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
