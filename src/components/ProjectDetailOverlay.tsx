import React from 'react';
import { motion } from 'motion/react';
import { ProjectId, UniverseView } from '../types';
import { PROJECTS_DATA } from '../data/projectsData';
import { sound } from '../utils/audioSynthesizer';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Layers,
  ShieldCheck,
  Sparkles,
  Cpu,
  Target,
  Workflow,
} from 'lucide-react';

interface ProjectDetailOverlayProps {
  projectId: ProjectId;
  onReturnToNexus: () => void;
  onSelectProject: (id: ProjectId) => void;
  isSimulationActive: boolean;
  onToggleSimulation: () => void;
}

export const ProjectDetailOverlay: React.FC<ProjectDetailOverlayProps> = ({
  projectId,
  onReturnToNexus,
  onSelectProject,
  isSimulationActive,
  onToggleSimulation,
}) => {
  const project = PROJECTS_DATA[projectId];
  const allProjectIds = Object.keys(PROJECTS_DATA) as ProjectId[];
  const currentIndex = allProjectIds.indexOf(projectId);
  const prevId = allProjectIds[(currentIndex - 1 + allProjectIds.length) % allProjectIds.length];
  const nextId = allProjectIds[(currentIndex + 1) % allProjectIds.length];

  const handleNext = () => {
    sound.playClick(600);
    onSelectProject(nextId);
  };

  const handlePrev = () => {
    sound.playClick(600);
    onSelectProject(prevId);
  };

  return (
    <div
      id="project-detail-panel"
      className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-8 select-none"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between pointer-events-auto">
        <button
          id="project-back-to-nexus-btn"
          onClick={() => {
            sound.playClick(400);
            onReturnToNexus();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl hud-border text-xs font-mono-tech text-slate-300 hover:text-sky-300 hover:border-sky-400/50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Nexus Hub</span>
        </button>

        {/* Project Cycle Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-xl hud-border flex items-center justify-center text-slate-400 hover:text-slate-100 hover:border-slate-400 transition-colors cursor-pointer"
            title="Previous System"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-3 py-1.5 rounded-xl hud-border text-[11px] font-mono-tech text-slate-400">
            SYSTEM {currentIndex + 1} OF 8
          </div>
          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-xl hud-border flex items-center justify-center text-slate-400 hover:text-slate-100 hover:border-slate-400 transition-colors cursor-pointer"
            title="Next System"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Bottom / Floating Project Dossier */}
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-auto max-w-4xl w-full mx-auto p-6 sm:p-8 rounded-2xl hud-border glow-box-subtle text-slate-100 max-h-[75vh] overflow-y-auto space-y-6 select-text"
      >
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-sky-400/40 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(56,189,248,0.2)]">
              {project.emblem}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wider text-slate-100">
                  {project.name}
                </h2>
                <span className="text-xs font-mono-tech px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-sky-400">
                  {project.subtitle}
                </span>
              </div>
              <p className="text-sm font-display text-slate-300 mt-1 font-semibold">
                {project.tagline}
              </p>
            </div>
          </div>

          {/* Interactive 3D Demonstration Mode Trigger */}
          <button
            id="toggle-project-simulation-btn"
            onClick={() => {
              sound.playClick(700);
              onToggleSimulation();
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              isSimulationActive
                ? 'bg-amber-500 text-slate-950 border border-amber-300 shadow-[0_0_25px_rgba(234,179,8,0.4)]'
                : 'bg-slate-900 border border-sky-400/40 text-sky-300 hover:border-amber-400 hover:text-amber-300'
            }`}
          >
            {isSimulationActive ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Simulation Streaming</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Demonstration</span>
              </>
            )}
          </button>
        </div>

        {/* Live Demonstration Feedback Banner if active */}
        {isSimulationActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs font-mono-tech text-amber-200 flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            <div>
              <span className="font-bold text-amber-300">{project.simulationLabel}: </span>
              <span>{project.simulationDescription}</span>
            </div>
          </motion.div>
        )}

        {/* Grid of Problem vs Mechanism */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Problem */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-rose-400 font-bold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              <span>The Problem Addressed</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {project.problemAddressed}
            </p>
          </div>

          {/* Mechanism */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-sky-400 font-bold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>Conceptual Architecture</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {project.conceptualMechanism}
            </p>
          </div>
        </div>

        {/* Why it Matters & Ecosystem Connection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Why It Matters</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {project.whyItMatters}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-emerald-400 font-bold uppercase tracking-wider">
              <Workflow className="w-3.5 h-3.5" />
              <span>Ecosystem Connection</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {project.ecosystemConnection}
            </p>
          </div>
        </div>

        {/* 4 Architectural Pillars */}
        <div>
          <div className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Core Pillars of {project.acronym}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {project.keyPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono-tech text-slate-200 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>{pillar}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
