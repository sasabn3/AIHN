import { ProjectData, ProjectId } from '../types';

export const AIHN_GENERAL_INFO = {
  name: 'AIHN',
  fullName: 'Artificial Intelligent Human Nexus',
  tagline: 'Moving AI from Command-Response to Context-Aware Decision Support',
  paradigmShift: {
    old: 'USER → COMMAND → RESPONSE',
    new: 'CONTEXT → OBSERVATION → UNDERSTANDING → PREDICTION → DECISION SUPPORT',
  },
  mission:
    'AIHN is a conceptual ecosystem engineered to extend human capability, improve high-stakes decision-making, eliminate avoidable human error, and architect systems that fundamentally understand human and operational context.',
  corePhilosophy:
    'AIHN does not exist to replace humans. Human oversight, responsible stewardship, ethical boundaries, and human-in-the-loop governance are the bedrock of the entire nexus.',
  founder: {
    name: 'MOSTAFA',
    title: 'Founder & Concept Architect of AIHN',
    statement:
      'The true purpose of artificial intelligence is not autonomy at the expense of humanity, but the amplification of human wisdom, foresight, and ethical clarity in an increasingly complex universe.',
  },
  coreStates: [
    {
      state: 'OBSERVE',
      description: 'Continuous continuous multi-modal environmental and cognitive signal absorption.',
      accent: '#94a3b8',
    },
    {
      state: 'UNDERSTAND',
      description: 'Synthesizing context, systemic relationships, and historical causality.',
      accent: '#38bdf8',
    },
    {
      state: 'PREDICT',
      description: 'Simulating cascading consequence vectors across parallel branching futures.',
      accent: '#818cf8',
    },
    {
      state: 'DECIDE',
      description: 'Delivering precise, ethically grounded decision support to human leaders.',
      accent: '#eab308',
    },
  ],
};

