import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const SURFACE_VIEWS = {
  elevation: { label: 'Elevation', metric: 'colored by height', readout: 'low - high terrain' },
  slope: { label: 'Slope', metric: 'steepness response', readout: 'flat - steep surface' },
  aspect: { label: 'Aspect', metric: 'surface direction', readout: 'north/east/south/west' },
  relief: { label: 'Relief', metric: 'shaded terrain', readout: 'hillshade + elevation' },
}

const PRODUCT_MODULES = [
  {
    title: 'Terrain Collision Surface',
    summary: 'The LiDAR GLB is treated like a playable surface so the shot rolls with slope, not along a canned spline.',
  },
  {
    title: 'Drag-To-Aim Shot Planning',
    summary: 'Drag on the demo to aim, build power, and preview the expected shot line before release.',
  },
  {
    title: 'Filament-Ready Terrain GLB',
    summary: 'The same terrain mesh still works as a portable 3D asset for native mobile rendering.',
  },
  {
    title: 'Surface Symbology',
    summary: 'Elevation, slope, aspect, and relief views keep the inspection layer intact while the ball stays playable.',
  },
]

const TERRAIN_GLB_URL = '/models/lidar-terrain-demo.glb'
const TERRAIN_TRANSFORM = {
  rotation: [-Math.PI / 2, 0, Math.PI],
  scale: 0.045,
  position: [0, 0.02, 0],
}
const BALL_RADIUS = 0.32
const PREVIEW_LENGTH = 3.4
const PREVIEW_HEIGHT = 1.6

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

function LidarTerrainModel({ mode, onBoundsReady }) {
  const { scene } = useGLTF(TERRAIN_GLB_URL)

  const model = useMemo(() => {
    const clone = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const center = box.getCenter(new THREE.Vector3())
    const offset = center.multiplyScalar(-1)
    clone.position.copy(offset)

    const centeredBox = new THREE.Box3().setFromObject(clone)
    const highestPoint = new THREE.Vector2(0, 0)
    const lowestPoint = new THREE.Vector2(0, 0)
    let highestZ = -Infinity
    let lowestZ = Infinity

    clone.traverse((child) => {
      if (!child.isMesh) return
      const position = child.geometry.attributes.position
      if (!position) return

      for (let i = 0; i < position.count; i += 1) {
        const x = position.getX(i)
        const y = position.getY(i)
        const z = position.getZ(i)

        if (z > highestZ) {
          highestZ = z
          highestPoint.set(x, y)
        }

        if (z < lowestZ) {
          lowestZ = z
          lowestPoint.set(x, y)
        }
      }
    })

    onBoundsReady?.({
      min: centeredBox.min.clone(),
      max: centeredBox.max.clone(),
      highestPoint: highestPoint.clone(),
      lowestPoint: lowestPoint.clone(),
    })

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
  }, [mode, onBoundsReady, scene])

  return <primitive object={model} />
}

function sampleTerrainAt(localXZ, terrainGroup, raycaster, downVector, temp) {
  temp.worldOrigin.set(localXZ.x, 18, localXZ.y)
  terrainGroup.localToWorld(temp.worldOrigin)
  raycaster.set(temp.worldOrigin, downVector)
  temp.meshes.length = 0

  terrainGroup.traverse((child) => {
    if (child.isMesh) temp.meshes.push(child)
  })

  const [hit] = raycaster.intersectObjects(temp.meshes, false)
  if (!hit) {
    return {
      y: BALL_RADIUS,
      surfaceY: 0,
      point: new THREE.Vector3(localXZ.x, 0, localXZ.y),
      normal: new THREE.Vector3(0, 1, 0),
      hit: false,
    }
  }

  temp.localPoint.copy(hit.point)
  terrainGroup.worldToLocal(temp.localPoint)

  const worldNormal = hit.face?.normal
    ? temp.localNormal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld).normalize()
    : temp.up

  temp.terrainNormal.copy(worldNormal)
  terrainGroup.worldToLocal(temp.terrainNormal.add(hit.point)).sub(temp.localPoint).normalize()

  return {
    y: temp.localPoint.y + BALL_RADIUS,
    surfaceY: temp.localPoint.y,
    point: temp.localPoint.clone(),
    normal: temp.terrainNormal.clone(),
    hit: true,
  }
}

