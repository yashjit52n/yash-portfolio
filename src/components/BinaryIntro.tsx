/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Cinematic Binary Coded Opening Curtain for Yash Jit's Portfolio.
 * Features an extended multi-oscillator procedural synth soundtrack,
 * reliable synthesized voice announcement with asynchronous voice resolution,
 * and matrix decoding HUD.
 * 
 * Fixed:
 * 1. Intro sequence now runs continuously once and never reloads on sound toggle.
 * 2. Speech synthesis listens to onvoiceschanged and handles browser autoplay policies.
 * 3. Any touch or click on the screen resumes suspended Web Audio and triggers speech.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, FastForward, Terminal, Sparkles, Volume1 } from 'lucide-react';

interface BinaryIntroProps {
  onComplete: () => void;
}

export const BinaryIntro: React.FC<BinaryIntroProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [decodedName, setDecodedName] = useState('01011001 01001010');
  const [statusText, setStatusText] = useState('INITIALIZING COMPUTATIONAL CORES...');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [needsGestureForAudio, setNeedsGestureForAudio] = useState(false);

  const soundEnabledRef = useRef(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const hasSpokenRef = useRef(false);

  // Synchronize soundEnabled ref
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
    if (masterGainRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.linearRampToValueAtTime(
        soundEnabled ? 0.14 : 0.0001,
        now + 0.1
      );
    }
    if (!soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [soundEnabled]);

  // Procedural Cybernetic Ambient Soundtrack using Web Audio API
  const playAmbientCyberneticTrack = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGainRef.current = masterGain;

      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(soundEnabledRef.current ? 0.14 : 0.0001, now + 0.6);
      masterGain.gain.setValueAtTime(soundEnabledRef.current ? 0.14 : 0.0001, now + 5.8);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 7.4);
      masterGain.connect(ctx.destination);

      // Check if browser suspended audio due to autoplay restrictions
      if (ctx.state === 'suspended') {
        setNeedsGestureForAudio(true);
      }

      // Lowpass filter for warm, non-harsh sci-fi atmosphere
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 3.0);
      filter.frequency.exponentialRampToValueAtTime(450, now + 7.0);
      filter.connect(masterGain);

      // 1. Deep Bass Drone Pad (C3 & G2)
      const bassOsc1 = ctx.createOscillator();
      const bassOsc2 = ctx.createOscillator();
      bassOsc1.type = 'sine';
      bassOsc2.type = 'triangle';
      bassOsc1.frequency.setValueAtTime(130.81, now); // C3
      bassOsc2.frequency.setValueAtTime(98.0, now);    // G2

      const bassGain = ctx.createGain();
      bassGain.gain.setValueAtTime(0.45, now);
      bassOsc1.connect(bassGain);
      bassOsc2.connect(bassGain);
      bassGain.connect(filter);

      bassOsc1.start(now);
      bassOsc2.start(now);
      bassOsc1.stop(now + 7.4);
      bassOsc2.stop(now + 7.4);

      // 2. High-Tech Arpeggio Pings throughout sequence
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
      const pingTimes = [0.4, 1.2, 2.0, 2.8, 3.6, 4.4, 5.2, 6.0];

      pingTimes.forEach((tOffset, idx) => {
        const pingOsc = ctx.createOscillator();
        const pingGain = ctx.createGain();

        pingOsc.type = 'sine';
        const noteFreq = notes[idx % notes.length];
        pingOsc.frequency.setValueAtTime(noteFreq, now + tOffset);

        pingGain.gain.setValueAtTime(0.001, now + tOffset);
        pingGain.gain.linearRampToValueAtTime(0.08, now + tOffset + 0.04);
        pingGain.gain.exponentialRampToValueAtTime(0.0001, now + tOffset + 0.55);

        pingOsc.connect(pingGain);
        pingGain.connect(filter);

        pingOsc.start(now + tOffset);
        pingOsc.stop(now + tOffset + 0.6);
      });
    } catch {
      // AudioContext policy blocked, handled gracefully
    }
  };

  // Robust voice greeting with asynchronous voice resolution
  const speakVoiceGreeting = () => {
    if (!('speechSynthesis' in window) || hasSpokenRef.current || !soundEnabledRef.current) return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const text = "System initialized. Welcome to the portfolio of Yash Jit.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 0.98;
      utterance.volume = 1.0;

      const attemptSpeak = () => {
        if (hasSpokenRef.current) return;
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const preferred = voices.find(v => 
            v.lang.startsWith('en') && (
              v.name.includes('Google') || 
              v.name.includes('Natural') || 
              v.name.includes('Samantha') || 
              v.name.includes('Daniel') || 
              v.name.includes('Alex')
            )
          ) || voices.find(v => v.lang.startsWith('en'));

          if (preferred) {
            utterance.voice = preferred;
          }
        }

        utterance.onend = () => {
          hasSpokenRef.current = true;
        };
        utterance.onerror = () => {
          hasSpokenRef.current = true;
        };

        window.speechSynthesis.speak(utterance);
        hasSpokenRef.current = true;
      };

      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          attemptSpeak();
        };
        // Fallback timer if onvoiceschanged doesn't trigger immediately
        setTimeout(() => {
          attemptSpeak();
        }, 300);
      } else {
        attemptSpeak();
      }
    } catch {
      // SpeechSynthesis blocked or unsupported
    }
  };

  // User gesture unlocker (resolves browser autoplay policy blocks)
  const handleUserGesture = () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().then(() => {
        setNeedsGestureForAudio(false);
      });
    } else {
      setNeedsGestureForAudio(false);
    }
    if (!hasSpokenRef.current && soundEnabledRef.current) {
      speakVoiceGreeting();
    }
  };

  // 1. Binary Rain Matrix Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(1).map(() => Math.floor(Math.random() * -60));
    const chars = ['0', '1'];

    let animId = 0;
    const draw = () => {
      ctx.fillStyle = 'rgba(5, 7, 15, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (Math.random() > 0.88) {
          ctx.fillStyle = '#ffffff';
        } else if (Math.random() > 0.4) {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.75)'; // Electric Cyan
        } else {
          ctx.fillStyle = 'rgba(129, 140, 248, 0.45)'; // Violet
        }

        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 2. Continuous Timed HUD Decoding Sequence (runs ONCE on mount, NEVER resets on sound toggle)
  useEffect(() => {
    const targetName = "YASH JIT";
    let iteration = 0;

    // Start background cybernetic audio
    playAmbientCyberneticTrack();

    // Paced progress counter (takes ~6.8 seconds to reach 100%)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 68);

    // Timed Status Updates
    const t1 = setTimeout(() => {
      setStatusText('AUTHENTICATING NEWTON SCHOOL OF TECHNOLOGY NODE...');
    }, 1400);

    // Voice greeting trigger at 1.8s
    const tVoice = setTimeout(() => {
      speakVoiceGreeting();
    }, 1800);

    const t2 = setTimeout(() => {
      setStatusText('DECODING NEURAL MATRICES // YASH JIT...');
    }, 3200);

    const t3 = setTimeout(() => {
      setStatusText('SYNCHRONIZING 4-YEAR CURRICULUM ARCHIVE...');
    }, 4800);

    const t4 = setTimeout(() => {
      setStatusText('ACCESS GRANTED · PROFILE VERIFIED (1ST YEAR B.TECH CS & AI)');
    }, 6200);

    // Scramble resolving character animation
    const scrambleInterval = setInterval(() => {
      setDecodedName(
        targetName
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return targetName[index];
            }
            return Math.random() > 0.5 ? '1' : '0';
          })
          .join('')
      );

      if (iteration >= targetName.length) {
        clearInterval(scrambleInterval);
        setDecodedName(targetName);
      }
      iteration += 1 / 4.5;
    }, 75);

    // Auto-complete intro after 7.4 seconds
    const exitTimer = setTimeout(() => {
      handleExit();
    }, 7400);

    return () => {
      clearInterval(progressInterval);
      clearInterval(scrambleInterval);
      clearTimeout(t1);
      clearTimeout(tVoice);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(exitTimer);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []); // Run ONCE on mount!

  // Lock body scroll while intro is visible
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleExit = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 650);
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleUserGesture();
    setSoundEnabled((prev) => !prev);
  };

  return (
    <div 
      onClick={handleUserGesture}
      className={`fixed inset-0 z-[100] flex flex-col justify-between overflow-y-auto overflow-x-hidden bg-[#05070f] p-3 sm:p-6 md:p-8 select-none transition-all duration-700 cursor-default ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Matrix Rain */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" />

      {/* Cybernetic Scanline Texture */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.4) 2px, rgba(0, 0, 0, 0.4) 4px)'
        }}
      />

      {/* Top Floating Controls - Responsive Non-Overlapping Header */}
      <header className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between gap-2 pt-1 pb-2">
        {/* Left Status Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-cyan-400 font-mono text-[10px] sm:text-xs min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
          <span className="tracking-wider sm:tracking-widest font-semibold truncate">
            <span className="hidden xs:inline">BOOT SEQUENCE // </span>NST-CORE
          </span>
        </div>

        {/* Right Audio & Skip Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {needsGestureForAudio && soundEnabled && (
            <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 animate-pulse">
              <Volume1 className="w-3 h-3 text-cyan-400" />
              <span>Click anywhere to activate sound</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleToggleSound}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors text-[10px] sm:text-xs font-mono cursor-pointer active:scale-95 shadow-sm"
            title="Toggle synthesized voice & soundtrack"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            )}
            <span className="hidden sm:inline">{soundEnabled ? 'Voice & Music On' : 'Muted'}</span>
            <span className="sm:hidden">{soundEnabled ? 'Audio' : 'Mute'}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleExit();
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 font-semibold transition-all shadow-lg shadow-cyan-500/10 cursor-pointer text-[10px] sm:text-xs font-mono active:scale-95 shrink-0"
          >
            <span>Skip</span>
            <span className="hidden xs:inline">Intro</span>
            <FastForward className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          </button>
        </div>
      </header>

      {/* Central Holographic Decoding Terminal Card */}
      <main className="relative z-10 w-full flex items-center justify-center my-auto py-3 sm:py-6">
        <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl glass-panel border border-slate-800 shadow-2xl text-center space-y-4 sm:space-y-6 backdrop-blur-xl">
          
          {/* Monogram Hexagon Badge */}
          <div className="w-13 h-13 sm:w-16 sm:h-16 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1.5px] shadow-xl shadow-cyan-500/20">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
              <span className="font-['Outfit'] font-black text-xl sm:text-2xl tracking-tighter bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                YJ
              </span>
            </div>
          </div>

          {/* Decoded Title & University Affiliation */}
          <div className="space-y-1 sm:space-y-1.5">
            <div className="text-[10px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest text-cyan-400 uppercase truncate">
              Subject ID Verified · Newton School of Technology
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-mono text-white drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              {decodedName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium font-['Outfit']">
              Aspiring Software Engineer · Class of 2030
            </p>
          </div>

          {/* Progress Bar & Telemetry */}
          <div className="space-y-2 pt-1 sm:pt-2">
            <div className="flex justify-between text-[10px] sm:text-xs font-mono text-slate-400">
              <span className="text-cyan-400">DECRYPT_PROGRESS</span>
              <span>{progress}%</span>
            </div>
            
            <div className="w-full h-1.5 sm:h-2 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Terminal Console Feed */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 sm:p-3 text-[10px] sm:text-xs font-mono text-slate-300 flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 text-cyan-400 shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="truncate">{statusText}</span>
          </div>

        </div>
      </main>

      {/* Bottom Telemetry Ticker */}
      <footer className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between text-[10px] sm:text-xs font-mono text-slate-500 border-t border-slate-900 pt-2 pb-1">
        <div className="hidden xs:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>SYSTEM: OPERATIONAL</span>
        </div>
        <div className="text-center w-full xs:w-auto">
          <span>PORTFOLIO ARCHITECTURE v2.6.0 · REACT + THREE.JS</span>
        </div>
        <div className="hidden sm:block">
          <span>LATENCY: 12ms</span>
        </div>
      </footer>
    </div>
  );
};
