/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Technical Skills Section for Yash Jit's Portfolio.
 * Provides interactive technology skill cards with:
 * - Real-time category filtering & instant keyword search
 * - Click-to-inspect card details with topic pills & practical usage
 * - Honest proficiency badges (Practicing, Working Knowledge, University Coursework)
 * - Micro-interaction hover lifts and theme synchronization
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Code2, FileCode, FileJson, Layout, Palette, 
  MonitorSmartphone, Trophy, Cpu, Network, CheckCircle2, 
  Sparkles, Layers, Search, X, ExternalLink, BookOpen 
} from 'lucide-react';
import { PortfolioData, SkillItem } from '../data/portfolioData';
import { soundEffects } from '../utils/soundEffects';

interface SkillsProps {
  data: PortfolioData;
  theme?: 'deep-space' | 'cyberpunk-light';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

export const Skills: React.FC<SkillsProps> = ({ data, theme = 'deep-space' }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'languages' | 'web' | 'competitive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedSkill, setInspectedSkill] = useState<SkillItem | null>(null);

  const isLight = theme === 'cyberpunk-light';

  const filteredSkills = data.skills.filter((skill) => {
    const matchesCategory = activeTab === 'all' || skill.category === activeTab;
    const matchesSearch = searchQuery.trim() === '' || 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (skill.topics && skill.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 'Code2': return <Code2 className="w-5 h-5 text-indigo-400" />;
      case 'FileCode': return <FileCode className="w-5 h-5 text-amber-400" />;
      case 'FileJson': return <FileJson className="w-5 h-5 text-yellow-400" />;
      case 'Layout': return <Layout className="w-5 h-5 text-orange-400" />;
      case 'Palette': return <Palette className="w-5 h-5 text-pink-400" />;
      case 'MonitorSmartphone': return <MonitorSmartphone className="w-5 h-5 text-blue-400" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-amber-300" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'Network': return <Network className="w-5 h-5 text-purple-400" />;
      default: return <Code2 className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getStatusBadge = (status: SkillItem['status']) => {
    switch (status) {
      case 'Practicing':
        return (
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
            isLight
              ? 'bg-cyan-50 text-cyan-800 border-cyan-300'
              : 'bg-cyan-950/60 text-cyan-300 border-cyan-700/50'
          }`}>
            Active Practice
          </span>
        );
      case 'Working knowledge':
        return (
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
            isLight
              ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
              : 'bg-indigo-950/60 text-indigo-300 border-indigo-700/50'
          }`}>
            Working Knowledge
          </span>
        );
      case 'Learning':
        return (
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
            isLight
              ? 'bg-purple-50 text-purple-800 border-purple-300'
              : 'bg-purple-950/60 text-purple-300 border-purple-700/50'
          }`}>
            Core Curriculum
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Subtle ambient light */}
      <div className={`absolute top-1/3 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isLight ? 'bg-cyan-500/10' : 'bg-cyan-500/5'
      }`} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-2 text-left">
            <div className="text-xs font-semibold tracking-wider uppercase text-cyan-400 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Technical Architecture</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight font-['Outfit'] ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Interactive Technical Skills
            </h2>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Honest, transparent competence indicators based on university coursework and active competitive programming on Codeforces. Click any card to inspect technical topics.
            </p>
          </div>

          {/* Interactive Controls: Search Bar & Category Filter Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start md:self-auto">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills..."
                className={`pl-8 pr-3 py-1.5 rounded-xl text-xs font-mono border outline-hidden transition-all ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500'
                    : 'bg-slate-900/90 border-slate-800 text-slate-200 focus:border-cyan-400'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className={`p-1 rounded-xl border flex items-center gap-1 shrink-0 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/90 border-slate-800'
            }`}>
              {[
                { id: 'all', label: 'All' },
                { id: 'languages', label: 'Languages' },
                { id: 'web', label: 'Web Tech' },
                { id: 'competitive', label: 'DSA & CP' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveTab(tab.id as any);
                  }}
                  onMouseEnter={() => soundEffects.playHover()}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? isLight
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md'
                      : isLight
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Cards Grid with Staggered Entrance */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
        >
          <AnimatePresence>
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.name}
                variants={cardVariants}
                layout
                onClick={() => {
                  soundEffects.playClick();
                  setInspectedSkill(skill);
                }}
                onMouseEnter={() => soundEffects.playHover()}
                className={`p-6 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between hover:scale-[1.02] ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm hover:shadow-md'
                    : 'glass-panel border-slate-800 hover:border-slate-700 shadow-xl'
                }`}
              >
                <div>
                  {/* Top Bar with Icon & Status Badge */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 group-hover:border-cyan-300'
                        : 'bg-slate-900/90 border-slate-800 group-hover:border-cyan-500/40'
                    }`}>
                      {getIcon(skill.iconName)}
                    </div>
                    {getStatusBadge(skill.status)}
                  </div>

                  {/* Skill Name */}
                  <h3 className={`text-lg font-bold font-['Outfit'] mb-2 group-hover:text-cyan-400 transition-colors ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {skill.name}
                  </h3>

                  {/* Description */}
                  <p className={`text-xs leading-relaxed mb-4 line-clamp-3 ${
                    isLight ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {skill.description}
                  </p>
                </div>

                {/* Subtopic Pills */}
                <div>
                  {skill.topics && skill.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                      {skill.topics.slice(0, 3).map((topic, i) => (
                        <span
                          key={i}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            isLight
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-slate-900/90 text-slate-300'
                          }`}
                        >
                          {topic}
                        </span>
                      ))}
                      {skill.topics.length > 3 && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded text-cyan-400`}>
                          +{skill.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className={`mt-3 flex items-center justify-between text-[11px] font-semibold ${
                    isLight ? 'text-cyan-700' : 'text-cyan-400'
                  }`}>
                    <span>Click to inspect details</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredSkills.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-sm">
            No technical skills found matching "{searchQuery}".
          </div>
        )}

      </div>

      {/* Interactive Skill Detail Lightbox Modal */}
      {inspectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl relative text-left ${
            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#0a0f1d] border-slate-800 text-white'
          }`}>
            <button
              onClick={() => setInspectedSkill(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                {getIcon(inspectedSkill.iconName)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-['Outfit']">{inspectedSkill.name}</h3>
                  {getStatusBadge(inspectedSkill.status)}
                </div>
                <div className="text-xs text-cyan-400 font-mono mt-0.5 uppercase">
                  Category: {inspectedSkill.category}
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-slate-300">
              <p>{inspectedSkill.description}</p>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Key Technical Competencies & Topics
                </div>
                <div className="flex flex-wrap gap-2">
                  {inspectedSkill.topics?.map((topic, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-3 py-1 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-300"
                    >
                      ✓ {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`pt-4 border-t text-xs ${
                isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
              }`}>
                Utilized in coursework and competitive rounds at Newton School of Technology and Codeforces.
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
