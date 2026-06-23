import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Suspense, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const SURFACE_VIEWS = {
  elevation: {
    label: 'Elevation',
    metric: 'colored by height',
    readout: 'low - high terrain',
    position: [4.6, 3.1, 5.6],
    target: [0.1, 0, 0.15],
  },
  slope: {
    label: 'Slope',
    metric: 'steepness response',
    readout: 'flat - steep surface',
    position: [1.2, 5.4, 4.4],
    target: [-0.45, 0, 0.2],
  },
  aspect: {
    label: 'Aspect',
    metric: 'surface direction',
    readout: 'north/east/south/west',
    position: [-4.8, 3.8, 3.6],
    target: [0.25, 0.05, -0.2],
  },
  relief: {
    label: 'Relief',
    metric: 'shaded terrain',
    readout: 'hillshade + elevation',
    position: [0, 7.2, 0.01],
    target: [0, 0, 0],
  },
}

const PRODUCT_MODULES = [
  {
    title: 'Real Terrain Asset',
    summary: 'A LiDAR-derived GLB mesh rendered as an inspection-ready surface rather than a static screenshot.',
  },
  {
    title: 'Analytical Symbology',
    summary: 'Elevation, slope, aspect, and shaded relief modes show how one asset can support multiple spatial reads.',
  },
  {
    title: 'Native 3D Path',
    summary: 'The GLB workflow keeps a path open for mobile rendering with a Filament-style native surface.',
  },
]

const TERRAIN_GLB_URL = '/models/lidar-terrain-demo.glb'

