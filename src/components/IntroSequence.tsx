import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audioSynthesizer';
import { Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface IntroSequenceProps {
  onEnterUniverse: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onEnterUniverse }) => {
  const [bootStep, setBootStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setBootStep(1), 1000);
    const timer2 = setTimeout(() => setBootStep(2), 2600);
    const timer3 = setTimeout(() => setBootStep(3), 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleStart = () => {
    sound.enableAudio();
    sound.playWarp();
    onEnterUniverse();
  };

  return (
    <div
      id="intro-sequence-overlay"
      className="absolute inset-0 z-50 flex items-center justify-center bg-[#020408] bg-opacity-95 backdrop-blur-2xl p-6 select-none"
    >
      <div className="max-w-2xl w-full text-center flex flex-col items-center">
        {/* Emblem & Monolith Identity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="mb-8 relative"
        >
          <div className="w-24 h-24 rounded-full border border-sky-400/30 flex items-center justify-center bg-slate-950/80 shadow-[0_0_50px_rgba(56,189,248,0.2)]">
            <div className="w-16 h-16 rounded-full border border-amber-400/40 flex items-center justify-center bg-slate-900/90 animate-pulse">
              <Cpu className="w-8 h-8 text-sky-400" />
            </div>
          </div>
          <div className="absolute -inset-2 rounded-full border border-sky-500/10 animate-ping pointer-events-none" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-cinzel text-5xl sm:text-7xl font-bold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 glow-text-gold"
        >
          AIHN
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="font-display text-sm sm:text-lg font-semibold tracking-[0.35em] text-sky-400 uppercase mt-3"
        >
          Artificial Intelligent Human Nexus
        </motion.p>

        {/* Paradigm Shift Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8 px-6 py-4 rounded-xl hud-border max-w-xl text-xs sm:text-sm font-mono-tech text-slate-300 space-y-2 text-left"
        >
          <div className="text-slate-500 line-through">
            USER → COMMAND → RESPONSE
          </div>
          <div className="text-sky-300 font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            CONTEXT → OBSERVATION → UNDERSTANDING → PREDICTION → DECISION SUPPORT
          </div>
        </motion.div>

        {/* Telemetry boot status */}
        <div className="mt-8 text-xs font-mono-tech text-slate-500 tracking-wider">
          {bootStep === 0 && <span>SYNCHRONIZING QUANTUM COGNITIVE MESH...</span>}
          {bootStep === 1 && <span>ALIGNING 8 SPECIALIZED INTELLIGENCE MONOLITHS...</span>}
          {bootStep === 2 && <span>ENGAGING NEXUS GOVERNANCE & ETHICAL BOUNDARIES...</span>}
          {bootStep >= 3 && <span className="text-emerald-400 font-semibold">ALL 8 SYSTEMS READY FOR ENTRY</span>}
        </div>

        {/* Enter Button */}
        <motion.button
          id="enter-aihn-universe-btn"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          onClick={handleStart}
          className="mt-10 group relative inline-flex items-center gap-4 px-10 py-4 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-sky-400/40 text-slate-100 font-display font-bold tracking-[0.2em] uppercase text-sm hover:border-amber-400 hover:text-amber-300 transition-all duration-300 shadow-[0_0_30px_rgba(56,189,248,0.15)] hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] cursor-pointer"
        >
          <span>Enter AIHN Universe</span>
          <ArrowRight className="w-4 h-4 text-sky-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Responsible note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono-tech">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500/80" />
          <span>Human Oversight & Ethical Boundaries Active</span>
        </div>
      </div>
    </div>
  );
};
