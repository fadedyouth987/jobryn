import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Box, 
  RotateCw, 
  Eye, 
  Sparkles, 
  Maximize2, 
  Layers, 
  Download, 
  Palette, 
  Zap, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Activity,
  UserCheck,
  Radio,
  Sliders,
  Check,
  RefreshCw,
  Camera
} from 'lucide-react';

export interface ThreeDModelOption {
  id: string;
  name: string;
  category: 'character' | 'product' | 'hardware' | 'trophy';
  influencerName: string;
  tagline: string;
  polyCount: string;
  vertices: string;
  textures: string;
  primaryColor: string;
  glowColor: string;
}

const MODEL_PRESETS: ThreeDModelOption[] = [
  {
    id: 'sophia-cyber',
    name: 'Sophia Chen - Cyber Avatar Spec v4',
    category: 'character',
    influencerName: 'Sophia Chen',
    tagline: 'Hyper-detailed 3D virtual presenter mesh with procedural facial node rig.',
    polyCount: '48,200 Polys',
    vertices: '24,150 Verts',
    textures: '4K PBR Metallic/Roughness',
    primaryColor: '#6366f1', // Indigo
    glowColor: '#38bdf8'   // Sky Blue
  },
  {
    id: 'aether-glasses',
    name: 'AetherVision Pro Spatial Glasses',
    category: 'product',
    influencerName: 'Marcus Thorne',
    tagline: 'Titanium-alloy spatial smart glasses with dual optical waveguide lenses.',
    polyCount: '32,400 Polys',
    vertices: '18,200 Verts',
    textures: '4K Anisotropic Metal & Glass',
    primaryColor: '#ec4899', // Pink
    glowColor: '#a855f7'   // Purple
  },
  {
    id: 'genesis-core',
    name: 'Genesis AI Autonomous Server Pod',
    category: 'hardware',
    influencerName: 'Elena Vance',
    tagline: 'Liquid-cooled enterprise AI compute node with animated core glow.',
    polyCount: '64,100 Polys',
    vertices: '38,900 Verts',
    textures: '4K Carbon Fiber & Glass',
    primaryColor: '#10b981', // Emerald
    glowColor: '#34d399'   // Mint
  },
  {
    id: 'aura-trophy',
    name: 'Aura Gold Campaign Trophy',
    category: 'trophy',
    influencerName: 'Maya Lin',
    tagline: 'Floating 3D geometric award emblem for top-performing campaigns.',
    polyCount: '19,800 Polys',
    vertices: '10,400 Verts',
    textures: '24k Gold Metallic Reflection',
    primaryColor: '#f59e0b', // Amber
    glowColor: '#fbbf24'   // Yellow
  }
];