function canUseWebGL() {
  if (typeof document === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

function mixColor(stops, t) {
  const nextT = THREE.MathUtils.clamp(t, 0, 0.9999)
  const scaled = nextT * (stops.length - 1)
  const index = Math.floor(scaled)
  const localT = scaled - index
  return new THREE.Color(stops[index]).lerp(new THREE.Color(stops[index + 1]), localT)
}

function colorForVertex(mode, position, normal, bounds) {
  const elevation = bounds.zRange === 0 ? 0 : (position.z - bounds.zMin) / bounds.zRange
  const slope = THREE.MathUtils.clamp(1 - Math.abs(normal.z), 0, 1)
  const aspect = (Math.atan2(normal.y, normal.x) + Math.PI) / (Math.PI * 2)

  if (mode === 'slope') {
    return mixColor(['#0f766e', '#84cc16', '#facc15', '#f97316', '#dc2626'], slope)
  }

  if (mode === 'aspect') {
    return mixColor(['#2563eb', '#06b6d4', '#22c55e', '#facc15', '#f97316', '#ef4444', '#a855f7', '#2563eb'], aspect)
  }

  if (mode === 'relief') {
    const light = new THREE.Vector3(-0.42, -0.58, 0.7).normalize()
    const shade = THREE.MathUtils.clamp(0.38 + normal.dot(light) * 0.62, 0.18, 1)
    const base = mixColor(['#174f63', '#2f8f66', '#a3c957', '#f0c15b', '#d46a35'], elevation)
    return base.multiplyScalar(shade)
  }

  return mixColor(['#1e3a8a', '#2563eb', '#06b6d4', '#34c759', '#facc15', '#f97316', '#dc2626'], elevation)
}

function applySurfaceSymbology(geometry, mode) {
  const position = geometry.attributes.position
  if (!position) return

  geometry.computeVertexNormals()

  const normal = geometry.attributes.normal
  const colors = new Float32Array(position.count * 3)
  const vertex = new THREE.Vector3()
  const vertexNormal = new THREE.Vector3()
  const bounds = {
    zMin: Infinity,
    zMax: -Infinity,
    zRange: 0,
  }

  for (let i = 0; i < position.count; i += 1) {
    const z = position.getZ(i)
    bounds.zMin = Math.min(bounds.zMin, z)
    bounds.zMax = Math.max(bounds.zMax, z)
  }
  bounds.zRange = bounds.zMax - bounds.zMin

  for (let i = 0; i < position.count; i += 1) {
    vertex.fromBufferAttribute(position, i)
    vertexNormal.fromBufferAttribute(normal, i).normalize()
    const color = colorForVertex(mode, vertex, vertexNormal, bounds)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.attributes.color.needsUpdate = true
}

function LidarTerrainModel({ mode }) {
  const { scene } = useGLTF(TERRAIN_GLB_URL)

  const model = useMemo(() => {
    const clone = scene.clone(true)

    clone.traverse((child) => {
      if (!child.isMesh) return
      child.geometry = child.geometry.clone()
      applySurfaceSymbology(child.geometry, mode)
      child.material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.84,
        metalness: 0.03,
        side: THREE.DoubleSide,
      })
      child.castShadow = false
      child.receiveShadow = true
    })

    return clone
  }, [mode, scene])

  return (
    <primitive
      object={model}
      rotation={[-Math.PI / 2, 0, Math.PI]}
      scale={0.045}
      position={[0, 0.02, 0]}
    />
  )
}

function CartographicScene({ activeMode }) {
  const groupRef = useRef()
  const cameraTarget = useRef(new THREE.Vector3())
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useFrame(({ camera }) => {
    const view = SURFACE_VIEWS[activeMode] || SURFACE_VIEWS.elevation
    const targetPosition = new THREE.Vector3(...view.position)
    const targetLookAt = new THREE.Vector3(...view.target)

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
      <Suspense fallback={null}>
        <LidarTerrainModel mode={activeMode} />
      </Suspense>
    </group>
  )
}

useGLTF.preload(TERRAIN_GLB_URL)

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
  const [activeMode, setActiveMode] = useState('elevation')
  const webglAvailable = useMemo(() => canUseWebGL(), [])
  const activeView = SURFACE_VIEWS[activeMode]

  return (
    <section className="section section-cartographic-products" id="cartographic-products">
      <div className="container">
        <div className="carto-layout">
          <div className="carto-copy">
            <div className="section-label">// LIDAR SHOWCASE</div>
            <h2 className="section-title">A premium 3D terrain surface, built from real LiDAR.</h2>
            <p className="section-sub carto-sub">
              This is the strongest visual proof on the site: a real LiDAR-derived GLB terrain asset, rendered in-browser with view-specific camera movement and analytical surface symbology.
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
              DISCUSS SPATIAL UI
            </a>
          </div>

          <div className="carto-showcase" aria-label="Interactive Filament-ready LiDAR terrain GLB demo">
            <div className="carto-toolbar" aria-label="Surface symbology and camera presets">
              {Object.entries(SURFACE_VIEWS).map(([key, view]) => (
                <button
                  className={activeMode === key ? 'active' : ''}
                  key={key}
                  type="button"
                  onClick={() => setActiveMode(key)}
                >
                  {view.label}
                </button>
              ))}
            </div>
            <div className="carto-canvas-wrap">
              {webglAvailable ? (
                <Canvas
                  camera={{ position: SURFACE_VIEWS.elevation.position, fov: 43, near: 0.1, far: 100 }}
                  gl={{ antialias: true, alpha: true }}
                >
                  <CartographicScene activeMode={activeMode} />
                </Canvas>
              ) : (
                <ShowcaseFallback />
              )}
              <div className="carto-map-label carto-map-label-primary">
                <span>Terrain GLB</span>
                <strong>17K vertices · 33K faces</strong>
              </div>
              <div className="carto-map-label carto-map-label-secondary">
                <span>Active view</span>
                <strong>{activeView.metric}</strong>
              </div>
            </div>
            <div className="carto-readout">
              <div>
                <span>Mode</span>
                <strong>{activeView.label}</strong>
              </div>
              <div>
                <span>Symbology</span>
                <strong>{activeView.readout}</strong>
              </div>
              <div>
                <span>Asset</span>
                <strong>LiDAR, color ramp, GLB, viewer</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
