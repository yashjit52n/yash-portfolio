/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Reusable Intersection Observer Reveal Section.
 * Gracefully fades in and slides up content as the user scrolls down the page.
 * Uses native IntersectionObserver with fallback and prefers-reduced-motion check.
 */

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  threshold?: number;
  rootMargin?: string;
  id?: string;
  enableSnap?: boolean;
}

export const ScrollRevealSection: React.FC<ScrollRevealSectionProps> = ({
  children,
  className = '',
  delayMs = 0,
  threshold = 0.12,
  rootMargin = '0px 0px -60px 0px',
  id,
  enableSnap = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delayMs > 0) {
            setTimeout(() => setIsVisible(true), delayMs);
          } else {
            setIsVisible(true);
          }
          observer.unobserve(el);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [delayMs, threshold, rootMargin]);

  return (
    <div
      ref={sectionRef}
      id={id}
      className={`${enableSnap ? 'snap-section ' : ''}transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform will-change-transform ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8 pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  );
};
