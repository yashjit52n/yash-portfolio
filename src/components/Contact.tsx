/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Contact & Social Links Section: "Have an idea? Let's build something."
 * Features working external links (GitHub, LinkedIn, Instagram, Codeforces, Email),
 * verified contact form with validation, mailto generator, and quick copy-to-clipboard.
 */

import React, { useState } from 'react';
import { 
  Mail, Github, Linkedin, Instagram, Code2, 
  Send, Copy, Check, ArrowUpRight, MessageSquare, 
  Sparkles, ExternalLink 
} from 'lucide-react';
import { PortfolioData } from '../data/portfolioData';
import { soundEffects } from '../utils/soundEffects';

interface ContactProps {
  data: PortfolioData;
  theme?: 'deep-space' | 'cyberpunk-light';
}

export const Contact: React.FC<ContactProps> = ({ data, theme = 'deep-space' }) => {
  const isLight = theme === 'cyberpunk-light';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.message.trim()) errs.message = 'Please enter a message.';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    
    // Generate mailto link so the message is actually delivered to Yash's email
    const subject = encodeURIComponent(formData.subject || `Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailtoUrl = `mailto:${data.personal.email}?subject=${subject}&body=${body}`;
    
    // Open user's email client directly
    window.location.href = mailtoUrl;

    setFormSubmitted(true);
  };

  const socialLinks = [
    {
      name: 'GitHub',
      handle: 'yashjit52n',
      url: data.socials.github,
      icon: <Github className="w-5 h-5" />,
      color: 'hover:text-white hover:border-slate-500'
    },
    {
      name: 'LinkedIn',
      handle: 'Yash Jit',
      url: data.socials.linkedin,
      icon: <Linkedin className="w-5 h-5" />,
      color: 'hover:text-blue-400 hover:border-blue-500/50'
    },
    {
      name: 'Codeforces',
      handle: `Yash2207 (Rating ${data.competitiveProgramming.rating})`,
      url: data.socials.codeforces,
      icon: <Code2 className="w-5 h-5" />,
      color: 'hover:text-cyan-400 hover:border-cyan-500/50'
    },
    {
      name: 'Instagram',
      handle: '@yashhhh.251',
      url: data.socials.instagram,
      icon: <Instagram className="w-5 h-5" />,
      color: 'hover:text-pink-400 hover:border-pink-500/50'
    }
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#070b16]/80 backdrop-blur-[2px]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 space-y-3 text-left">
          <div className="text-xs font-semibold tracking-wider uppercase text-cyan-400">
            Get in Touch
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-['Outfit']">
            Have an idea? Let's build something.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            I’m always open to discussing student projects, competitive programming practice, open-source collaborations, and software engineering opportunities.
          </p>
        </div>

        {/* Split Grid: Social Channels & Direct Contact on Left, Interactive Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Contact Info & Socials (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Quick Email Card with Copy button */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Direct Email Channel
              </div>
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-sm font-mono text-slate-200 truncate">
                    {data.personal.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    handleCopyEmail();
                  }}
                  onMouseEnter={() => soundEffects.playHover()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors shrink-0 cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Prefer email? Click copy or use the form to generate an instant email draft directly to my inbox.
              </p>
            </div>

            {/* Social Grid */}
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Connect Online
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socialLinks.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => soundEffects.playHover()}
                    onClick={() => soundEffects.playClick()}
                    className={`p-4 rounded-xl glass-panel border border-slate-800 flex items-center justify-between group transition-all ${s.color}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-slate-400 group-hover:text-inherit transition-colors">
                        {s.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {s.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[120px]">
                          {s.handle}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability note */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 block mb-1">Timezone & Availability</span>
              Based in India (IST). Open to collaborative remote learning, developer internships, and technical challenges.
            </div>

          </div>

          {/* Right: Functional Message Form (lg:col-span-7) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-slate-800 shadow-2xl text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                <MessageSquare className="w-4 h-4" />
                <span>Send a Message</span>
              </div>
              <h3 className="text-xl font-bold text-white font-['Outfit'] mb-6">
                Start a Conversation
              </h3>

              {formSubmitted ? (
                <div className="p-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
                    <Check className="w-5 h-5 text-cyan-400" />
                    <span>Email Draft Prepared!</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Your email client has been launched with your message formatted to <strong className="text-white">{data.personal.email}</strong>. If your email client did not open automatically, you can also reach me directly at that address.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="mt-2 px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Your Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alex Chen"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs bg-slate-950 border ${errors.name ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-400'} text-white focus:outline-none transition-colors`}
                      />
                      {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Email Address <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. alex@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs bg-slate-950 border ${errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-400'} text-white focus:outline-none transition-colors`}
                      />
                      {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Project Collaboration / Student Opportunity"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Message <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs bg-slate-950 border ${errors.message ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-400'} text-white focus:outline-none transition-colors`}
                    />
                    {errors.message && <p className="text-[11px] text-rose-400 mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    onMouseEnter={() => soundEffects.playHover()}
                    onClick={() => soundEffects.playClick()}
                    className="w-full py-3.5 px-6 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-600/20 hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Yash</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
