/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Top Scroll Progress Bar.
 * Fills up smoothly at the very top of the screen as the user scrolls down the page.
 * Uses a subtle, vibrant gradient that matches the current theme palette.
 */

import React, { useEffect, useState } from 'react';

interface ScrollProgressBarProps {
  theme?: 'deep-space' | 'cyberpunk-light';
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ theme = 'deep-space' }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const currentScroll = window.scrollY;
            const progress = Math.min(Math.max((currentScroll / totalHeight) * 100, 0), 100);
            setScrollProgress(progress);
          } else {
            setScrollProgress(0);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLight = theme === 'cyberpunk-light';

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-[3px] z-[70] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className={`h-full transition-all duration-75 ease-out origin-left ${
          isLight
            ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
            : 'bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-400 shadow-[0_0_12px_rgba(56,189,248,0.7)]'
        }`}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
