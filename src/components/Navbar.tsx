/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Top Bar Navigation complying with the 3-Zone Top Bar Contract:
 * [Brand Wordmark] — [4-5 Single-Line Links] — [1 Primary Action Button]
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Terminal, Sun, Moon, Volume2, VolumeX, FileText } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface NavbarProps {
  onConnectClick?: () => void;
  onReplayIntro?: () => void;
  theme?: 'deep-space' | 'cyberpunk-light';
  onToggleTheme?: () => void;
  onOpenResume?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onConnectClick, 
  onReplayIntro,
  theme = 'deep-space',
  onToggleTheme,
  onOpenResume,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const manualScrollLockRef = React.useRef<number>(0);

  const isLight = theme === 'cyberpunk-light';

  const handleSelectSection = (navId: string) => {
    setActiveSection(navId);
    // Lock scroll-spy briefly during smooth anchor scroll so intermediate sections don't steal focus
    manualScrollLockRef.current = Date.now() + 750;
  };

  useEffect(() => {
    const sectionMap: { id: string; navId: string }[] = [
      { id: 'hero', navId: 'hero' },
      { id: 'about', navId: 'about' },
      { id: 'college-life', navId: 'about' },
      { id: 'skills', navId: 'skills' },
      { id: 'competitive-programming', navId: 'competitive-programming' },
      { id: 'projects', navId: 'projects' },
      { id: 'github', navId: 'projects' },
      { id: 'certifications', navId: 'certifications' },
      { id: 'journey', navId: 'certifications' },
      { id: 'terminal', navId: 'terminal' },
      { id: 'contact', navId: 'contact' },
    ];

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // Respect brief lock while smooth-scrolling to a clicked section
      if (Date.now() < manualScrollLockRef.current) {
        return;
      }

      if (window.scrollY < 120) {
        setActiveSection('hero');
        return;
      }

      // Check if scrolled near the very bottom of the page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 70) {
        setActiveSection('contact');
        return;
      }

      // Focal line at 36% of viewport height: the last section in document order whose top is above this line is the active section
      const focalLine = window.innerHeight * 0.36;
      let currentMatch = 'hero';

      for (const item of sectionMap) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= focalLine) {
            currentMatch = item.navId;
          }
        }
      }

      setActiveSection(currentMatch);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const [isMuted, setIsMuted] = useState(() => soundEffects.isMuted());

  const handleToggleSound = () => {
    const next = soundEffects.toggleMuted();
    setIsMuted(next);
  };

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero', tooltip: '3D Hero & Introduction' },
    { label: 'About', href: '#about', id: 'about', tooltip: 'About Yash & Education' },
    { label: 'Skills', href: '#skills', id: 'skills', tooltip: 'Technical Stack & Tools' },
    { label: 'Codeforces', href: '#competitive-programming', id: 'competitive-programming', tooltip: 'Codeforces Live Stats (999)' },
    { label: 'Projects', href: '#projects', id: 'projects', tooltip: 'Featured Projects & Case Studies' },
    { label: 'Achievements', href: '#certifications', id: 'certifications', tooltip: 'Verified Certifications & Badges' },
    { label: 'Terminal', href: '#terminal', id: 'terminal', tooltip: 'Interactive Developer Terminal' },
    { label: 'Contact', href: '#contact', id: 'contact', tooltip: 'Get in Touch & Connect' },
  ];

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 transition-all duration-300 pointer-events-none"
    >
      <div 
        className={`max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 rounded-2xl flex items-center justify-between gap-2 md:gap-4 lg:gap-6 pointer-events-auto transition-all duration-300 border ${
          scrolled 
            ? isLight
              ? 'bg-white/90 backdrop-blur-xl border-cyan-500/25 shadow-xl shadow-cyan-950/5'
              : 'bg-[#10121A]/88 backdrop-blur-xl border-[#8B5CF6]/30 shadow-2xl shadow-black/60' 
            : isLight
              ? 'bg-white/75 backdrop-blur-md border-slate-200/80 shadow-sm'
              : 'bg-[#151824]/70 backdrop-blur-md border-white/10 shadow-lg shadow-black/30'
        }`}
      >
        {/* Zone 1: Brand Wordmark (Single element) */}
        <a 
          href="#hero" 
          onMouseEnter={() => soundEffects.playHover()}
          onClick={() => {
            soundEffects.playClick();
            handleSelectSection('hero');
          }}
          className={`flex items-center gap-2.5 sm:gap-3 group transition-colors whitespace-nowrap shrink-0 ${
            isLight ? 'text-slate-900 hover:text-black' : 'text-[#F8FAFC] hover:text-white'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-indigo-500 to-[#38BDF8] p-[1px] shadow-md shadow-[#8B5CF6]/25 group-hover:shadow-[#38BDF8]/40 transition-shadow">
            <div className={`w-full h-full rounded-[11px] flex items-center justify-center transition-colors ${
              isLight ? 'bg-white' : 'bg-[#08090D]'
            }`}>
              <span className="font-['Space_Grotesk'] font-bold text-xs sm:text-sm bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] bg-clip-text text-transparent">
                YJ
              </span>
            </div>
          </div>
          <span className={`font-['Space_Grotesk'] font-bold text-base sm:text-lg tracking-tight hidden lg:inline ${
            isLight ? 'text-slate-900' : 'text-[#F8FAFC]'
          }`}>
            Yash Jit
          </span>
        </a>

        {/* Zone 2: Mathematically Equal 8-Column Evenly Distributed Responsive Nav Links */}
        <nav aria-label="Primary Navigation" className="hidden md:grid grid-cols-8 items-center w-full flex-1 mx-2 lg:mx-4 xl:mx-6 gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <div key={link.id} className="relative group w-full flex justify-center">
                <a
                  href={link.href}
                  onMouseEnter={() => soundEffects.playHover()}
                  onClick={() => {
                    soundEffects.playClick();
                    handleSelectSection(link.id);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  data-section-link={link.id}
                  data-active={isActive ? 'true' : 'false'}
                  aria-describedby={`nav-tooltip-${link.id}`}
                  className={`nav-link-interactive relative w-full text-center flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-xs lg:text-xs xl:text-sm font-medium border ${
                    isActive 
                      ? `current-section ${
                          isLight 
                            ? 'text-cyan-800 font-bold bg-cyan-100/90 border-cyan-400/60' 
                            : 'text-[#38BDF8] font-semibold bg-[#8B5CF6]/20 border-[#8B5CF6]/50'
                        }`
                      : isLight 
                        ? 'text-slate-600 border-transparent' 
                        : 'text-slate-300 border-transparent'
                  }`}
                >
                  {isActive && (
                    <span 
                      className={`w-1.5 h-1.5 rounded-full shrink-0 animate-pulse ${
                        isLight ? 'bg-cyan-600' : 'bg-[#38BDF8]'
                      }`} 
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate px-0.5">{link.label}</span>
                  {isActive && (
                    <span className="current-section-indicator absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3/5 max-w-[36px] h-[2px] bg-gradient-to-r from-[#8B5CF6] via-[#38BDF8] to-[#8B5CF6] rounded-full" />
                  )}
                </a>

                {/* Subtle, Animated Hover Tooltip */}
                <div
                  id={`nav-tooltip-${link.id}`}
                  role="tooltip"
                  className={`absolute top-full mt-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-mono tracking-tight whitespace-nowrap shadow-xl border pointer-events-none opacity-0 scale-95 -translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 ease-out z-50 ${
                    isLight
                      ? 'bg-white/95 border-cyan-500/30 text-slate-800 shadow-slate-200/80 backdrop-blur-md'
                      : 'bg-[#0a0f1d]/95 border-cyan-500/40 text-cyan-200 shadow-cyan-950/50 backdrop-blur-md'
                  }`}
                >
                  {/* Tooltip Caret Arrow */}
                  <div 
                    className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-t border-l ${
                      isLight ? 'bg-white border-cyan-500/30' : 'bg-[#0a0f1d] border-cyan-500/40'
                    }`}
                  />
                  <span className="relative z-10 font-semibold">{link.tooltip}</span>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Zone 3: Actions - Adaptive Audio, Theme, Replay Intro & Let's Connect */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2.5 shrink-0">
          {/* Subtle Sound FX Toggle Button */}
          <button
            type="button"
            onClick={handleToggleSound}
            onMouseEnter={() => soundEffects.playHover()}
            className={`p-2 rounded-xl border transition-all cursor-pointer shadow-sm group active:scale-95 ${
              isLight
                ? isMuted 
                  ? 'text-slate-400 bg-slate-100/80 border-slate-200 hover:text-slate-700' 
                  : 'text-cyan-700 bg-cyan-50/80 border-cyan-400/40 hover:bg-cyan-100'
                : isMuted 
                  ? 'text-slate-500 bg-slate-900 border-slate-800 hover:text-slate-300' 
                  : 'text-cyan-400 bg-slate-900/90 border-cyan-500/40 hover:bg-slate-800'
            }`}
            title={isMuted ? 'Unmute subtle hover & click sound effects' : 'Mute UI sound effects'}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-500" />
            )}
          </button>

          {/* Theme Switch: Compact on mid-screens, Dual-segmented on extra large */}
          {onToggleTheme && (
            <>
              {/* Compact Switch (md to xl) */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playThemeSwitch();
                  onToggleTheme();
                }}
                onMouseEnter={() => soundEffects.playHover()}
                className={`2xl:hidden p-2 rounded-xl border transition-all duration-300 cursor-pointer group active:scale-95 shadow-sm ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-cyan-500/40 text-indigo-600 shadow-cyan-500/10'
                    : 'bg-slate-900/95 hover:bg-slate-800/95 border-cyan-500/30 text-amber-300 shadow-cyan-500/10'
                }`}
                title={isLight ? 'Switch to Deep Space (Dark Theme)' : 'Switch to Cyberpunk Light Theme'}
                aria-label="Toggle theme"
              >
                {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              </button>

              {/* Segmented Switch (2xl+) */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playThemeSwitch();
                  onToggleTheme();
                }}
                onMouseEnter={() => soundEffects.playHover()}
                className={`hidden 2xl:flex relative items-center p-1 rounded-xl border transition-all duration-300 cursor-pointer group active:scale-95 select-none shadow-sm ${
                  isLight
                    ? 'bg-white/95 hover:bg-white border-cyan-500/40 shadow-cyan-500/15'
                    : 'bg-slate-900/95 hover:bg-slate-800/95 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                }`}
                title={isLight ? 'Switch to Deep Space (Dark Theme)' : 'Switch to Cyberpunk Light Theme'}
                aria-label={`Toggle theme: currently ${isLight ? 'Cyberpunk Light' : 'Deep Space'}`}
              >
                <div className="flex items-center gap-1 text-[11px] font-semibold">
                  <span
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-300 ${
                      !isLight
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                        : 'text-slate-500 group-hover:text-slate-700'
                    }`}
                  >
                    <Moon className={`w-3 h-3 ${!isLight ? 'text-cyan-200' : 'text-slate-400'}`} />
                    <span>Deep Space</span>
                  </span>

                  <span
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-300 ${
                      isLight
                        ? 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25 font-bold'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Sun className={`w-3 h-3 ${isLight ? 'text-amber-200' : 'text-slate-500'}`} />
                    <span>Cyber Light</span>
                  </span>
                </div>
              </button>
            </>
          )}

          {/* Replay Intro Button (Icon on md/lg, Icon+Text on xl+) */}
          {onReplayIntro && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onReplayIntro();
              }}
              onMouseEnter={() => soundEffects.playHover()}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer shadow-sm group active:scale-95 ${
                isLight
                  ? 'text-cyan-700 hover:text-cyan-800 bg-white/90 hover:bg-white border-cyan-500/30 hover:border-cyan-500/60'
                  : 'text-cyan-400 hover:text-cyan-300 bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 hover:border-cyan-500/50'
              }`}
              title="Watch the 3D binary coded intro opening again"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-500 group-hover:scale-110 transition-transform" />
              <span className="hidden xl:inline">Replay Intro</span>
            </button>
          )}

          {/* Downloadable Resume Action */}
          {onOpenResume && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onOpenResume();
              }}
              onMouseEnter={() => soundEffects.playHover()}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                isLight 
                  ? 'bg-cyan-50/90 hover:bg-cyan-100 border-cyan-300 text-cyan-800 shadow-xs' 
                  : 'bg-cyan-950/40 hover:bg-cyan-900/50 border-cyan-500/30 text-cyan-300'
              }`}
              title="View and download verified resume"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Resume</span>
            </button>
          )}

          {/* Let's Connect CTA */}
          <a
            href="#contact"
            onClick={(e) => {
              soundEffects.playClick();
              onConnectClick?.();
            }}
            onMouseEnter={() => soundEffects.playHover()}
            className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 xl:px-5 py-2 lg:py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 rounded-xl hover:opacity-95 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all whitespace-nowrap shrink-0"
          >
            <span>Let's Connect</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu & Theme Button */}
        <div className="md:hidden flex items-center gap-2">
          {onToggleTheme && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playThemeSwitch();
                onToggleTheme();
              }}
              onMouseEnter={() => soundEffects.playHover()}
              className={`p-2 rounded-xl border text-xs font-medium transition-all shadow-sm active:scale-95 cursor-pointer ${
                isLight 
                  ? 'bg-white border-cyan-500/40 text-indigo-600 shadow-cyan-500/15' 
                  : 'bg-slate-900 border-cyan-500/40 text-amber-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
              }`}
              title={isLight ? 'Switch to Deep Space' : 'Switch to Cyberpunk Light'}
              aria-label="Toggle visual theme palette"
            >
              {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
              isLight 
                ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden mt-2 max-w-7xl mx-auto rounded-2xl px-6 py-6 space-y-4 shadow-2xl pointer-events-auto border transition-colors duration-300 ${
          isLight ? 'bg-white/95 border-cyan-500/20 text-slate-900 backdrop-blur-xl' : 'bg-[#10121A]/95 border-[#8B5CF6]/30 text-[#F8FAFC] backdrop-blur-xl'
        }`}>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => {
                    soundEffects.playClick();
                    handleSelectSection(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`nav-link-interactive text-sm font-medium py-2.5 px-3 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 border ${
                    isActive
                      ? `current-section ${
                          isLight 
                            ? 'bg-cyan-50 border-cyan-300 text-cyan-800 font-bold shadow-xs' 
                            : 'bg-[#8B5CF6]/20 border-[#8B5CF6]/50 text-[#38BDF8] font-bold shadow-xs'
                        }`
                      : isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-700' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  {isActive && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-cyan-600' : 'bg-[#38BDF8]'}`} />
                  )}
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>

          <div className={`pt-3 border-t space-y-2.5 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <button
              type="button"
              onClick={handleToggleSound}
              className={`flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                isLight
                  ? 'text-slate-800 bg-slate-50 border-slate-200 hover:bg-slate-100'
                  : 'text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-500" />}
              <span>{isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}</span>
            </button>

            {onToggleTheme && (
              <div className={`p-1 rounded-xl border flex items-center gap-1 transition-all ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
                <button
                  type="button"
                  onClick={() => {
                    if (isLight) {
                      soundEffects.playThemeSwitch();
                      onToggleTheme();
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    !isLight
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Deep Space</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isLight) {
                      soundEffects.playThemeSwitch();
                      onToggleTheme();
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isLight
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Cyber Light</span>
                </button>
              </div>
            )}

            {onReplayIntro && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setMobileMenuOpen(false);
                  onReplayIntro();
                }}
                className={`flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                  isLight
                    ? 'text-cyan-700 bg-cyan-50/60 border-cyan-500/30 hover:bg-cyan-50'
                    : 'text-cyan-400 bg-slate-900 border-slate-700/80 hover:border-cyan-500/50'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-500" />
                <span>Replay 3D Intro Opening</span>
              </button>
            )}

            {onOpenResume && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className={`flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  isLight
                    ? 'text-cyan-800 bg-cyan-50 border-cyan-300'
                    : 'text-cyan-300 bg-cyan-950/40 border-cyan-500/40'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View & Download Verified Resume</span>
              </button>
            )}

            <a
              href="#contact"
              onClick={() => {
                soundEffects.playClick();
                setMobileMenuOpen(false);
                onConnectClick?.();
              }}
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl"
            >
              <span>Let's Connect</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
