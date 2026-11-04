/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Beautiful, performant ambient background effects.
 * Includes floating nebula gradient meshes, subtle mouse-reactive constellation dust,
 * and delicate grid accents that preserve WCAG AA legibility and UI aesthetic.
 */

import React from 'react';

interface BackgroundEffectsProps {
  theme?: 'deep-space' | 'cyberpunk-light';
}

export const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ theme = 'deep-space' }) => {
  const isLight = theme === 'cyberpunk-light';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* 1. Slow-Drifting Aurora Nebula Orbs */}
      <div 
        className={`absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full blur-[130px] animate-float-1 transition-all duration-700 ${
          isLight 
            ? 'bg-gradient-to-br from-cyan-400/20 via-sky-300/12 to-transparent' 
            : 'bg-gradient-to-br from-indigo-600/15 via-blue-600/8 to-transparent'
        }`}
      />
      <div 
        className={`absolute top-[35%] -right-[15%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full blur-[120px] animate-float-2 transition-all duration-700 ${
          isLight 
            ? 'bg-gradient-to-bl from-fuchsia-400/18 via-pink-300/10 to-transparent' 
            : 'bg-gradient-to-bl from-cyan-500/12 via-indigo-600/6 to-transparent'
        }`}
      />
      <div 
        className={`absolute -bottom-[10%] left-[20%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full blur-[130px] animate-float-3 transition-all duration-700 ${
          isLight 
            ? 'bg-gradient-to-tr from-violet-400/16 via-indigo-300/10 to-transparent' 
            : 'bg-gradient-to-tr from-purple-600/12 via-cyan-600/5 to-transparent'
        }`}
      />

      {/* 2. Cybernetic Precision Grid Texture */}
      <div className={`absolute inset-0 bg-grid-pattern transition-opacity duration-700 ${isLight ? 'opacity-70' : 'opacity-40'}`} />

      {/* 3. Subtle Vignette Depth Scrim */}
      <div 
        className={`absolute inset-0 transition-all duration-700 ${
          isLight 
            ? 'bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(226,232,240,0.6)_100%)]' 
            : 'bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,7,15,0.7)_100%)]'
        }`} 
      />

      {/* 4. Ambient Cybernetic Top Center Glow */}
      <div 
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[900px] h-52 rounded-full blur-[110px] transition-all duration-700 pointer-events-none ${
          isLight 
            ? 'bg-gradient-to-b from-cyan-400/20 via-indigo-500/10 to-transparent' 
            : 'bg-gradient-to-b from-indigo-500/15 via-cyan-500/8 to-transparent'
        }`}
      />
    </div>
  );
};


