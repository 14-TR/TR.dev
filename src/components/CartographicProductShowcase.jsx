import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const CAMERA_PRESETS = {
  site: {
    label: 'Site',
    position: [4.6, 3.1, 5.6],
    target: [0.1, 0, 0.15],
  },
  access: {
    label: 'Access',
    position: [1.2, 5.4, 4.4],
    target: [-0.45, 0, 0.2],
  },
  risk: {
    label: 'Risk',
    position: [-4.8, 3.8, 3.6],
    target: [0.25, 0.05, -0.2],
  },
  report: {
    label: 'Report',
    position: [0, 7.2, 0.01],
    target: [0, 0, 0],
  },
}

const PRODUCT_MODULES = [
  {
    title: 'ParcelScene',
    summary: '3D property intelligence with parcel boundaries, constraint overlays, measured callouts, and report-ready views.',
  },
  {
    title: 'TerrainLens',
    summary: 'Terrain, slope, contour, and access surfaces for site planning, routing, wildfire, hydrology, and due diligence.',
  },
  {
    title: 'GeoAI Evidence Board',
    summary: 'Map outputs with confidence, source lineage, review status, and visible uncertainty instead of black-box magic.',
  },
]

function canUseWebGL() {
  if (typeof document === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

function makeTerrainGeometry() {
  const geometry = new THREE.PlaneGeometry(7.2, 4.8, 84, 56)
  const positions = geometry.attributes.position

  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i)
    const y = positions.getY(i)
    const ridge = Math.sin(x * 1.15) * 0.22
    const draw = Math.cos((x + y) * 1.55) * 0.12
    const shoulder = Math.sin(y * 2.35) * 0.08
    const basin = Math.max(0, 1.1 - Math.hypot(x + 1.8, y - 0.7)) * -0.18
    positions.setZ(i, ridge + draw + shoulder + basin)
  }

  geometry.computeVertexNormals()
  return geometry
}

function TerrainSurface() {
  const geometry = useMemo(() => makeTerrainGeometry(), [])

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial
        color="#1d2a2c"
        roughness={0.84}
        metalness={0.08}
        emissive="#0f1718"
        emissiveIntensity={0.35}
      />
    </mesh>
  )
}

function ParcelShape() {
  const shape = useMemo(() => {
    const parcel = new THREE.Shape()
    parcel.moveTo(-1.45, -0.8)
    parcel.lineTo(1.28, -1.02)
    parcel.lineTo(1.78, 0.68)
    parcel.lineTo(0.62, 1.12)
    parcel.lineTo(-1.68, 0.72)
    parcel.lineTo(-1.45, -0.8)
    return parcel
  }, [])

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
      <mesh>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.16} side={THREE.DoubleSide} />
      </mesh>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={6}
            array={new Float32Array([
              -1.45, -0.8, 0.04,
              1.28, -1.02, 0.04,
              1.78, 0.68, 0.04,
              0.62, 1.12, 0.04,
              -1.68, 0.72, 0.04,
              -1.45, -0.8, 0.04,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#fbbf24" linewidth={2} />
      </line>
    </group>
  )
}

function ConstraintLayers({ activePreset }) {
  const showRisk = activePreset === 'risk' || activePreset === 'report'

  return (
    <group position={[0, 0.18, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.7, 0, 0.35]}>
        <circleGeometry args={[1.35, 64, 0.3, 4.2]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.25, 0, -0.95]}>
        <ringGeometry args={[0.62, 1.1, 64]} />
        <meshBasicMaterial color={showRisk ? '#f97316' : '#f59e0b'} transparent opacity={showRisk ? 0.36 : 0.14} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, 0.35, 0]} position={[0.12, 0.16, -1.24]}>
        <boxGeometry args={[4.7, 0.018, 0.09]} />
        <meshBasicMaterial color="#e5e7eb" transparent opacity={0.72} />
      </mesh>
    </group>
  )
}

function SiteMassing() {
  return (
    <group position={[0.18, 0.16, 0.03]}>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.72, 0.44, 0.92]} />
        <meshStandardMaterial color="#d7b56d" roughness={0.62} metalness={0.18} />
      </mesh>
      <mesh position={[0.58, 0.13, 0.42]}>
        <boxGeometry args={[0.42, 0.26, 0.38]} />
        <meshStandardMaterial color="#f0c77b" roughness={0.66} metalness={0.1} />
      </mesh>
      <mesh position={[-0.62, 0.1, -0.34]}>
        <boxGeometry args={[0.36, 0.2, 0.48]} />
        <meshStandardMaterial color="#f7d794" roughness={0.7} metalness={0.06} />
      </mesh>
    </group>
  )
}

