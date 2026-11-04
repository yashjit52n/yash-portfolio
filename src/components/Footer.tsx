/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Clean, minimal Footer with back-to-top button, quick navigation,
 * and accessibility preferences.
 */

import React from 'react';
import { ArrowUp, Github, Linkedin, Instagram, Code2, Heart } from 'lucide-react';
import { PortfolioData } from '../data/portfolioData';
import { soundEffects } from '../utils/soundEffects';

interface FooterProps {
  data: PortfolioData;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ data, onReplayIntro }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-slate-800/80 bg-[#04060d] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-cyan-400 font-['Outfit']">
              YJ
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-200 text-sm font-['Outfit']">
                Yash Jit
              </div>
              <div className="text-[11px] text-slate-400">
                1st Year B.Tech CS & AI · Newton School of Technology (Rishihood)
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href={data.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundEffects.playHover()}
              onClick={() => soundEffects.playClick()}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={data.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundEffects.playHover()}
              onClick={() => soundEffects.playClick()}
              className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-900 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={data.socials.codeforces}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundEffects.playHover()}
              onClick={() => soundEffects.playClick()}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
              aria-label="Codeforces Profile"
            >
              <Code2 className="w-4 h-4" />
            </a>
            <a
              href={data.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundEffects.playHover()}
              onClick={() => soundEffects.playClick()}
              className="p-2 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-slate-900 transition-colors"
              aria-label="Instagram Profile"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          {/* Actions: Replay Intro & Back to Top */}
          <div className="flex items-center gap-3">
            {onReplayIntro && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onReplayIntro();
                }}
                onMouseEnter={() => soundEffects.playHover()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-400 bg-slate-900/90 hover:bg-slate-800 hover:text-cyan-300 border border-slate-800 transition-all cursor-pointer"
                title="Replay the binary coded opening sequence"
              >
                <span>Replay Intro</span>
              </button>
            )}

            <button
              onClick={() => {
                soundEffects.playClick();
                scrollToTop();
              }}
              onMouseEnter={() => soundEffects.playHover()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-800 transition-all cursor-pointer"
              aria-label="Back to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Copyright & Disclaimer Line */}
        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Yash Jit. Designed with 3D Three.js & Tailwind CSS.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with precision for software engineering opportunities</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
