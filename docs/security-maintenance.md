# Personal site security maintenance

These configuration templates are prepared for the static personal site at
`ingramgeoai.com`. Saving or merging them does not configure Cloudflare. They
must be applied separately by an operator with access to that zone. No zone IDs,
credentials, or executable deployment commands are included.

Scope: fix HTTPS for `www.ingramgeoai.com`, redirect it to the canonical HTTPS
apex, and add initial response security headers to the HTTPS apex only. Other
subdomains and applications are outside this change.

## Before applying

1. Save the current `www` DNS record, active certificate coverage, and the
   existing redirect and response-header rulesets, including rule order and IDs.
2. Confirm the active Cloudflare edge certificate covers both
   `ingramgeoai.com` and `www.ingramgeoai.com` (a wildcard covering the latter is
   sufficient). Confirm the apex serves the expected site over valid HTTPS.
3. Check existing rules for conflicting redirects or later header overrides.
   Keep every unrelated rule and setting. Do not change zone-wide TLS, HSTS,
   or HTTPS settings as part of this runbook.

Each JSON file contains **one rule**, not a whole ruleset. Append the templates
individually to the appropriate existing phase entrypoint rulesets. Never replace
entrypoints wholesale with these files. If a rule with the same `ref` already
exists, update that rule rather than creating a duplicate. If the phase entrypoint
does not exist, create it with `kind: "zone"` and its specified phase, then add
the rule. Inspect rule order before deploying so an earlier redirect does not
shadow the new one and a later transform does not overwrite the headers.

Cloudflare documents the [Redirect Rules API][redirect-api] and
[Response Header Transform Rules API][headers-api].

## Fix the www certificate path and redirect

Keep the existing `www` CNAME target, `14-tr.github.io`, and change its proxy
status to **Proxied** (orange cloud). The target should be checked against current
DNS before editing; do not create a duplicate record. Routing through Cloudflare
lets the browser use its edge certificate. The edge redirect then avoids relying
on the current GitHub Pages certificate for `www`.

Create the rule from
[`www-redirect-rule.json`](../ops/cloudflare/www-redirect-rule.json) in phase
`http_request_dynamic_redirect`. Create the redirect before enabling the proxy,
then validate the pair together. It matches only `www.ingramgeoai.com`, accepts
HTTP or HTTPS, and preserves the request path and query string.

Dashboard equivalent: **Rules → Create rule → Redirect Rule**, choose a custom
filter expression, and enter:

```text
(http.host eq "www.ingramgeoai.com")
```

Use a **Dynamic** target:

```text
concat("https://ingramgeoai.com", http.request.uri.path)
```

