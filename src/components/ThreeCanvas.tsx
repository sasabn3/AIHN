import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ProjectId, UniverseView } from '../types';
import { PROJECTS_DATA, AIHN_GENERAL_INFO } from '../data/projectsData';
import { sound } from '../utils/audioSynthesizer';

interface ThreeCanvasProps {
  currentView: UniverseView;
  activeProject: ProjectId | null;
  onSelectProject: (id: ProjectId) => void;
  onSelectView: (view: UniverseView) => void;
  coreStateIndex: number;
  isSimulationActive: boolean;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  currentView,
  activeProject,
  onSelectProject,
  onSelectView,
  coreStateIndex,
  isSimulationActive,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Targets for smooth camera lerp
  const targetCamPos = useRef(new THREE.Vector3(0, 40, 220));
  const targetCamLook = useRef(new THREE.Vector3(0, 0, 0));
  const currentCamLook = useRef(new THREE.Vector3(0, 0, 0));

  // Interactive mouse offset for parallax
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });

  // Raycaster for 3D clicks
  const raycaster = useRef(new THREE.Raycaster());
  const mousePointer = useRef(new THREE.Vector2());
  const projectMeshes = useRef<Map<ProjectId, THREE.Object3D>>(new Map());
  const hoveredProject = useRef<ProjectId | null>(null);

  // Animated elements references
  const coreObjects = useRef<{
    nucleus: THREE.Mesh;
    innerRing: THREE.Group;
    middleRing: THREE.Group;
    outerRing: THREE.Group;
    floatingPlates: THREE.Group;
    filaments: THREE.LineSegments;
    beaconLight: THREE.PointLight;
  } | null>(null);

  const towerGroup = useRef<THREE.Group | null>(null);
  const projectGroups = useRef<Map<ProjectId, THREE.Group>>(new Map());
  const conduitLines = useRef<THREE.LineSegments | null>(null);
  const particleSystem = useRef<THREE.Points | null>(null);

  // Update camera targets based on view & active project
  useEffect(() => {
    sound.playWarp();

    if (currentView === 'intro') {
      targetCamPos.current.set(0, -50, 450);
      targetCamLook.current.set(0, 50, -350);
    } else if (currentView === 'tower') {
      targetCamPos.current.set(0, 160, -180);
      targetCamLook.current.set(0, 130, -350);
    } else if (currentView === 'core') {
      targetCamPos.current.set(0, 15, 45);
      targetCamLook.current.set(0, 0, 0);
    } else if (currentView === 'nexus') {
      targetCamPos.current.set(0, 80, 260);
      targetCamLook.current.set(0, 0, 0);
    } else if (currentView === 'vision') {
      targetCamPos.current.set(120, 140, 320);
      targetCamLook.current.set(0, 30, -50);
    } else if (currentView === 'pullback') {
      targetCamPos.current.set(0, 320, 750);
      targetCamLook.current.set(0, 20, -100);
    } else if (currentView === 'project' && activeProject) {
      const posMap: Record<ProjectId, { cam: [number, number, number]; look: [number, number, number] }> = {
        matx: { cam: [-130, 45, -70], look: [-160, 40, -100] },
        sim: { cam: [-80, 75, -145], look: [-100, 70, -180] },
        med: { cam: [80, 65, -145], look: [100, 60, -180] },
        v: { cam: [140, 35, -60], look: [170, 30, -90] },
        def: { cam: [130, -40, 80], look: [160, -50, 110] },
        space: { cam: [65, 115, 115], look: [90, 110, 150] },
        edu: { cam: [-85, -50, 100], look: [-110, -60, 130] },
        gov: { cam: [-135, -20, 20], look: [-170, -30, 0] },
      };
      const target = posMap[activeProject];
      if (target) {
        targetCamPos.current.set(...target.cam);
        targetCamLook.current.set(...target.look);
      }
    }
  }, [currentView, activeProject]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x020408, 0.0018);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      3500
    );
    camera.position.set(0, -30, 400);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // ==========================================
    // 1. LIGHTING
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe2e8f0, 2.0);
    dirLight1.position.set(150, 300, 200);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.0);
    dirLight2.position.set(-200, -100, -150);
    scene.add(dirLight2);

    // ==========================================
    // 2. COSMIC STARFIELD & NEBULA PARTICLES
    // ==========================================
    const starCount = 4500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 600 + Math.random() * 1400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const colorVariance = Math.random();
      if (colorVariance > 0.85) {
        // Gold / Amber
        starColors[i * 3] = 0.95;
        starColors[i * 3 + 1] = 0.8;
        starColors[i * 3 + 2] = 0.4;
      } else if (colorVariance > 0.65) {
        // Cyan / Blue
        starColors[i * 3] = 0.4;
        starColors[i * 3 + 1] = 0.75;
        starColors[i * 3 + 2] = 0.98;
      } else {
        // Crisp Titanium White
        starColors[i * 3] = 0.85;
        starColors[i * 3 + 1] = 0.9;
        starColors[i * 3 + 2] = 0.95;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    particleSystem.current = stars;

    // ==========================================
    // 3. AIHN HEADQUARTERS TOWER (MEGASTRUCTURE)
    // ==========================================
    const tower = new THREE.Group();
    tower.position.set(0, 0, -350);

    // Dark Titanium & Obsidian Materials
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x070b14,
      roughness: 0.15,
      metalness: 0.95,
    });
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.85,
    });
    const crystalSpineMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      emissive: 0xca8a04,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.2,
    });

    // Central Spire
    const spireGeo = new THREE.CylinderGeometry(4, 18, 260, 8);
    const spire = new THREE.Mesh(spireGeo, obsidianMat);
    spire.position.y = 130;
    tower.add(spire);

    // Crystalline Spine Core
    const crystalCoreGeo = new THREE.CylinderGeometry(1.5, 3, 280, 6);
    const crystalCore = new THREE.Mesh(crystalCoreGeo, crystalSpineMat);
    crystalCore.position.y = 140;
    tower.add(crystalCore);

    // Architectural Buttress Wings (4 flanking chevrons)
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const buttressGeo = new THREE.BoxGeometry(6, 180, 24);
      const buttress = new THREE.Mesh(buttressGeo, titaniumMat);
      buttress.position.x = Math.cos(angle) * 26;
      buttress.position.z = Math.sin(angle) * 26;
      buttress.position.y = 90;
      buttress.rotation.y = angle;
      buttress.rotation.z = (Math.cos(angle) * 0.08);
      tower.add(buttress);

      // Accent gold light strip
      const stripGeo = new THREE.BoxGeometry(0.8, 160, 1.5);
      const strip = new THREE.Mesh(stripGeo, goldAccentMat);
      strip.position.x = Math.cos(angle) * 38;
      strip.position.z = Math.sin(angle) * 38;
      strip.position.y = 90;
      strip.rotation.y = angle;
      tower.add(strip);
    }

    // Crown Halo Rings
    const crownRingGeo = new THREE.TorusGeometry(32, 1.2, 16, 64);
    const crownRing = new THREE.Mesh(crownRingGeo, goldAccentMat);
    crownRing.position.y = 230;
    crownRing.rotation.x = Math.PI / 2;
    tower.add(crownRing);

    const crownRingGeo2 = new THREE.TorusGeometry(42, 0.8, 16, 64);
    const crownRing2 = new THREE.Mesh(crownRingGeo2, crystalSpineMat);
    crownRing2.position.y = 215;
    crownRing2.rotation.x = Math.PI / 2;
    tower.add(crownRing2);

    // Tower Foundation Pedestal
    const baseGeo = new THREE.CylinderGeometry(60, 90, 40, 8);
    const base = new THREE.Mesh(baseGeo, obsidianMat);
    base.position.y = -20;
    tower.add(base);

    // Vertical Skyward Searchlight
    const beaconLight = new THREE.PointLight(0x38bdf8, 8, 400);
    beaconLight.position.set(0, 270, 0);
    tower.add(beaconLight);

    scene.add(tower);
    towerGroup.current = tower;

    // ==========================================
    // 4. THE LIVING NEXUS CORE
    // ==========================================
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, 0);

    // Central Nucleus: Nested Icosahedron
    const nucleusGeo = new THREE.IcosahedronGeometry(12, 2);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(nucleus);

    // Nucleus Wireframe Lattice
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const wireMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(13.5, 2), wireMat);
    coreGroup.add(wireMesh);

    // Three Multi-Layer Gimbal Counter-Rotating Rings
    const innerRingGroup = new THREE.Group();
    const ringGeo1 = new THREE.TorusGeometry(22, 1.2, 16, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.95, roughness: 0.2 });
    const meshRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    innerRingGroup.add(meshRing1);
    coreGroup.add(innerRingGroup);

    const middleRingGroup = new THREE.Group();
    const ringGeo2 = new THREE.TorusGeometry(32, 1.6, 16, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.15 });
    const meshRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    middleRingGroup.add(meshRing2);
    coreGroup.add(middleRingGroup);

    const outerRingGroup = new THREE.Group();
    const ringGeo3 = new THREE.TorusGeometry(44, 2.0, 16, 64);
    const ringMat3 = new THREE.MeshStandardMaterial({ color: 0xeab308, emissive: 0x854d0e, emissiveIntensity: 0.3, metalness: 0.95, roughness: 0.25 });
    const meshRing3 = new THREE.Mesh(ringGeo3, ringMat3);
    outerRingGroup.add(meshRing3);
    coreGroup.add(outerRingGroup);

    // Floating Geometric Orbital Plates
    const platesGroup = new THREE.Group();
    const plateGeo = new THREE.BoxGeometry(4, 1.2, 8);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.position.set(Math.cos(angle) * 52, Math.sin(i) * 6, Math.sin(angle) * 52);
      plate.rotation.y = -angle;
      plate.rotation.z = 0.2;
      platesGroup.add(plate);
    }
    coreGroup.add(platesGroup);

    // Neural Energy Filaments (spline lines)
    const filamentPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 60; i++) {
      const p1 = new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16
      );
      const p2 = new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60
      );
      filamentPoints.push(p1, p2);
    }
    const filamentGeo = new THREE.BufferGeometry().setFromPoints(filamentPoints);
    const filamentMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    const filaments = new THREE.LineSegments(filamentGeo, filamentMat);
    coreGroup.add(filaments);

    // Core Point Light
    const coreLight = new THREE.PointLight(0x38bdf8, 5, 250);
    coreGroup.add(coreLight);

    scene.add(coreGroup);
    coreObjects.current = {
      nucleus,
      innerRing: innerRingGroup,
      middleRing: middleRingGroup,
      outerRing: outerRingGroup,
      floatingPlates: platesGroup,
      filaments,
      beaconLight: coreLight,
    };

    // ==========================================
    // 5. THE 8 UNIQUE MONUMENTAL PROJECT STRUCTURES
    // ==========================================
    const projectPositions: Record<ProjectId, [number, number, number]> = {
      matx: [-160, 40, -100],
      sim: [-100, 70, -180],
      med: [100, 60, -180],
      v: [170, 30, -90],
      def: [160, -50, 110],
      space: [90, 110, 150],
      edu: [-110, -60, 130],
      gov: [-170, -30, 0],
    };

    // Conduit lines connecting Core to each project
    const conduitCoords: number[] = [];

    (Object.keys(PROJECTS_DATA) as ProjectId[]).forEach((pid) => {
      const pData = PROJECTS_DATA[pid];
      const pos = projectPositions[pid];
      const pGroup = new THREE.Group();
      pGroup.position.set(...pos);

      // Add to conduits
      conduitCoords.push(0, 0, 0, pos[0], pos[1], pos[2]);

      // Base Beacon Light for Project
      const pLight = new THREE.PointLight(pData.lightColorHex, 3, 140);
      pGroup.add(pLight);

      // Construct UNIQUE 3D Geometry per project
      let interactiveTargetMesh: THREE.Object3D | null = null;

      if (pid === 'matx') {
        // MATX: Living Cognitive Neural Architecture
        const brainCluster = new THREE.Group();
        const matxCoreMat = new THREE.MeshStandardMaterial({
          color: 0x0c4a6e,
          emissive: 0x0284c7,
          emissiveIntensity: 0.7,
          roughness: 0.2,
          metalness: 0.8,
        });
        const centerOct = new THREE.Mesh(new THREE.OctahedronGeometry(9, 2), matxCoreMat);
        brainCluster.add(centerOct);
        interactiveTargetMesh = centerOct;

        // Synaptic filament web
        const synPoints: THREE.Vector3[] = [];
        for (let j = 0; j < 40; j++) {
          const v = new THREE.Vector3(
            (Math.random() - 0.5) * 28,
            (Math.random() - 0.5) * 28,
            (Math.random() - 0.5) * 28
          );
          synPoints.push(new THREE.Vector3(0, 0, 0), v);

          // Synapse node
          const synNode = new THREE.Mesh(
            new THREE.SphereGeometry(0.8, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
          );
          synNode.position.copy(v);
          brainCluster.add(synNode);
        }
        const synGeo = new THREE.BufferGeometry().setFromPoints(synPoints);
        const synLines = new THREE.LineSegments(
          synGeo,
          new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
        );
        brainCluster.add(synLines);

        pGroup.add(brainCluster);
      } else if (pid === 'sim') {
        // AIHN-SIM: Branching Quantum Probability Multiverse
        const simCluster = new THREE.Group();
        const simMat = new THREE.MeshStandardMaterial({
          color: 0x4c1d95,
          emissive: 0x9333ea,
          emissiveIntensity: 0.8,
          roughness: 0.15,
          metalness: 0.9,
        });
        const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(7, 2, 80, 16, 2, 3), simMat);
        simCluster.add(torusKnot);
        interactiveTargetMesh = torusKnot;

        // Branching timeline discs
        for (let k = 0; k < 5; k++) {
          const disc = new THREE.Mesh(
            new THREE.RingGeometry(10 + k * 3, 11 + k * 3, 32),
            new THREE.MeshBasicMaterial({
              color: 0xc084fc,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.35,
            })
          );
          disc.rotation.x = (k * Math.PI) / 6;
          disc.rotation.y = (k * Math.PI) / 4;
          simCluster.add(disc);
        }

        pGroup.add(simCluster);
      } else if (pid === 'med') {
        // AIHN-MED: Bio-Synthetic Crystalline Double Helix & Vascular Lattice
        const medCluster = new THREE.Group();
        const helixMat = new THREE.MeshStandardMaterial({
          color: 0x064e3b,
          emissive: 0x10b981,
          emissiveIntensity: 0.7,
          roughness: 0.2,
          metalness: 0.7,
        });

        // Double Helix strands
        const strandCount = 28;
        const radius = 6;
        const height = 24;
        for (let s = 0; s < strandCount; s++) {
          const t = (s / strandCount) * Math.PI * 4;
          const y = (s / strandCount) * height - height / 2;

          const n1 = new THREE.Mesh(new THREE.SphereGeometry(1.0, 12, 12), helixMat);
          n1.position.set(Math.cos(t) * radius, y, Math.sin(t) * radius);
          medCluster.add(n1);

          const n2 = new THREE.Mesh(new THREE.SphereGeometry(1.0, 12, 12), helixMat);
          n2.position.set(Math.cos(t + Math.PI) * radius, y, Math.sin(t + Math.PI) * radius);
          medCluster.add(n2);

          // Connecting base-pair bridge
          const bridgeGeo = new THREE.CylinderGeometry(0.25, 0.25, radius * 2, 8);
          const bridge = new THREE.Mesh(
            bridgeGeo,
            new THREE.MeshStandardMaterial({ color: 0x34d399, metalness: 0.8, roughness: 0.3 })
          );
          bridge.position.set(0, y, 0);
          bridge.rotation.z = Math.PI / 2;
          bridge.rotation.y = -t;
          medCluster.add(bridge);
        }

        interactiveTargetMesh = medCluster;
        pGroup.add(medCluster);
      } else if (pid === 'v') {
        // AIHN-V: Volumetric LiDAR Spatial Reconstruction Chamber
        const vCluster = new THREE.Group();
        const boxMat = new THREE.MeshBasicMaterial({
          color: 0x06b6d4,
          wireframe: true,
          transparent: true,
          opacity: 0.6,
        });
        const vCube = new THREE.Mesh(new THREE.BoxGeometry(16, 16, 16), boxMat);
        vCluster.add(vCube);
        interactiveTargetMesh = vCube;

        // Inner nested scanning tetrahedron
        const tetra = new THREE.Mesh(
          new THREE.TetrahedronGeometry(8),
          new THREE.MeshStandardMaterial({
            color: 0x083344,
            emissive: 0x06b6d4,
            emissiveIntensity: 0.8,
            metalness: 0.9,
            roughness: 0.2,
          })
        );
        vCluster.add(tetra);

        // Point cloud grid points
        const ptGeo = new THREE.BufferGeometry();
        const pts: number[] = [];
        for (let px = -6; px <= 6; px += 3) {
          for (let py = -6; py <= 6; py += 3) {
            for (let pz = -6; pz <= 6; pz += 3) {
              pts.push(px, py, pz);
            }
          }
        }
        ptGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        const ptsMesh = new THREE.Points(
          ptGeo,
          new THREE.PointsMaterial({ size: 1.2, color: 0x67e8f9 })
        );
        vCluster.add(ptsMesh);

        pGroup.add(vCluster);
      } else if (pid === 'def') {
        // AIHN-DEF: Monumental Crystalline Bastion & Kinetic Baffles
        const defCluster = new THREE.Group();
        const defMat = new THREE.MeshStandardMaterial({
          color: 0x1c1917,
          emissive: 0xd97706,
          emissiveIntensity: 0.5,
          metalness: 0.95,
          roughness: 0.15,
        });
        const bastionApex = new THREE.Mesh(new THREE.ConeGeometry(8, 20, 6), defMat);
        bastionApex.position.y = 2;
        defCluster.add(bastionApex);
        interactiveTargetMesh = bastionApex;

        // Interlocking shield plates
        for (let sh = 0; sh < 6; sh++) {
          const shAngle = (sh * Math.PI) / 3;
          const plate = new THREE.Mesh(
            new THREE.BoxGeometry(4, 12, 1.5),
            new THREE.MeshStandardMaterial({ color: 0x78350f, metalness: 0.9, roughness: 0.25 })
          );
          plate.position.set(Math.cos(shAngle) * 11, -2, Math.sin(shAngle) * 11);
          plate.rotation.y = -shAngle;
          defCluster.add(plate);
        }

        // Golden de-escalation harmonic ring
        const defRing = new THREE.Mesh(
          new THREE.TorusGeometry(15, 0.8, 16, 64),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xb45309, metalness: 0.9 })
        );
        defRing.rotation.x = Math.PI / 2;
        defCluster.add(defRing);

        pGroup.add(defCluster);
      } else if (pid === 'space') {
        // AIHN-SPACE: Monumental Orbital Ring Station & Celestial Body
        const spaceCluster = new THREE.Group();

        // Planetoid
        const planetGeo = new THREE.SphereGeometry(10, 32, 32);
        const planetMat = new THREE.MeshStandardMaterial({
          color: 0x1e1b4b,
          emissive: 0x312e81,
          emissiveIntensity: 0.4,
          roughness: 0.7,
          metalness: 0.2,
        });
        const planet = new THREE.Mesh(planetGeo, planetMat);
        spaceCluster.add(planet);
        interactiveTargetMesh = planet;

        // Orbital Ring System
        const ringSysGeo = new THREE.RingGeometry(15, 22, 48);
        const ringSysMat = new THREE.MeshBasicMaterial({
          color: 0x818cf8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const ringSys = new THREE.Mesh(ringSysGeo, ringSysMat);
        ringSys.rotation.x = Math.PI / 2.6;
        spaceCluster.add(ringSys);

        // Orbital Space Station Habitat
        const habRing = new THREE.Mesh(
          new THREE.TorusGeometry(18, 0.9, 16, 48),
          new THREE.MeshStandardMaterial({ color: 0xc7d2fe, metalness: 0.9, roughness: 0.2 })
        );
        habRing.rotation.x = Math.PI / 2.6;
        spaceCluster.add(habRing);

        pGroup.add(spaceCluster);
      } else if (pid === 'edu') {
        // AIHN-EDU: Multidimensional Polyhedral Knowledge Matrix
        const eduCluster = new THREE.Group();
        const eduMat = new THREE.MeshStandardMaterial({
          color: 0x500724,
          emissive: 0xdb2777,
          emissiveIntensity: 0.7,
          roughness: 0.2,
          metalness: 0.8,
        });
        const outerIcosa = new THREE.Mesh(new THREE.DodecahedronGeometry(8, 1), eduMat);
        eduCluster.add(outerIcosa);
        interactiveTargetMesh = outerIcosa;

        // Floating nested knowledge glyph polyhedra
        for (let g = 0; g < 8; g++) {
          const gAngle = (g / 8) * Math.PI * 2;
          const gNode = new THREE.Mesh(
            new THREE.TetrahedronGeometry(1.6),
            new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xbe185d, metalness: 0.8 })
          );
          gNode.position.set(Math.cos(gAngle) * 14, Math.sin(g * 2) * 4, Math.sin(gAngle) * 14);
          eduCluster.add(gNode);
        }

        pGroup.add(eduCluster);
      } else if (pid === 'gov') {
        // AIHN-GOV: Monumental Obsidian Citadel & Ethical Containment Field
        const govCluster = new THREE.Group();
        const citadelMat = new THREE.MeshStandardMaterial({
          color: 0x09090b,
          emissive: 0x713f12,
          emissiveIntensity: 0.4,
          metalness: 0.95,
          roughness: 0.1,
        });

        // 4 Monumental Pillar Columns
        for (let c = 0; c < 4; c++) {
          const cAngle = (c * Math.PI) / 2 + Math.PI / 4;
          const colGeo = new THREE.BoxGeometry(3, 24, 3);
          const col = new THREE.Mesh(colGeo, citadelMat);
          col.position.set(Math.cos(cAngle) * 10, 0, Math.sin(cAngle) * 10);
          govCluster.add(col);
        }

        // Central Ethical Core
        const coreSph = new THREE.Mesh(
          new THREE.SphereGeometry(4.5, 24, 24),
          new THREE.MeshStandardMaterial({
            color: 0xca8a04,
            emissive: 0xeab308,
            emissiveIntensity: 0.9,
            metalness: 0.95,
            roughness: 0.1,
          })
        );
        govCluster.add(coreSph);
        interactiveTargetMesh = coreSph;

        // Containment Barrier Field
        const barrierGeo = new THREE.TorusGeometry(13, 0.7, 16, 64);
        const barrierMat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          emissive: 0xa16207,
          metalness: 0.9,
        });
        const barrier = new THREE.Mesh(barrierGeo, barrierMat);
        barrier.rotation.x = Math.PI / 2;
        govCluster.add(barrier);

        pGroup.add(govCluster);
      }

      if (interactiveTargetMesh) {
        interactiveTargetMesh.userData = { projectId: pid };
        projectMeshes.current.set(pid, interactiveTargetMesh);
      }

      scene.add(pGroup);
      projectGroups.current.set(pid, pGroup);
    });

    // Conduit Line Network
    const conduitGeo = new THREE.BufferGeometry();
    conduitGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(conduitCoords, 3)
    );
    const conduitMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
    });
    const conduits = new THREE.LineSegments(conduitGeo, conduitMat);
    scene.add(conduits);
    conduitLines.current = conduits;

    // ==========================================
    // 6. EVENT LISTENERS
    // ==========================================
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mousePointer.current.set(x, y);
      mousePos.current.targetX = x * 25;
      mousePos.current.targetY = y * 15;

      if (isDragging.current) {
        dragOffset.current.x += (e.clientX - dragStart.current.x) * 0.05;
        dragOffset.current.y += (e.clientY - dragStart.current.y) * 0.05;
        dragStart.current = { x: e.clientX, y: e.clientY };
      }

      // Check raycast for hover
      raycaster.current.setFromCamera(mousePointer.current, camera);
      const meshes = Array.from(projectMeshes.current.values());
      const intersects = raycaster.current.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        const topHit = intersects[0].object;
        const pid = topHit.userData.projectId as ProjectId;
        if (pid && hoveredProject.current !== pid) {
          hoveredProject.current = pid;
          document.body.style.cursor = 'pointer';
          sound.playClick(600);
        }
      } else {
        if (hoveredProject.current !== null) {
          hoveredProject.current = null;
          document.body.style.cursor = 'default';
        }
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: MouseEvent) => {
      isDragging.current = false;

      // Click detection
      raycaster.current.setFromCamera(mousePointer.current, camera);
      const meshes = Array.from(projectMeshes.current.values());
      const intersects = raycaster.current.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        const pid = intersects[0].object.userData.projectId as ProjectId;
        if (pid) {
          onSelectProject(pid);
          onSelectView('project');
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);

    // ==========================================
    // 7. ANIMATION LOOP
    // ==========================================
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax lerp
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      // Smooth Camera LERP
      const lerpSpeed = 0.04;
      camera.position.x += (targetCamPos.current.x + mousePos.current.x * 0.5 + dragOffset.current.x - camera.position.x) * lerpSpeed;
      camera.position.y += (targetCamPos.current.y - mousePos.current.y * 0.5 + dragOffset.current.y - camera.position.y) * lerpSpeed;
      camera.position.z += (targetCamPos.current.z - camera.position.z) * lerpSpeed;

      currentCamLook.current.lerp(targetCamLook.current, lerpSpeed);
      camera.lookAt(currentCamLook.current);

      // Rotate Starfield slowly
      if (particleSystem.current) {
        particleSystem.current.rotation.y = elapsedTime * 0.015;
      }

      // Animate Living Nexus Core
      if (coreObjects.current) {
        const { nucleus, innerRing, middleRing, outerRing, floatingPlates, filaments, beaconLight } = coreObjects.current;

        nucleus.rotation.y = elapsedTime * 0.4;
        nucleus.rotation.x = elapsedTime * 0.2;

        innerRing.rotation.x = elapsedTime * 0.6;
        innerRing.rotation.y = elapsedTime * 0.3;

        middleRing.rotation.y = -elapsedTime * 0.45;
        middleRing.rotation.z = elapsedTime * 0.35;

        outerRing.rotation.z = elapsedTime * 0.3;
        outerRing.rotation.x = -elapsedTime * 0.2;

        floatingPlates.rotation.y = -elapsedTime * 0.25;

        filaments.rotation.y = elapsedTime * 0.15;

        // Pulse intensity based on simulation / core state
        const pulse = Math.sin(elapsedTime * 3) * 0.5 + 0.5;
        beaconLight.intensity = 4 + pulse * 3 + (isSimulationActive ? 4 : 0);
      }

      // Animate Tower searchlights & subtle crown rotation
      if (towerGroup.current) {
        towerGroup.current.rotation.y = Math.sin(elapsedTime * 0.1) * 0.05;
      }

      // Animate each of the 8 project monuments
      projectGroups.current.forEach((group, pid) => {
        const speed = 0.5;
        const isHovered = hoveredProject.current === pid;
        const isActive = activeProject === pid;

        group.rotation.y += 0.008;

        if (isHovered || isActive) {
          group.scale.lerp(new THREE.Vector3(1.25, 1.25, 1.25), 0.08);
        } else {
          group.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.08);
        }

        // Float effect
        group.position.y += Math.sin(elapsedTime * 1.5 + (pid.charCodeAt(0) % 5)) * 0.04;
      });

      // Animate Conduit pulsing opacity
      if (conduitLines.current) {
        (conduitLines.current.material as THREE.LineBasicMaterial).opacity =
          0.2 + Math.sin(elapsedTime * 2.5) * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="aihn-3d-universe-stage"
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
    />
  );
};