function AimOverlay({ dragState, power, interactionMode }) {
  return (
    <div className="carto-shot-overlay" aria-hidden="true">
      <div className="carto-shot-chip">
        <span>Shot planner</span>
        <strong>
          {interactionMode === 'navigate'
            ? 'navigate mode: orbit, pan, zoom'
            : dragState.isDragging
              ? 'release to fire'
              : 'drag from tee lane to aim'}
        </strong>
      </div>
      <div className="carto-power-meter">
        <span>Power</span>
        <div className="carto-power-track">
          <div className="carto-power-fill" style={{ transform: `scaleX(${power.toFixed(3)})` }} />
        </div>
      </div>
      <div className="carto-cup-chip">
        <span>Target</span>
        <strong>play uphill into the cup</strong>
      </div>
    </div>
  )
}

function PlayableBall({ terrainGroupRef, dragState, shotRequest, shotConfig, resetRequest, terrainBounds }) {
  const playBounds = useMemo(() => {
    if (!terrainBounds) return null
    return {
      xMin: terrainBounds.min.x,
      xMax: terrainBounds.max.x,
      zMin: terrainBounds.min.z,
      zMax: terrainBounds.max.z,
    }
  }, [terrainBounds])
  const anchorsRef = useRef(null)
  const ballRef = useRef()
  const markerRef = useRef()
  const cupRef = useRef()
  const teeRef = useRef()
  const trailRef = useRef()
  const stateRef = useRef({
    position: new THREE.Vector2(),
    velocity: new THREE.Vector2(),
    height: 0,
    verticalVelocity: 0,
    inCup: false,
  })
  const lastShotRequest = useRef(0)
  const lastResetRequest = useRef(0)
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const downVector = useMemo(() => new THREE.Vector3(0, -1, 0), [])
  const trailMaterial = useRef()
  const temp = useMemo(() => ({
    worldOrigin: new THREE.Vector3(),
    localPoint: new THREE.Vector3(),
    localNormal: new THREE.Vector3(),
    terrainNormal: new THREE.Vector3(),
    up: new THREE.Vector3(0, 1, 0),
    meshes: [],
  }), [])

  useEffect(() => {
    if (!terrainBounds || !terrainGroupRef.current || !playBounds) return

    const highest = { point: null, y: -Infinity }
    const lowest = { point: null, y: Infinity }
    const steps = 36

    for (let ix = 0; ix <= steps; ix += 1) {
      for (let iz = 0; iz <= steps; iz += 1) {
        const probe = new THREE.Vector2(
          THREE.MathUtils.lerp(playBounds.xMin, playBounds.xMax, ix / steps),
          THREE.MathUtils.lerp(playBounds.zMin, playBounds.zMax, iz / steps)
        )
        const sample = sampleTerrainAt(probe, terrainGroupRef.current, raycaster, downVector, temp)

        if (sample.surfaceY > highest.y) {
          highest.y = sample.surfaceY
          highest.point = probe.clone()
        }

        if (sample.surfaceY < lowest.y) {
          lowest.y = sample.surfaceY
          lowest.point = probe.clone()
        }
      }
    }

    if (!highest.point || !lowest.point) return

    anchorsRef.current = {
      tee: highest.point,
      cup: lowest.point,
    }
    stateRef.current.position.copy(highest.point)
  }, [terrainBounds, playBounds, raycaster, downVector, temp, terrainGroupRef])

  useEffect(() => {
    if (!anchorsRef.current) return
    if (resetRequest === lastResetRequest.current) return
    lastResetRequest.current = resetRequest
    stateRef.current.position.copy(anchorsRef.current.tee)
    stateRef.current.velocity.set(0, 0)
    stateRef.current.height = 0
    stateRef.current.verticalVelocity = 0
    stateRef.current.inCup = false
  }, [resetRequest])

  useFrame((_, delta) => {
    const terrainGroup = terrainGroupRef.current
    const anchors = anchorsRef.current
    if (!terrainGroup || !ballRef.current || !markerRef.current || !cupRef.current || !teeRef.current || !trailRef.current || !playBounds || !anchors) return

    if (shotRequest !== lastShotRequest.current) {
      lastShotRequest.current = shotRequest
      const impulse = 1.8 + shotConfig.power * 3.4
      stateRef.current.velocity.set(shotConfig.direction.x * impulse, shotConfig.direction.y * impulse)
      stateRef.current.verticalVelocity = 0.28 + shotConfig.power * 0.45
      stateRef.current.height = 0.015
      stateRef.current.inCup = false
    }

    const dt = Math.min(delta, 1 / 30)
    const state = stateRef.current
    const terrainAtTee = sampleTerrainAt(anchors.tee, terrainGroup, raycaster, downVector, temp)
    const terrainAtCup = sampleTerrainAt(anchors.cup, terrainGroup, raycaster, downVector, temp)

    teeRef.current.position.set(terrainAtTee.point.x, terrainAtTee.surfaceY + 0.02, terrainAtTee.point.z)
    cupRef.current.position.set(terrainAtCup.point.x, terrainAtCup.surfaceY, terrainAtCup.point.z)
    trailRef.current.position.set(terrainAtTee.point.x, terrainAtTee.surfaceY + BALL_RADIUS + 0.03, terrainAtTee.point.z)

    if (state.inCup) {
      ballRef.current.position.set(terrainAtCup.point.x, terrainAtCup.y - BALL_RADIUS * 0.35, terrainAtCup.point.z)
      markerRef.current.position.set(terrainAtCup.point.x, terrainAtCup.surfaceY + 0.02, terrainAtCup.point.z)
      return
    }

    const terrainNow = sampleTerrainAt(state.position, terrainGroup, raycaster, downVector, temp)
    const slopeForce = new THREE.Vector2(-terrainNow.normal.x, -terrainNow.normal.z).multiplyScalar(2.2)
    state.velocity.addScaledVector(slopeForce, dt)

    const rollingDamping = state.height > 0.02 ? 0.992 : 0.968
    state.velocity.multiplyScalar(Math.pow(rollingDamping, dt * 60))
    state.position.addScaledVector(state.velocity, dt)

    state.position.x = THREE.MathUtils.clamp(state.position.x, playBounds.xMin, playBounds.xMax)
    state.position.y = THREE.MathUtils.clamp(state.position.y, playBounds.zMin, playBounds.zMax)

    if (state.position.x === playBounds.xMin || state.position.x === playBounds.xMax) {
      state.velocity.x *= -0.32
    }
    if (state.position.y === playBounds.zMin || state.position.y === playBounds.zMax) {
      state.velocity.y *= -0.32
    }

    state.verticalVelocity -= 8.2 * dt
    state.height += state.verticalVelocity * dt

    const terrainAfterMove = sampleTerrainAt(state.position, terrainGroup, raycaster, downVector, temp)
    if (state.height <= 0) {
      if (Math.abs(state.verticalVelocity) > 0.45) {
        state.height = 0
        state.verticalVelocity = -state.verticalVelocity * 0.08
        state.velocity.multiplyScalar(0.94)
      } else {
        state.height = 0
        state.verticalVelocity = 0
      }
    }

    const cupDistance = state.position.distanceTo(anchors.cup)
    if (cupDistance < 0.34 && state.height < 0.06 && state.velocity.length() < 1.45) {
      state.position.copy(anchors.cup)
      state.velocity.set(0, 0)
      state.height = 0
      state.verticalVelocity = 0
      state.inCup = true
    }

    ballRef.current.position.set(terrainAfterMove.point.x, terrainAfterMove.y + state.height, terrainAfterMove.point.z)
    markerRef.current.position.set(terrainAfterMove.point.x, terrainAfterMove.surfaceY + 0.02, terrainAfterMove.point.z)

    const spin = state.velocity.length()
    ballRef.current.rotation.z -= spin * dt * 0.7
    ballRef.current.rotation.x += spin * dt * 0.55

    const trailOpacity = dragState.isDragging ? 0.92 : 0.34
    if (trailMaterial.current) {
      trailMaterial.current.opacity = trailOpacity
    }
  })

  const previewPointArray = useMemo(() => {
    const start = new THREE.Vector3(0, 0, 0)
    const end = new THREE.Vector3(
      dragState.direction.x * (1.8 + shotConfig.power * 3.3),
      0.45 + shotConfig.power * 0.75,
      dragState.direction.y * (1.8 + shotConfig.power * 3.3)
    )
    const mid = new THREE.Vector3(
      dragState.direction.x * (0.9 + shotConfig.power * 1.8),
      0.95 + shotConfig.power * 1.2,
      dragState.direction.y * (0.9 + shotConfig.power * 1.8)
    )
    return new Float32Array([...start.toArray(), ...mid.toArray(), ...end.toArray()])
  }, [dragState.direction.x, dragState.direction.y, shotConfig.power])

  return (
    <>
      <group ref={teeRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.34, 40]} />
          <meshBasicMaterial color="#f8fafc" transparent opacity={0.88} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <group ref={cupRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.3, 40]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.92} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.85, 10]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.45} metalness={0.1} />
        </mesh>
        <mesh position={[0.18, 0.72, 0]}>
          <boxGeometry args={[0.34, 0.18, 0.02]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>

      <group ref={ballRef}>
        <mesh castShadow={false} receiveShadow={false}>
          <sphereGeometry args={[BALL_RADIUS, 28, 28]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.68} metalness={0.02} />
        </mesh>
      </group>

      <mesh ref={markerRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.32, 40]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.24} side={THREE.DoubleSide} />
      </mesh>

      <line ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={previewPointArray.length / 3}
            array={previewPointArray}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={trailMaterial}
          color="#f8fafc"
          transparent
          opacity={0.34}
        />
      </line>
    </>
  )
}

