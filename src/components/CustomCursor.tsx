/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Non-intrusive custom cursor for desktop viewports.
 * Automatically disabled on mobile touch devices and when prefers-reduced-motion is active.
 */

import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    // Only enable if pointer is fine (desktop mouse) and motion is not reduced
    const fineQuery = window.matchMedia('(pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!fineQuery.matches || motionQuery.matches) {
      return;
    }
    setIsFinePointer(true);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('a, button, input, textarea, [role="button"], select')
        );
        setIsPointer(isClickable);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  if (!isFinePointer || !isVisible) return null;

  return (
    <>
      {/* Outer subtle glow cursor */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out hidden sm:block"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      >
        <div
          className={`rounded-full border border-cyan-400/50 transition-all duration-200 ${
            isPointer
              ? 'w-10 h-10 bg-cyan-400/10 scale-125 border-cyan-300'
              : 'w-7 h-7 bg-indigo-500/5'
          }`}
        />
      </div>

      {/* Tiny inner center dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 hidden sm:block"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
      </div>
    </>
  );
};
