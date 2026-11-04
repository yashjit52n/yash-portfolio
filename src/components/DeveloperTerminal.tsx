/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Simulated Developer Terminal for Yash Jit's Portfolio.
 * Provides safe, client-side predefined command execution:
 * [help, neofetch, about, skills, projects, codeforces, github, linkedin, education, achievements,
 *  ls, cat, goto, open, calc, ping, matrix, history, sound, contact, resume, theme, clear, whoami, date]
 * Includes command history (Up/Down arrow navigation), live autocomplete chips,
 * click-to-run quick command pills, virtual filesystem exploration, and rich syntax-highlighted outputs.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, Sparkles, Copy, Check, Maximize2, Minimize2, Trash2, Play, FolderOpen, Cpu } from 'lucide-react';
import { PortfolioData } from '../data/portfolioData';
import { soundEffects } from '../utils/soundEffects';

interface DeveloperTerminalProps {
  data: PortfolioData;
  theme?: 'deep-space' | 'cyberpunk-light';
  onOpenResume?: () => void;
  onToggleTheme?: () => void;
}

interface CommandOutput {
  id: string;
  command: string;
  timestamp: string;
  content: React.ReactNode;
}

export const DeveloperTerminal: React.FC<DeveloperTerminalProps> = ({
  data,
  theme = 'deep-space',
  onOpenResume,
  onToggleTheme,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uptimeSeconds, setUptimeSeconds] = useState(0);

  const isLight = theme === 'cyberpunk-light';
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);

  const availableCommands = [
    'help',
    'neofetch',
    'about',
    'skills',
    'codeforces',
    'projects',
    'education',
    'achievements',
    'ls',
    'cat',
    'goto',
    'open',
    'calc',
    'ping',
    'matrix',
    'github',
    'linkedin',
    'contact',
    'resume',
    'theme',
    'sound',
    'history',
    'whoami',
    'date',
    'clear',
  ];

  const virtualFiles: Record<string, { description: string; lang: string; content: string }> = {
    'about.md': {
      description: 'Personal bio & academic summary',
      lang: 'markdown',
      content: `# Yash Jit — Aspiring Software Engineer\n- Education: ${data.personal.education}\n- University: ${data.personal.college} (Class of 2030)\n- Duration: 2026 – Present\n- Codeforces: Handle Yash2207 | Rating: ${data.competitiveProgramming.rating} | 100+ Solved\n- Goal: ${data.personal.careerGoal}`,
    },
    'codeforces_999.cpp': {
      description: 'C++20 fast I/O competitive programming template',
      lang: 'cpp',
      content: `// Yash Jit (Yash2207) — Rating: ${data.competitiveProgramming.rating}\n#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    cin >> n;\n    vector<long long> a(n);\n    for (auto &x : a) cin >> x;\n    sort(a.begin(), a.end());\n    cout << "Optimal O(N log N) Ready\\n";\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int t = 1;\n    while (t--) solve();\n    return 0;\n}`,
    },
    'skills.json': {
      description: 'Structured technical stack & proficiency',
      lang: 'json',
      content: JSON.stringify(
        {
          languages: ['Python', 'C++20', 'Java', 'JavaScript (ES6+)'],
          web: ['HTML5', 'CSS3 / Tailwind', 'React', 'Three.js / WebGL'],
          competitiveProgramming: {
            platform: 'Codeforces',
            handle: 'Yash2207',
            rating: data.competitiveProgramming.rating,
            solved: '100+',
          },
        },
        null,
        2
      ),
    },
    'contact.sh': {
      description: 'Direct communication shell script',
      lang: 'bash',
      content: `#!/usr/bin/env bash\necho "Connecting with Yash Jit..."\necho "Email    : ${data.personal.email}"\necho "GitHub   : ${data.socials.github}"\necho "LinkedIn : ${data.socials.linkedin}"\necho "Instagram: ${data.socials.instagram}"`,
    },
  };

  // Track terminal session uptime
  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const renderWelcomeBanner = () => (
    <div className="space-y-2 text-xs sm:text-sm font-mono leading-relaxed">
      <div className="text-[#38BDF8] font-bold">
        ┌─ Yash Jit's Interactive Dev Station v3.0.0 [Interactive ZSH]
      </div>
      <div className="text-slate-300">
        Type <span className="text-[#38BDF8] font-bold bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">help</span> or <span className="text-[#8B5CF6] font-bold bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-800/40">neofetch</span>, or click any interactive command chip below.
      </div>
      <div className="text-slate-400 text-xs">
        Academic Pursuit: 1st Year B.Tech CS & AI · Newton School of Technology (Class of 2030) · Codeforces: <span className="text-emerald-400 font-semibold">{data.competitiveProgramming.rating}</span>
      </div>
    </div>
  );

  const [outputs, setOutputs] = useState<CommandOutput[]>([
    {
      id: 'welcome-banner',
      command: 'banner',
      timestamp: '00:00:01',
      content: renderWelcomeBanner(),
    },
  ]);

  // Auto-scroll ONLY inside the terminal screen container; NEVER scroll the browser window
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTo({
        top: terminalBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [outputs]);

  // Safe arithmetic calculator for `calc` command
  const evaluateMath = (expr: string): string => {
    const sanitized = expr.replace(/[^0-9+\-*/().%\s^]/g, '').replace(/\^/g, '**');
    if (!sanitized.trim()) return 'Invalid expression. Example: calc (999 + 201) * 2';
    try {
      // Safe evaluation of pure numeric expression
      const result = Function(`"use strict"; return (${sanitized});`)();
      if (typeof result === 'number' && Number.isFinite(result)) {
        return `${expr} = ${result}`;
      }
      return 'Result is not a finite number.';
    } catch {
      return `Syntax error in math expression: "${expr}"`;
    }
  };

  const handleExecute = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    soundEffects.playClick();

    // Record command in session history
    const updatedHistory = [...history, trimmed];
    setHistory(updatedHistory);
    setHistoryIndex(-1);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const argStr = args.join(' ');

    const time = new Date().toLocaleTimeString();
    let content: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        content = (
          <div className="space-y-3 text-xs sm:text-sm font-mono">
            <div className="text-[#38BDF8] font-bold flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span>YashOS Interactive Shell — Command Reference</span>
              <span className="text-[11px] text-slate-400 font-normal">Click any command to execute</span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-[#8B5CF6] font-bold">Core Commands</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div><button type="button" onClick={() => handleExecute('whoami')} className="text-emerald-400 hover:underline font-bold cursor-pointer">whoami</button> — Display developer identity & credentials</div>
                <div><button type="button" onClick={() => handleExecute('projects')} className="text-emerald-400 hover:underline font-bold cursor-pointer">projects</button> — Inspect featured engineering projects</div>
                <div><button type="button" onClick={() => handleExecute('contact')} className="text-emerald-400 hover:underline font-bold cursor-pointer">contact</button> — Direct email, social links & quick copy</div>
                <div><button type="button" onClick={() => handleExecute('help')} className="text-emerald-400 hover:underline font-bold cursor-pointer">help</button> — Show this interactive command guide</div>
                <div><button type="button" onClick={() => handleExecute('history')} className="text-emerald-400 hover:underline font-bold cursor-pointer">history</button> — View & re-run session command history</div>
                <div><button type="button" onClick={() => handleExecute('clear')} className="text-emerald-400 hover:underline font-bold cursor-pointer">clear</button> — Clear terminal output window</div>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="text-[11px] uppercase tracking-wider text-[#38BDF8] font-bold">Portfolio & Telemetry</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div><button type="button" onClick={() => handleExecute('neofetch')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">neofetch</button> — System & developer ASCII telemetry</div>
                <div><button type="button" onClick={() => handleExecute('about')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">about</button> — Bio, university & career ambition</div>
                <div><button type="button" onClick={() => handleExecute('skills')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">skills</button> — Languages & technical stack</div>
                <div><button type="button" onClick={() => handleExecute('codeforces')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">codeforces</button> — Live rating ({data.competitiveProgramming.rating}) & contest metrics</div>
                <div><button type="button" onClick={() => handleExecute('education')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">education</button> — 4-year B.Tech CS & AI roadmap (2026–2030)</div>
                <div><button type="button" onClick={() => handleExecute('achievements')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">achievements</button> — Verified certifications & badges</div>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">Filesystem & Utilities</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div><button type="button" onClick={() => handleExecute('ls')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">ls</button> — List virtual portfolio files</div>
                <div><button type="button" onClick={() => handleExecute('cat codeforces_999.cpp')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">cat &lt;file&gt;</button> — Inspect virtual file contents</div>
                <div><button type="button" onClick={() => handleExecute('goto projects')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">goto &lt;sec&gt;</button> — Smooth-scroll to a portfolio section</div>
                <div><button type="button" onClick={() => handleExecute('open github')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">open &lt;site&gt;</button> — Launch GitHub/LinkedIn/Codeforces/Resume</div>
                <div><button type="button" onClick={() => handleExecute('calc 999 + 201')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">calc &lt;expr&gt;</button> — Instant math expression evaluator</div>
                <div><button type="button" onClick={() => handleExecute('ping codeforces.com')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">ping &lt;host&gt;</button> — Network latency diagnostic check</div>
                <div><button type="button" onClick={() => handleExecute('matrix')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">matrix</button> — Render binary telemetry stream</div>
                <div><button type="button" onClick={() => handleExecute('resume')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">resume</button> — Open verified downloadable resume</div>
                <div><button type="button" onClick={() => handleExecute('theme')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">theme</button> — Toggle Deep Space / Cyberpunk Light</div>
                <div><button type="button" onClick={() => handleExecute('sound')} className="text-[#38BDF8] hover:underline font-semibold cursor-pointer">sound</button> — Mute / unmute UI sound effects</div>
              </div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        content = (
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5 text-xs font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div>
                <span className="text-emerald-400 font-bold text-sm">yash_jit</span>
                <span className="text-slate-400 ml-2">({data.personal.name} — {data.personal.title})</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold">
                UID: 1000 (ACTIVE)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-300">
              <div><span className="text-[#38BDF8] font-semibold">Degree:</span> {data.personal.education}</div>
              <div><span className="text-[#38BDF8] font-semibold">University:</span> {data.personal.college}</div>
              <div><span className="text-[#38BDF8] font-semibold">Batch:</span> Class of 2030 (2026 – Present)</div>
              <div><span className="text-[#38BDF8] font-semibold">Codeforces:</span> Yash2207 (Rating <span className="text-emerald-400 font-bold">{data.competitiveProgramming.rating}</span> · 100+ Solved)</div>
              <div><span className="text-[#38BDF8] font-semibold">Core Stack:</span> C++20, Python, Java, JS, React, Three.js</div>
              <div><span className="text-[#38BDF8] font-semibold">Location:</span> {data.personal.location}</div>
            </div>
            <div className="text-slate-400 text-[11px] pt-0.5">
              {data.personal.bio}
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleExecute('projects')}
                className="px-2.5 py-1 rounded-lg bg-[#151824] border border-slate-700 hover:border-[#38BDF8] text-[#38BDF8] text-[11px] cursor-pointer"
              >
                $ projects
              </button>
              <button
                type="button"
                onClick={() => handleExecute('contact')}
                className="px-2.5 py-1 rounded-lg bg-[#151824] border border-slate-700 hover:border-[#38BDF8] text-emerald-400 text-[11px] cursor-pointer"
              >
                $ contact
              </button>
              <button
                type="button"
                onClick={() => handleExecute('resume')}
                className="px-2.5 py-1 rounded-lg bg-[#151824] border border-slate-700 hover:border-[#38BDF8] text-purple-300 text-[11px] cursor-pointer"
              >
                $ resume
              </button>
            </div>
          </div>
        );
        break;

      case 'neofetch':
      case 'sysinfo':
        content = (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-1 text-xs font-mono">
            <pre className="sm:col-span-4 text-[#8B5CF6] font-bold leading-tight select-none">
{`  __   __    _ 
  \\ \\ / /   | |
   \\ V / _  | |
    | | | |_| |
    |_|  \\___/ 
  YASH JIT OS`}
            </pre>
            <div className="sm:col-span-8 space-y-1 text-slate-300">
              <div><span className="text-[#38BDF8] font-bold">yash@nst-workstation</span></div>
              <div className="text-slate-600">----------------------------</div>
              <div><span className="text-[#8B5CF6] font-semibold">OS:</span> Portfolio WebGL Engine v3.0 (Three.js + React 19)</div>
              <div><span className="text-[#8B5CF6] font-semibold">Academic:</span> 1st Year B.Tech CS & AI (2026 – Present)</div>
              <div><span className="text-[#8B5CF6] font-semibold">Institution:</span> Newton School of Technology (Class of 2030)</div>
              <div><span className="text-[#8B5CF6] font-semibold">Codeforces:</span> Yash2207 · Rating <span className="text-emerald-400 font-bold">{data.competitiveProgramming.rating}</span> · 100+ Solved</div>
              <div><span className="text-[#8B5CF6] font-semibold">Languages:</span> C++20, Python, Java, JavaScript (ES6+), HTML5/CSS3</div>
              <div><span className="text-[#8B5CF6] font-semibold">Theme:</span> {theme === 'deep-space' ? 'Deep Space (#08090D)' : 'Cyberpunk Light'}</div>
              <div><span className="text-[#8B5CF6] font-semibold">Session Uptime:</span> {formatUptime(uptimeSeconds)}</div>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-3 h-3 rounded-xs bg-[#08090D] border border-slate-700 inline-block" />
                <span className="w-3 h-3 rounded-xs bg-[#8B5CF6] inline-block" />
                <span className="w-3 h-3 rounded-xs bg-[#38BDF8] inline-block" />
                <span className="w-3 h-3 rounded-xs bg-emerald-400 inline-block" />
                <span className="w-3 h-3 rounded-xs bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" />
              </div>
            </div>
          </div>
        );
        break;

      case 'about':
        content = (
          <div className="space-y-1.5 text-xs sm:text-sm font-mono">
            <div className="text-[#38BDF8] font-bold">{data.personal.name} — {data.personal.title}</div>
            <div className="text-slate-300">{data.personal.bio}</div>
            <div className="text-slate-400 text-xs pt-1">
              • Education: {data.personal.education} (Class of 2030)
              <br />
              • University: {data.personal.college} (2026 – Present)
              <br />
              • Career Goal: {data.personal.careerGoal}
              <br />
              • Status: {data.personal.availability}
            </div>
          </div>
        );
        break;

      case 'skills':
        content = (
          <div className="space-y-2 text-xs sm:text-sm font-mono">
            <div className="text-[#38BDF8] font-bold">Technical Skills Inventory:</div>
            <div className="space-y-1 text-xs">
              <div className="text-purple-300 font-semibold">Languages:</div>
              <div className="text-slate-300 pl-3">Python · C++20 (Competitive Programming) · Java · JavaScript (ES6+) · HTML5 · CSS3</div>
              <div className="text-[#38BDF8] font-semibold pt-1">Core Competencies:</div>
              <div className="text-slate-300 pl-3">Data Structures & Algorithms · Asymptotic Analysis · Responsive Modern UI · Git / GitHub</div>
              <div className="text-emerald-300 font-semibold pt-1">Current University Coursework:</div>
              <div className="text-slate-300 pl-3">Discrete Mathematics · Computational Linear Algebra · Foundations of AI</div>
            </div>
          </div>
        );
        break;

      case 'education':
      case 'college':
        content = (
          <div className="space-y-2 text-xs font-mono">
            <div className="text-[#38BDF8] font-bold">B.Tech CS & AI — 4-Year Curriculum Checkpoints (2026 – 2030):</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {data.collegeCurriculum.map((yr) => (
                <div key={yr.year} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">Year {yr.year}: {yr.phase}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#8B5CF6]/20 text-[#38BDF8]">{yr.status}</span>
                  </div>
                  <div className="text-slate-300 text-[11px] mt-1">{yr.theme}</div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'achievements':
      case 'badges':
        content = (
          <div className="space-y-2 text-xs font-mono">
            <div className="text-[#38BDF8] font-bold">Verified Certifications & Competition Achievements:</div>
            <div className="space-y-1.5">
              {data.certifications.map((cert, i) => (
                <div key={cert.id} className="flex flex-wrap items-center justify-between gap-2 p-2 rounded bg-slate-900/50 border border-slate-800">
                  <div>
                    <span className="text-emerald-400 font-bold">✓ {i + 1}. {cert.title}</span>
                    <span className="text-slate-400 ml-2">({cert.issuer} · {cert.issueDate})</span>
                  </div>
                  <span className="text-[10px] text-[#38BDF8] uppercase">{cert.category}</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'ls':
      case 'dir':
        content = (
          <div className="space-y-2 text-xs font-mono">
            <div className="text-[#38BDF8] font-bold">Directory listing of /home/yash/portfolio (Click any file to inspect):</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {Object.entries(virtualFiles).map(([fname, meta]) => (
                <button
                  key={fname}
                  type="button"
                  onClick={() => handleExecute(`cat ${fname}`)}
                  className="p-2 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-[#38BDF8]/50 text-left flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <span className="text-emerald-400 font-bold group-hover:text-[#38BDF8]">{fname}</span>
                    <div className="text-[10px] text-slate-400">{meta.description}</div>
                  </div>
                  <span className="text-[10px] text-slate-500 group-hover:text-white">cat →</span>
                </button>
              ))}
            </div>
          </div>
        );
        break;

      case 'cat': {
        const targetFile = args[0];
        if (!targetFile) {
          content = (
            <div className="text-xs font-mono text-amber-300">
              Usage: <span className="font-bold">cat &lt;filename&gt;</span>. Available files: {Object.keys(virtualFiles).join(', ')}
            </div>
          );
        } else if (virtualFiles[targetFile]) {
          content = (
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1">
                <span className="text-[#38BDF8] font-bold">File: {targetFile}</span>
                <span className="uppercase text-[10px]">{virtualFiles[targetFile].lang}</span>
              </div>
              <pre className="p-3 rounded-lg bg-[#05070e] border border-slate-800/90 text-emerald-300 overflow-x-auto leading-relaxed">
                {virtualFiles[targetFile].content}
              </pre>
            </div>
          );
        } else {
          content = (
            <div className="text-xs font-mono text-rose-400">
              cat: {targetFile}: No such file in virtual directory. Type <span className="text-[#38BDF8] font-bold">ls</span> to view files.
            </div>
          );
        }
        break;
      }

      case 'goto': {
        const targetSec = (args[0] || '').toLowerCase();
        const secMap: Record<string, string> = {
          home: 'hero',
          hero: 'hero',
          about: 'about',
          college: 'college-life',
          skills: 'skills',
          codeforces: 'competitive-programming',
          cp: 'competitive-programming',
          projects: 'projects',
          github: 'github',
          achievements: 'certifications',
          badges: 'certifications',
          journey: 'journey',
          terminal: 'terminal',
          contact: 'contact',
        };
        const domId = secMap[targetSec];
        if (!targetSec || !domId) {
          content = (
            <div className="text-xs font-mono text-amber-300">
              Usage: <span className="font-bold">goto &lt;section&gt;</span> (e.g., <span className="text-[#38BDF8]">goto projects</span>, <span className="text-[#38BDF8]">goto codeforces</span>, <span className="text-[#38BDF8]">goto skills</span>, <span className="text-[#38BDF8]">goto contact</span>)
            </div>
          );
        } else {
          const el = document.getElementById(domId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
          content = (
            <div className="text-xs font-mono text-emerald-400">
              ✓ Navigating viewport to section <span className="font-bold">#{domId}</span>...
            </div>
          );
        }
        break;
      }

      case 'open': {
        const targetSite = (args[0] || '').toLowerCase();
        if (targetSite === 'github') {
          window.open(data.socials.github, '_blank', 'noopener,noreferrer');
          content = <div className="text-xs font-mono text-emerald-400">✓ Opened GitHub profile ({data.socials.github})</div>;
        } else if (targetSite === 'linkedin') {
          window.open(data.socials.linkedin, '_blank', 'noopener,noreferrer');
          content = <div className="text-xs font-mono text-emerald-400">✓ Opened LinkedIn profile ({data.socials.linkedin})</div>;
        } else if (targetSite === 'codeforces' || targetSite === 'cf') {
          window.open(data.socials.codeforces, '_blank', 'noopener,noreferrer');
          content = <div className="text-xs font-mono text-emerald-400">✓ Opened Codeforces profile ({data.socials.codeforces})</div>;
        } else if (targetSite === 'instagram') {
          window.open(data.socials.instagram, '_blank', 'noopener,noreferrer');
          content = <div className="text-xs font-mono text-emerald-400">✓ Opened Instagram profile ({data.socials.instagram})</div>;
        } else if (targetSite === 'resume') {
          onOpenResume?.();
          content = <div className="text-xs font-mono text-emerald-400">✓ Opened Verified Developer Resume Modal.</div>;
        } else {
          content = (
            <div className="space-y-1.5 text-xs font-mono">
              <div className="text-amber-300">Specify a target to open, or click below:</div>
              <div className="flex flex-wrap gap-2">
                {['github', 'linkedin', 'codeforces', 'instagram', 'resume'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleExecute(`open ${t}`)}
                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-[#38BDF8] hover:border-[#38BDF8] cursor-pointer"
                  >
                    open {t}
                  </button>
                ))}
              </div>
            </div>
          );
        }
        break;
      }

      case 'calc': {
        if (!argStr) {
          content = (
            <div className="text-xs font-mono text-amber-300">
              Usage: <span className="font-bold">calc &lt;expression&gt;</span> (e.g. <span className="text-[#38BDF8]">calc 999 + 201</span> or <span className="text-[#38BDF8]">calc 2 ^ 10</span>)
            </div>
          );
        } else {
          content = (
            <div className="text-xs sm:text-sm font-mono text-emerald-400 font-bold">
              🧮 {evaluateMath(argStr)}
            </div>
          );
        }
        break;
      }

      case 'ping': {
        const host = args[0] || 'codeforces.com';
        content = (
          <div className="space-y-1 text-xs font-mono text-slate-300">
            <div className="text-[#38BDF8] font-bold">PING {host} (104.26.10.230): 56 data bytes</div>
            <div>64 bytes from {host}: icmp_seq=0 ttl=58 time=14.2 ms</div>
            <div>64 bytes from {host}: icmp_seq=1 ttl=58 time=12.8 ms</div>
            <div>64 bytes from {host}: icmp_seq=2 ttl=58 time=13.4 ms</div>
            <div className="text-emerald-400 pt-1">
              --- {host} ping statistics: 3 packets transmitted, 3 received, 0% packet loss, avg 13.4ms ---
            </div>
          </div>
        );
        break;
      }

      case 'matrix': {
        const rows = Array.from({ length: 5 }, (_, r) =>
          Array.from({ length: 44 }, (_, c) => ((r * 17 + c * 31 + Date.now()) % 2 === 0 ? '1' : '0')).join(' ')
        );
        content = (
          <div className="p-3 rounded-lg bg-[#040812] border border-emerald-500/30 font-mono text-xs space-y-1">
            <div className="text-emerald-400 font-bold flex items-center justify-between">
              <span>[QUANTUM BINARY MATRIX STREAM ACTIVE]</span>
              <span className="text-[10px] text-[#38BDF8]">60 FPS SYNC</span>
            </div>
            {rows.map((line, i) => (
              <div key={i} className="text-emerald-500/80 tracking-widest truncate">
                {line}
              </div>
            ))}
          </div>
        );
        break;
      }

      case 'projects':
        content = (
          <div className="space-y-2.5 text-xs sm:text-sm font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[#38BDF8] font-bold">Featured Engineering Projects ({data.projects.length}):</span>
              <button
                type="button"
                onClick={() => handleExecute('goto projects')}
                className="px-2 py-0.5 rounded bg-[#151824] border border-slate-700 hover:border-[#38BDF8] text-[#38BDF8] text-[11px] cursor-pointer"
              >
                Scroll to Showcase →
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2.5 text-xs">
              {data.projects.map((p, idx) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-white font-bold text-xs sm:text-sm">
                      {idx + 1}. {p.title}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {p.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-1.5 py-0.5 rounded bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#38BDF8] text-[10px]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">{p.description}</div>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline font-semibold"
                    >
                      [GitHub Repository ↗]
                    </a>
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#38BDF8] hover:underline font-semibold"
                      >
                        [Live Demo ↗]
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'codeforces':
        content = (
          <div className="space-y-1.5 text-xs sm:text-sm font-mono">
            <div className="text-[#38BDF8] font-bold">Codeforces Algorithmic Profile:</div>
            <div className="text-slate-300 text-xs">
              • Handle: <span className="text-white font-bold">Yash2207</span>
              <br />
              • Current Rating: <span className="text-[#38BDF8] font-bold">{data.competitiveProgramming.rating}</span> ({data.competitiveProgramming.rankName})
              <br />
              • Solved Problems: <span className="text-emerald-400 font-bold">{data.competitiveProgramming.solvedProblems}</span>
              <br />
              • Progression: <span className="text-purple-300">0 → 462 → 685 → 824 → 999 (+999 net gain)</span>
              <br />
              • Profile Link: <a href={data.competitiveProgramming.profileUrl} target="_blank" rel="noreferrer" className="text-[#8B5CF6] underline">{data.competitiveProgramming.profileUrl}</a>
            </div>
          </div>
        );
        break;

      case 'github':
        content = (
          <div className="space-y-1.5 text-xs sm:text-sm font-mono">
            <div className="text-[#38BDF8] font-bold">GitHub Repositories & Activity:</div>
            <div className="text-slate-300 text-xs">
              • Username: <span className="text-white font-bold">yashjit52n</span>
              <br />
              • Profile: <a href={data.socials.github} target="_blank" rel="noreferrer" className="text-[#8B5CF6] underline">{data.socials.github}</a>
              <br />
              • Primary Repositories: algorithm-visualizer, competitive-programming-solutions, ai-coursework-models, developer-utility-suite
            </div>
          </div>
        );
        break;

      case 'linkedin':
        content = (
          <div className="space-y-1.5 text-xs sm:text-sm font-mono">
            <div className="text-[#38BDF8] font-bold">LinkedIn Profile:</div>
            <div className="text-slate-300 text-xs">
              • Profile: <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="text-[#8B5CF6] underline">{data.socials.linkedin}</a>
              <br />
              • Connect with Yash Jit for internships, hackathons, and software engineering opportunities.
            </div>
          </div>
        );
        break;

      case 'contact':
        content = (
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5 text-xs font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <span className="text-[#38BDF8] font-bold">Direct Communication & Social Channels</span>
              <span className="text-emerald-400 text-[11px]">● Open to Opportunities</span>
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div>
                • Email:{' '}
                <a href={`mailto:${data.personal.email}`} className="text-[#38BDF8] font-bold hover:underline">
                  {data.personal.email}
                </a>
              </div>
              <div>• Location: {data.personal.location}</div>
              <div>
                • GitHub:{' '}
                <a href={data.socials.github} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                  {data.socials.github}
                </a>
              </div>
              <div>
                • LinkedIn:{' '}
                <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                  {data.socials.linkedin}
                </a>
              </div>
              <div>
                • Codeforces:{' '}
                <a href={data.socials.codeforces} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                  {data.socials.codeforces}
                </a>
              </div>
              <div>
                • Instagram:{' '}
                <a href={data.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                  {data.socials.instagram}
                </a>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(data.personal.email);
                  soundEffects.playClick();
                }}
                className="px-2.5 py-1 rounded-lg bg-[#151824] border border-slate-700 hover:border-emerald-400 text-emerald-400 text-[11px] cursor-pointer"
              >
                Copy Email ({data.personal.email})
              </button>
              <button
                type="button"
                onClick={() => handleExecute('goto contact')}
                className="px-2.5 py-1 rounded-lg bg-[#151824] border border-slate-700 hover:border-[#38BDF8] text-[#38BDF8] text-[11px] cursor-pointer"
              >
                Jump to Contact Form →
              </button>
            </div>
          </div>
        );
        break;

      case 'resume':
        if (onOpenResume) {
          onOpenResume();
        }
        content = (
          <div className="space-y-1 text-xs sm:text-sm font-mono text-emerald-400">
            <div>✓ Opening Yash Jit's Downloadable Resume Modal...</div>
            <div className="text-slate-400 text-xs">You can review or print/download the verified PDF from the preview dialog.</div>
          </div>
        );
        break;

      case 'theme':
        if (onToggleTheme) {
          onToggleTheme();
        }
        content = (
          <div className="space-y-1 text-xs sm:text-sm font-mono text-[#38BDF8]">
            <div>✓ Toggled portfolio visual theme with smooth GSAP lens transition.</div>
          </div>
        );
        break;

      case 'sound': {
        const mutedNow = soundEffects.toggleMuted();
        content = (
          <div className="text-xs font-mono text-[#38BDF8]">
            ✓ UI sound effects are now <span className="font-bold">{mutedNow ? 'MUTED' : 'ENABLED'}</span>.
          </div>
        );
        break;
      }

      case 'history':
        content = (
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[#38BDF8] font-bold">Session Command History ({updatedHistory.length}):</span>
              <span className="text-[10px] text-slate-400">Click any entry to re-run</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {updatedHistory.map((hCmd, i) => (
                <button
                  key={`${hCmd}-${i}`}
                  type="button"
                  onClick={() => handleExecute(hCmd)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-[#38BDF8] hover:border-[#38BDF8]/50 cursor-pointer"
                >
                  <span className="text-slate-500 mr-1">#{i + 1}</span>
                  <span className="font-semibold">{hCmd}</span>
                </button>
              ))}
            </div>
          </div>
        );
        break;

      case 'banner':
        content = renderWelcomeBanner();
        break;

      case 'date':
        content = (
          <div className="text-xs sm:text-sm font-mono text-slate-300">
            {new Date().toString()}
          </div>
        );
        break;

      case 'clear':
      case 'cls':
        setOutputs([]);
        setInputVal('');
        return;

      default:
        content = (
          <div className="space-y-1 text-xs sm:text-sm font-mono text-rose-400">
            <div>command not found: <span className="font-bold">{cmd}</span></div>
            <div className="text-slate-400 text-xs">
              Type <span className="text-[#38BDF8] font-bold">help</span> to list all {availableCommands.length} interactive commands, or click a quick action below.
            </div>
          </div>
        );
        break;
    }

    setOutputs((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        command: trimmed,
        timestamp: time,
        content,
      },
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleExecute(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;
      const match = availableCommands.find((c) => c.startsWith(current));
      if (match) {
        setInputVal(match);
      }
    }
  };

  const copyTerminalHistory = () => {
    const text = outputs
      .map((o) => `[${o.timestamp}] $ ${o.command}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compute live autocomplete suggestions while typing
  const matchingSuggestions = inputVal.trim()
    ? availableCommands.filter(
        (c) => c.startsWith(inputVal.trim().toLowerCase()) && c !== inputVal.trim().toLowerCase()
      )
    : [];

  const quickCommands = [
    'help',
    'whoami',
    'projects',
    'contact',
    'neofetch',
    'codeforces',
    'ls',
    'cat codeforces_999.cpp',
    'education',
    'achievements',
    'history',
    'clear',
  ];

  return (
    <section id="terminal" className="py-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="max-w-2xl mb-10 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#38BDF8]">
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Interactive Developer Shell</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight font-['Space_Grotesk'] ${
            isLight ? 'text-slate-900' : 'text-[#F8FAFC]'
          }`}>
            Simulated Developer Terminal
          </h2>
          <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#94A3B8]'}`}>
            Execute interactive commands like <code className="text-[#38BDF8] font-mono">help</code>, <code className="text-[#38BDF8] font-mono">whoami</code>, <code className="text-[#38BDF8] font-mono">projects</code>, <code className="text-[#38BDF8] font-mono">contact</code>, and <code className="text-[#38BDF8] font-mono">clear</code>, or inspect virtual files (<code className="text-[#38BDF8] font-mono">ls</code>, <code className="text-[#38BDF8] font-mono">cat</code>).
          </p>
        </div>

        {/* Quick Command Pills for Frictionless Access */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`text-xs font-mono font-semibold flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-[#94A3B8]'}`}>
            <Play className="w-3 h-3 text-[#38BDF8]" />
            <span>Quick Execute:</span>
          </span>
          {quickCommands.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => handleExecute(cmd)}
              onMouseEnter={() => soundEffects.playHover()}
              className={`btn-interactive px-2.5 py-1 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-cyan-50 border-slate-200 text-slate-700 hover:text-cyan-700 shadow-2xs'
                  : 'bg-[#151824] hover:bg-[#1e2336] border-slate-800 text-slate-300 hover:text-[#38BDF8]'
              }`}
            >
              $ {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Window Box */}
        <div className={`rounded-2xl overflow-hidden border shadow-2xl transition-all ${
          isLight
            ? 'bg-slate-950 border-slate-700 shadow-slate-400/20 text-slate-200'
            : 'bg-[#08090D] border-slate-800 shadow-2xl text-slate-200'
        } ${isExpanded ? 'min-h-[600px]' : 'min-h-[440px]'}`}>
          
          {/* Top Title Bar (macOS / Linux Traffic Lights) */}
          <div className="px-4 py-3 bg-[#10121A] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline">
                yash@nst-workstation: ~/portfolio (zsh)
              </span>
            </div>

            {/* Window Utilities */}
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <button
                type="button"
                onClick={() => handleExecute('ls')}
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-xs font-mono text-[#38BDF8] flex items-center gap-1 border border-slate-800 cursor-pointer"
                title="Browse virtual files"
              >
                <FolderOpen className="w-3 h-3" />
                <span className="hidden sm:inline">Files</span>
              </button>
              <button
                type="button"
                onClick={() => handleExecute('neofetch')}
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-xs font-mono text-[#8B5CF6] flex items-center gap-1 border border-slate-800 cursor-pointer"
                title="Run System Info"
              >
                <Cpu className="w-3 h-3" />
                <span className="hidden sm:inline">SysInfo</span>
              </button>
              <button
                type="button"
                onClick={copyTerminalHistory}
                className="p-1.5 rounded hover:text-slate-200 transition-colors cursor-pointer"
                title="Copy terminal session"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => handleExecute('clear')}
                className="p-1.5 rounded hover:text-slate-200 transition-colors cursor-pointer"
                title="Run clear command"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded hover:text-slate-200 transition-colors cursor-pointer"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Live Session Command History Bar (Reflected directly in UI) */}
          {history.length > 0 && (
            <div className="px-4 py-2 bg-[#0b0e17] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
              <span className="text-slate-400 shrink-0 font-semibold">
                Command History ({history.length}):
              </span>
              <div className="flex items-center gap-1.5">
                {history.slice(-8).map((hCmd, idx) => {
                  const cmdNumber = Math.max(1, history.length - Math.min(history.length, 8) + idx + 1);
                  return (
                    <button
                      key={`${hCmd}-${cmdNumber}`}
                      type="button"
                      onClick={() => handleExecute(hCmd)}
                      className="px-2 py-0.5 rounded bg-[#151824] border border-slate-800 hover:border-[#38BDF8]/50 text-slate-300 hover:text-[#38BDF8] whitespace-nowrap cursor-pointer"
                      title={`Re-run "${hCmd}"`}
                    >
                      <span className="text-slate-500 mr-1">#{cmdNumber}</span>
                      <span>{hCmd}</span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => {
                  setHistory([]);
                  setHistoryIndex(-1);
                }}
                className="ml-auto text-[10px] text-slate-500 hover:text-rose-400 shrink-0 cursor-pointer"
                title="Clear command history log"
              >
                Reset History
              </button>
            </div>
          )}

          {/* Terminal Screen Body */}
          <div 
            ref={terminalBodyRef}
            className={`p-4 sm:p-6 overflow-y-auto space-y-4 select-text ${
              isExpanded ? 'max-h-[640px]' : 'max-h-[440px]'
            }`}
            onClick={() => inputRef.current?.focus({ preventScroll: true })}
          >
            {outputs.length === 0 ? (
              <div className="py-4 text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3">
                <span>Terminal output cleared. Session history ({history.length} commands) preserved.</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleExecute('help')}
                    className="text-[#38BDF8] hover:underline cursor-pointer"
                  >
                    $ help
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecute('whoami')}
                    className="text-emerald-400 hover:underline cursor-pointer"
                  >
                    $ whoami
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecute('banner')}
                    className="text-purple-400 hover:underline cursor-pointer"
                  >
                    $ banner
                  </button>
                </div>
              </div>
            ) : (
              outputs.map((out) => (
                <div key={out.id} className="space-y-1.5">
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                    <span className="text-[#38BDF8] font-bold">yash@portfolio</span>
                    <span className="text-slate-600">:</span>
                    <span className="text-[#8B5CF6] font-semibold">~/nst</span>
                    <span className="text-slate-500">$</span>
                    <span className="text-white font-semibold">{out.command}</span>
                    <span className="text-[10px] text-slate-600 ml-auto hidden sm:inline">{out.timestamp}</span>
                  </div>
                  <div className="pl-4 border-l-2 border-[#8B5CF6]/40 text-slate-200">
                    {out.content}
                  </div>
                </div>
              ))
            )}

            {/* Live Autocomplete Suggestions Bar */}
            {matchingSuggestions.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono">
                <span className="text-slate-500">Suggestions (Tab):</span>
                {matchingSuggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      setInputVal(sug);
                      inputRef.current?.focus({ preventScroll: true });
                    }}
                    className="px-2 py-0.5 rounded bg-[#151824] border border-[#8B5CF6]/40 text-[#38BDF8] hover:bg-[#8B5CF6]/20 cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Active Command Prompt Line */}
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm pt-2">
              <span className="text-[#38BDF8] font-bold">yash@portfolio</span>
              <span className="text-slate-600">:</span>
              <span className="text-[#8B5CF6] font-semibold">~/nst</span>
              <span className="text-emerald-400 font-bold">$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type 'help', 'whoami', 'projects', 'contact', 'clear'..."
                className="flex-1 bg-transparent border-none outline-hidden text-cyan-200 placeholder:text-slate-600 font-mono text-xs sm:text-sm"
                autoComplete="off"
                spellCheck="false"
                aria-label="Developer terminal command input"
              />
              <button
                type="button"
                onClick={() => handleExecute(inputVal)}
                className="p-1 text-slate-400 hover:text-[#38BDF8] transition-colors cursor-pointer"
                title="Execute command"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Terminal Status Bar */}
          <div className="px-4 py-2 bg-[#10121A] border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-semibold">ZSH v5.9 READY</span>
              </span>
              <span>HISTORY: {history.length}</span>
              <span>OUTPUTS: {outputs.length}</span>
              <span>UPTIME: {formatUptime(uptimeSeconds)}</span>
            </div>
            <div className="hidden sm:block text-slate-500">
              TAB to autocomplete · UP/DOWN for history · Click history pills to re-run
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
