# Hero3D - 3D Hero Section for TR.dev

A stunning interactive 3D hero section built with Three.js, featuring a neural network / data flow visualization that fits the AI/edge computing aesthetic of TR.dev.

## Features

### Visual Design
- **Neural Network Particles**: 60 animated particles with connecting lines that create a neural network aesthetic
- **Color Scheme**: Purple (#8b5cf6) to Pink (#ec4899) gradient matching TR.dev's brand colors
- **Floating Code Symbols**: Decorative code symbols ({ }, < >, [ ], =>, etc.) that float in the background
- **Dynamic Connections**: Lines automatically connect nearby particles, creating the look of a living neural network

### Interactivity
- **Mouse-responsive Parallax**: Particles gently respond to mouse movement
- **Smooth Animations**: 60fps target with optimized rendering
- **Orthographic Camera**: 2D-like perspective that's cleaner for UI overlays

### Performance
- **Lazy-loaded Three.js**: Three.js only loads after the initial page render
- **Shader-based Rendering**: Custom WebGL shaders for GPU-accelerated particle effects
- **Optimized Geometry**: BufferGeometry with minimal draw calls
- **Dynamic Chunk Splitting**: Three.js loads in a separate chunk (719KB vs bundled)

### Accessibility
- **Respects prefers-reduced-motion**: Automatically disables for users with reduced motion preferences
- **Semantic HTML**: Hidden from screen readers with aria-hidden
- **Graceful Degradation**: Falls back gracefully if WebGL is unavailable

## Usage

```jsx
import Hero3D from './components/Hero3D'

function App() {
  return (
    <section className="hero">
      <Hero3D />
      <div className="hero__content">
        {/* Your hero content */}
      </div>
    </section>
  )
}
```

## CSS Requirements

The hero section needs these styles (already added to App.css):

```css
.hero {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero__content {
  position: relative;
  z-index: 1;
}

.hero-3d {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
```

## Customization

### Particle Count
Modify `PARTICLE_COUNT` in Hero3D.jsx (default: 60)

### Connection Distance
Modify `CONNECTION_DISTANCE` to change how close particles need to be to connect (default: 1.8)

### Colors
The colors are defined in the shader uniforms:
- `uColor1`: Purple (#8b5cf6) - primary
- `uColor2`: Pink (#ec4899) - secondary gradient

### Mouse Sensitivity
Modify `MOUSE_SENSITIVITY` to adjust parallax intensity (default: 0.0008)

## Technical Details

- **Framework**: React 19 + Vite
- **3D Library**: Three.js (lazy-loaded)
- **Rendering**: WebGL with custom GLSL shaders
- **Bundle Impact**: 
  - Initial JS: 334KB (gzip: 107KB)
  - Three.js chunk: 720KB (gzip: 185KB) - loaded on demand

## Browser Support

- Modern browsers with WebGL support
- Automatically disables on older browsers or if WebGL is unavailable
- Respects `prefers-reduced-motion` media query
