/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive 3D Centerpiece built with Three.js.
 * Features a multi-part geometric core, orbital gyroscope rings,
 * realistic PBR lighting, and a high-performance, dual-tier interactive
 * particle system using Three.js points that dynamically react to mouse movement
 * (vortex swirl & magnetic dispersion) and scroll parallax.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCcw, Sparkles, Sliders, ChevronDown, ChevronUp, Wind, Layers, Laptop, Box } from 'lucide-react';

// Pre-allocated math objects outside render loop for ZERO Garbage Collection
const _targetRotation = new THREE.Vector2(0, 0);
const _currentRotation = new THREE.Vector2(0, 0);
const _dampedPointer = new THREE.Vector2(0, 0);

interface ThreeDSceneProps {
  className?: string;
  theme?: 'deep-space' | 'cyberpunk-light';
}

export const ThreeDScene: React.FC<ThreeDSceneProps> = ({ className = '', theme = 'deep-space' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [controlsOpen, setControlsOpen] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [coreGlow, setCoreGlow] = useState<boolean>(true);
  const [particleMode, setParticleMode] = useState<'vortex' | 'disperse' | 'calm'>('vortex');
  const [sceneMode, setSceneMode] = useState<'workspace' | 'quantum'>('workspace');

  const isLight = theme === 'cyberpunk-light';

  // References for dynamic animation mutation without canvas re-mounting
  const sceneStateRef = useRef({
    rotationSpeed: 1,
    wireframeMode: false,
    coreGlow: true,
    particleMode: 'vortex' as 'vortex' | 'disperse' | 'calm',
    sceneMode: 'workspace' as 'workspace' | 'quantum',
    theme: theme,
    pointerX: 0,
    pointerY: 0,
    scrollY: 0,
    isHovered: false
  });

  // Keep ref synchronized with state
  useEffect(() => {
    sceneStateRef.current.rotationSpeed = rotationSpeed;
    sceneStateRef.current.wireframeMode = wireframeMode;
    sceneStateRef.current.coreGlow = coreGlow;
    sceneStateRef.current.particleMode = particleMode;
    sceneStateRef.current.sceneMode = sceneMode;
    sceneStateRef.current.theme = theme;
  }, [rotationSpeed, wireframeMode, coreGlow, particleMode, sceneMode, theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect Software WebGL
    const isSoftwareGl = (() => {
      try {
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : (gl as WebGLRenderingContext).RENDERER;
        const gpu = String((gl as WebGLRenderingContext).getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: true
      });
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Root Group representing the Core Subject & Particle Space
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Inner Energy Sphere
    const innerSphereGeo = new THREE.SphereGeometry(1.05, 32, 32);
    const innerSphereMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5, // Indigo/Violet
      roughness: 0.25,
      metalness: 0.85,
      emissive: 0x2563eb,
      emissiveIntensity: 0.4
    });
    const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
    coreGroup.add(innerSphere);

    // 2. Geometric Icosahedron Lattice Cage (Outer Structural Layer)
    const latticeGeo = new THREE.IcosahedronGeometry(1.7, 1);
    const latticeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Electric Cyan
      roughness: 0.2,
      metalness: 0.9,
      wireframe: false,
      transparent: true,
      opacity: 0.8
    });
    const latticeMesh = new THREE.Mesh(latticeGeo, latticeMat);
    coreGroup.add(latticeMesh);

    // 2b. Wireframe outline for high-tech aesthetic
    const wireframeGeo = new THREE.WireframeGeometry(latticeGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.65
    });
    const wireframeLine = new THREE.LineSegments(wireframeGeo, wireframeMat);
    coreGroup.add(wireframeLine);

    // 3. Primary Gimbal Ring (Outer Orbit)
    const ring1Geo = new THREE.TorusGeometry(2.3, 0.045, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      metalness: 0.95,
      roughness: 0.15
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // 4. Secondary Gimbal Ring (Inner Counter-Orbit)
    const ring2Geo = new THREE.TorusGeometry(2.0, 0.035, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, // Cyan
      metalness: 0.92,
      roughness: 0.2
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.z = Math.PI / 6;
    coreGroup.add(ring2);

    // 5. Orbiting Nodes (Accent Details on Ring 1)
    const nodeGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.8
    });
    const node1 = new THREE.Mesh(nodeGeo, nodeMat);
    node1.position.set(2.3, 0, 0);
    ring1.add(node1);

    const node2 = new THREE.Mesh(nodeGeo, nodeMat);
    node2.position.set(-2.3, 0, 0);
    ring1.add(node2);

    // =========================================================================
    // INTERACTIVE 3D DEVELOPER WORKSPACE (LAPTOP, CODE IDE & FLOATING HOLOGRAMS)
    // =========================================================================
    const workspaceGroup = new THREE.Group();
    scene.add(workspaceGroup);

    // 1. Procedural High-Res Screen IDE Texture
    const ideCanvas = document.createElement('canvas');
    ideCanvas.width = 512;
    ideCanvas.height = 340;
    const ideCtx = ideCanvas.getContext('2d')!;
    ideCtx.fillStyle = '#060a14';
    ideCtx.fillRect(0, 0, 512, 340);

    // Top window bar
    ideCtx.fillStyle = '#0f172a';
    ideCtx.fillRect(0, 0, 512, 36);
    ideCtx.fillStyle = '#ef4444';
    ideCtx.beginPath(); ideCtx.arc(20, 18, 5, 0, Math.PI * 2); ideCtx.fill();
    ideCtx.fillStyle = '#f59e0b';
    ideCtx.beginPath(); ideCtx.arc(36, 18, 5, 0, Math.PI * 2); ideCtx.fill();
    ideCtx.fillStyle = '#10b981';
    ideCtx.beginPath(); ideCtx.arc(52, 18, 5, 0, Math.PI * 2); ideCtx.fill();

    ideCtx.font = 'bold 12px monospace';
    ideCtx.fillStyle = '#38bdf8';
    ideCtx.fillText('yash@dev-station: ~/codeforces/solution.cpp', 80, 22);

    // Code lines
    ideCtx.font = '13px monospace';
    const codeLines = [
      { text: '// Yash Jit — 1st Year B.Tech CS & AI (NST)', color: '#64748b' },
      { text: '#include <iostream>', color: '#c084fc' },
      { text: '#include <vector>', color: '#c084fc' },
      { text: 'using namespace std;', color: '#38bdf8' },
      { text: '', color: '#ffffff' },
      { text: 'void solve() {', color: '#fbbf24' },
      { text: '    int rating = 999; // Codeforces', color: '#34d399' },
      { text: '    cout << "Competitive SWE" << endl;', color: '#f472b6' },
      { text: '}', color: '#fbbf24' },
      { text: 'int main() { solve(); return 0; }', color: '#38bdf8' },
    ];
    codeLines.forEach((line, idx) => {
      ideCtx.fillStyle = '#475569';
      ideCtx.fillText(`${idx + 1}`, 15, 60 + idx * 24);
      ideCtx.fillStyle = line.color;
      ideCtx.fillText(line.text, 40, 60 + idx * 24);
    });

    const ideTexture = new THREE.CanvasTexture(ideCanvas);
    ideTexture.colorSpace = THREE.SRGBColorSpace;

    // 2. Procedural Keyboard Layout Texture
    const kbCanvas = document.createElement('canvas');
    kbCanvas.width = 256;
    kbCanvas.height = 128;
    const kbCtx = kbCanvas.getContext('2d')!;
    kbCtx.fillStyle = '#0f172a';
    kbCtx.fillRect(0, 0, 256, 128);
    kbCtx.fillStyle = '#1e293b';
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 14; col++) {
        kbCtx.fillRect(8 + col * 17, 8 + row * 22, 14, 18);
      }
    }
    const kbTexture = new THREE.CanvasTexture(kbCanvas);
    kbTexture.colorSpace = THREE.SRGBColorSpace;

    // 3. Floating Hologram Badges Textures
    const makeBadgeTex = (text1: string, text2: string, color: string) => {
      const bCanvas = document.createElement('canvas');
      bCanvas.width = 256;
      bCanvas.height = 96;
      const bCtx = bCanvas.getContext('2d')!;
      bCtx.fillStyle = 'rgba(10, 15, 30, 0.9)';
      bCtx.roundRect(4, 4, 248, 88, 16);
      bCtx.fill();
      bCtx.lineWidth = 3;
      bCtx.strokeStyle = color;
      bCtx.stroke();
      bCtx.fillStyle = color;
      bCtx.font = 'bold 16px sans-serif';
      bCtx.textAlign = 'center';
      bCtx.fillText(text1, 128, 38);
      bCtx.fillStyle = '#e2e8f0';
      bCtx.font = '12px monospace';
      bCtx.fillText(text2, 128, 65);
      const tex = new THREE.CanvasTexture(bCanvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const badge1Tex = makeBadgeTex('C++20 & PYTHON', 'Problem Solving', '#38bdf8');
    const badge2Tex = makeBadgeTex('CODEFORCES 999', '100+ Solved', '#c084fc');

    // 4. Floating 3D Programming Language Icon Tiles (Python, C++, Java, JS)
    const makeLangIconTex = (symbol: string, label: string, accent: string) => {
      const lCanvas = document.createElement('canvas');
      lCanvas.width = 128;
      lCanvas.height = 128;
      const lCtx = lCanvas.getContext('2d')!;
      lCtx.fillStyle = 'rgba(11, 17, 34, 0.92)';
      lCtx.roundRect(8, 8, 112, 112, 24);
      lCtx.fill();
      lCtx.lineWidth = 4;
      lCtx.strokeStyle = accent;
      lCtx.stroke();
      lCtx.fillStyle = accent;
      lCtx.font = 'bold 34px monospace';
      lCtx.textAlign = 'center';
      lCtx.fillText(symbol, 64, 66);
      lCtx.fillStyle = '#cbd5e1';
      lCtx.font = 'bold 14px sans-serif';
      lCtx.fillText(label, 64, 98);
      const tex = new THREE.CanvasTexture(lCanvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const langPythonTex = makeLangIconTex('PY', 'Python', '#38bdf8');
    const langCppTex = makeLangIconTex('C++', 'STL / CP', '#818cf8');
    const langJavaTex = makeLangIconTex('JV', 'Java', '#f472b6');
    const langJsTex = makeLangIconTex('JS', 'ES6+ Web', '#fbbf24');

    const langIconGeo = new THREE.PlaneGeometry(0.72, 0.72);
    const langMeshes: THREE.Mesh[] = [];
    const langConfigs = [
      { tex: langPythonTex, pos: new THREE.Vector3(-2.6, 2.05, -0.3), rotY: 0.25 },
      { tex: langCppTex, pos: new THREE.Vector3(2.6, 2.05, -0.3), rotY: -0.25 },
      { tex: langJavaTex, pos: new THREE.Vector3(-2.5, -0.85, 0.7), rotY: 0.3 },
      { tex: langJsTex, pos: new THREE.Vector3(2.5, -0.85, 0.7), rotY: -0.3 },
    ];
    langConfigs.forEach((cfg) => {
      const mat = new THREE.MeshBasicMaterial({
        map: cfg.tex,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(langIconGeo, mat);
      mesh.position.copy(cfg.pos);
      mesh.rotation.y = cfg.rotY;
      scene.add(mesh);
      langMeshes.push(mesh);
    });

    // Laptop Base Geometry
    const laptopBaseGeo = new THREE.BoxGeometry(3.3, 0.12, 2.2);
    const laptopBaseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25,
    });
    const laptopBase = new THREE.Mesh(laptopBaseGeo, laptopBaseMat);
    workspaceGroup.add(laptopBase);

    // Trackpad
    const trackpadGeo = new THREE.PlaneGeometry(0.85, 0.55);
    const trackpadMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.7,
      roughness: 0.35,
    });
    const trackpad = new THREE.Mesh(trackpadGeo, trackpadMat);
    trackpad.rotation.x = -Math.PI / 2;
    trackpad.position.set(0, 0.065, 0.55);
    workspaceGroup.add(trackpad);

    // Keyboard Plane
    const keyboardGeo = new THREE.PlaneGeometry(2.8, 1.25);
    const keyboardMat = new THREE.MeshBasicMaterial({
      map: kbTexture,
      transparent: true,
      opacity: 0.9,
    });
    const keyboard = new THREE.Mesh(keyboardGeo, keyboardMat);
    keyboard.rotation.x = -Math.PI / 2;
    keyboard.position.set(0, 0.065, -0.32);
    workspaceGroup.add(keyboard);

    // Screen Pivot & Lid
    const screenPivot = new THREE.Group();
    screenPivot.position.set(0, 0.06, -1.05);
    screenPivot.rotation.x = -Math.PI / 10; // Angled back ~108 degrees
    workspaceGroup.add(screenPivot);

    const screenLidGeo = new THREE.BoxGeometry(3.3, 2.2, 0.08);
    const screenLidMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.2,
    });
    const screenLid = new THREE.Mesh(screenLidGeo, screenLidMat);
    screenLid.position.set(0, 1.1, 0);
    screenPivot.add(screenLid);

    // Screen Display Screen
    const screenDisplayGeo = new THREE.PlaneGeometry(3.1, 2.0);
    const screenDisplayMat = new THREE.MeshBasicMaterial({
      map: ideTexture,
    });
    const screenDisplay = new THREE.Mesh(screenDisplayGeo, screenDisplayMat);
    screenDisplay.position.set(0, 1.1, 0.045);
    screenPivot.add(screenDisplay);

    // Floating Hologram Badges
    const badgeGeo = new THREE.PlaneGeometry(1.6, 0.6);
    const badge1Mat = new THREE.MeshBasicMaterial({ map: badge1Tex, transparent: true, opacity: 0.92 });
    const badge1 = new THREE.Mesh(badgeGeo, badge1Mat);
    badge1.position.set(-2.4, 0.9, 0.4);
    badge1.rotation.y = 0.35;
    workspaceGroup.add(badge1);

    const badge2Mat = new THREE.MeshBasicMaterial({ map: badge2Tex, transparent: true, opacity: 0.92 });
    const badge2 = new THREE.Mesh(badgeGeo, badge2Mat);
    badge2.position.set(2.4, 0.9, 0.4);
    badge2.rotation.y = -0.35;
    workspaceGroup.add(badge2);

    // Set initial mode visibility
    workspaceGroup.visible = true;
    coreGroup.visible = false;

    // --- ZERO-DEPENDENCY PROCEDURAL PARTICLE GLOW TEXTURE ---
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d')!;
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pGrad.addColorStop(0.2, 'rgba(129, 140, 248, 0.95)');
    pGrad.addColorStop(0.55, 'rgba(56, 189, 248, 0.35)');
    pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);

    const particleTexture = new THREE.CanvasTexture(pCanvas);
    particleTexture.colorSpace = THREE.SRGBColorSpace;

    // =========================================================================
    // TIER 1: ORBITAL CONSTELLATION CORE SWARM (320 POINTS)
    // Reacts dynamically to mouse proximity, vortex swirling, and dispersion
    // =========================================================================
    const coreParticleCount = isSoftwareGl ? 90 : 320;
    const corePositions = new Float32Array(coreParticleCount * 3);
    const coreColors = new Float32Array(coreParticleCount * 3);

    const baseRadii = new Float32Array(coreParticleCount);
    const thetas = new Float32Array(coreParticleCount);
    const phis = new Float32Array(coreParticleCount);
    const speeds = new Float32Array(coreParticleCount);
    const dispersionWeights = new Float32Array(coreParticleCount);
    const wobbleFreqs = new Float32Array(coreParticleCount);
    const wobbleAmps = new Float32Array(coreParticleCount);

    const colorCyan = new THREE.Color(0x38bdf8);
    const colorViolet = new THREE.Color(0xa855f7);
    const colorWhite = new THREE.Color(0xe0f2fe);
    const tempColor = new THREE.Color();

    for (let i = 0; i < coreParticleCount; i++) {
      // Stratified layers: 50% tight orbital shell, 50% outer data cloud
      const isOuter = i % 2 === 0;
      const radius = isOuter 
        ? 2.8 + Math.random() * 1.8 
        : 1.8 + Math.random() * 0.9;

      baseRadii[i] = radius;
      thetas[i] = Math.random() * Math.PI * 2;
      phis[i] = Math.acos(2 * Math.random() - 1); // Spherical distribution

      const dir = Math.random() > 0.45 ? 1 : -1;
      speeds[i] = dir * (0.15 + Math.random() * 0.4);

      dispersionWeights[i] = 0.5 + Math.random() * 0.9;
      wobbleFreqs[i] = 1.0 + Math.random() * 2.5;
      wobbleAmps[i] = 0.04 + Math.random() * 0.1;

      corePositions[i * 3] = radius * Math.sin(phis[i]) * Math.cos(thetas[i]);
      corePositions[i * 3 + 1] = radius * Math.cos(phis[i]);
      corePositions[i * 3 + 2] = radius * Math.sin(phis[i]) * Math.sin(thetas[i]);

      const blend = Math.random();
      if (blend < 0.6) {
        tempColor.lerpColors(colorCyan, colorViolet, blend / 0.6);
      } else {
        tempColor.lerpColors(colorViolet, colorWhite, (blend - 0.6) / 0.4);
      }
      coreColors[i * 3] = tempColor.r;
      coreColors[i * 3 + 1] = tempColor.g;
      coreColors[i * 3 + 2] = tempColor.b;
    }

    const coreParticlesGeo = new THREE.BufferGeometry();
    coreParticlesGeo.setAttribute('position', new THREE.BufferAttribute(corePositions, 3));
    coreParticlesGeo.setAttribute('color', new THREE.BufferAttribute(coreColors, 3));

    const coreParticlesMat = new THREE.PointsMaterial({
      size: isSoftwareGl ? 0.08 : 0.09,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const coreParticleSystem = new THREE.Points(coreParticlesGeo, coreParticlesMat);
    coreParticleSystem.frustumCulled = false;
    coreGroup.add(coreParticleSystem);

    // =========================================================================
    // TIER 2: VOLUMETRIC SPACE FIELD & SCROLL PARALLAX EMBERS (160 POINTS)
    // Distributed in front and around the scene, providing high-depth scroll parallax
    // =========================================================================
    const spaceParticleCount = isSoftwareGl ? 40 : 160;
    const spacePositions = new Float32Array(spaceParticleCount * 3);
    const spaceBasePositions = new Float32Array(spaceParticleCount * 3);
    const spaceColors = new Float32Array(spaceParticleCount * 3);
    const spaceParallaxFactors = new Float32Array(spaceParticleCount);
    const spaceDriftSpeeds = new Float32Array(spaceParticleCount);

    for (let i = 0; i < spaceParticleCount; i++) {
      const i3 = i * 3;
      const sx = (Math.random() - 0.5) * 11;
      const sy = (Math.random() - 0.5) * 8;
      const sz = -3 + Math.random() * 8.5;

      spacePositions[i3] = sx;
      spacePositions[i3 + 1] = sy;
      spacePositions[i3 + 2] = sz;

      spaceBasePositions[i3] = sx;
      spaceBasePositions[i3 + 1] = sy;
      spaceBasePositions[i3 + 2] = sz;

      // Parallax depth multiplier: closer particles move faster on scroll
      spaceParallaxFactors[i] = 0.8 + ((sz + 3) / 11) * 1.8;
      spaceDriftSpeeds[i] = 0.08 + Math.random() * 0.15;

      // Color scheme: soft indigo to celestial cyan
      tempColor.lerpColors(colorCyan, colorWhite, Math.random());
      spaceColors[i3] = tempColor.r;
      spaceColors[i3 + 1] = tempColor.g;
      spaceColors[i3 + 2] = tempColor.b;
    }

    const spaceParticlesGeo = new THREE.BufferGeometry();
    spaceParticlesGeo.setAttribute('position', new THREE.BufferAttribute(spacePositions, 3));
    spaceParticlesGeo.setAttribute('color', new THREE.BufferAttribute(spaceColors, 3));

    const spaceParticlesMat = new THREE.PointsMaterial({
      size: isSoftwareGl ? 0.06 : 0.075,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const spaceParticleSystem = new THREE.Points(spaceParticlesGeo, spaceParticlesMat);
    spaceParticleSystem.frustumCulled = false;
    scene.add(spaceParticleSystem);

    // 7. Ground Contact Shadow Grounding
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 128;
    sCanvas.height = 128;
    const sCtx = sCanvas.getContext('2d')!;
    const gradient = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.7)');
    gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.08)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = gradient;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(sCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.6
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.6;
    scene.add(shadowMesh);

    // Balanced Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe0e7ff, 2.8);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 1.6);
    fillLight.position.set(-6, -2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xa855f7, 2.5, 15);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Event Listeners for Dynamic Mouse & Scroll Interaction
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      sceneStateRef.current.pointerX = x;
      sceneStateRef.current.pointerY = y;
      sceneStateRef.current.isHovered = true;
    };

    const handlePointerLeave = () => {
      sceneStateRef.current.pointerX = 0;
      sceneStateRef.current.pointerY = 0;
      sceneStateRef.current.isHovered = false;
    };

    const handleScroll = () => {
      sceneStateRef.current.scrollY = window.scrollY;
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with Clock & Silky-Smooth Exponential Damping
    const clock = new THREE.Clock();
    let frameId = 0;
    let dampedDispersion = 0;
    let dampedScroll = 0;

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const currentSpeed = sceneStateRef.current.rotationSpeed;
      const mode = sceneStateRef.current.particleMode;

      // Rotate geometric core assemblies
      latticeMesh.rotation.y += delta * 0.4 * currentSpeed;
      latticeMesh.rotation.x += delta * 0.2 * currentSpeed;
      wireframeLine.rotation.copy(latticeMesh.rotation);

      ring1.rotation.z += delta * 0.6 * currentSpeed;
      ring2.rotation.x -= delta * 0.5 * currentSpeed;

      // Breathing scale for inner sphere
      const pulse = 1 + Math.sin(elapsed * 2) * 0.03;
      innerSphere.scale.set(pulse, pulse, pulse);

      // Wireframe & Core Glow state reflection
      const isCurLight = sceneStateRef.current.theme === 'cyberpunk-light';
      latticeMat.wireframe = sceneStateRef.current.wireframeMode;
      innerSphereMat.emissiveIntensity = sceneStateRef.current.coreGlow
        ? (isCurLight ? 0.3 : 0.4) + Math.sin(elapsed * 3) * 0.12
        : 0.05;

      shadowMat.opacity = isCurLight ? 0.32 : 0.6;
      ambientLight.intensity = isCurLight ? 1.6 : 1.2;
      keyLight.intensity = isCurLight ? 2.4 : 2.8;

      // Smooth pointer parallax tracking for central core
      const targetX = sceneStateRef.current.pointerY * 0.35;
      const targetY = sceneStateRef.current.pointerX * 0.5;

      _targetRotation.set(targetX, targetY);
      _currentRotation.x = THREE.MathUtils.damp(_currentRotation.x, _targetRotation.x, 3.5, delta);
      _currentRotation.y = THREE.MathUtils.damp(_currentRotation.y, _targetRotation.y, 3.5, delta);

      _dampedPointer.x = THREE.MathUtils.damp(_dampedPointer.x, sceneStateRef.current.pointerX, 4.0, delta);
      _dampedPointer.y = THREE.MathUtils.damp(_dampedPointer.y, sceneStateRef.current.pointerY, 4.0, delta);

      const isWorkspace = sceneStateRef.current.sceneMode === 'workspace';
      workspaceGroup.visible = isWorkspace;
      coreGroup.visible = !isWorkspace;

      if (isWorkspace) {
        workspaceGroup.rotation.x = 0.32 + _currentRotation.x * 0.45;
        workspaceGroup.rotation.y = -0.15 + _currentRotation.y * 0.55 + Math.sin(elapsed * 0.5) * 0.05;
        workspaceGroup.position.y = -0.3 + Math.sin(elapsed * 1.5) * 0.04;

        // Floating badges levitation
        badge1.position.y = 0.9 + Math.sin(elapsed * 2.0) * 0.12;
        badge2.position.y = 0.9 + Math.cos(elapsed * 1.8) * 0.12;
      } else {
        coreGroup.rotation.x = _currentRotation.x;
        coreGroup.rotation.y = _currentRotation.y + elapsed * 0.1 * currentSpeed;
      }

      // Animate floating 3D programming-language icon tiles
      langMeshes.forEach((mesh, idx) => {
        const basePos = langConfigs[idx].pos;
        const phase = idx * 1.4;
        mesh.position.y = basePos.y + Math.sin(elapsed * 1.8 + phase) * 0.14;
        mesh.position.x = basePos.x + _dampedPointer.x * 0.18;
        mesh.rotation.y = langConfigs[idx].rotY + _dampedPointer.x * 0.25 + Math.sin(elapsed * 1.1 + phase) * 0.08;
        mesh.rotation.x = -_dampedPointer.y * 0.18;
      });

      // Smooth Scroll Parallax Interpolation
      const targetScroll = Math.min(sceneStateRef.current.scrollY * 0.0018, 1.4);
      dampedScroll = THREE.MathUtils.damp(dampedScroll, targetScroll, 4.0, delta);

      // Dynamic Mouse Dispersion Intensity
      const mouseDist = Math.sqrt(
        sceneStateRef.current.pointerX * sceneStateRef.current.pointerX + 
        sceneStateRef.current.pointerY * sceneStateRef.current.pointerY
      );

      const targetDispersion = (sceneStateRef.current.isHovered && mode !== 'calm')
        ? Math.min(mouseDist * 1.25 + 0.35, 1.8)
        : 0;
      dampedDispersion = THREE.MathUtils.damp(dampedDispersion, targetDispersion, 3.2, delta);

      // =======================================================================
      // UPDATE TIER 1: CORE PARTICLES (SWIRL & MAGNETIC DISPERSION)
      // =======================================================================
      const corePosAttr = coreParticlesGeo.attributes.position as THREE.BufferAttribute;
      const corePosArray = corePosAttr.array as Float32Array;

      for (let i = 0; i < coreParticleCount; i++) {
        const i3 = i * 3;

        // Swirl speed acceleration based on pointer interaction & mode
        const isVortex = mode === 'vortex';
        const swirlBoost = isVortex ? (1 + dampedDispersion * 1.8) : 1;
        thetas[i] += delta * speeds[i] * currentSpeed * swirlBoost;

        // Radial expansion when dispersed
        const dispersionSpread = (mode !== 'calm') ? (dampedDispersion * dispersionWeights[i] * 0.9) : 0;
        const r = baseRadii[i] + dispersionSpread + Math.sin(elapsed * wobbleFreqs[i]) * wobbleAmps[i];

        const sinPhi = Math.sin(phis[i]);
        const cosPhi = Math.cos(phis[i]);
        const cosTheta = Math.cos(thetas[i]);
        const sinTheta = Math.sin(thetas[i]);

        let px = r * sinPhi * cosTheta;
        let py = r * cosPhi;
        let pz = r * sinPhi * sinTheta;

        // Dynamic vortex swirl or magnetic push around mouse coordinates
        if (mode !== 'calm' && dampedDispersion > 0.02) {
          if (isVortex) {
            // Helical vortex swirl angle
            const vortexAngle = dampedDispersion * 0.35 * (1 - r / 6.2);
            const cV = Math.cos(vortexAngle);
            const sV = Math.sin(vortexAngle);

            const vx = px * cV - pz * sV;
            const vz = px * sV + pz * cV;
            px = vx + _dampedPointer.x * 0.4 * (1 - r / 6.5);
            pz = vz;
            py += _dampedPointer.y * 0.28 * Math.sin(r + elapsed);
          } else {
            // Pure radial magnetic push outward
            px += _dampedPointer.x * 0.6 * (dispersionSpread / 2);
            py += _dampedPointer.y * 0.6 * (dispersionSpread / 2);
          }
        }

        // Parallax drift from scroll
        py -= dampedScroll * 1.3;
        pz -= dampedScroll * 0.6;

        corePosArray[i3] = px;
        corePosArray[i3 + 1] = py;
        corePosArray[i3 + 2] = pz;
      }
      corePosAttr.needsUpdate = true;

      coreParticleSystem.rotation.y -= delta * 0.08 * currentSpeed;
      coreParticleSystem.rotation.z = _dampedPointer.x * 0.15 + dampedScroll * 0.2;

      // =======================================================================
      // UPDATE TIER 2: VOLUMETRIC SPACE FIELD & HIGH-DEPTH SCROLL PARALLAX
      // =======================================================================
      const spacePosAttr = spaceParticlesGeo.attributes.position as THREE.BufferAttribute;
      const spacePosArray = spacePosAttr.array as Float32Array;

      for (let i = 0; i < spaceParticleCount; i++) {
        const i3 = i * 3;
        const pFactor = spaceParallaxFactors[i];

        // Constant gentle forward/upward drift
        spaceBasePositions[i3 + 1] += delta * spaceDriftSpeeds[i];
        if (spaceBasePositions[i3 + 1] > 4.5) {
          spaceBasePositions[i3 + 1] = -4.5;
        }

        // Mouse Parallax Influence
        const mx = _dampedPointer.x * 0.8 * pFactor;
        const my = _dampedPointer.y * 0.6 * pFactor;

        // Scroll Parallax Displacement (pronounced vertical and depth drift)
        const scrollOffsetY = -dampedScroll * 3.4 * pFactor;
        const scrollOffsetZ = -dampedScroll * 1.6 * pFactor;

        spacePosArray[i3] = spaceBasePositions[i3] + mx;
        spacePosArray[i3 + 1] = spaceBasePositions[i3 + 1] + my + scrollOffsetY;
        spacePosArray[i3 + 2] = spaceBasePositions[i3 + 2] + scrollOffsetZ;
      }
      spacePosAttr.needsUpdate = true;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // Cleanup resources
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);

      // Geometries disposal
      innerSphereGeo.dispose();
      latticeGeo.dispose();
      wireframeGeo.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      nodeGeo.dispose();
      laptopBaseGeo.dispose();
      trackpadGeo.dispose();
      keyboardGeo.dispose();
      screenLidGeo.dispose();
      screenDisplayGeo.dispose();
      badgeGeo.dispose();
      coreParticlesGeo.dispose();
      spaceParticlesGeo.dispose();
      shadowGeo.dispose();
      shadowTex.dispose();
      particleTexture.dispose();
      ideTexture.dispose();
      kbTexture.dispose();
      badge1Tex.dispose();
      badge2Tex.dispose();
      langPythonTex.dispose();
      langCppTex.dispose();
      langJavaTex.dispose();
      langJsTex.dispose();
      langIconGeo.dispose();
      langMeshes.forEach((m) => (m.material as THREE.Material).dispose());

      // Materials disposal
      innerSphereMat.dispose();
      latticeMat.dispose();
      wireframeMat.dispose();
      ring1Mat.dispose();
      ring2Mat.dispose();
      nodeMat.dispose();
      laptopBaseMat.dispose();
      trackpadMat.dispose();
      keyboardMat.dispose();
      screenLidMat.dispose();
      screenDisplayMat.dispose();
      badge1Mat.dispose();
      badge2Mat.dispose();
      coreParticlesMat.dispose();
      spaceParticlesMat.dispose();
      shadowMat.dispose();

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleReset = () => {
    setRotationSpeed(1);
    setWireframeMode(false);
    setCoreGlow(true);
    setParticleMode('vortex');
  };

  const cycleParticleMode = () => {
    if (particleMode === 'vortex') setParticleMode('disperse');
    else if (particleMode === 'disperse') setParticleMode('calm');
    else setParticleMode('vortex');
  };

  if (!webGlSupported) {
    return (
      <div className={`relative flex items-center justify-center p-8 rounded-2xl glass-panel ${className}`}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-semibold text-slate-200">Interactive 3D Sphere</h4>
          <p className="mt-2 text-sm text-slate-400">
            WebGL is currently running in fallback mode on this device. Enjoy the rich, responsive visual portfolio below!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[420px] lg:min-h-[540px] flex items-center justify-center select-none ${className}`}>
      {/* 3D Canvas Mount Point */}
      <div 
        ref={mountRef} 
        className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" 
        aria-label="Interactive 3D Geometric Core with responsive dual-tier particle constellation"
      />

      {/* Ergonomic Collapsible Bottom Control Dock (Three.js Skill Compliant) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[580px]">
        {/* Toggle Bar */}
        <div className="flex justify-center mb-1.5">
          <button
            onClick={() => setControlsOpen(!controlsOpen)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold shadow-lg backdrop-blur transition-all border ${
              isLight
                ? 'text-slate-800 bg-white/95 hover:bg-white border-cyan-500/30 shadow-cyan-500/10'
                : 'text-slate-300 bg-slate-900/80 hover:bg-slate-800/90 border-slate-700/60'
            }`}
            title="Toggle 3D Controls"
          >
            <Sliders className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
            <span>3D Controls</span>
            {controlsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Dock Drawer */}
        {controlsOpen && (
          <div className={`rounded-xl p-3 shadow-2xl transition-all border ${
            isLight
              ? 'bg-white/95 border-cyan-500/30 text-slate-800 shadow-cyan-950/10 backdrop-blur-md'
              : 'glass-panel border-slate-700/70 text-slate-200'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
              {/* Rotation Speed Multipliers */}
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Speed:</span>
                <div className={`flex items-center p-0.5 rounded-lg border ${
                  isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                }`}>
                  <button
                    onClick={() => setRotationSpeed(0.4)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                      rotationSpeed === 0.4 
                        ? isLight ? 'bg-cyan-600 text-white shadow-sm' : 'bg-cyan-500/20 text-cyan-300' 
                        : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    0.5x
                  </button>
                  <button
                    onClick={() => setRotationSpeed(1)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                      rotationSpeed === 1 
                        ? isLight ? 'bg-cyan-600 text-white shadow-sm' : 'bg-cyan-500/20 text-cyan-300' 
                        : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    1x
                  </button>
                  <button
                    onClick={() => setRotationSpeed(2)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                      rotationSpeed === 2 
                        ? isLight ? 'bg-cyan-600 text-white shadow-sm' : 'bg-cyan-500/20 text-cyan-300' 
                        : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    2x
                  </button>
                </div>
              </div>

              {/* 3D Object Mode Switcher */}
              <button
                onClick={() => setSceneMode(sceneMode === 'workspace' ? 'quantum' : 'workspace')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                  sceneMode === 'workspace'
                    ? isLight ? 'bg-cyan-100 text-cyan-800 border-cyan-300' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                    : isLight ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                }`}
                title="Toggle between 3D Developer Workspace and Quantum Core"
              >
                {sceneMode === 'workspace' ? <Laptop className="w-3 h-3 text-cyan-400" /> : <Box className="w-3 h-3 text-indigo-400" />}
                <span>{sceneMode === 'workspace' ? '3D Workspace' : 'Quantum Core'}</span>
              </button>

              {/* Wireframe Mode Toggle */}
              <button
                onClick={() => setWireframeMode(!wireframeMode)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                  wireframeMode 
                    ? isLight ? 'bg-indigo-100 text-indigo-700 border-indigo-300 font-semibold' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' 
                    : isLight ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100' : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
                title="Toggle Wireframe Architecture"
              >
                <Eye className={`w-3 h-3 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />
                <span>Wireframe</span>
              </button>

              {/* Core Glow Toggle */}
              <button
                onClick={() => setCoreGlow(!coreGlow)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                  coreGlow 
                    ? isLight ? 'bg-cyan-100 text-cyan-800 border-cyan-300 font-semibold' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                    : isLight ? 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100' : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
                title="Toggle Core Energy Glow"
              >
                <Sparkles className={`w-3 h-3 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                <span>Glow</span>
              </button>

              {/* Interactive Particle Modes Cycler */}
              <button
                onClick={cycleParticleMode}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                  particleMode !== 'calm'
                    ? isLight ? 'bg-cyan-100 text-cyan-800 border-cyan-300' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                    : isLight ? 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100' : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
                title="Cycle Interactive Particle Reactions (Vortex -> Magnetic Push -> Calm Orbit)"
              >
                <Wind className={`w-3 h-3 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                <span className="capitalize">{particleMode} Points</span>
              </button>

              {/* Reset Control */}
              <button
                onClick={handleReset}
                className={`p-1 rounded-lg transition-colors ${
                  isLight 
                    ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
                title="Reset scene parameters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
