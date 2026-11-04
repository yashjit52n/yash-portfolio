/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * About Section for Yash Jit's Portfolio.
 * Upgraded with a professional software engineering introduction,
 * interactive view tabs (Engineering Narrative, Academic Foundations, Core Values),
 * verified educational credentials, and customizable journey checkpoints.
 */

import React, { useState } from 'react';
import { 
  GraduationCap, Trophy, Code2, Sparkles, BookOpen, Clock, 
  Target, Plus, Edit2, Award, Compass, CheckCircle2, Terminal, ArrowUpRight 
} from 'lucide-react';
import { PortfolioData } from '../data/portfolioData';
import developerAvatarImg from '../assets/images/about_developer_avatar_1793291350495.jpg';
import { soundEffects } from '../utils/soundEffects';

interface AboutProps {
  data: PortfolioData;
  theme?: 'deep-space' | 'cyberpunk-light';
}

export const About: React.FC<AboutProps> = ({ data, theme = 'deep-space' }) => {
  const [activeTab, setActiveTab] = useState<'narrative' | 'education' | 'values'>('narrative');
  const isLight = theme === 'cyberpunk-light';

  // Customizable journey timeline items
  const [journeySteps, setJourneySteps] = useState([
    {
      year: "2026 – Present",
      title: "1st Year B.Tech in CS & Artificial Intelligence",
      institution: "Newton School of Technology (Rishihood University)",
      description: "Immersed in an intensive, industry-first computer science curriculum focusing on algorithmic foundations, discrete mathematics, system design, and AI modeling."
    },
    {
      year: "Active Arena",
      title: "Competitive Programming & Problem Solving",
      institution: "Codeforces (Handle: Yash2207)",
      description: "Consistent algorithmic training achieving 999 rating and 100+ verified solved problems across Division 3 & 4 rounds, honing asymptotic efficiency and edge-case correctness."
    },
    {
      year: "Continuous",
      title: "Full-Stack Software Engineering",
      institution: "Web Development & Systems",
      description: "Developing modern, responsive digital products and educational developer utilities in C++, Python, JavaScript, HTML5, and modern CSS architectures."
    }
  ]);

  const coreValues = [
    {
      title: "Algorithmic Precision",
      desc: "Belief that clean, asymptotically optimal algorithms lead to robust, scalable software.",
      icon: <Code2 className="w-5 h-5 text-cyan-400" />
    },
    {
      title: "First-Principles Thinking",
      desc: "Deconstructing complex distributed problems into intuitive, manageable mathematical and programmatic units.",
      icon: <Terminal className="w-5 h-5 text-indigo-400" />
    },
    {
      title: "Relentless Consistency",
      desc: "Daily problem-solving on Codeforces and iterative software shipping over passive theory.",
      icon: <Trophy className="w-5 h-5 text-amber-400" />
    },
    {
      title: "Human-Centric Engineering",
      desc: "Software is meaningless if users cannot navigate it effortlessly. Performance and accessibility are non-negotiable.",
      icon: <Compass className="w-5 h-5 text-emerald-400" />
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background radial accent */}
      <div className={`absolute top-1/2 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
        isLight ? 'bg-cyan-500/10' : 'bg-indigo-600/10'
      }`} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-14 space-y-3 text-left">
          <div className="text-xs font-semibold tracking-wider uppercase text-cyan-400 flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Professional Profile</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight font-['Outfit'] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Driven by curiosity, grounded in code.
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            I’m a 1st Year Computer Science & Artificial Intelligence undergraduate passionate about the discipline of engineering, algorithmic problem solving, and building high-utility software systems.
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: 3D Illustration & Identity Card (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className={`relative rounded-3xl p-5 overflow-hidden border shadow-xl flex-1 flex flex-col justify-between transition-all ${
              isLight 
                ? 'bg-white border-slate-200 shadow-slate-200/50' 
                : 'glass-panel border-slate-800 shadow-2xl'
            }`}>
              
              {/* Image Container with Fallback */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group">
                <img
                  src={developerAvatarImg}
                  alt="Yash Jit - Software Engineering Scholar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Software Engineering Candidate</span>
                  </div>
                  <div className="text-base font-bold text-white mt-0.5 font-['Outfit']">
                    Yash Jit · Class of 2030
                  </div>
                  <div className="text-xs text-slate-300">
                    Newton School of Technology (Rishihood University)
                  </div>
                </div>
              </div>

              {/* Verified Quick Stats Strip */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-left">
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/60 border-slate-800 text-slate-200'
                }`}>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Specialization</div>
                  <div className="text-xs font-bold text-cyan-400 mt-0.5">B.Tech CS & AI</div>
                </div>
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/60 border-slate-800 text-slate-200'
                }`}>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Codeforces</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">Rating: 999 (100+)</div>
                </div>
              </div>

              {/* Engineering Motto */}
              <div className={`mt-3 p-4 rounded-xl border text-left ${
                isLight ? 'bg-cyan-50/70 border-cyan-200 text-cyan-950' : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
              }`}>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Engineering Motto</span>
                </div>
                <p className="text-xs italic leading-relaxed">
                  "{data.personal.careerGoal}"
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Tabbed Narrative, Education & Values (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6 text-left flex flex-col justify-between">
            
            {/* View Selector Tabs */}
            <div className={`p-1.5 rounded-2xl border flex items-center gap-2 self-start ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/80 border-slate-800'
            }`}>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('narrative');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'narrative'
                    ? isLight
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Engineering Narrative
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('education');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'education'
                    ? isLight
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Academic Foundations
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('values');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'values'
                    ? isLight
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Core Values
              </button>
            </div>

            {/* TAB 1: Written Narrative */}
            {activeTab === 'narrative' && (
              <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 text-sm sm:text-base leading-relaxed animate-fadeIn ${
                isLight ? 'bg-white border-slate-200 text-slate-700' : 'glass-panel border-slate-800 text-slate-300'
              }`}>
                <p>
                  My transition into software engineering stems from a deep curiosity about computation: <strong className={isLight ? 'text-slate-900 font-bold' : 'text-white font-medium'}>how mathematical logic translates into high-performance software that solves real human challenges.</strong>
                </p>
                <p>
                  As an undergraduate at <strong className="text-cyan-400 font-semibold">Newton School of Technology (Rishihood University)</strong> pursuing a <strong className={isLight ? 'text-slate-900' : 'text-white'}>B.Tech in Computer Science and Artificial Intelligence</strong>, I spend my days writing algorithms in C++, automating workflows with Python, and engineering modern client architectures with JavaScript, HTML, and CSS.
                </p>
                <p>
                  Beyond university lectures, competitive programming on <strong className={isLight ? 'text-indigo-600 font-bold' : 'text-indigo-300 font-semibold'}>Codeforces (Rating: 999)</strong> is where I cultivate discipline under pressure. It has trained me to analyze time and space complexity upfront, rigorously test edge cases, and write correct code on the first attempt.
                </p>
                <div className={`pt-3 border-t flex flex-wrap items-center gap-4 text-xs ${
                  isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'
                }`}>
                  <span>Primary Languages: Python · C++ · Java · JavaScript</span>
                  <span>•</span>
                  <span>Goal: Professional Software Engineer</span>
                </div>
              </div>
            )}

            {/* TAB 2: Academic Foundations & Timeline */}
            {activeTab === 'education' && (
              <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 animate-fadeIn ${
                isLight ? 'bg-white border-slate-200' : 'glass-panel border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-bold font-['Outfit'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Educational Milestones
                    </h3>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Newton School of Technology (Rishihood University) curriculum checkpoints
                    </p>
                  </div>
                  <a
                    href={data.personal.collegeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                  >
                    <span>Visit College</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-4">
                  {journeySteps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50 mt-1" />
                        {idx < journeySteps.length - 1 && (
                          <div className={`w-0.5 h-14 my-1 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-sm font-bold font-['Outfit'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {step.title}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                            isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-cyan-300'
                          }`}>
                            {step.year}
                          </span>
                        </div>
                        <div className={`text-xs font-semibold ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>
                          {step.institution}
                        </div>
                        <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Core Values */}
            {activeTab === 'values' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                {coreValues.map((v, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-2xl border space-y-2 text-left transition-all ${
                      isLight 
                        ? 'bg-white border-slate-200 shadow-xs hover:border-cyan-400' 
                        : 'glass-panel border-slate-800 hover:border-slate-700 shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
                      }`}>
                        {v.icon}
                      </div>
                      <h4 className={`text-sm font-bold font-['Outfit'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {v.title}
                      </h4>
                    </div>
                    <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {v.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Info Cards: Location, Availability & Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className={`p-4 rounded-2xl border ${
                isLight ? 'bg-white border-slate-200 text-slate-800' : 'glass-panel border-slate-800 text-slate-200'
              }`}>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Location</div>
                <div className="text-sm font-bold font-['Outfit'] mt-1">{data.personal.location}</div>
                <div className="text-[11px] text-slate-500">Delhi NCR, India</div>
              </div>

              <div className={`p-4 rounded-2xl border ${
                isLight ? 'bg-white border-slate-200 text-slate-800' : 'glass-panel border-slate-800 text-slate-200'
              }`}>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Availability</div>
                <div className="text-sm font-bold font-['Outfit'] text-emerald-500 mt-1">Open for Internships</div>
                <div className="text-[11px] text-slate-500">Learning & Hackathons</div>
              </div>

              <div className={`p-4 rounded-2xl border ${
                isLight ? 'bg-white border-slate-200 text-slate-800' : 'glass-panel border-slate-800 text-slate-200'
              }`}>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Codebase Languages</div>
                <div className="text-sm font-bold font-['Outfit'] mt-1">Python · C++ · Java</div>
                <div className="text-[11px] text-slate-500">+ JS, HTML5, CSS3</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
