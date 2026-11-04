/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Fullscreen Project Case Study Modal for Yash Jit's Portfolio.
 * Implements complete case study specifications:
 * - Project Overview
 * - Problem Statement
 * - Solution Architecture
 * - Technologies Used
 * - Key Features List
 * - Screenshots & Direct Repository / Live Demo Links
 */

import React, { useEffect } from 'react';
import { X, Github, ExternalLink, Sparkles, CheckCircle, Lightbulb, Target, Layers, Cpu } from 'lucide-react';
import { ProjectItem } from '../data/portfolioData';
import { soundEffects } from '../utils/soundEffects';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  theme?: 'deep-space' | 'cyberpunk-light';
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ 
  project, 
  onClose,
  theme = 'deep-space' 
}) => {
  const isLight = theme === 'cyberpunk-light';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className={`relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl text-left border ${
          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#0a0f1e] border-slate-700/80 text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className={`absolute top-5 right-5 p-2 rounded-xl transition-colors z-20 cursor-pointer ${
            isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700'
          }`}
          aria-label="Close case study dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Project Image Preview */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-6 bg-slate-950 border border-slate-800 shadow-md">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          
          {/* Status Badge */}
          {project.isPlaceholder && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
              Active Engineering Prototype
            </div>
          )}
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1 mb-4">
          <h3 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {project.title}
          </h3>
          <p className="text-sm font-semibold text-cyan-400">
            {project.subtitle}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech, i) => (
            <span
              key={i}
              className={`text-xs px-2.5 py-1 rounded-md font-mono border ${
                isLight 
                  ? 'bg-slate-100 border-slate-200 text-slate-800' 
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Structured Case Study Sections */}
        <div className="space-y-6 text-sm leading-relaxed mb-8">
          
          {/* 1. Project Overview */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Overview</span>
            </h4>
            <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>
              {project.caseStudy?.overview || project.description}
            </p>
          </div>

          {/* 2. Problem Statement */}
          {project.caseStudy?.problemStatement && (
            <div className={`p-4 rounded-2xl border space-y-1.5 ${
              isLight ? 'bg-rose-50/60 border-rose-200' : 'bg-rose-950/20 border-rose-500/30'
            }`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 font-mono">
                <Target className="w-3.5 h-3.5" />
                <span>The Problem Statement</span>
              </h4>
              <p className={isLight ? 'text-slate-800 text-xs sm:text-sm' : 'text-slate-300 text-xs sm:text-sm'}>
                {project.caseStudy.problemStatement}
              </p>
            </div>
          )}

          {/* 3. Solution & Architecture */}
          {project.caseStudy?.solution && (
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isLight ? 'bg-indigo-50/60 border-indigo-200' : 'bg-indigo-950/20 border-indigo-500/30'
            }`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 font-mono">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Engineered Solution</span>
              </h4>
              <p className={isLight ? 'text-slate-800 text-xs sm:text-sm' : 'text-slate-300 text-xs sm:text-sm'}>
                {project.caseStudy.solution}
              </p>
              {project.caseStudy.architecture && (
                <div className={`text-xs pt-1 font-mono ${isLight ? 'text-indigo-900' : 'text-indigo-300'}`}>
                  Architecture: {project.caseStudy.architecture}
                </div>
              )}
            </div>
          )}

          {/* 4. Key Features & Highlights */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
              <Layers className="w-3.5 h-3.5" />
              <span>Key Features & Functional Highlights</span>
            </h4>
            <ul className="space-y-2">
              {(project.caseStudy?.features || project.highlights).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Telemetry Metric Callout */}
          {project.caseStudy?.metrics && (
            <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-mono ${
              isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-900' : 'bg-cyan-950/30 border-cyan-800/40 text-cyan-300'
            }`}>
              <Cpu className="w-4 h-4 shrink-0" />
              <span>Benchmark: {project.caseStudy.metrics}</span>
            </div>
          )}
        </div>

        {/* Action Links */}
        <div className={`flex flex-wrap items-center gap-4 pt-4 border-t ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundEffects.playHover()}
            onClick={() => soundEffects.playClick()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
          >
            <Github className="w-4 h-4" />
            <span>View GitHub Repository</span>
          </a>

          {project.liveUrl && project.liveUrl !== '#' && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundEffects.playHover()}
              onClick={() => soundEffects.playClick()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Demonstration</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