function Contours() {
  const rings = useMemo(() => {
    return Array.from({ length: 10 }, (_, index) => ({
      scale: 1 + index * 0.22,
      x: Math.sin(index * 1.7) * 0.24,
      z: Math.cos(index * 1.1) * 0.16,
      opacity: 0.28 - index * 0.016,
    }))
  }, [])

  return (
    <group>
      {rings.map((ring) => (
        <mesh key={ring.scale} rotation={[-Math.PI / 2, 0, 0]} position={[ring.x, 0.215, ring.z]}>
          <ringGeometry args={[ring.scale, ring.scale + 0.008, 96]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={Math.max(0.08, ring.opacity)} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

function CartographicScene({ activePreset }) {
  const groupRef = useRef()
  const cameraTarget = useRef(new THREE.Vector3())
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useFrame(({ camera }) => {
    const preset = CAMERA_PRESETS[activePreset] || CAMERA_PRESETS.site
    const targetPosition = new THREE.Vector3(...preset.position)
    const targetLookAt = new THREE.Vector3(...preset.target)

    camera.position.lerp(targetPosition, reduceMotion ? 1 : 0.045)
    cameraTarget.current.lerp(targetLookAt, reduceMotion ? 1 : 0.07)
    camera.lookAt(cameraTarget.current)

    if (!reduceMotion && groupRef.current) {
      groupRef.current.rotation.y += 0.0008
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.42} />
      <directionalLight position={[4, 7, 4]} intensity={1.35} color="#f8e1ad" />
      <pointLight position={[-4, 3, -3]} intensity={0.55} color="#38bdf8" />
      <TerrainSurface />
      <Contours />
      <ParcelShape />
      <ConstraintLayers activePreset={activePreset} />
      <SiteMassing />
      <gridHelper args={[7.2, 12, '#7a8493', '#242424']} position={[0, 0.02, 0]} />
    </group>
  )
}

function ShowcaseFallback() {
  return (
    <div className="carto-visual-fallback" aria-hidden="true">
      <div className="carto-fallback-terrain" />
      <div className="carto-fallback-parcel" />
      <div className="carto-fallback-road" />
      <div className="carto-fallback-node carto-fallback-node-a" />
      <div className="carto-fallback-node carto-fallback-node-b" />
    </div>
  )
}

export default function CartographicProductShowcase() {
  const [activePreset, setActivePreset] = useState('site')
  const webglAvailable = useMemo(() => canUseWebGL(), [])

  return (
    <section className="section section-cartographic-products" id="cartographic-products">
      <div className="container">
        <div className="carto-layout">
          <div className="carto-copy">
            <div className="section-label">// 3D CARTOGRAPHIC PRODUCTS</div>
            <h2 className="section-title">Sharp spatial products for decisions about real places.</h2>
            <p className="section-sub carto-sub">
              A first proof should feel like a serious geospatial instrument: terrain, parcels, constraints, evidence, and report-ready views in one inspectable surface.
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
              SCOPE A 3D MAP PROOF
            </a>
          </div>

          <div className="carto-showcase" aria-label="Interactive 3D parcel and terrain proof">
            <div className="carto-toolbar" aria-label="Map camera presets">
              {Object.entries(CAMERA_PRESETS).map(([key, preset]) => (
                <button
                  className={activePreset === key ? 'active' : ''}
                  key={key}
                  type="button"
                  onClick={() => setActivePreset(key)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="carto-canvas-wrap">
              {webglAvailable ? (
                <Canvas
                  camera={{ position: CAMERA_PRESETS.site.position, fov: 43, near: 0.1, far: 100 }}
                  gl={{ antialias: true, alpha: true }}
                >
                  <CartographicScene activePreset={activePreset} />
                </Canvas>
              ) : (
                <ShowcaseFallback />
              )}
              <div className="carto-map-label carto-map-label-primary">
                <span>Parcel boundary</span>
                <strong>18.7 ac review area</strong>
              </div>
              <div className="carto-map-label carto-map-label-secondary">
                <span>Constraint stack</span>
                <strong>access · slope · water</strong>
              </div>
            </div>
            <div className="carto-readout">
              <div>
                <span>Output</span>
                <strong>reviewable 3D site brief</strong>
              </div>
              <div>
                <span>Proof</span>
                <strong>map view → insight → report</strong>
              </div>
              <div>
                <span>Data path</span>
                <strong>static demo now, real sources later</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
