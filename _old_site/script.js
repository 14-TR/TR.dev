import * as THREE from 'three';

// --- Configuration ---
const config = {
    sunDistance: 400, // TEST: Bring closer along -Z
    sunRadius: 10.0,  // TEST: Increase size drastically
    earthRadius: 2.5,
    earthTilt: 0.0, // Keep tilt at 0 for pole alignment
    cloudOffset: 0.05,
    moonRadius: 0.35,
    moonOrbitRadius: 6,
    starfieldOpacity: 0.2,
    baseAmbientLight: 0.1,
    directionalLightIntensity: 1.5,
    initialEarthRotationY: 0,
};

// --- Global Variables (accessible by animate loop) ---
let scene, camera, renderer;
let sunLightSource;
let earthMaterial, globe, cloudLayer;
let moonOrbit, moonMesh;
let texturedSunMesh;
let scrollRotation = 0;
let currentTargetObject = null;
let cameraLookAtTarget = new THREE.Vector3();
let isCameraAnimating = false;
let cmeUniforms; // Add uniforms for CME shader
let softGlowUniforms; // Add uniforms for soft glow layer
let currentViewMode = 'hero'; // Add state variable to track the active view mode
const cameraFollowLerpFactor = 1.5; // Smoothing factor (INCREASED from 0.05 for tighter follow)
const racetrackLookAtLerpFactor = 0.5; // Separate, slower lerp for look-at during racetrack

// --- Setup Functions ---

function setupScene() {
    scene = new THREE.Scene();
    const canvas = document.getElementById('bg-canvas');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true 
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera = new THREE.PerspectiveCamera(
        50, // FOV
        window.innerWidth / window.innerHeight, // Aspect Ratio
        0.1, // Near Plane
        1000 // Far Plane
    );
    camera.position.z = 5;

    // Basic window resize handling (no composer)
    const onWindowResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        // Removed composer.setSize
    };
    window.addEventListener('resize', onWindowResize);
    // --- End Resize Setup ---
}

function createLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, config.baseAmbientLight);
    scene.add(ambientLight);

    sunLightSource = new THREE.PointLight(0xffffff, 2.0, 0, 0); // Increased intensity (2.0), No decay (0)
    sunLightSource.castShadow = true; // Enable shadows (may need tweaking)
    // PointLight shadow settings (adjust if needed)
    sunLightSource.shadow.mapSize.width = 1024; 
    sunLightSource.shadow.mapSize.height = 1024;
    sunLightSource.shadow.camera.near = 1;
    sunLightSource.shadow.camera.far = 600;
    // sunLightSource.shadow.bias = -0.005; // TEST: Temporarily removed bias

    scene.add(sunLightSource);
}

function createStarfield(textureLoader) {
    const starTexture = textureLoader.load('assets/2k_stars_milky_way.jpg');
    const starGeometry = new THREE.SphereGeometry(500, 64, 64);
    const starMaterial = new THREE.MeshBasicMaterial({
        map: starTexture,
        side: THREE.BackSide,
        transparent: true,
        opacity: config.starfieldOpacity
    });
    const starField = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starField); // Re-enable star field
}

