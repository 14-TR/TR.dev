# TR.dev LiDAR Showcase Plan

Date: 2026-05-31
Priority: create a clear LiDAR-focused showcase lane for the public site

## Objective

Turn TR.dev into a cleaner showcase for LiDAR / 3D object work without mixing it
up with the Open World Model backend proof lane.

## Product Goal

When someone lands on TR.dev, they should quickly understand:

- TR works on spatial / geospatial / AI systems
- LiDAR and 3D object workflows are part of that capability
- the site has a visible, modern proof surface rather than only text claims

## Recommended Showcase Direction

Build a focused LiDAR showcase surface, likely one of these:

1. A hero or featured section with 1-3 standout LiDAR/3D artifacts
2. A project/gallery section with short explanations of capture/generation/output
3. A lightweight viewer-first case study if browser/runtime constraints allow it

## Preferred Content Shape

Each showcased object or scene should answer:

- What is it?
- Where did it come from?
- Why does it matter?
- What workflow does it demonstrate?

Suggested fields:

- title
- thumbnail/poster
- asset type (`glb`, point-cloud render, mesh render, still)
- short description
- proof/result statement

## Execution Plan

### Phase 1: Pick the surface

Choose one:

1. **Fastest:** static gallery with rendered stills/posters
2. **Balanced:** static gallery plus downloadable/viewable 3D assets
3. **Most ambitious:** embedded interactive viewer for one flagship artifact

Recommendation:

- start with the balanced path
- posters + short copy + optional asset/view links

### Phase 2: Define the asset contract

Standardize what the site will accept:

- poster image
- optional `glb` or other 3D asset
- short caption
- proof text

This keeps the site clean even if the source artifacts vary.

### Phase 3: Design the section

The section should feel like:

- spatial
- technical
- high-signal
- fast-loading

Avoid:

- heavy WebGL dependence for the whole page
- fragile background-only gimmicks
- anything that blanks out on no-WebGL/headless browsers

### Phase 4: First publishable slice

Ship a first slice with:

- one flagship LiDAR artifact
- two supporting objects or scenes
- one short explanation of the workflow
- one CTA toward contact / collaboration

## Constraints

- TR.dev still has known production sitemap follow-through work, but the live
  parity issues are separate from this showcase direction
- decorative 3D should fail open so the page still renders without WebGL
- keep the LiDAR showcase separate from Open World Model infrastructure claims

## Recommendation

Build the LiDAR showcase as a proof-first public surface:

- lightweight
- visual
- evidence-led
- resilient without requiring full interactive 3D everywhere

The best first move is a curated gallery/case-study slice, not an oversized
viewer-heavy rebuild.
