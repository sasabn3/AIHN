import React, { useState, useEffect } from 'react';
import { ProjectId, UniverseView, AICommand } from './types';
import { ThreeCanvas } from './components/ThreeCanvas';
import { IntroSequence } from './components/IntroSequence';
import { HUDOverlay } from './components/HUDOverlay';
import { NexusIntelligenceModal } from './components/NexusIntelligenceModal';
import { ProjectDetailOverlay } from './components/ProjectDetailOverlay';
import { FounderVisionOverlay } from './components/FounderVisionOverlay';
import { CosmicEndingOverlay } from './components/CosmicEndingOverlay';
import { sound } from './utils/audioSynthesizer';

export default function App() {
  const [currentView, setCurrentView] = useState<UniverseView>('intro');
  const [activeProject, setActiveProject] = useState<ProjectId | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [coreStateIndex, setCoreStateIndex] = useState(0);
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Automatic Living Core Cognitive cycle (OBSERVE -> UNDERSTAND -> PREDICT -> DECIDE)
  useEffect(() => {
    const interval = setInterval(() => {
      setCoreStateIndex((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleEnterUniverse = () => {
    setCurrentView('tower');
    // Subtle transition to nexus after tower reveal
    setTimeout(() => {
      setCurrentView('nexus');
    }, 4000);
  };

  const handleSelectView = (view: UniverseView) => {
    if (view === 'vision') {
      setIsVisionModalOpen(true);
      setCurrentView('vision');
    } else {
      setIsVisionModalOpen(false);
      setCurrentView(view);
      if (view !== 'project') {
        setActiveProject(null);
        setIsSimulationActive(false);
      }
    }
  };

  const handleSelectProject = (id: ProjectId) => {
    setActiveProject(id);
    setCurrentView('project');
    setIsVisionModalOpen(false);
  };

  const handleReturnToNexus = () => {
    setCurrentView('nexus');
    setActiveProject(null);
    setIsSimulationActive(false);
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    sound.setMuted(nextMute);
  };

  // Safe allowlisted AI command execution
  const handleExecuteAICommand = (command: AICommand) => {
    if (!command || !command.action) return;

    switch (command.action) {
      case 'OPEN_PROJECT':
        if (command.targetId) {
          handleSelectProject(command.targetId);
        }
        break;
      case 'RETURN_TO_NEXUS':
        handleReturnToNexus();
        break;
      case 'FOCUS_ON_TOWER':
        setCurrentView('tower');
        setActiveProject(null);
        break;
      case 'FOCUS_ON_CORE':
        setCurrentView('core');
        setActiveProject(null);
        break;
      case 'OPEN_MAP':
        setIsVisionModalOpen(true);
        setCurrentView('vision');
        break;
      case 'SHOW_PROJECT_DEMONSTRATION':
        if (command.targetId) {
          handleSelectProject(command.targetId);
        }
        setIsSimulationActive(true);
        break;
      case 'PULL_BACK_UNIVERSE':
        setCurrentView('pullback');
        setActiveProject(null);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020408] font-sans">
      {/* Background Radial Vignette */}
      <div className="radial-vignette absolute inset-0 z-10" />

      {/* 3D Universe Canvas */}
      <ThreeCanvas
        currentView={currentView}
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        onSelectView={handleSelectView}
        coreStateIndex={coreStateIndex}
        isSimulationActive={isSimulationActive}
      />

      {/* Intro Sequence (Phase 0) */}
      {currentView === 'intro' && (
        <IntroSequence onEnterUniverse={handleEnterUniverse} />
      )}

      {/* Primary HUD Overlay (active across views) */}
      {currentView !== 'intro' && (
        <HUDOverlay
          currentView={currentView}
          activeProject={activeProject}
          onSelectView={handleSelectView}
          onSelectProject={handleSelectProject}
          onToggleAIChat={() => setIsAIChatOpen((prev) => !prev)}
          isAIMetaOpen={isAIChatOpen}
          coreStateIndex={coreStateIndex}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Project Dossier Overlay (when inspecting one of the 8 systems) */}
      {currentView === 'project' && activeProject && (
        <ProjectDetailOverlay
          projectId={activeProject}
          onReturnToNexus={handleReturnToNexus}
          onSelectProject={handleSelectProject}
          isSimulationActive={isSimulationActive}
          onToggleSimulation={() => setIsSimulationActive((prev) => !prev)}
        />
      )}

      {/* Founder & Ecosystem Vision Overlay */}
      {isVisionModalOpen && (
        <FounderVisionOverlay
          onClose={() => {
            setIsVisionModalOpen(false);
            setCurrentView('nexus');
          }}
          onPullBackUniverse={() => {
            setIsVisionModalOpen(false);
            setCurrentView('pullback');
          }}
        />
      )}

      {/* Cosmic Pull-back Finale ('WILL COME SOON') */}
      {currentView === 'pullback' && (
        <CosmicEndingOverlay onReturnToHub={handleReturnToNexus} />
      )}

      {/* Nexus Intelligence Real AI Assistant */}
      <NexusIntelligenceModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        currentView={currentView}
        activeProject={activeProject}
        onExecuteCommand={handleExecuteAICommand}
      />
    </div>
  );
}
