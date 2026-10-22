import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import vm from 'node:vm'

// Run with: node --experimental-vm-modules scripts/verify-analytics-privacy.mjs
// Execute the real module with Vite's import.meta.env supplied by the test host.
const source = await fs.readFile(new URL('../src/lib/analytics.js', import.meta.url), 'utf8')
const privateFields = {
  name: 'PRIVATE_NAME_7a91',
  email: 'PRIVATE_EMAIL_93cb@example.test',
  company: 'PRIVATE_COMPANY_e29f',
  project: 'PRIVATE_PROJECT_b6d8',
  details: 'PRIVATE_MESSAGE_1f04',
}
const privateQuery = 'PRIVATE_QUERY_87aa'
const privateFragment = 'PRIVATE_FRAGMENT_9b16'
const pageUrl = new URL(`https://ingramgeoai.com/?analytics_debug=1&private=${privateQuery}#${privateFragment}`)
const composeUrl = new URL('https://mail.google.com/mail/?view=cm&fs=1')
composeUrl.searchParams.set('to', 'tr@ingramgeoai.com')
composeUrl.searchParams.set('body', Object.values(privateFields).join('\n'))
composeUrl.hash = privateFragment

const received = { events: [], logs: [], vendor: [] }
const windowStub = {
  location: pageUrl,
  localStorage: { getItem: () => null },
  __TR_ANALYTICS_ENABLED__: true,
  dispatchEvent: (event) => received.events.push(structuredClone(event.detail)),
  console: { info: (...args) => received.logs.push(structuredClone(args)) },
  plausible: (...args) => received.vendor.push(structuredClone(args)),
}
const context = vm.createContext({
  window: windowStub,
  URLSearchParams,
  CustomEvent: class {
    constructor(type, { detail }) {
      this.type = type
      this.detail = detail
    }
  },
})
const module = new vm.SourceTextModule(source, {
  context,
  initializeImportMeta(meta) {
    meta.env = { DEV: false, VITE_TR_ANALYTICS_ENABLED: 'false' }
  },
})
await module.link(() => { throw new Error('Unexpected analytics module import') })
await module.evaluate()
const { CTA_EVENT_NAMES, trackCtaClick, trackSiteEvent } = module.namespace

const originalHref = composeUrl.toString()
const props = {
  location: 'contact_section',
  target: 'gmail_web',
  interaction: 'webmail_link',
  href: originalHref,
  ...privateFields,
  contactForm: privateFields,
}
trackCtaClick(CTA_EVENT_NAMES.contactClick, props)

const expectedProps = {
  category: 'cta',
  location: 'contact_section',
  target: 'gmail_web',
  interaction: 'webmail_link',
}
assert.equal(received.events.length, 1)
assert.equal(received.logs.length, 1)
assert.equal(received.vendor.length, 1)
assert.deepEqual(received.events[0].props, expectedProps)
assert.deepEqual(received.logs[0][1], received.events[0])
assert.deepEqual(received.vendor[0], [CTA_EVENT_NAMES.contactClick, { props: expectedProps }])
assert.equal(received.events[0].pagePath, '/')
assert.equal(props.href, originalHref, 'Tracking must leave the working compose URL unchanged')
assert.equal(new URL(props.href).searchParams.get('body'), Object.values(privateFields).join('\n'))

// Reject free-form data even when it is accidentally put in a metadata field.
trackSiteEvent(CTA_EVENT_NAMES.contactClick, {
  category: privateFields.name,
  location: privateFields.company,
  target: privateFields.email,
  interaction: privateFields.details,
  href: originalHref,
})
assert.deepEqual(received.events[1].props, {})
trackSiteEvent(privateFields.project, props)
assert.equal(received.events.length, 2, 'Unknown event names must not carry private data')
assert.equal(received.logs.length, 2)
assert.equal(received.vendor.length, 2)

const allTransportPayloads = JSON.stringify(received)
for (const value of [...Object.values(privateFields), privateQuery, privateFragment, originalHref]) {
  assert.ok(!allTransportPayloads.includes(value), `Private value reached telemetry: ${value}`)
  assert.ok(!allTransportPayloads.includes(encodeURIComponent(value)), 'Encoded private value reached telemetry')
}

// The normal opt-out still prevents debug and vendor delivery.
windowStub.__TR_ANALYTICS_ENABLED__ = false
windowStub.location = new URL('https://ingramgeoai.com/')
trackCtaClick(CTA_EVENT_NAMES.heroCtaClick, { location: 'hero', target: 'projects', interaction: 'anchor' })
assert.equal(received.events.length, 3)
assert.equal(received.logs.length, 2)
assert.equal(received.vendor.length, 2)

console.log('Analytics privacy verification passed: all three transports exclude private form data and URLs; compose links remain intact.')
