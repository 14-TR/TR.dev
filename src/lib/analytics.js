const ANALYTICS_EVENT_TARGET = 'tr:analytics'

export const CTA_EVENT_NAMES = {
  heroCtaClick: 'hero_cta_click',
  heroRuntimeOptInClick: 'hero_runtime_opt_in_click',
  projectOutboundClick: 'project_outbound_click',
  contactClick: 'contact_click',
}

const EVENT_NAMES = new Set(Object.values(CTA_EVENT_NAMES))
// Only fixed UI metadata belongs in telemetry. In particular, webmail hrefs
// contain the visitor's contact brief, so URLs and free-form fields are omitted.
const ALLOWED_PROP_VALUES = {
  category: new Set(['cta']),
  location: new Set([
    'hero', 'selected_work', 'offer_fit_section', 'engagement_packages',
    'delivery_loop_section', 'contact_section', 'footer',
  ]),
  target: new Set([
    'projects', 'contact', 'Git-Map', 'ParcelIQ', 'ProjectIQ', 'Barkie',
    'email', 'github', 'linkedin', 'start with an audit', 'scope a proof build',
    'harden a launch surface', 'delivery_loop', 'browser_fallback_prepare',
    'copy_email_brief', 'gmail_web', 'outlook_web',
  ]),
  interaction: new Set([
    'anchor', 'outbound_link', 'mailto', 'form_submit', 'clipboard_copy', 'webmail_link',
  ]),
}

function getSafeProps(props) {
  return Object.fromEntries(
    Object.entries(ALLOWED_PROP_VALUES)
      .filter(([key, allowed]) => allowed.has(props?.[key]))
      .map(([key]) => [key, props[key]])
  )
}

function hasWindow() {
  return typeof window !== 'undefined'
}

function getDebugMode() {
  if (!hasWindow()) return false

  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get('analytics_debug') === '1') return true
    if (window.localStorage.getItem('tr:analytics:debug') === '1') return true
  } catch {
    return false
  }

  return false
}

function isVendorDispatchEnabled() {
  if (!hasWindow()) return false

  return (
    import.meta.env.VITE_TR_ANALYTICS_ENABLED === 'true' ||
    window.__TR_ANALYTICS_ENABLED__ === true
  )
}

export function trackSiteEvent(name, props = {}) {
  if (!hasWindow() || !EVENT_NAMES.has(name)) return

  const safeProps = getSafeProps(props)
  const detail = {
    name,
    props: safeProps,
    pagePath: window.location.pathname,
    emittedAt: new Date().toISOString(),
  }

  window.dispatchEvent(new CustomEvent(ANALYTICS_EVENT_TARGET, { detail }))

  if (import.meta.env.DEV || getDebugMode()) {
    window.console.info('[analytics]', detail)
  }

  if (isVendorDispatchEnabled() && typeof window.plausible === 'function') {
    window.plausible(name, { props: safeProps })
  }
}

export function trackCtaClick(name, props) {
  trackSiteEvent(name, { category: 'cta', ...props })
}

export { ANALYTICS_EVENT_TARGET }
