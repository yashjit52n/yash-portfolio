/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Subtle Three.js Particle Background Effect.
 * Floats gracefully behind the main 3D content in the Hero section.
 * Automatically synchronizes drift speed, motion kinetics, and color transitions
 * with the current theme state ('deep-space' vs 'cyberpunk-light').
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeParticleBackgroundProps {
  theme?: 'deep-space' | 'cyberpunk-light';
  className?: string;
}

export const ThreeParticleBackground: React.FC<ThreeParticleBackgroundProps> = ({
  theme = 'deep-space',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef(theme);

  // Synchronize active theme ref
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect hardware support
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch {
      return; // Gracefully bail out if WebGL unsupported
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 32);

    // Procedural soft circular particle glow sprite (zero external network dependency)
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d')!;
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)');
    pGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.35)');
    pGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);

    const particleTexture = new THREE.CanvasTexture(pCanvas);
    particleTexture.colorSpace = THREE.SRGBColorSpace;

    // Particle Palette Definitions
    // Deep Space: Ethereal Cyan, Electric Indigo, Neon Purple, and Celestial White-Blue
    const darkPalette = [
      new THREE.Color(0x06b6d4), // Cyan 500
      new THREE.Color(0x6366f1), // Indigo 500
      new THREE.Color(0xa855f7), // Purple 500
      new THREE.Color(0x38bdf8), // Sky 400
      new THREE.Color(0xe0f2fe), // Starlight White-Cyan
    ];

    // Cyberpunk Light: High-contrast Electric Cerulean, Cyber Magenta, Vivid Violet, Deep Turquoise
    const lightPalette = [
      new THREE.Color(0x0284c7), // Sky 600
      new THREE.Color(0xdb2777), // Pink 600
      new THREE.Color(0x7c3aed), // Violet 600
      new THREE.Color(0x0d9488), // Teal 600
      new THREE.Color(0x2563eb), // Blue 600
    ];

    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const currentColors = new Array<THREE.Color>(particleCount);
    const targetColors = new Array<THREE.Color>(particleCount);

    // Dynamic kinematics buffers
    const basePositions = new Float32Array(particleCount * 3);
    const driftSpeeds = new Float32Array(particleCount);
    const oscillationFreqs = new Float32Array(particleCount);
    const oscillationAmps = new Float32Array(particleCount);
    const phaseOffsets = new Float32Array(particleCount);
    const paletteIndexes = new Uint8Array(particleCount);

    const initialIsLight = themeRef.current === 'cyberpunk-light';

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Distribute particles broadly across the viewport depth with subtle clustering behind the right 3D hero area
      // 60% spread across entire canvas, 40% biased toward right half (x > 0)
      const isHeroBiased = i % 2 === 0;
      const x = isHeroBiased 
        ? (Math.random() * 24 - 4) // Centered around the 3D subject zone
        : (Math.random() - 0.5) * 44;
      const y = (Math.random() - 0.5) * 28;
      const z = -18 + Math.random() * 24;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;

      driftSpeeds[i] = 0.08 + Math.random() * 0.16;
      oscillationFreqs[i] = 0.4 + Math.random() * 0.8;
      oscillationAmps[i] = 0.3 + Math.random() * 0.6;
      phaseOffsets[i] = Math.random() * Math.PI * 2;

      const pIndex = Math.floor(Math.random() * darkPalette.length);
      paletteIndexes[i] = pIndex;

      const initialPalette = initialIsLight ? lightPalette : darkPalette;
      const color = initialPalette[pIndex].clone();
      currentColors[i] = color.clone();
      targetColors[i] = color.clone();

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: initialIsLight ? 0.72 : 0.85,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: initialIsLight ? 0.68 : 0.75,
      blending: initialIsLight ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    particles.frustumCulled = false;
    scene.add(particles);

    // Mouse & Parallax State
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = nx * 2.2;
      mouse.targetY = ny * 1.5;
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Kinetic Animation Loop
    const clock = new THREE.Clock();
    let frameId = 0;
    let currentSpeedFactor = initialIsLight ? 1.15 : 0.55;

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Theme-synced velocity and color transition
      const isCurLight = themeRef.current === 'cyberpunk-light';
      const targetSpeedFactor = isCurLight ? 1.25 : 0.52;
      currentSpeedFactor = THREE.MathUtils.damp(currentSpeedFactor, targetSpeedFactor, 2.5, delta);

      // Adjust particle material settings for current theme
      material.size = isCurLight ? 0.72 : 0.85;
      material.opacity = isCurLight ? 0.65 : 0.78;
      material.blending = isCurLight ? THREE.NormalBlending : THREE.AdditiveBlending;

      // Smooth pointer parallax
      mouse.x = THREE.MathUtils.damp(mouse.x, mouse.targetX, 3.5, delta);
      mouse.y = THREE.MathUtils.damp(mouse.y, mouse.targetY, 3.5, delta);

      camera.position.x = mouse.x;
      camera.position.y = mouse.y;
      camera.lookAt(0, 0, 0);

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      const colAttr = geometry.attributes.color as THREE.BufferAttribute;
      const colArray = colAttr.array as Float32Array;

      const activePalette = isCurLight ? lightPalette : darkPalette;

      let colorsNeedUpdate = false;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Kinetic floating motion: subtle vertical drift + gentle horizontal oscillation
        const drift = delta * driftSpeeds[i] * currentSpeedFactor;
        basePositions[i3 + 1] += drift;

        // Wrap around boundary bounds seamlessly
        if (basePositions[i3 + 1] > 16) {
          basePositions[i3 + 1] = -16;
        }

        const wave = Math.sin(elapsed * oscillationFreqs[i] + phaseOffsets[i]) * oscillationAmps[i];
        const lateralWave = Math.cos(elapsed * (oscillationFreqs[i] * 0.7) + phaseOffsets[i]) * (oscillationAmps[i] * 0.4);

        posArray[i3] = basePositions[i3] + lateralWave;
        posArray[i3 + 1] = basePositions[i3 + 1] + wave;
        posArray[i3 + 2] = basePositions[i3 + 2];

        // Smooth Color Shifting synced to theme
        const pIndex = paletteIndexes[i];
        const targetC = activePalette[pIndex];
        const currentC = currentColors[i];

        const diff = Math.abs(currentC.r - targetC.r) + Math.abs(currentC.g - targetC.g) + Math.abs(currentC.b - targetC.b);
        if (diff > 0.003) {
          currentC.lerp(targetC, delta * 3.5);
          colArray[i3] = currentC.r;
          colArray[i3 + 1] = currentC.g;
          colArray[i3 + 2] = currentC.b;
          colorsNeedUpdate = true;
        }
      }

      posAttr.needsUpdate = true;
      if (colorsNeedUpdate) {
        colAttr.needsUpdate = true;
      }

      // Gentle global rotation
      particles.rotation.y = elapsed * 0.015 * currentSpeedFactor;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // Cleanup resources
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);

      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
