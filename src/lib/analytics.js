const ANALYTICS_EVENT_TARGET = 'tr:analytics'

export const CTA_EVENT_NAMES = {
  heroCtaClick: 'hero_cta_click',
  heroRuntimeOptInClick: 'hero_runtime_opt_in_click',
  projectOutboundClick: 'project_outbound_click',
  contactClick: 'contact_click',
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
  if (!hasWindow()) return

  const detail = {
    name,
    props,
    pagePath: window.location.pathname,
    emittedAt: new Date().toISOString(),
  }

  window.dispatchEvent(new CustomEvent(ANALYTICS_EVENT_TARGET, { detail }))

  if (import.meta.env.DEV || getDebugMode()) {
    window.console.info('[analytics]', detail)
  }

  if (isVendorDispatchEnabled() && typeof window.plausible === 'function') {
    window.plausible(name, { props })
  }
}

export function trackCtaClick(name, props) {
  trackSiteEvent(name, { category: 'cta', ...props })
}

export { ANALYTICS_EVENT_TARGET }
