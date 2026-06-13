function HeroOrb({ className }) {
  return <span className={className} aria-hidden="true" />
}

export default function HeroCanvas() {
  return (
    <div className="hero-canvas-lite" aria-hidden="true">
      <div className="hero-orbit hero-orbit-a" />
      <div className="hero-orbit hero-orbit-b" />
      <div className="hero-orbit hero-orbit-c" />
      <HeroOrb className="hero-orb hero-orb-a" />
      <HeroOrb className="hero-orb hero-orb-b" />
      <HeroOrb className="hero-orb hero-orb-c" />
      <div className="hero-beacon hero-beacon-a" />
      <div className="hero-beacon hero-beacon-b" />
    </div>
  )
}
