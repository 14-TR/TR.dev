import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function WireframeGlobe() {
  const meshRef = useRef()
  const gridRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0015
      meshRef.current.rotation.x += 0.0003
    }
    if (gridRef.current) {
      gridRef.current.rotation.y -= 0.0008
    }
  })

  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.2 + (Math.random() - 0.5) * 0.4
      pts.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      )
    }
    return new Float32Array(pts)
  }, [])

  return (
    <group>
      {/* Main wireframe sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 24, 16]} />
        <meshBasicMaterial
          color="#f59e0b"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Inner denser sphere */}
      <mesh ref={gridRef}>
        <sphereGeometry args={[1.6, 16, 10]} />
        <meshBasicMaterial
          color="#f59e0b"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Particle cloud */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length / 3}
            array={points}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#f59e0b"
          size={0.025}
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>

      {/* Equatorial ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.4, 0.008, 4, 80]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} />
      </mesh>

      {/* Tilted ring */}
      <mesh rotation={[Math.PI / 4, 0, Math.PI / 6]}>
        <torusGeometry args={[2.6, 0.004, 4, 80]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <WireframeGlobe />
    </Canvas>
  )
}