export const PROJECTS_DATA: Record<ProjectId, ProjectData> = {
  matx: {
    id: 'matx',
    name: 'MATX',
    acronym: 'MATX',
    subtitle: 'Mind Adaptive Thinking eXecutor',
    tagline: 'Living Cognitive Architecture for Personal Human Thinking',
    emblem: '🧠',
    accentColor: '#38bdf8',
    lightColorHex: 0x38bdf8,
    worldAtmosphere: 'Deep obsidian void illuminated by crystalline neural synapses and fluid cognitive currents.',
    description:
      'A cognitive companion engineered to understand how a specific person thinks, reasons, and adapts under varying real-world conditions.',
    problemAddressed:
      'Standard AI treats every user query as an isolated, transactional command without understanding personal cognitive load, reasoning patterns, or unique mental workflows.',
    conceptualMechanism:
      'MATX constructs a continuous contextual reasoning topology. It adapts to individual mental friction, predicts decision fatigue, and offers tailored cognitive scaffolding tailored to how the human mind operates.',
    whyItMatters:
      'Augments individual human intellect without enforcing rigid machine templates, preserving human intuition while reducing cognitive overload.',
    ecosystemConnection:
      'Feeds personal cognitive context into AIHN-SIM for scenario stress testing and coordinates with AIHN-EDU for personalized knowledge mastery.',
    keyPillars: [
      'Behavioral Pattern Synthesis',
      'Contextual Adaptive Scaffolding',
      'Personal Reasoning Modeling',
      'Cognitive Fatigue Mitigation',
    ],
    simulationLabel: 'Cognitive Sync Stream',
    simulationDescription:
      'Real-time adaptation matrix mapping thought frequency, contextual bandwidth, and decision clarity.',
  },

  sim: {
    id: 'sim',
    name: 'AIHN-SIM',
    acronym: 'SIM',
    subtitle: 'Cognitive Simulation System',
    tagline: 'Branching Multiverse Probability & Consequence Simulator',
    emblem: '⎇',
    accentColor: '#a855f7',
    lightColorHex: 0xa855f7,
    worldAtmosphere: 'Luminescent quantum branching manifolds with glowing timelines suspended in dimensional space.',
    description:
      'A high-fidelity simulation engine designed to compute parallel decisions and possible second- and third-order consequences before real-world commitment.',
    problemAddressed:
      'High-stakes decisions in medicine, governance, and strategy are often made under irreversible pressure with incomplete awareness of cascading systemic ramifications.',
    conceptualMechanism:
      'Constructs multi-branch scenario topologies, introducing probabilistic stressors, resource bottlenecks, and human behavioral dynamics to map consequence trajectories.',
    whyItMatters:
      'Transforms decision-making from reactive guesswork into proactive, thoroughly simulated foresight, drastically reducing catastrophic avoidable errors.',
    ecosystemConnection:
      'Provides predictive scenario graphs to AIHN-DEF, AIHN-SPACE, and AIHN-MED for clinical, tactical, and mission simulations.',
    keyPillars: [
      'Parallel Consequence Topologies',
      'High-Pressure Decision Stressors',
      'Non-Linear Risk Forecasting',
      'Multi-Variable Outcome Tree Analysis',
    ],
    simulationLabel: 'Quantum Timeline Divergence',
    simulationDescription:
      'Visualizing 16 concurrent consequence trajectories across risk thresholds and systemic stability vectors.',
  },

  med: {
    id: 'med',
    name: 'AIHN-MED',
    acronym: 'MED',
    subtitle: 'Medical Cognitive Assistant',
    tagline: 'Scientific Cognitive Partner for Clinical Decision Synthesis',
    emblem: '⚕',
    accentColor: '#10b981',
    lightColorHex: 0x10b981,
    worldAtmosphere: 'Organic-synthetic crystalline double helix surrounded by vascular data conduits and physiological resonance.',
    description:
      'A conceptual clinical intelligence designed to support physicians by synthesizing physiological signals, longitudinal symptoms, lifestyle context, and clinical reasoning.',
    problemAddressed:
      'Modern physicians are overwhelmed by fragmented medical records, disjointed biomarker streams, and time compression, risking diagnostic oversight.',
    conceptualMechanism:
      'Acts as a cognitive co-pilot (strictly NOT an autonomous doctor). It connects subtle anomalies across bodily systems, highlighting diagnostic blind spots for physician verification.',
    whyItMatters:
      'Empowers healthcare professionals with deep contextual diagnostic clarity, improving patient outcomes while keeping clinical authority firmly with the physician.',
    ecosystemConnection:
      'Draws biological sensory data from AIHN-V and leverages AIHN-SIM to model patient disease progression under alternative treatment protocols.',
    keyPillars: [
      'Physiological Signal Synthesis',
      'Longitudinal Symptom Correlation',
      'Clinical Reasoning Support',
      'Physician-Centric Oversight Matrix',
    ],
    simulationLabel: 'Vascular Diagnostic Lattice',
    simulationDescription:
      'Harmonizing multi-channel cardiac, metabolic, and neural telemetry into coherent clinical insight vectors.',
  },

  v: {
    id: 'v',
    name: 'AIHN-V',
    acronym: 'VISION',
    subtitle: 'Vision Intelligence System',
    tagline: 'Spatial Reality Comprehension & Environmental Dynamics',
    emblem: '◎',
    accentColor: '#06b6d4',
    lightColorHex: 0x06b6d4,
    worldAtmosphere: 'Volumetric LiDAR point-cloud chamber with dynamic wireframe geometry and spatial trajectory vectors.',
    description:
      'A spatial intelligence system designed to deeply understand environments rather than simply classify isolated objects. Principle: Seeing is not the same as understanding.',
    problemAddressed:
      'Traditional computer vision detects 2D bounding boxes without understanding spatial depth, environmental physics, human intent, or impending hazards.',
    conceptualMechanism:
      'Performs holistic volumetric reconstruction, calculating kinetic trajectories, contextual intent, environmental risks, and spatial relationships in 3D spacetime.',
    whyItMatters:
      'Enables machines and operators to comprehend full situational awareness in complex urban, industrial, and extreme environments.',
    ecosystemConnection:
      'Supplies spatial topology to AIHN-SPACE for orbital docking and AIHN-DEF for situational risk assessment.',
    keyPillars: [
      'Spatial Topology Reconstruction',
      'Kinetic Trajectory Modeling',
      'Contextual Hazard Anticipation',
      'Human Activity Dynamics',
    ],
    simulationLabel: 'Volumetric LiDAR Field',
    simulationDescription:
      'Real-time point-cloud ray-tracing measuring spatial velocity, occlusion depth, and proximity gradients.',
  },

  def: {
    id: 'def',
    name: 'AIHN-DEF',
    acronym: 'DEF',
    subtitle: 'Defense Cognitive System',
    tagline: 'Strategic Intelligence Focused on Risk Reduction & De-Escalation',
    emblem: '🛡',
    accentColor: '#f59e0b',
    lightColorHex: 0xf59e0b,
    worldAtmosphere: 'Monumental geometric bastion of dark alloy with dynamic kinetic baffles and golden protective geometry.',
    description:
      'A conceptual strategic intelligence system focused on risk reduction, conflict analysis, systemic stabilization, and active de-escalation.',
    problemAddressed:
      'Escalating geopolitics and fast-paced operational crises frequently lead to unintended escalation, civilian harm, and catastrophic miscalculations.',
    conceptualMechanism:
      'Strictly NOT a weapon or autonomous lethal system. Philosophy: Intelligence that prevents harm. Analyzes multi-dimensional conflict matrices to identify non-violent off-ramps.',
    whyItMatters:
      'Provides strategic commanders with objective, crisis-dampening decision support designed to de-escalate confrontations before kinetic engagement occurs.',
    ecosystemConnection:
      'Operates under strict governance protocols enforced by AIHN-GOV and receives simulation branches from AIHN-SIM.',
    keyPillars: [
      'Conflict Vector Analysis',
      'Systemic De-Escalation Pathways',
      'Harm Minimization Algorithms',
      'Strategic Stability Assurance',
    ],
    simulationLabel: 'De-Escalation Shield Grid',
    simulationDescription:
      'Evaluating threat dissipation corridors and multi-stakeholder equilibrium thresholds.',
  },

  space: {
    id: 'space',
    name: 'AIHN-SPACE',
    acronym: 'SPACE',
    subtitle: 'Autonomous Space Intelligence',
    tagline: 'Deep-Space Autonomy for Latency-Constrained Cosmic Exploration',
    emblem: '🪐',
    accentColor: '#6366f1',
    lightColorHex: 0x6366f1,
    worldAtmosphere: 'Vast cosmic panorama with colossal orbital rings, distant exoplanets, nebulae, and stellar trajectory lines.',
    description:
      'An autonomous intelligence system engineered for extreme space environments where communication latency with Earth makes real-time human control impossible.',
    problemAddressed:
      'Interplanetary missions face signal delays of minutes to hours, leaving spacecraft and planetary habitats vulnerable during critical maneuvers or hardware failures.',
    conceptualMechanism:
      'Operates with self-governing local autonomy: manages orbital mechanics, dynamic power triage, autonomous trajectory corrections, and habitat life-support balance.',
    whyItMatters:
      'Ensures humanity can safely push the frontiers of solar and deep-space exploration without catastrophic dependency on instantaneous Earth communications.',
    ecosystemConnection:
      'Uses AIHN-V for orbital rendezvous and celestial navigation, while relying on AIHN-SIM for multi-day mission contingency modeling.',
    keyPillars: [
      'Communication Delay Autonomy',
      'Orbital Mechanics Optimization',
      'Extreme Isolation Triage',
      'Deep-Space Habitation Support',
    ],
    simulationLabel: 'Relativistic Orbital Orbit',
    simulationDescription:
      'Autonomous orbital insertion calculations under 42-minute light-speed communication latency.',
  },

  edu: {
    id: 'edu',
    name: 'AIHN-EDU',
    acronym: 'EDU',
    subtitle: 'Adaptive Education Intelligence',
    tagline: 'Multidimensional Epistemological Scaffolding for Human Mastery',
    emblem: '✦',
    accentColor: '#ec4899',
    lightColorHex: 0xec4899,
    worldAtmosphere: 'Multidimensional floating tessellated knowledge library of glowing geometric polyhedra.',
    description:
      'An adaptive education system designed to reverse-engineer how an individual student uniquely learns, grasps abstract concepts, and discovers latent strengths.',
    problemAddressed:
      'Standardized industrial education forces uniform pacing and rote memorization, failing diverse learning styles and creating intellectual disengagement.',
    conceptualMechanism:
      'Builds multi-layered epistemological knowledge graphs, dynamically re-structuring explanations, analogies, and pacing to match the student’s intuitive reasoning framework.',
    whyItMatters:
      'Transforms learning into an inspiring, deeply personalized journey of genuine comprehension rather than superficial test preparation.',
    ecosystemConnection:
      'Interacts with MATX to align pedagogical pacing with the learner’s cognitive rhythm and focus states.',
    keyPillars: [
      'Epistemological Graph Mapping',
      'Comprehension over Memorization',
      'Personalized Analogical Translation',
      'Latent Strength Discovery',
    ],
    simulationLabel: 'Polyhedral Knowledge Matrix',
    simulationDescription:
      'Deconstructing complex quantum mechanics principles into intuitive, interconnected topological nodes.',
  },

  gov: {
    id: 'gov',
    name: 'AIHN-GOV',
    acronym: 'GOV',
    subtitle: 'AI Governance & Ethics System',
    tagline: 'Monumental Ethical Citadel Enforcing Ecosystem Boundaries',
    emblem: '⚖',
    accentColor: '#eab308',
    lightColorHex: 0xeab308,
    worldAtmosphere: 'Colossal obsidian and titanium citadel with golden harmonic rings and immutable containment forcefields.',
    description:
      'The overarching governance and ethical boundary layer establishing non-negotiable constraints, transparency, and human oversight across all AIHN systems.',
    problemAddressed:
      'Unchecked autonomous AI systems risk misalignment, bias propagation, opaque black-box decisions, and catastrophic misuse without rigorous ethical guardrails.',
    conceptualMechanism:
      'Maintains cryptographic auditability, dynamic ethical verification, permission enforcement, and mandatory human sovereignty checkpoints at every operational layer.',
    whyItMatters:
      'Guarantees that the entire AIHN universe operates with uncompromising moral integrity, total auditability, and irrevocable human control.',
    ecosystemConnection:
      'Acts as the structural aegis wrapping around all 7 other systems; no system can execute an action without AIHN-GOV consensus verification.',
    keyPillars: [
      'Non-Negotiable Ethical Boundaries',
      'Immutable Cryptographic Auditability',
      'Human Sovereignty Checkpoints',
      'Systemic Misuse Prevention',
    ],
    simulationLabel: 'Ethical Constraint Consensus',
    simulationDescription:
      'Real-time verification of operational mandates against human rights, safety protocols, and governance standards.',
  },
};
