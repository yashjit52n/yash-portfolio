/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Certifications and Badges Gallery for Yash Jit's Portfolio.
 * Displays verified academic, competitive programming, and technical credentials.
 * Includes interactive modal verification details and category filtering.
 */

import React, { useState } from 'react';
import { Award, CheckCircle2, ExternalLink, GraduationCap, Trophy, Code2, Layout, Sparkles, Filter, X } from 'lucide-react';
import { BadgeItem } from '../data/portfolioData';
import { soundEffects } from '../utils/soundEffects';

interface CertificationsGalleryProps {
  certifications: BadgeItem[];
  theme?: 'deep-space' | 'cyberpunk-light';
}

export const CertificationsGallery: React.FC<CertificationsGalleryProps> = ({
  certifications,
  theme = 'deep-space',
}) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'competitive' | 'academic' | 'technical'>('all');

  const isLight = theme === 'cyberpunk-light';

  const filtered = activeCategory === 'all'
    ? certifications
    : certifications.filter((c) => c.category === activeCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy className="w-6 h-6 text-amber-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-indigo-400" />;
      case 'Code2':
        return <Code2 className="w-6 h-6 text-cyan-400" />;
      case 'Layout':
      default:
        return <Layout className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <section id="certifications" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#38BDF8]">
              <Award className="w-3.5 h-3.5" />
              <span>Verified Milestones & Education Timeline</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight font-['Space_Grotesk'] ${
              isLight ? 'text-slate-900' : 'text-[#F8FAFC]'
            }`}>
              Achievements, Certifications & Academic Timeline
            </h2>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#94A3B8]'}`}>
              Verified academic, algorithmic, and engineering achievements earned throughout university coursework at Newton School of Technology and competitive coding on Codeforces.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 self-start md:self-auto ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#10121A] border-slate-800'
          }`}>
            {(['all', 'competitive', 'academic', 'technical'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  activeCategory === cat
                    ? isLight
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] text-white shadow-sm'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Timeline Track Indicator (Desktop) */}
        <div className="hidden lg:flex items-center justify-between mb-6 px-6 relative">
          <div className={`absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] ${
            isLight ? 'bg-gradient-to-r from-indigo-200 via-cyan-300 to-indigo-200' : 'bg-gradient-to-r from-[#8B5CF6]/40 via-[#38BDF8]/40 to-[#8B5CF6]/40'
          }`} />
          {filtered.map((badge) => (
            <div key={`tl-${badge.id}`} className="relative z-10 flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold border bg-[#10121A] border-[#8B5CF6]/40 text-[#38BDF8]">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
              <span>{badge.issueDate}</span>
            </div>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((badge) => (
            <div
              key={badge.id}
              onClick={() => {
                soundEffects.playClick();
                setSelectedBadge(badge);
              }}
              onMouseEnter={() => soundEffects.playHover()}
              className={`p-6 rounded-2xl border transition-all cursor-pointer hover:-translate-y-1 flex flex-col justify-between text-left group ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm hover:shadow-md'
                  : 'glass-panel glass-panel-hover border-slate-800 shadow-xl'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                    isLight 
                      ? 'bg-cyan-50 border-cyan-200 shadow-xs' 
                      : 'bg-[#10121A] border-slate-700/80 group-hover:border-[#8B5CF6]/50 shadow-md'
                  }`}>
                    {getIcon(badge.iconName)}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {badge.verified && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-[#38BDF8] font-medium">
                      {badge.issueDate}
                    </span>
                  </div>
                </div>

                <h3 className={`text-base font-bold font-['Space_Grotesk'] mb-1 group-hover:text-[#38BDF8] transition-colors ${
                  isLight ? 'text-slate-900' : 'text-[#F8FAFC]'
                }`}>
                  {badge.title}
                </h3>
                
                <div className={`text-xs font-medium mb-3 ${isLight ? 'text-indigo-600' : 'text-[#8B5CF6]'}`}>
                  {badge.issuer}
                </div>

                <p className={`text-xs line-clamp-3 leading-relaxed mb-4 ${
                  isLight ? 'text-slate-600' : 'text-[#94A3B8]'
                }`}>
                  {badge.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {badge.skills.slice(0, 3).map((sk) => (
                    <span
                      key={sk}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        isLight ? 'bg-slate-100 text-slate-700' : 'bg-[#10121A] text-slate-300 border border-white/5'
                      }`}
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                <div className={`pt-3 border-t flex items-center justify-between text-[11px] ${
                  isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800/80 text-slate-400'
                }`}>
                  <span className="capitalize font-mono">{badge.category}</span>
                  <span className="font-semibold text-[#38BDF8] group-hover:translate-x-0.5 transition-transform">
                    Inspect Credential →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div 
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl relative text-left ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0b1020] border-slate-800 text-white'
            }`}
          >
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center">
                {getIcon(selectedBadge.iconName)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-['Outfit']">{selectedBadge.title}</h3>
                  {selectedBadge.verified && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>
                <div className="text-xs text-cyan-400 font-semibold mt-0.5">
                  {selectedBadge.issuer} · {selectedBadge.issueDate}
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-slate-300">
              <p>{selectedBadge.description}</p>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Validated Competencies
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedBadge.skills.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-mono px-2.5 py-1 rounded-md bg-indigo-950/40 border border-indigo-500/30 text-indigo-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {selectedBadge.credentialUrl && (
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Institutional Reference:</span>
                  <a
                    href={selectedBadge.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>Verify Credentials</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
