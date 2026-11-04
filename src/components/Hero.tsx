/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Cinematic Hero Section for Yash Jit's 3D Portfolio.
 * Displays bold typographic introduction, cycling professional roles,
 * primary CTAs, and the interactive Three.js 3D geometric centerpiece.
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ArrowDown, Code2, Compass, Mail, Sparkles, FileText, Terminal, Github, Linkedin, Instagram, Download } from 'lucide-react';
import { ThreeDSceneLoader } from './ThreeDSceneLoader';
import { PortfolioData } from '../data/portfolioData';
import { soundEffects } from '../utils/soundEffects';

// Code-split 3D WebGL scenes for instant initial page load
const ThreeDScene = lazy(() =>
  import('./ThreeDScene').then((m) => ({ default: m.ThreeDScene }))
);
const ThreeParticleBackground = lazy(() =>
  import('./ThreeParticleBackground').then((m) => ({ default: m.ThreeParticleBackground }))
);

interface HeroProps {
  data: PortfolioData;
  onReplayIntro?: () => void;
  theme?: 'deep-space' | 'cyberpunk-light';
  onOpenResume?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ data, onReplayIntro, theme = 'deep-space', onOpenResume }) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = data.personal.headlineRoles;
  const isLight = theme === 'cyberpunk-light';

  // Cycle through professional roles smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [roles.length]);

  const handleMagneticMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.18;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = 'translate3d(0px, 0px, 0)';
  };

  return (
    <section 
      id="hero" 
      className="snap-section relative min-h-screen pt-28 pb-16 flex flex-col justify-between overflow-hidden bg-radial-gradient bg-grid-pattern"
    >
      {/* Subtle Three.js particle background effect floating behind the main 3D content */}
      <Suspense fallback={null}>
        <ThreeParticleBackground theme={theme} />
      </Suspense>

      {/* Subtle background ambient glow spheres */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10 ${
        isLight ? 'bg-indigo-400/15' : 'bg-indigo-600/10'
      }`} />
      <div className={`absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10 ${
        isLight ? 'bg-cyan-400/15' : 'bg-cyan-500/10'
      }`} />

      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-center">
        {/* Split Hero Grid: Left Typographic Pitch, Right 3D Centerpiece */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-6">
          
          {/* Left Column (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6 text-left z-10">
            {/* Availability status marker & intro trigger pill */}
            <div className="flex flex-wrap items-center gap-3">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border transition-colors ${
                isLight 
                  ? 'bg-cyan-50/90 border-cyan-300 text-cyan-800 shadow-sm shadow-cyan-500/5' 
                  : 'bg-indigo-950/60 border-indigo-500/30 text-cyan-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-cyan-600' : 'bg-cyan-400'}`} />
                <span>{data.personal.availability}</span>
              </div>

              {onReplayIntro && (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    onReplayIntro();
                  }}
                  onMouseEnter={() => soundEffects.playHover()}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    isLight 
                      ? 'bg-white/90 hover:bg-white border-cyan-400/40 text-cyan-700 shadow-sm' 
                      : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
                  }`}
                  title="Experience the binary coded intro sequence again"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                  <span>Replay Intro</span>
                </button>
              )}
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Outfit'] ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Hi, I'm <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">Yash Jit</span>.
              </h1>
              
              {/* Cycling Role Headline */}
              <div className="h-12 sm:h-14 flex items-center overflow-hidden">
                <span className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-['Outfit'] ${
                  isLight ? 'text-slate-800' : 'text-slate-300'
                }`}>
                  I am a{' '}
                  <span 
                    key={roleIndex} 
                    className={`inline-block border-b-2 pb-0.5 animate-fadeIn font-extrabold ${
                      isLight 
                        ? 'text-cyan-600 border-cyan-500' 
                        : 'text-cyan-400 border-cyan-400/60'
                    }`}
                  >
                    {roles[roleIndex]}
                  </span>
                </span>
              </div>
            </div>

            {/* Short Introduction */}
            <p className={`text-base sm:text-lg leading-relaxed max-w-2xl font-normal ${
              isLight ? 'text-slate-700' : 'text-slate-300/90'
            }`}>
              {data.personal.bio}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <a
                href="#projects"
                onMouseEnter={() => soundEffects.playHover()}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                onClick={() => soundEffects.playClick()}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#8B5CF6] via-indigo-500 to-[#38BDF8] hover:opacity-95 shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#38BDF8]/30 transition-all duration-200 ease-out"
              >
                <Compass className="w-4 h-4 text-cyan-100" />
                <span>Explore Projects</span>
              </a>

              {onOpenResume && (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    onOpenResume();
                  }}
                  onMouseEnter={() => soundEffects.playHover()}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  className={`flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-semibold border transition-all duration-200 ease-out cursor-pointer ${
                    isLight 
                      ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-sm hover:border-cyan-400' 
                      : 'bg-[#151824] hover:bg-[#1c2030] text-[#F8FAFC] border-[#8B5CF6]/40 hover:border-[#38BDF8]/60 shadow-md shadow-black/30'
                  }`}
                  title="View and download verified resume"
                >
                  <Download className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#38BDF8]'}`} />
                  <span>Download Resume</span>
                </button>
              )}

              <a
                href="#contact"
                onMouseEnter={() => soundEffects.playHover()}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                onClick={() => soundEffects.playClick()}
                className={`flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ease-out border ${
                  isLight 
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300' 
                    : 'text-slate-200 glass-panel hover:bg-slate-800/80 hover:text-white border-slate-700/80 hover:border-slate-500'
                }`}
              >
                <Mail className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-[#8B5CF6]'}`} />
                <span>Let's Connect</span>
              </a>

              <a
                href="#terminal"
                onMouseEnter={() => soundEffects.playHover()}
                onClick={() => soundEffects.playClick()}
                className={`flex items-center gap-2 px-4 py-3.5 rounded-xl text-xs font-semibold border transition-all ${
                  isLight 
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' 
                    : 'bg-[#10121A]/80 hover:bg-[#151824] border-slate-800 text-slate-300'
                }`}
                title="Jump to interactive terminal"
              >
                <Terminal className="w-4 h-4 text-[#38BDF8]" />
                <span>Terminal</span>
              </a>
            </div>

            {/* Direct Social Media Links & Verified Profiles Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <span className={`text-xs font-medium uppercase tracking-wider mr-1 ${
                isLight ? 'text-slate-500' : 'text-[#94A3B8]'
              }`}>
                Profiles:
              </span>
              <a
                href={data.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEffects.playHover()}
                onClick={() => soundEffects.playClick()}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-950 shadow-2xs'
                    : 'bg-[#151824]/90 hover:bg-[#1e2233] border-white/10 hover:border-[#8B5CF6]/50 text-[#F8FAFC]'
                }`}
                aria-label="GitHub Profile"
              >
                <Github className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>GitHub</span>
              </a>

              <a
                href={data.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEffects.playHover()}
                onClick={() => soundEffects.playClick()}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-blue-700 shadow-2xs'
                    : 'bg-[#151824]/90 hover:bg-[#1e2233] border-white/10 hover:border-[#38BDF8]/50 text-[#F8FAFC]'
                }`}
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>LinkedIn</span>
              </a>

              <a
                href={data.socials.codeforces}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEffects.playHover()}
                onClick={() => soundEffects.playClick()}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-cyan-700 shadow-2xs'
                    : 'bg-[#151824]/90 hover:bg-[#1e2233] border-white/10 hover:border-[#38BDF8]/50 text-[#F8FAFC]'
                }`}
                aria-label="Codeforces Profile"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Codeforces ({data.competitiveProgramming.rating})</span>
              </a>

              <a
                href={data.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEffects.playHover()}
                onClick={() => soundEffects.playClick()}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-pink-600 shadow-2xs'
                    : 'bg-[#151824]/90 hover:bg-[#1e2233] border-white/10 hover:border-pink-500/50 text-[#F8FAFC]'
                }`}
                aria-label="Instagram Profile"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>Instagram</span>
              </a>
            </div>

            {/* Clean Editorial Metadata Line */}
            <div className={`pt-2 flex flex-wrap items-center gap-3 text-xs ${
              isLight ? 'text-slate-600' : 'text-[#94A3B8]'
            }`}>
              <span className={`font-semibold ${isLight ? 'text-cyan-700' : 'text-[#38BDF8]'}`}>
                1st Year · Newton School of Technology
              </span>
              <span aria-hidden="true" className={isLight ? 'text-slate-400' : 'text-slate-600'}>·</span>
              <span className={isLight ? 'text-slate-800 font-medium' : 'text-slate-300'}>
                Rishihood University
              </span>
              <span aria-hidden="true" className={isLight ? 'text-slate-400' : 'text-slate-600'}>·</span>
              <span>100+ Problems Solved</span>
              <span aria-hidden="true" className={isLight ? 'text-slate-400' : 'text-slate-600'}>·</span>
              <span>C++, Python, Java, JS</span>
            </div>
          </div>

          {/* Right Column: 3D Centerpiece (lg:col-span-5) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className={`w-full max-w-[540px] aspect-square relative rounded-3xl glass-panel p-2 shadow-2xl overflow-hidden border transition-all ${
              isLight ? 'border-cyan-400/30 shadow-cyan-500/10' : 'border-slate-800'
            }`}>
              {/* Subtle tech border glow */}
              <div className={`absolute inset-0 pointer-events-none ${
                isLight 
                  ? 'bg-gradient-to-tr from-indigo-500/5 via-transparent to-cyan-500/10' 
                  : 'bg-gradient-to-tr from-indigo-500/10 via-transparent to-cyan-500/10'
              }`} />
              
              {/* 3D Scene with Lightweight Suspense Fallback */}
              <Suspense fallback={<ThreeDSceneLoader theme={theme} />}>
                <ThreeDScene className="w-full h-full" theme={theme} />
              </Suspense>
            </div>
          </div>

        </div>

        {/* Full-Width Metric Strip Below Split */}
        <div className={`mt-12 pt-8 border-t grid grid-cols-2 md:grid-cols-4 gap-6 ${
          isLight ? 'border-slate-200' : 'border-slate-800/80'
        }`}>
          <div className="space-y-1">
            <div className={`text-xs uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Academic Pursuit
            </div>
            <div className={`text-sm sm:text-base font-bold font-['Outfit'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
              1st Year B.Tech CS & AI
            </div>
            <div className={`text-xs font-medium ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>
              Newton School of Technology (Rishihood)
            </div>
          </div>
          <div className="space-y-1">
            <div className={`text-xs uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Competitive Stats
            </div>
            <div className={`text-sm sm:text-base font-bold font-['Outfit'] font-mono tabular-nums ${isLight ? 'text-slate-900' : 'text-white'}`}>
              100+ Solved
            </div>
            <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Codeforces Algorithmic Challenges
            </div>
          </div>
          <div className="space-y-1">
            <div className={`text-xs uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Contest Rating
            </div>
            <div className={`text-sm sm:text-base font-bold font-['Outfit'] font-mono tabular-nums ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>
              {data.competitiveProgramming.rating} <span className={`text-xs font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>({data.competitiveProgramming.rankName})</span>
            </div>
            <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Active Division Competitor
            </div>
          </div>
          <div className="space-y-1">
            <div className={`text-xs uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Programming Stack
            </div>
            <div className={`text-sm sm:text-base font-bold font-['Outfit'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Python · C++ · Java
            </div>
            <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              + Modern Web & JavaScript
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Scroll Indicator */}
      <div className="flex justify-center pt-8">
        <a 
          href="#about" 
          className={`flex flex-col items-center gap-1.5 text-xs transition-colors group ${
            isLight ? 'text-slate-500 hover:text-cyan-600' : 'text-slate-400 hover:text-cyan-400'
          }`}
          aria-label="Scroll down to About section"
        >
          <span className="text-[11px] tracking-widest uppercase font-semibold">Scroll to explore</span>
          <ArrowDown className={`w-3.5 h-3.5 animate-bounce group-hover:translate-y-1 transition-transform ${
            isLight ? 'text-cyan-600' : 'text-cyan-400'
          }`} />
        </a>
      </div>
    </section>
  );
};
