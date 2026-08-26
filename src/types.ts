export type UniverseView =
  | 'intro'
  | 'tower'
  | 'nexus'
  | 'core'
  | 'project'
  | 'vision'
  | 'pullback';

export type ProjectId =
  | 'matx'
  | 'sim'
  | 'med'
  | 'v'
  | 'def'
  | 'space'
  | 'edu'
  | 'gov';

export type CoreState = 'OBSERVE' | 'UNDERSTAND' | 'PREDICT' | 'DECIDE';

export interface ProjectData {
  id: ProjectId;
  name: string;
  acronym: string;
  subtitle: string;
  tagline: string;
  emblem: string; // SVG or symbolic representation
  accentColor: string;
  lightColorHex: number;
  description: string;
  problemAddressed: string;
  conceptualMechanism: string;
  whyItMatters: string;
  ecosystemConnection: string;
  keyPillars: string[];
  simulationLabel: string;
  simulationDescription: string;
  worldAtmosphere: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  command?: AICommand | null;
}

export interface AICommand {
  action:
    | 'OPEN_PROJECT'
    | 'RETURN_TO_NEXUS'
    | 'FOCUS_ON_TOWER'
    | 'FOCUS_ON_CORE'
    | 'OPEN_MAP'
    | 'SHOW_PROJECT_DEMONSTRATION'
    | 'PULL_BACK_UNIVERSE'
    | null;
  targetId?: ProjectId | null;
  highlightReason?: string;
}

export interface CameraTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov?: number;
  duration?: number;
}
