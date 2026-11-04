/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * College Life & 4-Year Academic Checkpoints Section.
 * Comprehensive year-by-year curriculum journey for Newton School of Technology (Rishihood University).
 * Highlights Year 1 (Build), Year 2 (Achieve), Year 3 (Scale), and Year 4 (Launch).
 */

import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Layers, Rocket, Target, 
  ExternalLink, CheckCircle2, ChevronRight, Sparkles, Building2,
  Code2, Database, Cloud, Briefcase 
} from 'lucide-react';
import { PortfolioData, CollegeYearCheckpoint } from '../data/portfolioData';
import { soundEffects } from '../utils/soundEffects';

interface CollegeLifeProps {
  data: PortfolioData;
  theme?: 'deep-space' | 'cyberpunk-light';
}

export const CollegeLife: React.FC<CollegeLifeProps> = ({ data, theme = 'deep-space' }) => {
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const activeCheckpoint = data.collegeCurriculum.find(c => c.year === selectedYear) || data.collegeCurriculum[0];
  const isLight = theme === 'cyberpunk-light';

  const getYearIcon = (year: number) => {
    switch (year) {
      case 1: return <Code2 className="w-5 h-5 text-cyan-400" />;
      case 2: return <Database className="w-5 h-5 text-indigo-400" />;
      case 3: return <Cloud className="w-5 h-5 text-blue-400" />;
      case 4: return <Briefcase className="w-5 h-5 text-emerald-400" />;
      default: return <GraduationCap className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="college-life" className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className={`absolute top-1/3 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isLight ? 'bg-indigo-400/10' : 'bg-indigo-600/10'
      }`} />
      <div className={`absolute bottom-1/4 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isLight ? 'bg-cyan-400/10' : 'bg-cyan-500/10'
      }`} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left">
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-semibold tracking-wider uppercase text-cyan-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Campus & Academic Roadmap</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-['Outfit'] ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              College Life & 4-Year Checkpoints
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              I am a <strong className="text-cyan-400 font-semibold">1st Year B.Tech student in Computer Science and Artificial Intelligence</strong> at{' '}
              <strong className={isLight ? 'text-slate-900' : 'text-white'}>Newton School of Technology (Rishihood University)</strong>. 
              Our curriculum is industry-first, coding-from-day-one, structured across four progressive checkpoints.
            </p>
          </div>

          {/* College Official Link Badge */}
          <a
            href={data.personal.collegeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all shrink-0 self-start md:self-auto ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800 hover:border-cyan-400 shadow-xs'
                : 'glass-panel border-slate-700/80 text-slate-200 hover:border-cyan-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Visit Newton School of Technology</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        {/* 4-Year Checkpoint Navigation Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {data.collegeCurriculum.map((checkpoint) => {
            const isSelected = selectedYear === checkpoint.year;
            const isCurrent = checkpoint.year === 1;

            return (
              <button
                key={checkpoint.year}
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedYear(checkpoint.year);
                }}
                onMouseEnter={() => soundEffects.playHover()}
                className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? isLight
                      ? 'bg-white border-cyan-500 shadow-md shadow-cyan-500/15'
                      : 'bg-slate-900/95 border-cyan-500/60 shadow-xl shadow-cyan-500/10'
                    : isLight
                      ? 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                      : 'glass-panel border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {/* Current Active Student Ribbon */}
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-indigo-600 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wider">
                    Current Year
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors border ${
                    isSelected 
                      ? isLight ? 'bg-cyan-50 border-cyan-300' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                      : isLight ? 'bg-white border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}>
                    {getYearIcon(checkpoint.year)}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                      Year {checkpoint.year}
                    </span>
                    <span className={`text-sm font-bold font-['Outfit'] block ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      Phase: {checkpoint.phase}
                    </span>
                  </div>
                </div>

                <div className={`text-xs font-medium line-clamp-1 ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {checkpoint.theme}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Year Detailed Checkpoint Board */}
        <div className={`rounded-3xl p-8 sm:p-10 border shadow-2xl relative overflow-hidden text-left ${
          isLight ? 'bg-white border-slate-200' : 'glass-panel border-slate-800'
        }`}>
          
          {/* Top Banner */}
          <div className={`flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b ${
            isLight ? 'border-slate-200' : 'border-slate-800/80'
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-mono px-2.5 py-0.5 rounded-md font-semibold ${
                  isLight ? 'bg-cyan-50 border border-cyan-200 text-cyan-800' : 'bg-cyan-950/70 border border-cyan-800/60 text-cyan-300'
                }`}>
                  Checkpoint {activeCheckpoint.year} of 4
                </span>
                {activeCheckpoint.year === 1 && (
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                    isLight ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-emerald-950/70 border border-emerald-800/60 text-emerald-300'
                  }`}>
                    Active Student In Residence
                  </span>
                )}
              </div>
              <h3 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] mt-1 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Year {activeCheckpoint.year}: {activeCheckpoint.phase} — {activeCheckpoint.theme}
              </h3>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Institutional Partner</div>
              <div className={`text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                Rishihood University Campus
              </div>
            </div>
          </div>

          {/* Focus Narrative */}
          <div className={`mb-8 p-5 rounded-2xl border space-y-2 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
          }`}>
            <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>Curriculum Focus & Philosophy</span>
            </div>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {activeCheckpoint.focus}
            </p>
          </div>

          {/* Split Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Core Subjects (lg:col-span-6) */}
            <div className="lg:col-span-6 space-y-4">
              <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Core Academic Modules Covered</span>
              </div>

              <div className="space-y-2.5">
                {activeCheckpoint.coreSubjects.map((subject, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                      isLight ? 'bg-white border-slate-200' : 'bg-slate-950/70 border-slate-800/80'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className={`text-xs font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      {subject}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Milestones & Industry Deliverables (lg:col-span-6) */}
            <div className="lg:col-span-6 space-y-4">
              <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Milestones, Sprints & Hands-On Projects</span>
              </div>

              <div className="space-y-2.5">
                {activeCheckpoint.milestonesAndProjects.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                      isLight ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-900/60 border-indigo-500/20'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                      0{idx + 1}
                    </div>
                    <span className={`text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Industry Takeaway Card */}
              <div className={`mt-6 p-4 rounded-xl border ${
                isLight ? 'bg-cyan-50/60 border-cyan-200' : 'bg-gradient-to-r from-indigo-950/40 to-cyan-950/30 border-cyan-500/20'
              }`}>
                <div className={`text-[11px] uppercase tracking-wider font-semibold mb-1 ${
                  isLight ? 'text-cyan-800' : 'text-cyan-300'
                }`}>
                  Industry Readiness Takeaway
                </div>
                <p className={`text-xs italic leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  "{activeCheckpoint.industryTakeaway}"
                </p>
              </div>
            </div>

          </div>

          {/* Student Profile Snapshot Footer */}
          <div className={`mt-8 pt-6 border-t flex flex-wrap items-center justify-between gap-4 text-xs ${
            isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-400'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${isLight ? 'text-slate-800' : 'text-white'}`}>
                B.Tech in Computer Science & Artificial Intelligence
              </span>
              <span>·</span>
              <span>Class of 2030</span>
            </div>
            <div className="text-cyan-400 font-mono text-[11px]">
              NST @ Rishihood University Campus
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
