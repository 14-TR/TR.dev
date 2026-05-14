import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import graphData from '../data/graph.json'

export default function CodeGraphBg() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Scene ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200)
    camera.position.z = 28

    // ── Build node positions on a diffuse sphere ───────────────────────────
    const N = graphData.n.length
    const positions = new Float32Array(N * 3)
    const posArr = [] // vec3 per node for edge lookup

    for (let i = 0; i < N; i++) {
      // Fibonacci sphere for even distribution
      const phi   = Math.acos(1 - 2 * (i + 0.5) / N)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = 10 + (Math.random() - 0.5) * 4
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      positions[i * 3]     = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      posArr.push(new THREE.Vector3(x, y, z))
    }

    // ── Node points ────────────────────────────────────────────────────────
    const nodeGeo = new THREE.BufferGeometry()
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Vary size by node weight
    const sizes = new Float32Array(N)
    for (let i = 0; i < N; i++) sizes[i] = graphData.n[i] * 0.8 + 0.6
    nodeGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const nodeMat = new THREE.PointsMaterial({
      color: 0x4a7fa5,
      size: 0.18,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
    })
    const pointsMesh = new THREE.Points(nodeGeo, nodeMat)

    // ── Edges ──────────────────────────────────────────────────────────────
    const edgePositions = []
    for (const [s, t] of graphData.e) {
      if (posArr[s] && posArr[t]) {
        edgePositions.push(posArr[s].x, posArr[s].y, posArr[s].z)
        edgePositions.push(posArr[t].x, posArr[t].y, posArr[t].z)
      }
    }

    const edgeGeo = new THREE.BufferGeometry()
    edgeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgePositions), 3))
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x2a5070,
      transparent: true,
      opacity: 0.18,
    })
    const linesMesh = new THREE.LineSegments(edgeGeo, edgeMat)

    // ── Resize handler ─────────────────────────────────────────────────────
    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    onResize()
    window.addEventListener('resize', onResize)

    // ── Scroll parallax ────────────────────────────────────────────────────
    let scrollY = 0
    const onScroll = () => { scrollY = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ── Group everything and add to scene ──────────────────────────────────
    const group = new THREE.Group()
    group.add(pointsMesh, linesMesh)
    scene.add(group)

    let frameId
    const clock = new THREE.Clock()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Very slow rotation
      group.rotation.y = t * 0.025
      group.rotation.x = Math.sin(t * 0.008) * 0.12

      // Subtle parallax drift with scroll
      group.position.y = -scrollY * 0.004

      renderer.render(scene, camera)
    }
    if (reduceMotion) {
      renderer.render(scene, camera)
    } else {
      animate()
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      renderer.dispose()
      nodeGeo.dispose()
      edgeGeo.dispose()
      nodeMat.dispose()
      edgeMat.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.55,
      }}
    />
  )
}
