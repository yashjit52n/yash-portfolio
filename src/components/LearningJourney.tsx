/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Experience and Learning Journey Section: "Currently Exploring"
 * Modern interactive roadmap displaying Yash Jit's continuous development in
 * DSA, Competitive Programming, Full-Stack Web Development, and AI/ML.
 */

import React, { useState } from 'react';
import { Compass, CheckCircle2, CircleDashed, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { PortfolioData, RoadmapItem } from '../data/portfolioData';
import { soundEffects } from '../utils/soundEffects';

interface LearningJourneyProps {
  data: PortfolioData;
}

export const LearningJourney: React.FC<LearningJourneyProps> = ({ data }) => {
  const [activeRoadmapId, setActiveRoadmapId] = useState<string>(data.roadmap[0].id);

  const getStatusColor = (status: RoadmapItem['status']) => {
    switch (status) {
      case 'Active Focus':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
      case 'In Progress':
        return 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60';
      case 'Hands-On':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      case 'Upcoming':
        return 'text-slate-400 bg-slate-900 border-slate-800';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <section id="journey" className="py-24 relative overflow-hidden bg-[#05070f]/80 backdrop-blur-[2px]">
      {/* Background ambient lighting */}
      <div className="absolute bottom-10 right-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 space-y-3 text-left">
          <div className="text-xs font-semibold tracking-wider uppercase text-cyan-400">
            Forward Trajectory
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-['Outfit']">
            Currently Exploring
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            A transparent view into my active learning pipeline, technical milestones, and theoretical exploration as a Computer Science & Artificial Intelligence student.
          </p>
        </div>

        {/* Interactive Roadmap Layout: Stepper on Left, Deep Dive on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Stepper Navigation List (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-3">
            {data.roadmap.map((item, index) => {
              const isSelected = activeRoadmapId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveRoadmapId(item.id);
                  }}
                  onMouseEnter={() => soundEffects.playHover()}
                  className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-500/50 shadow-xl shadow-cyan-500/5'
                      : 'glass-panel border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold ${
                      isSelected 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                        : 'bg-slate-950 text-slate-500 border border-slate-800'
                    }`}>
                      0{index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-['Outfit']">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        <span className={`inline-block px-1.5 py-0.2 rounded border text-[10px] ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Detailed Milestone Panel (lg:col-span-7) */}
          <div className="lg:col-span-7">
            {data.roadmap
              .filter(item => item.id === activeRoadmapId)
              .map(item => (
                <div 
                  key={item.id}
                  className="rounded-3xl glass-panel p-8 sm:p-10 border border-slate-800 text-left shadow-2xl relative overflow-hidden animate-fadeIn"
                >
                  {/* Subtle corner badge */}
                  <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-cyan-400" />
                      <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Roadmap Track</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white font-['Outfit'] mb-4">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-8">
                    {item.description}
                  </p>

                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Actionable Learning Objectives</span>
                    </div>
                    <div className="space-y-3">
                      {item.goals.map((goal, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
                        >
                          <CircleDashed className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-200 leading-normal">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Curriculum & Self-Directed Exploration</span>
                    <span className="text-slate-300 font-medium">B.Tech CS & AI</span>
                  </div>
                </div>
              ))}
          </div>

        </div>

      </div>
    </section>
  );
};
