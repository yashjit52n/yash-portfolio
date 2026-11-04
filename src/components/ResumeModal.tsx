/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Downloadable / Printable Resume Modal for Yash Jit.
 * Provides a verified, high-contrast, ATS-friendly developer resume preview
 * with one-click print/save-as-PDF and text download capabilities.
 */

import React, { useRef } from 'react';
import { X, Printer, Download, ExternalLink, FileText, CheckCircle2, Award, Briefcase, GraduationCap } from 'lucide-react';
import { PortfolioData } from '../data/portfolioData';
import { soundEffects } from '../utils/soundEffects';

interface ResumeModalProps {
  data: PortfolioData;
  isOpen: boolean;
  onClose: () => void;
  theme?: 'deep-space' | 'cyberpunk-light';
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  data,
  isOpen,
  onClose,
  theme = 'deep-space',
}) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'cyberpunk-light';

  if (!isOpen) return null;

  const handlePrint = () => {
    soundEffects.playClick();
    window.print();
  };

  const handleDownloadText = () => {
    soundEffects.playClick();
    const resumeText = `
================================================================================
YASH JIT - ASPIRING SOFTWARE ENGINEER
================================================================================
Email: ${data.personal.email}
Location: ${data.personal.location}
GitHub: ${data.socials.github}
LinkedIn: ${data.socials.linkedin}
Codeforces: ${data.socials.codeforces} (Rating: ${data.competitiveProgramming.rating})

SUMMARY
--------------------------------------------------------------------------------
${data.resumeData.summary}

EDUCATION
--------------------------------------------------------------------------------
${data.resumeData.education[0].institution}
${data.resumeData.education[0].degree}
Duration: ${data.resumeData.education[0].duration} | Location: ${data.resumeData.education[0].location}
Highlights:
${data.resumeData.education[0].highlights.map(h => `  • ${h}`).join('\n')}

TECHNICAL SKILLS
--------------------------------------------------------------------------------
${data.resumeData.skills.map(s => `• ${s.category}: ${s.items.join(', ')}`).join('\n')}

COMPETITIVE PROGRAMMING
--------------------------------------------------------------------------------
Platform: ${data.resumeData.competitiveProgramming.platform}
Rating: ${data.resumeData.competitiveProgramming.rating}
Problems Solved: ${data.resumeData.competitiveProgramming.solved}
Profile: ${data.resumeData.competitiveProgramming.profile}
Highlights:
${data.resumeData.competitiveProgramming.highlights.map(h => `  • ${h}`).join('\n')}

FEATURED PROJECTS
--------------------------------------------------------------------------------
${data.resumeData.featuredProjects.map(p => `
${p.name} [${p.tech}]
${p.bullets.map(b => `  • ${b}`).join('\n')}
`).join('')}

CERTIFICATIONS & HONORS
--------------------------------------------------------------------------------
${data.resumeData.certifications.map(c => `• ${c}`).join('\n')}
================================================================================
    `.trim();

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Yash_Jit_Resume_${new Date().getFullYear()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className={`w-full max-w-4xl my-8 rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#0a0f1d] border-slate-800 text-slate-100'
        }`}
      >
        {/* Modal Top Control Bar */}
        <div className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 shrink-0 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0d1424] border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Outfit']">Yash Jit - Verified Developer Resume</h3>
              <p className="text-xs text-slate-400">B.Tech CS & AI · Software Engineering Candidate</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              onMouseEnter={() => soundEffects.playHover()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-95 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadText}
              onMouseEnter={() => soundEffects.playHover()}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isLight 
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' 
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title="Download Plain Text Format"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download .TXT</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
              title="Close Resume"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resume Document Preview Container (Print-optimized) */}
        <div 
          ref={resumeRef}
          className="p-6 sm:p-10 overflow-y-auto space-y-6 text-left font-['Plus_Jakarta_Sans',sans-serif] select-text"
        >
          {/* Header */}
          <div className="border-b pb-6 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit'] text-cyan-400">
              Yash Jit
            </h1>
            <div className="text-sm font-semibold text-indigo-400">
              Aspiring Software Engineer · 1st Year B.Tech Computer Science & Artificial Intelligence
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
              <span>Email: <a href={`mailto:${data.personal.email}`} className="text-cyan-300 underline">{data.personal.email}</a></span>
              <span>•</span>
              <span>Location: {data.personal.location}</span>
              <span>•</span>
              <span>GitHub: <a href={data.socials.github} target="_blank" rel="noreferrer" className="text-cyan-300 underline">yashjit52n</a></span>
              <span>•</span>
              <span>LinkedIn: <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="text-cyan-300 underline">Yash Jit</a></span>
              <span>•</span>
              <span>Codeforces: <a href={data.socials.codeforces} target="_blank" rel="noreferrer" className="text-cyan-300 underline">Yash2207 ({data.competitiveProgramming.rating})</a></span>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Professional Summary
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              {data.resumeData.summary}
            </p>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Education
            </h2>
            {data.resumeData.education.map((edu, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex flex-wrap items-center justify-between font-semibold text-xs sm:text-sm text-white">
                  <span>{edu.institution}</span>
                  <span className="text-slate-400 font-normal">{edu.duration}</span>
                </div>
                <div className="text-xs text-cyan-300 font-medium">
                  {edu.degree} · <span className="text-slate-400">{edu.location}</span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5 pt-1">
                  {edu.highlights.map((h, hIdx) => (
                    <li key={hIdx}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Technical Skills */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {data.resumeData.skills.map((grp, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="font-semibold text-cyan-300 mb-1">{grp.category}</div>
                  <div className="text-slate-300">{grp.items.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitive Programming */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Competitive Programming
            </h2>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex flex-wrap items-center justify-between font-semibold text-white">
                <span>Codeforces (Handle: Yash2207)</span>
                <span className="text-cyan-400 font-mono">Current Rating: {data.competitiveProgramming.rating} ({data.competitiveProgramming.rankName})</span>
              </div>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                {data.resumeData.competitiveProgramming.highlights.map((h, idx) => (
                  <li key={idx}>{h}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Featured Projects */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Featured Software Engineering Projects
            </h2>
            <div className="space-y-3 text-xs">
              {data.resumeData.featuredProjects.map((p, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between font-semibold text-sm text-white">
                    <span>{p.name}</span>
                    <span className="text-xs font-mono text-indigo-400">{p.tech}</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {p.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications & Badges */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Honors & Certifications
            </h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {data.resumeData.certifications.map((c, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
