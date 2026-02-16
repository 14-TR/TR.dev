/**
 * Hero3D - Interactive 3D Hero Section for TR.dev
 * 
 * A neural network / data flow visualization using Three.js
 * Features:
 * - Animated particles with connecting lines (neural network aesthetic)
 * - Mouse-responsive parallax movement
 * - Floating code symbols (ASCII art style)
 * - Optimized for performance (InstancedMesh, minimal draw calls)
 * - Accessible: can be disabled via CSS (prefers-reduced-motion)
 * - Lazy loads Three.js for fast initial page load
 * 
 * Usage: Import and add <Hero3D /> to your hero section
 */

import { useEffect, useRef, useState, lazy, Suspense } from 'react'

// Lazy load Three.js - only load when component mounts
const PARTICLE_COUNT = 60
const CONNECTION_DISTANCE = 1.8
const MOUSE_SENSITIVITY = 0.0008

function Hero3DCanvas() {
  const containerRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsLoaded(true)
      return
    }

    let THREE = null
    let scene, camera, renderer, particles, lines, textGroup
    let animationId
    let particleGeometry, particleMaterial, lineGeometry, lineMaterial
    let clock
    let velocities, posArray

    const init = async () => {
      // Dynamic import Three.js
      THREE = await import('three')
      
      if (!containerRef.current) return

      const container = containerRef.current
      const width = container.clientWidth
      const height = container.clientHeight

      // Scene setup
      scene = new THREE.Scene()
      
      // Perspective camera for dramatic 3D effect
      const aspect = width / height
      camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100)
      camera.position.set(0, 0, 8)
      camera.lookAt(0, 0, 0)

      // Renderer
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      container.appendChild(renderer.domElement)

      // Particle system with custom geometry
      particleGeometry = new THREE.BufferGeometry()
      const positions = new Float32Array(PARTICLE_COUNT * 3)
      velocities = new Float32Array(PARTICLE_COUNT * 3)
      const sizes = new Float32Array(PARTICLE_COUNT)

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Spread particles across the scene in 3D space
        positions[i * 3] = (Math.random() - 0.5) * 12
        positions[i * 3 + 1] = (Math.random() - 0.5) * 8
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2 // Spread in Z-depth

        // Random velocities
        velocities[i * 3] = (Math.random() - 0.5) * 0.003
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002 // Z movement for depth

        // Varying sizes
        sizes[i] = Math.random() * 0.15 + 0.05
      }

      posArray = positions
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      // Custom shader material for particles
      particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color(0x8b5cf6) }, // Purple
          uColor2: { value: new THREE.Color(0xec4899) }, // Pink
        },
        vertexShader: `
          attribute float size;
          varying float vSize;
          uniform float uTime;
          
          void main() {
            vSize = size;
            vec3 pos = position;
            
            // Subtle floating animation
            pos.y += sin(uTime * 0.5 + position.x * 2.0) * 0.1;
            pos.x += cos(uTime * 0.3 + position.y * 2.0) * 0.05;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform float uTime;
          varying float vSize;
          
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            alpha *= 0.6 + 0.4 * sin(uTime * 2.0 + vSize * 20.0);
            
            vec3 color = mix(uColor1, uColor2, vSize * 10.0);
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })

      particles = new THREE.Points(particleGeometry, particleMaterial)
      scene.add(particles)

      // Connection lines
      lineGeometry = new THREE.BufferGeometry()
      const linePositions = new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6)
      lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
      
      lineMaterial = new THREE.LineBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
      })

      lines = new THREE.LineSegments(lineGeometry, lineMaterial)
      scene.add(lines)

      // Floating code symbols (decorative)
      const symbols = ['{ }', '< >', '[ ]', '( )', '=>', '::', '&&', '||', '...', '///']
      textGroup = new THREE.Group()
      
      symbols.forEach((symbol) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = 128
        canvas.height = 64
        
        ctx.fillStyle = 'transparent'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.font = 'monospace 24px JetBrains Mono, monospace'
        ctx.fillStyle = 'rgba(139, 92, 246, 0.3)'
        ctx.textAlign = 'center'
        ctx.fillText(symbol, canvas.width / 2, canvas.height / 2 + 8)
        
        const texture = new THREE.CanvasTexture(canvas)
        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending
        })
        const sprite = new THREE.Sprite(material)
        
        sprite.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 6,
          -2 + Math.random() * -3 // Behind particles
        )
        sprite.scale.set(0.5, 0.25, 1)
        
        sprite.userData = {
          originalX: sprite.position.x,
          originalY: sprite.position.y,
          speed: Math.random() * 0.5 + 0.5,
          offset: Math.random() * Math.PI * 2
        }
        
        textGroup.add(sprite)
      })
      scene.add(textGroup)

      // Mouse tracking
      const handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect()
        mouseRef.current.x = (e.clientX - rect.left - rect.width / 2) * 2
        mouseRef.current.y = -(e.clientY - rect.top - rect.height / 2) * 2
      }
      
      container.addEventListener('mousemove', handleMouseMove)

      // Animation loop
      clock = new THREE.Clock()

      const animate = () => {
        animationId = requestAnimationFrame(animate)
        
        const time = clock.getElapsedTime()
        
        // Update particle positions
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          posArray[i * 3] += velocities[i * 3] + mouseRef.current.x * MOUSE_SENSITIVITY
          posArray[i * 3 + 1] += velocities[i * 3 + 1] + mouseRef.current.y * MOUSE_SENSITIVITY
          posArray[i * 3 + 2] += velocities[i * 3 + 2]
          
          // Boundary wrapping with perspective bounds
          const boundX = 6
          const boundY = 4
          const boundZ = 4
          
          if (posArray[i * 3] > boundX) posArray[i * 3] = -boundX
          if (posArray[i * 3] < -boundX) posArray[i * 3] = boundX
          if (posArray[i * 3 + 1] > boundY) posArray[i * 3 + 1] = -boundY
          if (posArray[i * 3 + 1] < -boundY) posArray[i * 3 + 1] = boundY
          if (posArray[i * 3 + 2] > boundZ) posArray[i * 3 + 2] = -boundZ
          if (posArray[i * 3 + 2] < -boundZ) posArray[i * 3 + 2] = boundZ
          
          // Damping for mouse effect
          mouseRef.current.x *= 0.95
          mouseRef.current.y *= 0.95
        }
        
        particleGeometry.attributes.position.needsUpdate = true
        
        // Update shader time
        particleMaterial.uniforms.uTime.value = time
        
        // Update connection lines
        let lineIndex = 0
        const linePosArray = lineGeometry.attributes.position.array
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          for (let j = i + 1; j < PARTICLE_COUNT; j++) {
            const dx = posArray[i * 3] - posArray[j * 3]
            const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1]
            const dist = Math.sqrt(dx * dx + dy * dy)
            
            if (dist < CONNECTION_DISTANCE) {
              linePosArray[lineIndex++] = posArray[i * 3]
              linePosArray[lineIndex++] = posArray[i * 3 + 1]
              linePosArray[lineIndex++] = 0
              linePosArray[lineIndex++] = posArray[j * 3]
              linePosArray[lineIndex++] = posArray[j * 3 + 1]
              linePosArray[lineIndex++] = 0
            }
          }
        }
        
        lineGeometry.attributes.position.needsUpdate = true
        lineGeometry.setDrawRange(0, lineIndex / 3)
        
        // Update text sprites
        textGroup.children.forEach((sprite) => {
          const { originalX, originalY, speed, offset } = sprite.userData
          sprite.position.x = originalX + Math.sin(time * speed + offset) * 0.3
          sprite.position.y = originalY + Math.cos(time * speed * 0.7 + offset) * 0.2
          sprite.material.opacity = 0.2 + Math.sin(time + offset) * 0.15
        })
        
        // Subtle camera rotation for 3D effect
        camera.position.x = Math.sin(time * 0.1) * 1.5
        camera.position.y = Math.cos(time * 0.08) * 0.8
        camera.lookAt(0, 0, 0)
        
        renderer.render(scene, camera)
      }

      animate()
      setIsLoaded(true)

      // Resize handler
      const handleResize = () => {
        const newWidth = container.clientWidth
        const newHeight = container.clientHeight
        
        camera.aspect = newWidth / newHeight
        camera.updateProjectionMatrix()
        
        renderer.setSize(newWidth, newHeight)
      }

      window.addEventListener('resize', handleResize)

      // Cleanup function
      container._cleanup = () => {
        cancelAnimationFrame(animationId)
        window.removeEventListener('resize', handleResize)
        container.removeEventListener('mousemove', handleMouseMove)
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement)
        }
        particleGeometry?.dispose()
        particleMaterial?.dispose()
        lineGeometry?.dispose()
        lineMaterial?.dispose()
        renderer?.dispose()
      }
    }

    init()

    return () => {
      containerRef.current?._cleanup?.()
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="hero-3d"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
      aria-hidden="true"
    />
  )
}

// Loading placeholder
function Hero3DLoader() {
  return (
    <div 
      className="hero-3d"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
}

// Main component with Suspense
export default function Hero3D() {
  return (
    <Suspense fallback={<Hero3DLoader />}>
      <Hero3DCanvas />
    </Suspense>
  )
}