export const ThreeDAssetViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedModelId, setSelectedModelId] = useState<string>('sophia-cyber');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.008);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [lightingPreset, setLightingPreset] = useState<'cyber' | 'studio' | 'sunset' | 'deepspace'>('cyber');
  const [materialMode, setMaterialMode] = useState<'pbr' | 'hologram' | 'gold' | 'glass'>('pbr');
  const [particleDensity, setParticleDensity] = useState<number>(180);
  const [fps, setFps] = useState<number>(60);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const selectedModel = MODEL_PRESETS.find((m) => m.id === selectedModelId) || MODEL_PRESETS[0];

  // Refs for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const particlesMeshRef = useRef<THREE.Points | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090d16); // Dark sleek slate background
    scene.fog = new THREE.FogExp2(0x090d16, 0.08);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights Group
    const lightsGroup = new THREE.Group();
    lightsGroupRef.current = lightsGroup;
    scene.add(lightsGroup);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    lightsGroup.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0x6366f1, 2.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    lightsGroup.add(keyLight);

    // Fill Light
    const fillLight = new THREE.PointLight(0x38bdf8, 2, 20);
    fillLight.position.set(-4, 3, -2);
    lightsGroup.add(fillLight);

    // Rim Light
    const rimLight = new THREE.PointLight(0xa855f7, 3, 15);
    rimLight.position.set(0, -3, -4);
    lightsGroup.add(rimLight);

    // 5. Grid Floor (Turntable Stage)
    const gridHelper = new THREE.GridHelper(12, 24, 0x334155, 0x1e293b);
    gridHelper.position.y = -1.2;
    scene.add(gridHelper);

    // Ring Base
    const ringGeo = new THREE.RingGeometry(1.6, 1.7, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x6366f1, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.19;
    scene.add(ringMesh);

    // 6. Main Model Group
    const mainGroup = new THREE.Group();
    mainGroupRef.current = mainGroup;
    scene.add(mainGroup);

    // 7. Particle Background
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 12;
      posArray[i + 1] = (Math.random() - 0.5) * 8;
      posArray[i + 2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particleGeo, particleMat);
    particlesMeshRef.current = particlesMesh;
    scene.add(particlesMesh);

    // Animation Loop Variables
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // FPS Counter
      frameCount++;
      if (time - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastTime)));
        frameCount = 0;
        lastTime = time;
      }

      // Auto rotation
      if (mainGroupRef.current && autoRotate && !isDraggingRef.current) {
        mainGroupRef.current.rotation.y += rotationSpeed;
      }

      // Float particles
      if (particlesMeshRef.current) {
        particlesMeshRef.current.rotation.y += 0.001;
      }

      // Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate(performance.now());

    // Mouse Drag Rotation Controls
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !mainGroupRef.current) return;

      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      mainGroupRef.current.rotation.y += deltaX * 0.008;
      mainGroupRef.current.rotation.x += deltaY * 0.008;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!cameraRef.current) return;
      cameraRef.current.position.z += e.deltaY * 0.003;
      cameraRef.current.position.z = Math.max(2.5, Math.min(cameraRef.current.position.z, 9));
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domEl.addEventListener('wheel', handleWheel, { passive: true });

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      domEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domEl.removeEventListener('wheel', handleWheel);
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, []);

  // Re-build 3D Geometry mesh when model, wireframe, or material mode changes
  useEffect(() => {
    const mainGroup = mainGroupRef.current;
    if (!mainGroup) return;

    // Clear previous mesh
    while (mainGroup.children.length > 0) {
      const obj = mainGroup.children[0];
      mainGroup.remove(obj);
    }

    const primaryColor = new THREE.Color(selectedModel.primaryColor);
    const glowColor = new THREE.Color(selectedModel.glowColor);

    // Material setup
    let meshMat: THREE.Material;

    if (materialMode === 'hologram') {
      meshMat = new THREE.MeshBasicMaterial({
        color: glowColor,
        wireframe: true,
        transparent: true,
        opacity: 0.8
      });
    } else if (materialMode === 'gold') {
      meshMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.95,
        roughness: 0.15,
        wireframe
      });
    } else if (materialMode === 'glass') {
      meshMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.5,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.9,
        wireframe
      });
    } else {
      // PBR Standard
      meshMat = new THREE.MeshStandardMaterial({
        color: primaryColor,
        metalness: 0.6,
        roughness: 0.2,
        wireframe
      });
    }

    // Build specific 3D Shape based on model selected
    if (selectedModel.id === 'sophia-cyber') {
      // Character Avatar Bust
      const group = new THREE.Group();

      // Head (Sphere)
      const headGeo = new THREE.SphereGeometry(0.7, 32, 32);
      const headMesh = new THREE.Mesh(headGeo, meshMat);
      headMesh.position.y = 0.5;
      group.add(headMesh);

      // Cyber Halo / Visor
      const visorGeo = new THREE.TorusGeometry(0.75, 0.05, 16, 64);
      const visorMat = new THREE.MeshStandardMaterial({ color: glowColor, emissive: glowColor, emissiveIntensity: 0.6 });
      const visorMesh = new THREE.Mesh(visorGeo, visorMat);
      visorMesh.rotation.x = Math.PI / 2.5;
      visorMesh.position.y = 0.55;
      group.add(visorMesh);

      // Neck / Shoulders Base
      const bodyGeo = new THREE.CylinderGeometry(0.3, 0.9, 1.2, 32);
      const bodyMesh = new THREE.Mesh(bodyGeo, meshMat);
      bodyMesh.position.y = -0.5;
      group.add(bodyMesh);

      // Floating Hologram HUD Rings
      const hudGeo = new THREE.RingGeometry(1.0, 1.05, 32);
      const hudMat = new THREE.MeshBasicMaterial({ color: glowColor, side: THREE.DoubleSide });
      const hudMesh = new THREE.Mesh(hudGeo, hudMat);
      hudMesh.position.y = 0.1;
      hudMesh.rotation.x = Math.PI / 2;
      group.add(hudMesh);

      mainGroup.add(group);

    } else if (selectedModel.id === 'aether-glasses') {
      // Spatial Glasses
      const group = new THREE.Group();

      // Frame
      const frameGeo = new THREE.BoxGeometry(2.2, 0.6, 0.2);
      const frameMesh = new THREE.Mesh(frameGeo, meshMat);
      group.add(frameMesh);

      // Lenses (Left & Right)
      const lensGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.05, 32);
      const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7, roughness: 0.05 });
      
      const leftLens = new THREE.Mesh(lensGeo, lensMat);
      leftLens.rotation.x = Math.PI / 2;
      leftLens.position.set(-0.55, 0, 0.08);
      group.add(leftLens);

      const rightLens = new THREE.Mesh(lensGeo, lensMat);
      rightLens.rotation.x = Math.PI / 2;
      rightLens.position.set(0.55, 0, 0.08);
      group.add(rightLens);

      // Side Temples
      const templeGeo = new THREE.BoxGeometry(0.1, 0.1, 1.5);
      const templeLeft = new THREE.Mesh(templeGeo, meshMat);
      templeLeft.position.set(-1.05, 0, -0.7);
      group.add(templeLeft);

      const templeRight = new THREE.Mesh(templeGeo, meshMat);
      templeRight.position.set(1.05, 0, -0.7);
      group.add(templeRight);

      mainGroup.add(group);

    } else if (selectedModel.id === 'genesis-core') {
      // AI Server Pod Cube
      const group = new THREE.Group();

      // Outer Cage
      const outerGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
      const outerMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, wireframe: true });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      group.add(outerMesh);

      // Inner Glowing Core
      const coreGeo = new THREE.OctahedronGeometry(0.7, 2);
      const coreMat = new THREE.MeshStandardMaterial({
        color: glowColor,
        emissive: glowColor,
        emissiveIntensity: 0.8,
        wireframe
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      group.add(coreMesh);

      // Orbiting Satellites
      for (let i = 0; i < 4; i++) {
        const satGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const satMesh = new THREE.Mesh(satGeo, meshMat);
        const angle = (i / 4) * Math.PI * 2;
        satMesh.position.set(Math.cos(angle) * 1.3, 0, Math.sin(angle) * 1.3);
        group.add(satMesh);
      }

      mainGroup.add(group);

    } else if (selectedModel.id === 'aura-trophy') {
      // Diamond Trophy
      const group = new THREE.Group();

      // Top Gem Diamond
      const gemGeo = new THREE.OctahedronGeometry(1.0, 0);
      const gemMesh = new THREE.Mesh(gemGeo, meshMat);
      gemMesh.position.y = 0.5;
      group.add(gemMesh);

      // Pedestal Base
      const baseGeo = new THREE.CylinderGeometry(0.9, 1.1, 0.5, 8);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = -0.8;
      group.add(baseMesh);

      // Floating Glow Ring
      const ringGeo = new THREE.TorusGeometry(1.2, 0.04, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: glowColor });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.5;
      group.add(ringMesh);

      mainGroup.add(group);
    }
  }, [selectedModelId, wireframe, materialMode]);

  // Update lighting preset
  useEffect(() => {
    const lightsGroup = lightsGroupRef.current;
    if (!lightsGroup) return;

    const keyLight = lightsGroup.children[1] as THREE.DirectionalLight;
    const fillLight = lightsGroup.children[2] as THREE.PointLight;
    const rimLight = lightsGroup.children[3] as THREE.PointLight;

    if (lightingPreset === 'cyber') {
      keyLight?.color.setHex(0x6366f1);
      fillLight?.color.setHex(0x38bdf8);
      rimLight?.color.setHex(0xa855f7);
    } else if (lightingPreset === 'studio') {
      keyLight?.color.setHex(0xffffff);
      fillLight?.color.setHex(0xe2e8f0);
      rimLight?.color.setHex(0x94a3b8);
    } else if (lightingPreset === 'sunset') {
      keyLight?.color.setHex(0xf59e0b);
      fillLight?.color.setHex(0xef4444);
      rimLight?.color.setHex(0xec4899);
    } else if (lightingPreset === 'deepspace') {
      keyLight?.color.setHex(0x06b6d4);
      fillLight?.color.setHex(0x3b82f6);
      rimLight?.color.setHex(0x10b981);
    }
  }, [lightingPreset]);

  // Simulate GLTF / USDZ AR Export
  const handleExportModel = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1800);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Bar Header */}
      <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-600/30">
            <Box className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-white tracking-tight">Interactive 3D Asset Studio Canvas</h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                WebGL 2.0 Real-Time
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              Drag mouse to rotate • Scroll to zoom • Toggle wireframe & lighting shaders
            </p>
          </div>
        </div>

        {/* Model Selection Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs overflow-x-auto">
          {MODEL_PRESETS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModelId(m.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                selectedModelId === m.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{m.name.split('-')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left WebGL Viewport (7 cols) + Right Controls & Metadata (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* 3D Canvas Stage */}
        <div className="lg:col-span-7 relative bg-slate-950 min-h-[420px] flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Canvas Mount Container */}
          <div ref={mountRef} className="w-full h-[440px] cursor-grab active:cursor-grabbing" />

          {/* On-Canvas Overlay Badges */}
          <div className="absolute top-4 left-4 flex items-center space-x-2 pointer-events-none">
            <span className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-emerald-400 border border-slate-800 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{fps} FPS</span>
            </span>

            <span className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-slate-300 border border-slate-800">
              {selectedModel.polyCount}
            </span>
          </div>

          {/* On-Canvas Floating Quick Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto bg-slate-950/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-colors ${
                  autoRotate ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                <span>Auto-Turntable</span>
              </button>

              <button
                onClick={() => setWireframe(!wireframe)}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-colors ${
                  wireframe ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Wireframe Mesh</span>
              </button>
            </div>

            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              Camera: Perspective (45°)
            </span>
          </div>
        </div>

        {/* Right Control & Campaign Specs Column */}
        <div className="lg:col-span-5 p-6 space-y-6 bg-slate-900/60">
          {/* Active Model Title */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded border border-indigo-800">
                Associated Influencer: {selectedModel.influencerName}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">PBR Shaded</span>
            </div>
            <h4 className="text-lg font-extrabold text-white mt-1.5">{selectedModel.name}</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{selectedModel.tagline}</p>
          </div>

          {/* Material Shader Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center space-x-2">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>Material Shader Mode</span>
            </label>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setMaterialMode('pbr')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  materialMode === 'pbr'
                    ? 'bg-indigo-950 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                PBR Metallic Standard
              </button>

              <button
                onClick={() => setMaterialMode('hologram')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  materialMode === 'hologram'
                    ? 'bg-sky-950 border-sky-500 text-sky-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Hologram Wire Mesh
              </button>

              <button
                onClick={() => setMaterialMode('gold')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  materialMode === 'gold'
                    ? 'bg-amber-950 border-amber-500 text-amber-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                24k Gold Metallic
              </button>

              <button
                onClick={() => setMaterialMode('glass')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  materialMode === 'glass'
                    ? 'bg-purple-950 border-purple-500 text-purple-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Physical Glass
              </button>
            </div>
          </div>

          {/* Studio Lighting Environment Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center space-x-2">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Studio Lighting Setup</span>
            </label>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setLightingPreset('cyber')}
                className={`p-2 rounded-xl border text-left text-xs font-semibold ${
                  lightingPreset === 'cyber' ? 'bg-indigo-900/60 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Cyber Neon Trio
              </button>

              <button
                onClick={() => setLightingPreset('studio')}
                className={`p-2 rounded-xl border text-left text-xs font-semibold ${
                  lightingPreset === 'studio' ? 'bg-indigo-900/60 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                High-Key Studio Softbox
              </button>

              <button
                onClick={() => setLightingPreset('sunset')}
                className={`p-2 rounded-xl border text-left text-xs font-semibold ${
                  lightingPreset === 'sunset' ? 'bg-indigo-900/60 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Sunset Gold Hour
              </button>

              <button
                onClick={() => setLightingPreset('deepspace')}
                className={`p-2 rounded-xl border text-left text-xs font-semibold ${
                  lightingPreset === 'deepspace' ? 'bg-indigo-900/60 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Deep Space Cyan
              </button>
            </div>
          </div>

          {/* Technical Mesh Specs Table */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Polygon Count</span>
              <span className="font-mono text-slate-200 font-bold">{selectedModel.polyCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Vertex Count</span>
              <span className="font-mono text-slate-200 font-bold">{selectedModel.vertices}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Textures</span>
              <span className="font-mono text-indigo-400 font-bold">{selectedModel.textures}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Render Engine</span>
              <span className="font-mono text-emerald-400 font-bold">WebGL 2.0 + PBR</span>
            </div>
          </div>

          {/* AR & Export Action Button */}
          <div className="space-y-2">
            <button
              onClick={handleExportModel}
              disabled={isExporting}
              className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xl shadow-indigo-600/30 transition-all"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Compiling 3D Model Package (.USDZ / .GLTF)...</span>
                </>
              ) : exportSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>3D Model Exported to Campaign Media Vault!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>EXPORT 3D ASSET (.GLTF / AR USDZ)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
