const PRODUCT_MODULES = [
  {
    title: 'LiDAR Parcel Scene',
    summary: 'LiDAR-informed parcel review with terrain, boundary context, measured callouts, and report-ready spatial proof.',
  },
  {
    title: 'Point Cloud To Terrain',
    summary: 'Point-cloud and elevation surfaces translated into slope, contour, access, and site-readiness views for fast due diligence.',
  },
  {
    title: 'Scan Evidence Board',
    summary: 'LiDAR outputs with source lineage, review state, and visible uncertainty instead of a black-box 3D render.',
  },
]

const READOUTS = [
  { label: 'Output', value: 'reviewable LiDAR site brief' },
  { label: 'Proof', value: 'scan to terrain to decision' },
  { label: 'Data path', value: 'capture, clean, model, communicate' },
]

export default function CartographicProductShowcase() {
  return (
    <section className="section section-cartographic-products" id="cartographic-products">
      <div className="container">
        <div className="carto-layout">
          <div className="carto-copy">
            <div className="section-label">// LIDAR SHOWCASE</div>
            <h2 className="section-title">LiDAR proof surfaces for decisions about real places.</h2>
            <p className="section-sub carto-sub">
              The right first impression is not generic 3D. It is a LiDAR-informed surface that turns terrain, parcels, scan detail, and site constraints into something inspectable and decision-ready.
            </p>
            <div className="carto-module-list" aria-label="3D cartographic product modules">
              {PRODUCT_MODULES.map((module) => (
                <article className="carto-module" key={module.title}>
                  <h3>{module.title}</h3>
                  <p>{module.summary}</p>
                </article>
              ))}
            </div>
            <a className="btn btn-outline carto-cta" href="#contact">
              SCOPE A LIDAR PROOF
            </a>
          </div>

          <div className="carto-showcase" aria-label="LiDAR parcel and terrain proof">
            <div className="carto-toolbar" aria-label="Map camera presets">
              <span className="active">Site</span>
              <span>Access</span>
              <span>Risk</span>
              <span>Report</span>
            </div>
            <div className="carto-canvas-wrap carto-canvas-lite">
              <div className="carto-terrain-band carto-terrain-band-a" />
              <div className="carto-terrain-band carto-terrain-band-b" />
              <div className="carto-contour-stack" />
              <div className="carto-parcel-shape" />
              <div className="carto-road-line" />
              <div className="carto-zone carto-zone-a" />
              <div className="carto-zone carto-zone-b" />
              <div className="carto-structure carto-structure-main" />
              <div className="carto-structure carto-structure-side" />
              <div className="carto-map-label carto-map-label-primary">
                <span>LiDAR capture</span>
                <strong>18.7 ac terrain + parcel review</strong>
              </div>
              <div className="carto-map-label carto-map-label-secondary">
                <span>Constraint stack</span>
                <strong>slope · access · drainage</strong>
              </div>
            </div>
            <div className="carto-readout">
              {READOUTS.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