function CartographicScene({ activeMode, dragState, shotRequest, shotConfig, resetRequest, interactionMode }) {
  const terrainGroupRef = useRef()
  const [terrainBounds, setTerrainBounds] = useState(null)

  useFrame(({ camera }) => {
    if (interactionMode === 'navigate') return
    camera.position.set(0, 8.4, 5.6)
    camera.lookAt(0, -0.15, -0.8)
  })

  return (
    <group>
      <ambientLight intensity={0.42} />
      <directionalLight position={[4, 7, 4]} intensity={1.35} color="#f8e1ad" />
      <pointLight position={[-4, 3, -3]} intensity={0.55} color="#38bdf8" />
      <group
        ref={terrainGroupRef}
        rotation={TERRAIN_TRANSFORM.rotation}
        scale={TERRAIN_TRANSFORM.scale}
        position={TERRAIN_TRANSFORM.position}
      >
        <Suspense fallback={null}>
          <LidarTerrainModel mode={activeMode} onBoundsReady={setTerrainBounds} />
        </Suspense>
        <PlayableBall
          terrainGroupRef={terrainGroupRef}
          dragState={dragState}
          shotRequest={shotRequest}
          shotConfig={shotConfig}
          resetRequest={resetRequest}
          terrainBounds={terrainBounds}
        />
      </group>
      <OrbitControls
        makeDefault
        enabled={interactionMode === 'navigate'}
        enablePan
        enableZoom
        enableRotate
        target={[0, -0.15, -0.8]}
        minDistance={4}
        maxDistance={16}
        minPolarAngle={0.35}
        maxPolarAngle={1.45}
      />
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
  const [interactionMode, setInteractionMode] = useState('shot')
  const [shotRequest, setShotRequest] = useState(0)
  const [resetRequest, setResetRequest] = useState(0)
  const [shotConfig, setShotConfig] = useState({
    direction: { x: 0.72, y: 0.44 },
    power: 0.46,
  })
  const [dragState, setDragState] = useState({
    isDragging: false,
    direction: { x: 0.72, y: 0.44 },
  })
  const dragStartRef = useRef(null)
  const webglAvailable = useMemo(() => canUseWebGL(), [])
  const activeView = SURFACE_VIEWS[activeMode]
  const handlePointerDown = (event) => {
    if (interactionMode !== 'shot') return
    const rect = event.currentTarget.getBoundingClientRect()
    dragStartRef.current = {
      x: rect.left + rect.width * 0.5,
      y: rect.top + rect.height * 0.78,
      width: rect.width,
      height: rect.height,
    }
    setDragState((current) => ({
      ...current,
      isDragging: true,
    }))
  }

  const handlePointerMove = (event) => {
    if (interactionMode !== 'shot') return
    if (!dragStartRef.current) return

    const dx = (event.clientX - dragStartRef.current.x) / dragStartRef.current.width
    const dy = (event.clientY - dragStartRef.current.y) / dragStartRef.current.height
    const pullX = THREE.MathUtils.clamp(-dx * 3.2, -1, 1)
    const pullY = THREE.MathUtils.clamp(-dy * 3.2, -1, 1)
    const vector = new THREE.Vector2(pullX, pullY)

    if (vector.lengthSq() < 0.002) return

    const direction = vector.clone().normalize()
    const power = THREE.MathUtils.clamp(vector.length(), 0.08, 0.72)

    setShotConfig({
      direction: { x: direction.x, y: direction.y },
      power,
    })
    setDragState({
      isDragging: true,
      direction: { x: direction.x, y: direction.y },
    })
  }

  const handlePointerEnd = () => {
    if (interactionMode !== 'shot') return
    if (!dragStartRef.current) return
    dragStartRef.current = null
    setDragState((current) => ({ ...current, isDragging: false }))
    setShotRequest((count) => count + 1)
  }

  return (
    <section className="section section-cartographic-products" id="cartographic-products">
      <div className="container">
        <div className="carto-layout">
          <div className="carto-copy">
            <div className="section-label">// LIDAR SHOWCASE</div>
            <h2 className="section-title">Playable LiDAR terrain with a real shot-planning surface.</h2>
            <p className="section-sub carto-sub">
      Pull back from the tee area to aim and set power, then release to fire. The terrain stays locked in a stable playable frame instead of rotating like a showcase.
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
              DISCUSS 3D GEOSPATIAL UI
            </a>
          </div>

          <div className="carto-showcase" aria-label="Interactive Filament-ready LiDAR terrain GLB demo">
            <div className="carto-toolbar" aria-label="Surface symbology, shot controls, and reset">
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
              <button type="button" onClick={() => setResetRequest((count) => count + 1)}>
                Reset Ball
              </button>
              <button
                type="button"
                className={interactionMode === 'navigate' ? 'active' : ''}
                onClick={() => setInteractionMode((current) => (current === 'shot' ? 'navigate' : 'shot'))}
              >
                {interactionMode === 'navigate' ? 'Shot Mode' : 'Navigate'}
              </button>
            </div>
            <div
              className={`carto-canvas-wrap ${interactionMode === 'navigate' ? 'is-navigating' : ''}`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerLeave={handlePointerEnd}
            >
              <AimOverlay dragState={dragState} power={shotConfig.power} interactionMode={interactionMode} />
              {webglAvailable ? (
                <Canvas
                  camera={{ position: [0, 8.4, 5.6], fov: 34, near: 0.1, far: 100 }}
                  gl={{ antialias: true, alpha: true }}
                >
                  <CartographicScene
                    activeMode={activeMode}
                    dragState={dragState}
                    shotRequest={shotRequest}
                    shotConfig={shotConfig}
                    resetRequest={resetRequest}
                    interactionMode={interactionMode}
                  />
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
                <span>Interaction</span>
                <strong>{interactionMode === 'navigate' ? 'Use drag plus pinch/scroll to inspect terrain' : 'Pull back from the tee area, then release to shoot'}</strong>
              </div>
              <div>
                <span>Power</span>
                <strong>{Math.round(shotConfig.power * 100)}% shot strength</strong>
              </div>
              <div>
                <span>Objective</span>
                <strong>Work the ball uphill and into the flagged cup</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