Set status **301** and enable **Preserve query string**. For an initial trial,
use 302 until the checks below pass, then change that same rule to the final 301
in the template. Permanent redirects can remain cached by clients after a rule
changes. [Cloudflare's redirect settings][redirect-settings] explain these
options; redirects require a [proxied DNS record][redirect-api].

## Add initial security headers

Create the rule from
[`security-headers-rule.json`](../ops/cloudflare/security-headers-rule.json) in
phase `http_response_headers_transform`.

Dashboard equivalent: **Rules → Create rule → Response Header Transform Rule**.
Use the custom expression below, then choose **Set static** for each header in
the table. The match limits the change to HTTPS responses from the apex.

```text
(http.host eq "ingramgeoai.com" and ssl)
```

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | `base-uri 'self'; object-src 'none'; frame-ancestors 'none'` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Strict-Transport-Security` | `max-age=86400` |

This CSP is an initial, limited policy: it blocks framing of the personal site,
foreign base URLs, and plugin objects. It does not restrict scripts, styles,
workers, images, or network destinations, and should not be described as a full
XSS prevention policy. A stricter resource policy requires an inventory and
browser validation of the existing graphics, fonts, analytics, and
Cloudflare-injected scripts. The framing restriction must be an HTTP response
header; `frame-ancestors` does not work in an HTML meta tag. See
[MDN's directive reference][frame-ancestors].

HSTS initially lasts one day. Do not add `includeSubDomains` or `preload`; those
would extend the commitment beyond the scope of this repair. Increase the
duration only after stable HTTPS operation is verified. The hostname-scoped
Transform Rule avoids changing unrelated hosts. Cloudflare supports scoped HSTS
through a [Response Header Transform Rule][hsts].

Use **Set static**, not **Add static**, to avoid accidentally duplicating
headers. Preserve stronger existing policies if current inspection finds any;
the templates assume the reported headers are absent. See the
[dashboard instructions][headers-dashboard] and [parameter reference][headers-parameters].

## Validate the deployed configuration

Use real GET requests and normal certificate verification; do not pass `-k` or
`--insecure`. After DNS propagation, check both schemes without following the
first redirect:

```sh
curl --silent --show-error --dump-header - --output /dev/null 'http://www.ingramgeoai.com/articles.json?check=1'
curl --silent --show-error --dump-header - --output /dev/null 'https://www.ingramgeoai.com/articles.json?check=1'
```

Both must return the configured redirect status and exactly:

```text
Location: https://ingramgeoai.com/articles.json?check=1
```

The HTTPS request must succeed without a certificate error. Verify the complete
chain and apex headers:

```sh
curl --fail --silent --show-error --location --max-redirs 5 --dump-header - --output /dev/null 'https://www.ingramgeoai.com/articles.json?check=1'
curl --fail --silent --show-error --dump-header - --output /dev/null 'https://ingramgeoai.com/'
```

The chain should end successfully at the HTTPS apex without a loop. The apex
response must contain all five headers and their expected values. Check a known
JavaScript and CSS asset from the current page too: assets must still load with
correct MIME types after enabling `nosniff`. The limited CSP is intentionally not
a complete resource allowlist, even if a scanner requests one.

Open the site in a fresh browser session and verify:

- The homepage and canonical URL load without a certificate warning.
- Deferred hero graphics and the LiDAR/3D section render after scrolling.
- Article loading and the article modal still work.
- Contact controls, email links, and the copy action still work.
- The mobile layout remains usable and the console has no new CSP or asset errors.

Check an unrelated subdomain's response before and after; this change must not
alter its behavior or headers. Cloudflare Trace can help identify which rules
match if a response differs from the expected configuration.

## Rollback

- **Redirect:** restore only the changed rule's saved definition or disable the
  added rule after confirming that `www` has a functioning alternative HTTPS
  response. Keep the proxy enabled while the origin certificate for `www`
  remains invalid. Turning the DNS record back to DNS-only would restore the
  original certificate problem. Clients may retain a cached 301; that cannot be
  immediately revoked by editing Cloudflare.
- **Headers other than HSTS:** restore the prior values or remove just the
  added header operations. Preserve unrelated rules and settings.
- **HSTS:** set `Strict-Transport-Security: max-age=0` on the HTTPS apex before
  removing that header operation. Keep HTTPS and its valid certificate working
  for at least the previously advertised 86,400 seconds after the last response
  carrying that policy. Browsers that have not returned to receive `max-age=0`
  can retain the original policy for its remaining lifetime. Removing the
  header alone does not clear a browser's cached HSTS policy.
- Repeat the request and browser checks after rollback. Do not restore an
  entire ruleset snapshot over concurrent unrelated changes.

[redirect-api]: https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-api/
[redirect-settings]: https://developers.cloudflare.com/rules/url-forwarding/single-redirects/settings/
[headers-api]: https://developers.cloudflare.com/rules/transform/response-header-modification/create-api/
[headers-dashboard]: https://developers.cloudflare.com/rules/transform/response-header-modification/create-dashboard/
[headers-parameters]: https://developers.cloudflare.com/rules/transform/response-header-modification/reference/parameters/
[hsts]: https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/
[frame-ancestors]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
