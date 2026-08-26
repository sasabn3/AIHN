import React from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audioSynthesizer';
import { Orbit, RotateCcw } from 'lucide-react';

interface CosmicEndingOverlayProps {
  onReturnToHub: () => void;
}

export const CosmicEndingOverlay: React.FC<CosmicEndingOverlayProps> = ({ onReturnToHub }) => {
  return (
    <div
      id="cosmic-ending-panel"
      className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between items-center p-6 sm:p-12 text-center select-none"
    >
      {/* Top subtle badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full hud-border text-xs font-mono-tech text-slate-400"
      >
        <Orbit className="w-3.5 h-3.5 text-sky-400 animate-spin" />
        <span>AIHN TOTAL ECOSYSTEM SYNTHESIS</span>
      </motion.div>

      {/* Monumental Center Identity & 'WILL COME SOON' */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 1.2 }}
        className="space-y-6 max-w-2xl"
      >
        <h1 className="font-cinzel text-5xl sm:text-7xl lg:text-8xl font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 glow-text-gold">
          AIHN
        </h1>
        <p className="font-display text-sm sm:text-lg tracking-[0.35em] text-sky-300 font-semibold uppercase">
          Artificial Intelligent Human Nexus
        </p>

        <div className="pt-8 space-y-2">
          <div className="font-cinzel text-2xl sm:text-4xl font-bold tracking-[0.4em] text-amber-300 glow-text-gold uppercase">
            WILL COME SOON
          </div>
          <p className="font-mono-tech text-xs text-slate-400 tracking-widest uppercase">
            The Beginning of a New Cognitive Civilization
          </p>
        </div>
      </motion.div>

      {/* Bottom Re-enter Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="pointer-events-auto"
      >
        <button
          id="re-enter-hub-btn"
          onClick={() => {
            sound.playClick(500);
            onReturnToHub();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-full hud-border text-xs font-mono-tech text-slate-300 hover:text-sky-300 hover:border-sky-400/50 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Re-Enter Living Nexus Hub</span>
        </button>
      </motion.div>
    </div>
  );
};
