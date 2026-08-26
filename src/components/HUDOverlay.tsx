import React from 'react';
import { ProjectId, UniverseView } from '../types';
import { PROJECTS_DATA, AIHN_GENERAL_INFO } from '../data/projectsData';
import { sound } from '../utils/audioSynthesizer';
import {
  Volume2,
  VolumeX,
  Bot,
  Compass,
  Building2,
  Orbit,
  Sparkles,
  Maximize2,
  UserCheck,
  Cpu,
} from 'lucide-react';

interface HUDOverlayProps {
  currentView: UniverseView;
  activeProject: ProjectId | null;
  onSelectView: (view: UniverseView) => void;
  onSelectProject: (id: ProjectId) => void;
  onToggleAIChat: () => void;
  isAIMetaOpen: boolean;
  coreStateIndex: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  currentView,
  activeProject,
  onSelectView,
  onSelectProject,
  onToggleAIChat,
  isAIMetaOpen,
  coreStateIndex,
  isMuted,
  onToggleMute,
}) => {
  const coreStates = AIHN_GENERAL_INFO.coreStates;
  const currentCoreState = coreStates[coreStateIndex];

  const handleViewChange = (view: UniverseView) => {
    sound.playClick(500);
    onSelectView(view);
  };

  const handleProjectSelect = (pid: ProjectId) => {
    sound.playClick(600);
    onSelectProject(pid);
    onSelectView('project');
  };

  return (
    <div id="aihn-hud-overlay" className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* ========================================================= */}
      {/* TOP HUD BAR */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between w-full">
        {/* Brand identity */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            id="hud-brand-home-btn"
            onClick={() => handleViewChange('nexus')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-lg hud-border flex items-center justify-center group-hover:border-amber-400/50 transition-colors">
              <Cpu className="w-5 h-5 text-sky-400 group-hover:text-amber-300 transition-colors" />
            </div>
            <div>
              <div className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-slate-100 flex items-center gap-2">
                <span>AIHN</span>
                <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-500/30 text-sky-300">
                  NEXUS
                </span>
              </div>
              <div className="text-[10px] font-display tracking-[0.2em] text-slate-400 uppercase hidden sm:block">
                Artificial Intelligent Human Nexus
              </div>
            </div>
          </button>
        </div>

        {/* Center: Core Cognitive Phase Indicator */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full hud-border">
          <span className="text-[10px] font-mono-tech text-slate-500 uppercase tracking-widest mr-1">
            CORE SYNTHESIS:
          </span>
          {coreStates.map((st, idx) => {
            const isActive = idx === coreStateIndex;
            return (
              <div
                key={st.state}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono-tech transition-all duration-300 ${
                  isActive
                    ? 'bg-slate-800 border border-sky-400/40 text-slate-100 font-bold shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                    : 'text-slate-500 opacity-60'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-amber-400 animate-ping' : 'bg-slate-600'
                  }`}
                />
                <span>{st.state}</span>
              </div>
            );
          })}
        </div>

        {/* Right Action Cluster */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Audio toggle */}
          <button
            id="hud-mute-btn"
            onClick={onToggleMute}
            className="w-10 h-10 rounded-lg hud-border flex items-center justify-center text-slate-400 hover:text-slate-100 hover:border-slate-400 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Universe Ambient' : 'Mute Ambient'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
          </button>

          {/* Nexus Intelligence AI button */}
          <button
            id="hud-nexus-ai-btn"
            onClick={onToggleAIChat}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-display text-xs tracking-wider uppercase font-semibold transition-all duration-300 cursor-pointer ${
              isAIMetaOpen
                ? 'hud-border-active text-amber-300 shadow-[0_0_20px_rgba(234,179,8,0.25)]'
                : 'hud-border text-slate-200 hover:text-sky-300 hover:border-sky-400/50'
            }`}
          >
            <Bot className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>Nexus AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MIDDLE QUICK NAV STRIP */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between pointer-events-none">
        {/* Left: View Modes */}
        <div className="pointer-events-auto hidden lg:flex flex-col gap-2 p-2 rounded-xl hud-border">
          <button
            id="view-tower-btn"
            onClick={() => handleViewChange('tower')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono-tech text-left transition-colors cursor-pointer ${
              currentView === 'tower'
                ? 'bg-slate-800 text-amber-300 font-bold border border-amber-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>AIHN Tower</span>
          </button>

          <button
            id="view-nexus-btn"
            onClick={() => handleViewChange('nexus')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono-tech text-left transition-colors cursor-pointer ${
              currentView === 'nexus'
                ? 'bg-slate-800 text-sky-300 font-bold border border-sky-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>Living Nexus</span>
          </button>

          <button
            id="view-core-btn"
            onClick={() => handleViewChange('core')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono-tech text-left transition-colors cursor-pointer ${
              currentView === 'core'
                ? 'bg-slate-800 text-sky-300 font-bold border border-sky-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Nexus Core</span>
          </button>

          <button
            id="view-vision-btn"
            onClick={() => handleViewChange('vision')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono-tech text-left transition-colors cursor-pointer ${
              currentView === 'vision'
                ? 'bg-slate-800 text-amber-300 font-bold border border-amber-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Vision & Founder</span>
          </button>

          <button
            id="view-pullback-btn"
            onClick={() => handleViewChange('pullback')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono-tech text-left transition-colors cursor-pointer ${
              currentView === 'pullback'
                ? 'bg-slate-800 text-slate-100 font-bold border border-slate-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Universe View</span>
          </button>
        </div>

        {/* Right side helper info (if inside general view) */}
        {currentView === 'nexus' && (
          <div className="hidden md:block pointer-events-auto max-w-xs p-4 rounded-xl hud-border text-left">
            <div className="text-[10px] font-mono-tech text-amber-400 tracking-wider uppercase mb-1">
              ORBITAL EXPLORATION ACTIVE
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              Rotate in 3D by dragging canvas. Click any monument structure or use the navigation strip below to approach specialized intelligence environments.
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* BOTTOM HUD: 8 PROJECT MONUMENT SELECTOR */}
      {/* ========================================================= */}
      <div className="w-full flex flex-col items-center gap-2">
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-2xl hud-border overflow-x-auto max-w-full">
          {(Object.keys(PROJECTS_DATA) as ProjectId[]).map((pid) => {
            const p = PROJECTS_DATA[pid];
            const isActive = currentView === 'project' && activeProject === pid;

            return (
              <button
                key={pid}
                id={`hud-project-btn-${pid}`}
                onClick={() => handleProjectSelect(pid)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-display transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800/90 border border-sky-400/60 text-slate-100 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <span className="text-sm">{p.emblem}</span>
                <span className="font-bold tracking-wider">{p.acronym}</span>
              </button>
            );
          })}
        </div>

        {/* Footer info text */}
        <div className="text-[10px] font-mono-tech text-slate-500 tracking-widest uppercase hidden sm:block">
          AIHN ECOSYSTEM • 8 SPECIALIZED INTELLIGENCE PILLARS • HUMAN-IN-THE-LOOP GOVERNANCE
        </div>
      </div>
    </div>
  );
};
