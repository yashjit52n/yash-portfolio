/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GitHub Projects & Public Activity Showcase for Yash Jit (yashjit52n).
 * Fetches and displays public repositories, primary languages, stars,
 * forks, and profile telemetry via GitHub's public API with verified graceful fallbacks.
 */

import React, { useState, useEffect } from 'react';
import { Github, Star, GitFork, ExternalLink, RefreshCw, Radio, Code2, Sparkles, BookOpen } from 'lucide-react';
import { fetchGitHubData, GitHubDataResult } from '../utils/githubApi';
import { soundEffects } from '../utils/soundEffects';

interface GithubShowcaseProps {
  theme?: 'deep-space' | 'cyberpunk-light';
}

const LANGUAGE_COLORS: Record<string, string> = {
  Python: 'bg-blue-500',
  'C++': 'bg-pink-500',
  Java: 'bg-amber-600',
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-600',
  HTML: 'bg-orange-500',
  CSS: 'bg-indigo-500',
};

export const GithubShowcase: React.FC<GithubShowcaseProps> = ({ theme = 'deep-space' }) => {
  const [data, setData] = useState<GitHubDataResult | null>(null);
  const [loading, setLoading] = useState(true);
  const isLight = theme === 'cyberpunk-light';

  const loadData = async () => {
    setLoading(true);
    const res = await fetchGitHubData('yashjit52n');
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <section id="github" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cyan-400">
              <Github className="w-3.5 h-3.5" />
              <span>Open Source & Public Repositories</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight font-['Outfit'] ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              GitHub Activity & Repositories
            </h2>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Direct telemetry from GitHub's public API displaying active code repositories, implementation algorithms, and version-controlled projects.
            </p>
          </div>

          {/* Sync status & Refresh button */}
          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              data?.isLive 
                ? isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                : isLight ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
            }`}>
              <Radio className="w-3 h-3 animate-pulse" />
              <span>{data?.isLive ? 'Live GitHub Sync' : 'Verified Cached Data'}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                loadData();
              }}
              disabled={loading}
              className={`p-2 rounded-xl border transition-all ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-xs' 
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title="Refresh GitHub Repositories"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Profile Card Banner */}
        {data && (
          <div className={`p-6 rounded-2xl border mb-10 transition-all ${
            isLight
              ? 'bg-white border-slate-200 shadow-sm shadow-slate-200/50'
              : 'glass-panel border-slate-800 shadow-xl'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={data.profile.avatar_url}
                  alt={data.profile.name}
                  className="w-16 h-16 rounded-2xl border-2 border-cyan-500/30 object-cover shadow-md"
                  onError={(e) => {
                    // Fallback to initial monogram avatar if network image is blocked
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xl font-bold font-['Outfit'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {data.profile.name || 'Yash Jit'}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                      @{data.profile.login}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 max-w-xl ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {data.profile.bio || '1st Year B.Tech Computer Science & AI student at Newton School of Technology.'}
                  </p>
                </div>
              </div>

              {/* Metric Highlights & Profile CTA */}
              <div className="flex flex-wrap items-center gap-4">
                <div className={`px-4 py-2 rounded-xl border text-center ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className={`text-lg font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {data.profile.public_repos}
                  </div>
                  <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Repositories</div>
                </div>

                <div className={`px-4 py-2 rounded-xl border text-center ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className={`text-lg font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {data.profile.followers}
                  </div>
                  <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Followers</div>
                </div>

                <a
                  href={data.profile.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => soundEffects.playHover()}
                  onClick={() => soundEffects.playClick()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-95 shadow-md shadow-indigo-600/20 transition-all"
                >
                  <Github className="w-4 h-4" />
                  <span>View GitHub Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Repository Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.repos.map((repo) => {
            const langColor = repo.language ? (LANGUAGE_COLORS[repo.language] || 'bg-cyan-500') : 'bg-slate-500';
            const formattedDate = new Date(repo.updated_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={repo.id}
                className={`flex flex-col justify-between p-6 rounded-2xl border transition-all hover:scale-[1.01] ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm hover:shadow-md'
                    : 'glass-panel border-slate-800 hover:border-slate-700 shadow-lg'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen className={`w-4 h-4 shrink-0 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-base font-bold font-['Outfit'] hover:underline truncate ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                        title={repo.name}
                      >
                        {repo.name}
                      </a>
                    </div>
                    <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded border ${
                      isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      Public
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed line-clamp-3 mb-4 ${
                    isLight ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {repo.description || 'Software repository created by Yash Jit focusing on algorithmic implementations and web prototypes.'}
                  </p>

                  {/* Topic Tags */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                            isLight
                              ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                              : 'bg-cyan-950/40 text-cyan-300 border border-cyan-800/40'
                          }`}
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Metrics */}
                <div className={`pt-4 border-t flex items-center justify-between text-xs ${
                  isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800/80 text-slate-400'
                }`}>
                  <div className="flex items-center gap-4">
                    {repo.language && (
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className={`w-2.5 h-2.5 rounded-full ${langColor}`} />
                        <span>{repo.language}</span>
                      </span>
                    )}

                    <span className="flex items-center gap-1" title="Stars">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>{repo.stargazers_count}</span>
                    </span>

                    <span className="flex items-center gap-1" title="Forks">
                      <GitFork className="w-3.5 h-3.5" />
                      <span>{repo.forks_count}</span>
                    </span>
                  </div>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => soundEffects.playHover()}
                    onClick={() => soundEffects.playClick()}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                    title="Open on GitHub"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
