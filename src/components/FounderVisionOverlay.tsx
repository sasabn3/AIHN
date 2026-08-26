import React from 'react';
import { motion } from 'motion/react';
import { AIHN_GENERAL_INFO } from '../data/projectsData';
import { sound } from '../utils/audioSynthesizer';
import { ShieldCheck, ArrowRight, UserCheck, Cpu, Orbit, Sparkles } from 'lucide-react';

interface FounderVisionOverlayProps {
  onClose: () => void;
  onPullBackUniverse: () => void;
}

export const FounderVisionOverlay: React.FC<FounderVisionOverlayProps> = ({
  onClose,
  onPullBackUniverse,
}) => {
  return (
    <div
      id="aihn-founder-vision-modal"
      className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-8 bg-[#020408]/90 backdrop-blur-2xl overflow-y-auto select-text"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-4xl w-full p-6 sm:p-10 rounded-2xl hud-border glow-box-subtle text-slate-100 space-y-8 my-auto max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="text-center space-y-3 border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-400/30 text-sky-400 text-xs font-mono-tech tracking-wider uppercase">
            <Orbit className="w-3.5 h-3.5" />
            <span>AIHN Ecosystem Architecture</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-widest text-slate-100 glow-text-gold">
            {AIHN_GENERAL_INFO.name}
          </h1>
          <p className="font-display text-sm sm:text-base tracking-[0.2em] text-slate-400 uppercase font-semibold">
            {AIHN_GENERAL_INFO.fullName}
          </p>
        </div>

        {/* The Core Paradigm Shift */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="text-xs font-mono-tech text-amber-400 uppercase tracking-wider font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>The Foundational Paradigm Shift</span>
          </div>
          <div className="space-y-2 font-mono-tech text-xs sm:text-sm">
            <div className="text-slate-500 line-through p-3 rounded-lg bg-slate-900/40">
              PREVIOUS PARADIGM: {AIHN_GENERAL_INFO.paradigmShift.old}
            </div>
            <div className="text-sky-300 font-bold p-3 rounded-lg bg-sky-950/40 border border-sky-400/30">
              AIHN PARADIGM: {AIHN_GENERAL_INFO.paradigmShift.new}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {AIHN_GENERAL_INFO.mission}
          </p>
        </div>

        {/* Human Oversight & Ethics */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="text-xs font-mono-tech text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Ethics, Governance & Human-in-the-Loop</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {AIHN_GENERAL_INFO.corePhilosophy}
          </p>
        </div>

        {/* Founder Section */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 space-y-4 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-400/40 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-amber-200">
                {AIHN_GENERAL_INFO.founder.name}
              </div>
              <div className="text-xs font-mono-tech text-slate-400 tracking-wider">
                {AIHN_GENERAL_INFO.founder.title}
              </div>
            </div>
          </div>

          <blockquote className="border-l-2 border-amber-400/60 pl-4 py-1 text-xs sm:text-sm italic text-slate-300 font-sans leading-relaxed">
            &ldquo;{AIHN_GENERAL_INFO.founder.statement}&rdquo;
          </blockquote>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playClick(400);
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl hud-border text-xs font-mono-tech text-slate-300 hover:text-slate-100 transition-colors cursor-pointer"
          >
            Back to Universe
          </button>

          <button
            id="founder-pullback-btn"
            onClick={() => {
              sound.playClick(800);
              onClose();
              onPullBackUniverse();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(234,179,8,0.3)] cursor-pointer"
          >
            <span>Pull Back & Reveal Entire Universe</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
