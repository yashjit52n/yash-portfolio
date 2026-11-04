/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Lightweight 3D Loading Screen / Suspense Fallback.
 * Renders an animated high-tech geometric HUD with scanning line,
 * concentric rotating orbital rings, and real-time status telemetry
 * while Three.js and the 3D Developer Workspace load in the background.
 * Zero layout shift (matches container aspect ratio perfectly).
 */

import React, { useState, useEffect } from 'react';
import { Cpu, Box, Sparkles, Layers } from 'lucide-react';

interface ThreeDSceneLoaderProps {
  theme?: 'deep-space' | 'cyberpunk-light';
  message?: string;
}

export const ThreeDSceneLoader: React.FC<ThreeDSceneLoaderProps> = ({
  theme = 'deep-space',
  message = 'Initializing 3D Developer Workspace...',
}) => {
  const isLight = theme === 'cyberpunk-light';
  const [progress, setProgress] = useState(24);

  // Simulated progressive load telemetry
  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(62), 120);
    const timer2 = setTimeout(() => setProgress(88), 350);
    const timer3 = setTimeout(() => setProgress(98), 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div 
      className={`w-full h-full min-h-[340px] sm:min-h-[420px] rounded-2xl flex flex-col items-center justify-between p-6 relative overflow-hidden transition-colors select-none ${
        isLight 
          ? 'bg-slate-50/90 text-slate-800' 
          : 'bg-[#090e1a]/95 text-slate-200'
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading 3D workspace"
    >
      {/* Background Tech Grid & Radial Glow */}
      <div className={`absolute inset-0 pointer-events-none opacity-20 ${
        isLight
          ? 'bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:16px_16px]'
          : 'bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]'
      }`} />

      {/* Animated Vertical Scanline */}
      <div 
        className={`absolute inset-x-0 h-16 pointer-events-none opacity-25 animate-pulse ${
          isLight
            ? 'bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent'
            : 'bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent'
        }`}
        style={{
          animation: 'scanline 2.4s ease-in-out infinite',
        }}
      />

      {/* Top HUD Telemetry */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono tracking-wider z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className={isLight ? 'text-cyan-800 font-bold' : 'text-cyan-300'}>
            SYS://WEBGL_ENGINE
          </span>
        </div>
        <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>
          ASYNC_CHUNK: ACTIVE
        </div>
      </div>

      {/* Central Holographic Gyroscope Animation */}
      <div className="relative flex items-center justify-center my-auto z-10">
        {/* Outer Pulsing Glow */}
        <div className={`absolute w-44 h-44 rounded-full blur-2xl pointer-events-none ${
          isLight ? 'bg-cyan-500/15' : 'bg-indigo-600/25'
        }`} />

        {/* Outer Orbital Ring 1 */}
        <div className={`w-36 h-36 rounded-full border border-dashed animate-spin ${
          isLight ? 'border-cyan-400/40' : 'border-cyan-500/30'
        }`} style={{ animationDuration: '8s' }} />

        {/* Middle Orbital Ring 2 (Counter-clockwise) */}
        <div className={`absolute w-28 h-28 rounded-full border border-dotted animate-spin ${
          isLight ? 'border-indigo-400/50' : 'border-indigo-400/40'
        }`} style={{ animationDuration: '5s', animationDirection: 'reverse' }} />

        {/* Inner Solid Geometric Ring */}
        <div className={`absolute w-20 h-20 rounded-full border-2 ${
          isLight 
            ? 'border-cyan-500/60 shadow-md shadow-cyan-500/20' 
            : 'border-cyan-400/60 shadow-lg shadow-cyan-400/20'
        }`} />

        {/* Core Icon with Pulse */}
        <div className={`absolute w-12 h-12 rounded-xl flex items-center justify-center border shadow-xl ${
          isLight
            ? 'bg-white border-cyan-200 text-cyan-600'
            : 'bg-slate-900 border-cyan-500/50 text-cyan-300 shadow-cyan-500/20'
        }`}>
          <Box className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* Bottom Loading Telemetry & Progress Indicator */}
      <div className="w-full max-w-xs space-y-3 z-10 text-center">
        <div className="space-y-1">
          <div className={`text-xs font-semibold tracking-wide font-['Outfit'] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {message}
          </div>
          <div className="text-[11px] font-mono text-cyan-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Compiling Shaders & Meshes [{progress}%]</span>
          </div>
        </div>

        {/* High-Tech Progress Bar */}
        <div className={`w-full h-1.5 rounded-full overflow-hidden p-0.5 border ${
          isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-slate-900 border-slate-800'
        }`}>
          <div 
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-400 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Hardware Status Note */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
          <span>PIPELINE: THREE.JS</span>
          <span>GPU ACCELERATED</span>
        </div>
      </div>
    </div>
  );
};
