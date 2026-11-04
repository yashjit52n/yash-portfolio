/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Yash Jit - 3D Personal Portfolio
 * Main application orchestrating 3D Three.js experiences,
 * accessible navigation, project showcases, and developer profiles.
 */

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUp } from 'lucide-react';
import { initialPortfolioData } from './data/portfolioData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { CollegeLife } from './components/CollegeLife';
import { Skills } from './components/Skills';
import { CompetitiveProgramming } from './components/CompetitiveProgramming';
import { Projects } from './components/Projects';
import { GithubShowcase } from './components/GithubShowcase';
import { CertificationsGallery } from './components/CertificationsGallery';
import { DeveloperTerminal } from './components/DeveloperTerminal';
import { LearningJourney } from './components/LearningJourney';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { BackgroundEffects } from './components/BackgroundEffects';
import { BinaryIntro } from './components/BinaryIntro';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { ScrollRevealSection } from './components/ScrollRevealSection';
import { ResumeModal } from './components/ResumeModal';

export default function App() {
  const [data] = useState(initialPortfolioData);
  const [showIntro, setShowIntro] = useState(true);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const isInitialMount = useRef(true);
  const transitionOverlayRef = useRef<HTMLDivElement>(null);
  const appContainerRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<'deep-space' | 'cyberpunk-light'>(() => {
    try {
      const saved = localStorage.getItem('yj_theme');
      return (saved === 'cyberpunk-light' || saved === 'deep-space') ? saved : 'deep-space';
    } catch {
      return 'deep-space';
    }
  });

  const applyThemeToDOM = (targetTheme: 'deep-space' | 'cyberpunk-light') => {
    document.documentElement.setAttribute('data-theme', targetTheme);
    if (targetTheme === 'deep-space') {
      document.documentElement.classList.add('dark');
      document.body.className = "bg-[#08090D] text-[#F8FAFC] selection:bg-[#8B5CF6]/30 selection:text-[#38BDF8] antialiased overflow-x-hidden font-['Inter',sans-serif]";
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = "bg-[#f1f5f9] text-slate-900 selection:bg-cyan-500/25 selection:text-cyan-900 antialiased overflow-x-hidden font-['Inter',sans-serif]";
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'deep-space' ? 'cyberpunk-light' : 'deep-space';
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !transitionOverlayRef.current) {
      applyThemeToDOM(nextTheme);
      setTheme(nextTheme);
      try {
        localStorage.setItem('yj_theme', nextTheme);
      } catch {
        // ignore
      }
      return;
    }

    // Execute smooth GSAP circular iris wipe & subtle micro-blur transition
    const overlay = transitionOverlayRef.current;
    const isGoingLight = nextTheme === 'cyberpunk-light';
    const veilColor = isGoingLight 
      ? 'rgba(241, 245, 249, 0.95)' 
      : 'rgba(5, 7, 15, 0.96)';

    // Kill any ongoing tweens on the overlay
    gsap.killTweensOf(overlay);

    gsap.set(overlay, {
      display: 'block',
      backgroundColor: veilColor,
      opacity: 0,
      clipPath: 'circle(0% at 85% 40px)',
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { display: 'none' });
      }
    });

    // Expand circular lens veil from the top-right navbar theme button position
    tl.to(overlay, {
      opacity: 1,
      clipPath: 'circle(150% at 85% 40px)',
      duration: 0.38,
      ease: 'power3.inOut',
      onComplete: () => {
        // Switch the data-theme attribute on documentElement at peak veil
        applyThemeToDOM(nextTheme);
        setTheme(nextTheme);
        try {
          localStorage.setItem('yj_theme', nextTheme);
        } catch {
          // ignore
        }
      }
    })
    // Smoothly dissolve veil and restore ambient sharpness
    .to(overlay, {
      opacity: 0,
      duration: 0.32,
      ease: 'power2.out',
    });

    // Subtle gentle GSAP luminance micro-animation on root container
    if (appContainerRef.current) {
      gsap.fromTo(
        appContainerRef.current,
        { filter: 'brightness(1.06) contrast(0.98)' },
        { filter: 'brightness(1) contrast(1)', duration: 0.5, ease: 'power2.out' }
      );
    }
  };

  useEffect(() => {
    // Ensure viewport starts at the top (Hero) when opening the website
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    if (isInitialMount.current) {
      applyThemeToDOM(theme);
      isInitialMount.current = false;
    }

    const onScroll = () => {
      setShowBackToTop(window.scrollY > 520);

      // Disable CSS scroll-snap near the bottom of the page (Terminal, Contact & Footer)
      // so scrolling down to the end never auto-pushes the viewport back up to "Have an idea? Let's build something."
      const contactEl = document.getElementById('contact');
      const terminalEl = document.getElementById('terminal');
      const nearBottomByHeight =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 950;
      const inBottomSections =
        (contactEl ? contactEl.getBoundingClientRect().top <= window.innerHeight * 0.85 : false) ||
        (terminalEl ? terminalEl.getBoundingClientRect().top <= window.innerHeight * 0.5 : false);

      if (nearBottomByHeight || inBottomSections) {
        document.documentElement.classList.add('disable-scroll-snap');
      } else {
        document.documentElement.classList.remove('disable-scroll-snap');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.documentElement.classList.remove('disable-scroll-snap');
    };
  }, [theme]);

  const handleConnectClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      ref={appContainerRef}
      data-theme={theme}
      className={`min-h-screen relative transition-colors duration-500 ${
        theme === 'cyberpunk-light'
          ? 'bg-[#f1f5f9] text-slate-900 selection:bg-cyan-500/25 selection:text-cyan-900'
          : 'bg-[#08090D] text-[#F8FAFC] selection:bg-[#8B5CF6]/30 selection:text-[#38BDF8]'
      }`}
    >
      {/* GSAP Smooth Theme Transition Lens Overlay */}
      <div 
        ref={transitionOverlayRef} 
        className="fixed inset-0 pointer-events-none z-[9999] backdrop-blur-[2px]" 
        style={{ display: 'none' }} 
        aria-hidden="true"
      />

      {/* Top Scroll Progress Bar */}
      <ScrollProgressBar theme={theme} />

      {/* Cinematic Binary Coded Opening Curtain */}
      {showIntro && (
        <BinaryIntro onComplete={() => setShowIntro(false)} />
      )}

      {/* Ambient Beautiful Background Effects */}
      <BackgroundEffects theme={theme} />

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Main Navigation - Hidden while showing the opening intro */}
      {!showIntro && (
        <Navbar 
          onConnectClick={handleConnectClick} 
          onReplayIntro={() => setShowIntro(true)} 
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenResume={() => setIsResumeOpen(true)}
        />
      )}

      {/* Main Content Sections */}
      <main>
        {/* Hero Section with Interactive 3D Centerpiece */}
        <Hero 
          data={data} 
          onReplayIntro={() => setShowIntro(true)} 
          theme={theme} 
          onOpenResume={() => setIsResumeOpen(true)}
        />

        {/* About Me Section - Graceful Scroll Reveal */}
        <ScrollRevealSection id="about-reveal">
          <About data={data} theme={theme} />
        </ScrollRevealSection>

        {/* College Life & 4-Year Academic Checkpoints */}
        <ScrollRevealSection id="college-life-reveal">
          <CollegeLife data={data} theme={theme} />
        </ScrollRevealSection>

        {/* Technical Skills Section - Graceful Scroll Reveal */}
        <ScrollRevealSection id="skills-reveal">
          <Skills data={data} theme={theme} />
        </ScrollRevealSection>

        {/* Competitive Programming & Live Codeforces Dashboard */}
        <ScrollRevealSection id="competitive-programming-reveal">
          <CompetitiveProgramming data={data} theme={theme} />
        </ScrollRevealSection>

        {/* Projects Showcase with Rich Case Studies - Graceful Scroll Reveal */}
        <ScrollRevealSection id="projects-reveal">
          <Projects data={data} theme={theme} />
        </ScrollRevealSection>

        {/* GitHub Public Repositories & Activity Telemetry */}
        <ScrollRevealSection id="github-reveal">
          <GithubShowcase theme={theme} />
        </ScrollRevealSection>

        {/* Certifications & Badges Gallery */}
        <ScrollRevealSection id="certifications-reveal">
          <CertificationsGallery certifications={data.certifications} theme={theme} />
        </ScrollRevealSection>

        {/* Currently Exploring / Learning Roadmap */}
        <ScrollRevealSection id="journey-reveal">
          <LearningJourney data={data} />
        </ScrollRevealSection>

        {/* Interactive Simulated Developer Terminal */}
        <ScrollRevealSection id="terminal-reveal" enableSnap={false}>
          <DeveloperTerminal 
            data={data} 
            theme={theme} 
            onOpenResume={() => setIsResumeOpen(true)}
            onToggleTheme={toggleTheme}
          />
        </ScrollRevealSection>

        {/* Social Links and Functional Contact Section */}
        <ScrollRevealSection id="contact-reveal" enableSnap={false}>
          <Contact data={data} theme={theme} />
        </ScrollRevealSection>
      </main>

      {/* Footer */}
      <Footer data={data} onReplayIntro={() => setShowIntro(true)} />

      {/* Floating Back-to-Top Control */}
      {showBackToTop && !showIntro && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll back to top"
          title="Back to top"
          className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl border shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
            theme === 'cyberpunk-light'
              ? 'bg-white/95 hover:bg-cyan-50 text-cyan-700 border-cyan-400/50 shadow-cyan-500/15'
              : 'bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border-cyan-500/40 shadow-cyan-500/20 backdrop-blur-md'
          }`}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Verified Downloadable / Printable Resume Modal */}
      <ResumeModal
        data={data}
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        theme={theme}
      />
    </div>
  );
}
