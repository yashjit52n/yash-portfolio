/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Projects Showcase Section for Yash Jit's Portfolio.
 * Displays interactive project cards with 3D tilt micro-interactions,
 * clear placeholder disclaimers, GitHub repository links, and custom addition modal.
 */

import React, { useState } from 'react';
import { Github, ExternalLink, Sparkles, Plus, Eye, Code, ArrowUpRight } from 'lucide-react';
import { PortfolioData, ProjectItem } from '../data/portfolioData';
import { ProjectModal } from './ProjectModal';
import algoVisualizerImg from '../assets/images/project_algorithm_visualizer_1793291350878.jpg';
import { soundEffects } from '../utils/soundEffects';

interface ProjectsProps {
  data: PortfolioData;
  theme?: 'deep-space' | 'cyberpunk-light';
}

export const Projects: React.FC<ProjectsProps> = ({ data, theme = 'deep-space' }) => {
  const isLight = theme === 'cyberpunk-light';
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(data.projects);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTechs, setNewTechs] = useState('');
  const [newGithub, setNewGithub] = useState('');
  const [newLive, setNewLive] = useState('');

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newProject: ProjectItem = {
      id: `custom-proj-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Software Engineering Project',
      description: newDesc.trim(),
      technologies: newTechs.split(',').map(t => t.trim()).filter(Boolean),
      image: algoVisualizerImg,
      githubUrl: newGithub.trim() || data.socials.github,
      liveUrl: newLive.trim() || undefined,
      isPlaceholder: false,
      highlights: ['Custom user-added project', 'Ready to deploy']
    };

    setProjectsList([newProject, ...projectsList]);
    setNewTitle('');
    setNewSubtitle('');
    setNewDesc('');
    setNewTechs('');
    setNewGithub('');
    setNewLive('');
    setIsAddOpen(false);
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className={`absolute top-1/2 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isLight ? 'bg-indigo-400/10' : 'bg-indigo-600/10'
      }`} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-semibold tracking-wider uppercase text-cyan-400">
              Featured Engineering
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight font-['Outfit'] ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Projects & Case Studies
            </h2>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Explore structured software engineering case studies. Each project details problem formulation, architectural solutions, technology stack, and verified metrics.
            </p>
          </div>

          <button
            onClick={() => {
              soundEffects.playClick();
              setIsAddOpen(!isAddOpen);
            }}
            onMouseEnter={() => soundEffects.playHover()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 hover:text-white transition-all shrink-0 self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>{isAddOpen ? 'Cancel' : 'Add New Project'}</span>
          </button>
        </div>

        {/* Add Project Form (Modal Drawer) */}
        {isAddOpen && (
          <form onSubmit={handleAddProject} className="mb-12 p-6 rounded-2xl glass-panel border border-cyan-500/30 text-left space-y-4">
            <div className="text-sm font-bold text-white flex items-center gap-2 font-['Outfit']">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Add Your Own Project to the Showcase</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project Title (e.g. Codeforces Upsolving Tool)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                required
              />
              <input
                type="text"
                placeholder="Short Subtitle / Category"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                className="px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Technologies (comma-separated: C++, Python, React)"
                value={newTechs}
                onChange={(e) => setNewTechs(e.target.value)}
                className="px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="url"
                placeholder="GitHub Repository URL"
                value={newGithub}
                onChange={(e) => setNewGithub(e.target.value)}
                className="px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <textarea
              placeholder="Detailed description of what the project does, key technical architecture, and impact..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              required
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg hover:opacity-95"
              >
                Save Project
              </button>
            </div>
          </form>
        )}

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsList.map((project) => (
            <div
              key={project.id}
              onMouseEnter={() => soundEffects.playHover()}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="group rounded-2xl glass-panel glass-panel-hover border border-slate-800 flex flex-col justify-between overflow-hidden text-left transition-all duration-200 ease-out will-change-transform"
            >
              {/* Card Image Area with subtle zoom & badge */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border-b border-slate-800/80">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-60" />
                
                {/* Placeholder Warning Badge */}
                {project.isPlaceholder && (
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                    In Development
                  </div>
                )}

                {/* Inspect Button overlay */}
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedProject(project);
                  }}
                  onMouseEnter={() => soundEffects.playHover()}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-900/90 text-cyan-300 border border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-500 hover:text-slate-950 cursor-pointer"
                  title="View project details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs font-medium text-cyan-400 mb-1">
                    {project.subtitle}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-['Outfit']">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech Tags */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-950/80 text-slate-400 border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedProject(project);
                      }}
                      onMouseEnter={() => soundEffects.playHover()}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer py-1"
                    >
                      <span>Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => soundEffects.playHover()}
                        onClick={() => soundEffects.playClick()}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="View GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      {project.liveUrl && project.liveUrl !== '#' && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onMouseEnter={() => soundEffects.playHover()}
                          onClick={() => soundEffects.playClick()}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                          title="Open Live Preview"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        theme={theme}
      />
    </section>
  );
};
