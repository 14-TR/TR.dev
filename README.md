# TR Site

Portfolio site for `ingramgeoai.com`, built with React and Vite.

## QA commands

- `npm run verify:analytics`
- `npm run lint`
- `npm run build`
- `npm run verify:performance`

## Homepage performance budget

The homepage keeps the heavier Three.js experience behind deferred runtime entry points instead of shipping it on first paint. `npm run verify:performance` is the proof path for that policy.

Current enforced budgets:

- Entry JS: <= 250 kB raw and <= 80 kB gzip
- Entry CSS: <= 40 kB raw and <= 8 kB gzip
- Deferred 3D runtime bundle set: <= 1000 kB raw and <= 280 kB gzip
- `dist/index.html` must not eagerly reference the deferred 3D runtime chunks

This budget is meant to protect the public launch surface while still allowing an opt-in 3D showcase lower on the page.
