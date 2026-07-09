import fs from 'node:fs'
import path from 'node:path'

const repoRoot = path.resolve(import.meta.dirname, '..')

const heroCtaPattern = /handleHeroCtaClick\('([^']+)'\)/g

const checks = [
  {
    file: 'src/App.jsx',
    snippets: [
      'CTA_EVENT_NAMES.heroCtaClick',
      "handleHeroCtaClick('projects')",
      "handleContactClick('email', 'offer_fit_section', `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(CONTACT_SUBJECT)}`)",
      "handleContactClick('email', 'contact_section', `mailto:${CONTACT_EMAIL}`)",
      "handleContactClick('browser_fallback_prepare', 'contact_section', '#contact-fallback', 'form_submit')",
      "handleContactClick('copy_email_brief', 'contact_section', '#contact-fallback', 'clipboard_copy')",
      "handleContactClick('gmail_web', 'contact_section', gmailComposeHref, 'webmail_link')",
      "handleContactClick('outlook_web', 'contact_section', outlookComposeHref, 'webmail_link')",
      "handleContactClick('github', 'contact_section', 'https://github.com/14-TR')",
      "handleContactClick('linkedin', 'contact_section', 'https://linkedin.com/in/tr-ingram')",
      "handleContactClick(link.label.toLowerCase(), 'footer', link.href)",
      'handleProjectOutboundClick(project)',
    ],
  },
  {
    file: 'src/components/ProjectCard.jsx',
    snippets: ['onClick={onLinkClick}'],
  },
  {
    file: 'src/lib/analytics.js',
    snippets: [
      "heroCtaClick: 'hero_cta_click'",
      "projectOutboundClick: 'project_outbound_click'",
      "contactClick: 'contact_click'",
      "window.dispatchEvent(new CustomEvent(ANALYTICS_EVENT_TARGET, { detail }))",
      "import.meta.env.VITE_TR_ANALYTICS_ENABLED === 'true'",
      "window.__TR_ANALYTICS_ENABLED__ === true",
    ],
  },
]

const failures = []

for (const check of checks) {
  const fullPath = path.join(repoRoot, check.file)
  const source = fs.readFileSync(fullPath, 'utf8')

  for (const snippet of check.snippets) {
    if (!source.includes(snippet)) {
      failures.push(`${check.file} missing snippet: ${snippet}`)
    }
  }

  if (check.file === 'src/App.jsx') {
    const heroTargets = [...source.matchAll(heroCtaPattern)].map((match) => match[1])
    const uniqueHeroTargets = new Set(heroTargets)

    if (!uniqueHeroTargets.has('projects')) {
      failures.push("src/App.jsx missing hero CTA target: projects")
    }

    if (uniqueHeroTargets.size < 2) {
      failures.push('src/App.jsx expected at least two tracked hero CTA targets')
    }
  }
}

if (failures.length > 0) {
  console.error('Analytics baseline verification failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('Analytics baseline verification passed.')