function createSun(textureLoader) {
    const sunTexture = textureLoader.load('assets/8k_sun.jpg');
    const sunGeometry = new THREE.SphereGeometry(config.sunRadius, 64, 64);

    const sunMaterial = new THREE.MeshBasicMaterial({ 
        map: sunTexture, 
        color: 0xffffff,
        fog: false
    });
    texturedSunMesh = new THREE.Mesh(sunGeometry, sunMaterial);

    texturedSunMesh.position.set(-100, 0, -config.sunDistance);
    scene.add(texturedSunMesh);

    // === REMOVE Old Corona Code ===
    /*
    const coronaSize = config.sunRadius * 1.2;
    const coronaGeometry = new THREE.SphereGeometry(coronaSize, 64, 64);
    // ... uniforms, shaders, material, mesh creation ...
    scene.add(coronaMesh);
    */
    // === END REMOVAL ===

    // === Add CME Shader Layer ===
    const cmeSize = config.sunRadius * 1.01; // Slightly larger than sun radius (was config.sunRadius)
    const cmeGeometry = new THREE.SphereGeometry(cmeSize, 64, 64);

    // Define CME Shaders (Procedural 3D Noise Version)
    const cmeVertexShader = `
        // varying vec2 vUv; // No longer needed
        // varying vec3 vNormal; // No longer needed
        varying vec3 vPosition; // Use local position for stable noise input
        varying vec3 vWorldNormal;
        void main() {
          // vUv = uv; // No longer needed
          vPosition = position;
          vWorldNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    // Procedural Fragment Shader using 3D Simplex Noise
    const cmeFragmentShader = `
        // 3D Simplex Noise by Stefan Gustavson (stegu@itn.liu.se)
        // --- BEGIN SNOISE CODE ---
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

            // First corner
            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);

            // Other corners
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);

            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;

            // Permutations
            i = mod289(i);
            vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

            // Gradients: 7x7 points over a square, mapped onto an octahedron.
            float n_ = 0.142857142857; // 1.0/7.0
            vec3 ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z); // mod(p, 7*7)

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_); // mod(j, 7)

            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);

            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);

            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));

            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);

            // Normalize gradients
            vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

            // Mix final noise value
            vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }
        // --- END SNOISE CODE ---

        // --- BEGIN HUE TO RGB FUNCTION ---
        vec3 hue2rgb(float h){
            h = fract(h) * 6.0 - 2.0;
            vec3 rgb = vec3(abs(h - 1.0) - 1.0, 2.0 - abs(h), 0.0);
            return clamp(rgb, 0.0, 1.0);
        }
        // --- END HUE TO RGB FUNCTION ---

        uniform float u_time;
        uniform float u_noise_scale;
        uniform float u_flare_speed;

        // varying vec2 vUv; // No longer needed
        // varying vec3 vNormal; // No longer needed
        varying vec3 vPosition; // Local position
        varying vec3 vWorldNormal;

        void main() {
            float time = u_time * u_flare_speed;
            vec3 noisePos = vPosition * u_noise_scale;

            // Base layer: slower, larger scale noise
            float baseNoise = snoise(noisePos * 0.5 + vec3(0.0, 0.0, time * 0.2));
            float baseIntensity = smoothstep(-0.2, 0.5, baseNoise) * 0.6;

            // Flare layer: faster, smaller scale, modulated noise
            float flareNoiseMod = snoise(noisePos * 0.8 + vec3(time * 0.1));
            float flareNoise = snoise(noisePos * 2.0 + vec3(0.0, 0.0, time * 0.8 + flareNoiseMod * 2.0));
            // Use abs(flareNoise) for sharper edges / more jagged look
            float flareIntensity = smoothstep(0.2, 0.6, abs(flareNoise)) * 1.2; // Adjusted smoothstep range and multiplier

            // Combine intensities
            float totalIntensity = baseIntensity + flareIntensity;

            // Fresnel effect for limb brightening
            float fresnelBase = max(0.0, 1.0 - max(dot(vWorldNormal, vec3(0, 0, 1)), 0.0));
            float fresnel = pow(fresnelBase, 2.0);
            totalIntensity = totalIntensity * (0.5 + fresnel * 1.5);

            // Add a minimum intensity floor
            totalIntensity = max(totalIntensity, 0.08);

            // Coloring
            vec3 base_color = vec3(1.0, 0.3, 0.0);  // Deep orange base
            // Calculate hue based on noise and time for rainbow effect
            float hue = fract(flareNoise * 3.0 + time * 0.05);
            vec3 rainbow_flare_color = hue2rgb(hue);

            // Mix color based on flare intensity relative to total
            vec3 color = mix(base_color, rainbow_flare_color, smoothstep(0.0, 1.0, flareIntensity / (totalIntensity + 0.01)));

            // Final output
            gl_FragColor = vec4(color * totalIntensity, totalIntensity * 0.8);
        }
    `;

    // Initialize CME Uniforms (no changes needed here for now)
    cmeUniforms = {
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }, // Still needed if shader uses it
        u_noise_scale: { value: 1.5 }, // Adjusted scale for 3D noise
        u_flare_speed: { value: 0.05 } // Slowed down animation speed (was 0.3)
    };

    // CME Material
    const cmeMaterial = new THREE.ShaderMaterial({
        uniforms: cmeUniforms,
        vertexShader: cmeVertexShader,
        fragmentShader: cmeFragmentShader,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });

    const cmeMesh = new THREE.Mesh(cmeGeometry, cmeMaterial);
    cmeMesh.position.copy(texturedSunMesh.position); // Position with the sun
    scene.add(cmeMesh);
    // === End CME Layer ===

    // === Add Soft Glow Layer ===
    const softGlowSize = config.sunRadius * 1.3; // Larger than CME layer
    const softGlowGeometry = new THREE.SphereGeometry(softGlowSize, 64, 64);

    const softGlowVertexShader = `
        varying vec3 vWorldPosition;
        varying vec3 vWorldNormal;
        void main() {
            vec4 worldPos = modelMatrix * vec4( position, 1.0 );
            vWorldPosition = worldPos.xyz;
            vWorldNormal = normalize( normalMatrix * normal );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `;

    const softGlowFragmentShader = `
        uniform vec3 cameraPosition;
        varying vec3 vWorldPosition;
        varying vec3 vWorldNormal;

        void main() {
            vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
            // Safeguard pow base
            float intensityBase = max(0.0, 1.0 - max(dot(vWorldNormal, viewDirection), 0.0));
            float intensity = pow(intensityBase, 3.5); // Adjust exponent (3.0 - 5.0) for falloff
            float opacity = 0.3; // Base opacity

            // Fade out softly, avoiding sharp cutoff
            intensity = smoothstep(0.0, 0.8, intensity);

            gl_FragColor = vec4(1.0, 0.3, 0.0, intensity * opacity); // Deep orange glow
        }
    `;

    softGlowUniforms = {
        cameraPosition: { value: new THREE.Vector3() },
        u_time: { value: 0.0 }
    };

    const softGlowMaterial = new THREE.ShaderMaterial( {
        uniforms: softGlowUniforms,
        vertexShader: softGlowVertexShader,
        fragmentShader: softGlowFragmentShader,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });

    // --- Temporarily comment out Soft Glow Mesh creation and addition ---
    /*
    const softGlowMesh = new THREE.Mesh(softGlowGeometry, softGlowMaterial);
    softGlowMesh.position.copy(texturedSunMesh.position);
    scene.add(softGlowMesh);
    */
    // === End Soft Glow Layer ===

    if (sunLightSource) {
        sunLightSource.position.copy(texturedSunMesh.position);

        // === REMOVED Lens Flare ===
        /*
        const textureFlare0 = textureLoader.load( 'assets/lensflare0.png' );
        const textureFlare3 = textureLoader.load( 'assets/lensflare3.png' );

        const lensflare = new Lensflare();
        lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, sunLightSource.color ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );

        sunLightSource.add( lensflare ); 
        */
        // === END REMOVED Lens Flare ===
    }
}

function createEarth(textureLoader) {
    const earthTexture = textureLoader.load('assets/2k_earth_daymap.jpg');
    const nightTexture = textureLoader.load('assets/2k_earth_nightmap.jpg');
    const cloudTexture = textureLoader.load('assets/2k_earth_clouds.jpg');

    const geometry = new THREE.SphereGeometry(config.earthRadius, 64, 64);

    // Earth Shader Material
    earthMaterial = new THREE.ShaderMaterial({ // Assign to global
        uniforms: {
            dayTexture: { value: earthTexture },
            nightTexture: { value: nightTexture },
            lightPosition: { value: sunLightSource.position }
        },
        vertexShader: `
            precision mediump float;
            varying vec2 vUv;
            // varying vec3 vNormal; <-- Remove View Space Normal varying
            varying vec3 vViewPosition;
            varying vec3 vWorldPosition;
            varying vec3 vWorldNormal; // <-- Add World Space Normal varying

            void main() {
                vUv = uv;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                // vNormal = normalize(normalMatrix * normal);
                vViewPosition = -mvPosition.xyz;
                vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                // Calculate world normal: transform normal by model matrix (ignore translation), then normalize
                vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz); 
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            precision mediump float;
            uniform sampler2D dayTexture; uniform sampler2D nightTexture; 
            uniform vec3 lightPosition;

            varying vec2 vUv; 
            // varying vec3 vNormal; <-- Remove View Space Normal varying
            varying vec3 vViewPosition;
            varying vec3 vWorldPosition;
            varying vec3 vWorldNormal; // <-- Add World Space Normal varying

            void main() {
                // Calculate light direction per-fragment (World Space)
                vec3 lightDir = normalize(lightPosition - vWorldPosition);

                // Calculate NdotL using World Space normal and World Space light direction
                // float NdotL = max(dot(normalize(vNormal), lightDir), 0.0);
                float NdotL = max(dot(normalize(vWorldNormal), lightDir), 0.0); 

                vec4 dayColor = texture2D(dayTexture, vUv); vec4 nightColor = texture2D(nightTexture, vUv);
                float mixFactor = smoothstep(0.0, 0.25, NdotL);
                
                // Output only the blended color (TEST from previous step)
                vec3 blendedColor = mix(nightColor.rgb, dayColor.rgb, mixFactor); 
                gl_FragColor = vec4(blendedColor, 1.0);
                // === END TEST ===
            }
        `
    });

    globe = new THREE.Mesh(geometry, earthMaterial); // Assign to global
    globe.castShadow = true;
    globe.receiveShadow = true;
    globe.rotation.x = 0.0;
    globe.rotation.z = config.earthTilt;
    globe.rotation.y = config.initialEarthRotationY;
    globe.position.set(7, -3, -5); // Keep current position
    scene.add(globe);

    // Cloud Layer
    const cloudGeometry = new THREE.SphereGeometry(config.earthRadius + config.cloudOffset, 64, 64);
    const cloudMaterial = new THREE.MeshStandardMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    cloudLayer = new THREE.Mesh(cloudGeometry, cloudMaterial); // Assign to global
    cloudLayer.rotation.copy(globe.rotation);
    cloudLayer.position.copy(globe.position);
    scene.add(cloudLayer);
}

function createMoon(textureLoader) {
    const moonTexture = textureLoader.load('assets/2k_moon.jpg');
    moonOrbit = new THREE.Group();
    moonOrbit.position.copy(globe.position);
    scene.add(moonOrbit);

    const moonGeometry = new THREE.SphereGeometry(config.moonRadius, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({
        map: moonTexture,
        roughness: 0.9
    });
    moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.x = config.moonOrbitRadius;
    moonMesh.castShadow = true;
    moonMesh.receiveShadow = true;
    moonOrbit.add(moonMesh);
}

function setupEventListeners() {
    // Resize Listener
    window.addEventListener('resize', () => {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        // Update CME Shader Resolution
        if (cmeUniforms) {
            cmeUniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
        }
    }, false);

    // Scroll Listener
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollRotation = (docHeight > 0) ? (scrollY / docHeight) * Math.PI * 2 : 0; // Avoid division by zero
    });

    // === Intersection Observer for Scroll Targets ===
    const sections = document.querySelectorAll('main > section[id]'); // Get all sections with IDs
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.6 // Trigger when 60% of the section is visible
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                triggerCameraAnimation(sectionId);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));
    // === End Intersection Observer ===
}

function initUIAnimations() {
    // Title Flicker Randomization
    document.addEventListener('DOMContentLoaded', () => {
        const headings = document.querySelectorAll('h1, h2, h3');
        headings.forEach(heading => {
            const randomDelay = Math.random() * -6;
            heading.style.setProperty('--title-flicker-delay', `${randomDelay}s`);
        });
        
        // Initialize Splitting & AOS here if they are still needed globally
        // If Splitting() / AOS.init() were called elsewhere, ensure they are called after DOMContentLoaded
        // Example: if(typeof Splitting !== 'undefined') { Splitting(); }
        // Example: if(typeof AOS !== 'undefined') { AOS.init(); }
    });
}

// === Camera Tweening Logic ===
const scrollTargets = {
    // Target object function and offset Vector3 relative to target's world position
    'hero':       { target: () => globe,           offset: new THREE.Vector3(0, 0, 10) },    // Focus Earth
    'about':      { target: () => moonMesh },                                               // Center Moon (offset calculated dynamically)
    'skills':     { target: () => moonMesh },  // <<< Target Moon, position calculated dynamically
    'projects':   { target: () => globe },     // <<< Target Globe, position calculated dynamically (racetrack)
    'experience': { target: () => texturedSunMesh, offset: new THREE.Vector3(-40, 0, 5) },    // Sun Close-up (Zoomed In More)
    'education':  { target: () => globe,           offset: new THREE.Vector3(0, 0, 10) },    // Return Earth Focus
    'contact':    { target: () => globe,           offset: new THREE.Vector3(0, 0, 15) }     // Wider Earth Focus
};

function triggerCameraAnimation(sectionId) {
    const targetInfo = scrollTargets[sectionId];
    if (!targetInfo || !targetInfo.target) {
        return;
    }

    const targetObject = targetInfo.target();
    if (!targetObject && sectionId !== 'racetrack') { // Allow null target for racetrack
        return; 
    }
    
    if (targetObject === currentTargetObject && !isCameraAnimating && targetObject !== moonMesh) {
        return; 
    }
    
    isCameraAnimating = true;

    const targetPosition = new THREE.Vector3();
    if(targetObject) targetObject.getWorldPosition(targetPosition); 

    let cameraTargetPosition = new THREE.Vector3();
    let lookAtTargetPosition = targetPosition.clone(); // Default: Look at the target's center (might be 0,0,0 if no targetObject)

    // === Special Case for Moon View ('about') ===
    if (sectionId === 'about' && targetObject === moonMesh /* && globe */) {
        currentViewMode = 'moon_about'; 
        lookAtTargetPosition.copy(targetPosition); 
    
    // === Special Case for Moon View ('skills') ===
    } else if (sectionId === 'skills' && targetObject === moonMesh && globe) {
        currentViewMode = 'moon_skills'; 
        const earthPosition = new THREE.Vector3();
        globe.getWorldPosition(earthPosition);
        const moonPosition = targetPosition; 

        // Calculate side vector (same as before)
        const earthToMoonDir = new THREE.Vector3().subVectors(moonPosition, earthPosition).normalize();
        const upVector = new THREE.Vector3(0, 1, 0);
        const sideVector = new THREE.Vector3().crossVectors(earthToMoonDir, upVector).normalize();

        // Calculate target position for the *tween*
        const cameraDistanceSideways = 7; 
        const cameraHeightOffset = 1; 
        cameraTargetPosition.copy(moonPosition)
            .addScaledVector(sideVector, cameraDistanceSideways)
            .addScaledVector(upVector, cameraHeightOffset); 

        // Look at the Earth's center
        lookAtTargetPosition.copy(earthPosition);

        currentTargetObject = targetObject; 

    // === Special Case for Racetrack View ('projects') ===
    } else if (sectionId === 'projects' && globe && texturedSunMesh) { 
        currentViewMode = 'racetrack'; 
        
        // Calculate initial tween targets - position slightly above midpoint, looking towards midpoint
        const earthPos = new THREE.Vector3();
        const sunPos = new THREE.Vector3();
        globe.getWorldPosition(earthPos);
        texturedSunMesh.getWorldPosition(sunPos);
        const midPoint = new THREE.Vector3().lerpVectors(earthPos, sunPos, 0.5);
        
        // Start position somewhat far, offset from midpoint
        cameraTargetPosition.copy(midPoint).add(new THREE.Vector3(0, 50, 150)); 
        lookAtTargetPosition.copy(midPoint); 
        currentTargetObject = null; 

    } else {
        // Default Case: Use fixed offset or specific logic (e.g., experience)
        currentViewMode = sectionId; 
        if (targetInfo.offset) {
             cameraTargetPosition = targetPosition.clone().add(targetInfo.offset);
             lookAtTargetPosition = targetPosition.clone(); 
             if (sectionId === 'experience') {
                 lookAtTargetPosition.x -= 34; 
             }
        } else if (targetObject) { // Fallback only if there *was* a target but no offset
             cameraTargetPosition = targetPosition.clone().add(new THREE.Vector3(0, 0, 10));
        } else {
             // No target object and no offset, maybe default view?
             cameraTargetPosition.set(0, 0, 15); // Example default position
             lookAtTargetPosition.set(0, 0, 0); // Look at origin
        }
        currentTargetObject = targetObject; 
    }
    // === End Special Cases ===

    const duration = 2000; 

    TWEEN.removeAll(); 

    // Tween Camera Position (Skip for 'about' Moon target)
    if (currentViewMode !== 'moon_about') { 
        new TWEEN.Tween(camera.position)
            .to(cameraTargetPosition, duration)
            .easing(TWEEN.Easing.Quintic.InOut) 
            .start();
    }

    // Tween LookAt Target Vector (Always tween lookAt)
    new TWEEN.Tween(cameraLookAtTarget)
        .to(lookAtTargetPosition, duration)
        .easing(TWEEN.Easing.Quintic.InOut) 
        .onComplete(() => {
            isCameraAnimating = false;
        })
        .start();
}
// === End Camera Tweening Logic ===

// --- Animation Loop ---
function animate(time) {
    requestAnimationFrame(animate);
    const timeSeconds = time * 0.001; 

    TWEEN.update(time); 

    // === Continuous Camera Position Update for Moon Views (Post-Tween) ===
    if (!isCameraAnimating && globe && moonMesh && texturedSunMesh) { // Added sun check
        if (currentViewMode === 'moon_about') {
            const earthPos = new THREE.Vector3();
            const moonPos = new THREE.Vector3();
            globe.getWorldPosition(earthPos);
            moonMesh.getWorldPosition(moonPos);
            const earthToMoonDir = new THREE.Vector3().subVectors(moonPos, earthPos).normalize();
            const cameraDistanceBehindMoon = 5;
            const targetCamPos = new THREE.Vector3().copy(moonPos).addScaledVector(earthToMoonDir, cameraDistanceBehindMoon);
            // Smoothly interpolate camera position towards the target
            camera.position.lerp(targetCamPos, cameraFollowLerpFactor); 
            
        } else if (currentViewMode === 'moon_skills') {
            const earthPos = new THREE.Vector3();
            const moonPos = new THREE.Vector3();
            globe.getWorldPosition(earthPos);
            moonMesh.getWorldPosition(moonPos);
            const earthToMoonDir = new THREE.Vector3().subVectors(moonPos, earthPos).normalize();
            const upVector = new THREE.Vector3(0, 1, 0);
            const sideVector = new THREE.Vector3().crossVectors(earthToMoonDir, upVector).normalize();
            const cameraDistanceSideways = 7; 
            const cameraHeightOffset = 1; 
            const targetCamPos = new THREE.Vector3().copy(moonPos)
                .addScaledVector(sideVector, cameraDistanceSideways)
                .addScaledVector(upVector, cameraHeightOffset); 
            // Smoothly interpolate camera position towards the target
            camera.position.lerp(targetCamPos, cameraFollowLerpFactor); 
        } else if (currentViewMode === 'racetrack') {
            const earthPos = new THREE.Vector3();
            const sunPos = new THREE.Vector3();
            globe.getWorldPosition(earthPos);
            texturedSunMesh.getWorldPosition(sunPos);
            
            const centerPoint = new THREE.Vector3().lerpVectors(earthPos, sunPos, 0.5);
            const orbitRadiusX = earthPos.distanceTo(sunPos) * 0.6; // Adjust scale as needed
            const orbitRadiusZ = earthPos.distanceTo(sunPos) * 0.4;
            const orbitSpeed = 0.15; // Adjust speed
            const cameraHeight = 20; // Height above the center plane

            // Calculate target position on ellipse
            const angle = timeSeconds * orbitSpeed;
            const targetCamPosX = centerPoint.x + Math.cos(angle) * orbitRadiusX;
            const targetCamPosY = centerPoint.y + cameraHeight;
            const targetCamPosZ = centerPoint.z + Math.sin(angle) * orbitRadiusZ;
            const targetCamPos = new THREE.Vector3(targetCamPosX, targetCamPosY, targetCamPosZ);
            
            // Calculate look-at point slightly ahead on the path
            const lookAheadAngle = angle + 0.4; // Look ahead factor (radians)
            const lookAheadPosX = centerPoint.x + Math.cos(lookAheadAngle) * orbitRadiusX * 0.8; // Look slightly inwards
            const lookAheadPosY = centerPoint.y + cameraHeight * 0.5; // Look slightly down
            const lookAheadPosZ = centerPoint.z + Math.sin(lookAheadAngle) * orbitRadiusZ * 0.8;
            const targetLookAt = new THREE.Vector3(lookAheadPosX, lookAheadPosY, lookAheadPosZ);
            
            // Smoothly interpolate camera position and lookAt target
            camera.position.lerp(targetCamPos, cameraFollowLerpFactor); 
            cameraLookAtTarget.lerp(targetLookAt, racetrackLookAtLerpFactor); // Use separate lerp for lookAt
        }
    }
    // === End Continuous Update ===

    // Apply camera position/lookAt updated by TWEEN or the continuous logic above
    // Ensure cameraLookAtTarget is initialized (should be done at the end of init)
    if (cameraLookAtTarget) {
        camera.lookAt(cameraLookAtTarget); 
    } else {
        camera.lookAt(0,0,0); // Absolute fallback
    }
    
    // Update CME shader time
    if (cmeUniforms) {
        cmeUniforms.u_time.value = timeSeconds; // Use seconds
    }
    // Update soft glow time
    if (softGlowUniforms) {
        softGlowUniforms.u_time.value = timeSeconds; // Use seconds
    }

    // === Apply Object Rotations (No Scroll Influence) ===
    // Apply scroll-based rotation - REMOVED
    // const rotationAmount = scrollRotation * Math.PI * 2 * 0.15; 
    if (globe) {
        // Continuous spin only
        const earthContinuousSpeed = 0.05; // REVERTED to slower speed (was 0.5)
        globe.rotation.y = config.initialEarthRotationY + timeSeconds * earthContinuousSpeed; 
        // Continuous cloud spin only
        cloudLayer.rotation.y = config.initialEarthRotationY + timeSeconds * (earthContinuousSpeed + 0.01); // Adjusted cloud speed relative to new earth speed
    }

    // Moon Orbit and Revolution Calculation (No Scroll Influence)
    if (moonOrbit) {
        const moonRevolutionSpeed = 0.1; // REVERTED to slower speed (was 0.8)
        // Base revolution only
        moonOrbit.rotation.y = timeSeconds * moonRevolutionSpeed;
    }
    // === End Object Rotations ===

    // Apply Tidal Lock to Moon Mesh
    if (moonMesh && moonOrbit) { 
        moonMesh.rotation.y = -moonOrbit.rotation.y - (Math.PI / 2);
    }

    // === USE DIRECT RENDERER ===
    renderer.render(scene, camera); // Use direct rendering
    // === END DIRECT RENDERER ===
}

// --- Initialization ---

try {
    setupScene();
    createLighting(); // Needs scene
    const textureLoaderInstance = new THREE.TextureLoader();
    createStarfield(textureLoaderInstance); // Needs scene
    createSun(textureLoaderInstance); // Needs scene, sunLightSource
    createEarth(textureLoaderInstance); // Needs scene, sunLightSource
    createMoon(textureLoaderInstance);  // Needs scene, globe
    setupEventListeners(); // Needs camera, renderer
    initUIAnimations(); // Sets up DOM-dependent UI animations

    // Set initial lookAt target
    if (texturedSunMesh) {
        texturedSunMesh.getWorldPosition(cameraLookAtTarget);
    } else if (globe) {
        globe.getWorldPosition(cameraLookAtTarget);
    } // else leave at 0,0,0

    animate(); // Needs renderer, scene, camera and other animated objects
} catch (error) {
    console.error("Error during initialization or animation:", error);
    // Optionally display an error message to the user on the page
} 