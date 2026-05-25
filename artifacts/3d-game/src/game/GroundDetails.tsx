import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// =====================================================================
// GroundDetails — grass tufts, pavement patches, parking lots,
// plazas, and ground clutter to break up the flat green plane.
// =====================================================================

function GrassTuft({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null!);
  const blades = useMemo(() => {
    return Array.from({ length: 5 + Math.floor(Math.random() * 4) }, (_, i) => ({
      x: (Math.random() - 0.5) * 0.2,
      z: (Math.random() - 0.5) * 0.2,
      h: 0.08 + Math.random() * 0.15,
      rot: Math.random() * Math.PI,
      lean: (Math.random() - 0.5) * 0.3,
      color: ["#16a34a", "#22c55e", "#15803d", "#4ade80"][Math.floor(Math.random() * 4)],
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.z = Math.sin(t * 1.5 + position[0]) * 0.02;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {blades.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]} rotation={[b.lean, b.rot, 0]}>
          <boxGeometry args={[0.015, b.h, 0.015]} />
          <meshStandardMaterial color={b.color} />
        </mesh>
      ))}
    </group>
  );
}

function PavementPatch({ position, width, depth, rotation = 0 }: {
  position: [number, number, number];
  width: number;
  depth: number;
  rotation?: number;
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.2} />
    </mesh>
  );
}

function ParkingLot({ position, width, depth, rotation = 0 }: {
  position: [number, number, number];
  width: number;
  depth: number;
  rotation?: number;
}) {
  const spaces = Math.floor(width / 2.5);
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Asphalt base */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#0f172a" roughness={0.95} />
      </mesh>
      {/* Parking lines */}
      {Array.from({ length: spaces + 1 }).map((_, i) => (
        <mesh key={i} position={[-width / 2 + i * 2.5, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, depth * 0.9]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      ))}
    </group>
  );
}

function PlazaTile({ position, color = "#334155" }: { position: [number, number, number]; color?: string }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[1.8, 1.8]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

function Manhole({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 16]} />
        <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[0.3, 0.34, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>
    </group>
  );
}

function DrainGrate({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* Grate bars */}
      {[-0.15, 0, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.04, 0.45]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// Pre-placed ground details around the city
const GRASS_CLUMPS: [number, number, number][] = [
  // Financial district green space
  [-8, 0, 8], [-6, 0, 10], [-10, 0, 6], [-5, 0, 5],
  [8, 0, -8], [10, 0, -6], [6, 0, -10], [5, 0, -5],
  // Parks
  [-50, 0, -50], [-52, 0, -48], [-48, 0, -52],
  [50, 0, 50], [52, 0, 48], [48, 0, 52],
  // Scattered around
  [-20, 0, 30], [25, 0, -25], [-30, 0, -20], [35, 0, 35],
  [-15, 0, -35], [40, 0, -40], [-45, 0, 15], [20, 0, 45],
];

const PAVEMENT_PATCHES: { pos: [number, number, number]; w: number; d: number; r?: number }[] = [
  // Building plazas
  { pos: [12, 0.01, -15], w: 8, d: 8 },      // WorkCorp
  { pos: [-13.5, 0.01, -12], w: 9, d: 9 },   // TaxMart
  { pos: [13.5, 0.01, 13.5], w: 6, d: 6 },   // FirstBank
  { pos: [-13.5, 0.01, 13.5], w: 6, d: 6 },  // IRS
  { pos: [19.5, 0.01, -19.5], w: 7, d: 7 },  // MoneyBot Towers
  // Sidewalk extensions
  { pos: [90, 0.01, -7], w: 5, d: 5 },
  { pos: [90, 0.01, -62], w: 5, d: 5 },
  { pos: [-105, 0.01, -31.5], w: 6, d: 6 },
];

const PARKING_LOTS: { pos: [number, number, number]; w: number; d: number; r?: number }[] = [
  { pos: [-18, 0.01, -18], w: 10, d: 7 },
  { pos: [28, 0.01, 12], w: 10, d: 7 },
  { pos: [-75, 0.01, -45], w: 8, d: 6 },
  { pos: [82, 0.01, -18], w: 8, d: 6 },
];

const PLAZA_TILES: { pos: [number, number, number]; color?: string }[] = [
  // Central plaza pattern
  ...Array.from({ length: 5 }, (_, i) =>
    Array.from({ length: 5 }, (_, j) => ({
      pos: [(-2 + i) * 2, 0.02, (-2 + j) * 2] as [number, number, number],
      color: (i + j) % 2 === 0 ? "#1e293b" : "#334155",
    }))
  ).flat(),
  // City hall plaza
  ...Array.from({ length: 4 }, (_, i) =>
    Array.from({ length: 4 }, (_, j) => ({
      pos: [17 + i * 2, 0.02, -43 + j * 2] as [number, number, number],
      color: (i + j) % 2 === 0 ? "#1e293b" : "#0f172a",
    }))
  ).flat(),
];

const MANHOLES: [number, number, number][] = [
  [3, 0.01, 3], [-5, 0.01, -7], [15, 0.01, 8],
  [-20, 0.01, 25], [30, 0.01, -30], [-40, 0.01, -15],
  [50, 0.01, 20], [-60, 0.01, 10], [70, 0.01, -50],
];

const DRAIN_GRATES: { pos: [number, number, number]; r?: number }[] = [
  { pos: [0, 0.01, 5] }, { pos: [5, 0.01, 0] }, { pos: [-5, 0.01, -5] },
  { pos: [25, 0.01, -15] }, { pos: [-25, 0.01, 20] },
];

export default function GroundDetails() {
  return (
    <group>
      {/* Grass clumps */}
      {GRASS_CLUMPS.map((pos, i) => (
        <GrassTuft key={`grass-${i}`} position={pos} scale={0.8 + Math.random() * 0.4} />
      ))}

      {/* Pavement patches */}
      {PAVEMENT_PATCHES.map((p, i) => (
        <PavementPatch key={`pave-${i}`} position={p.pos} width={p.w} depth={p.d} rotation={p.r ?? 0} />
      ))}

      {/* Parking lots */}
      {PARKING_LOTS.map((p, i) => (
        <ParkingLot key={`park-${i}`} position={p.pos} width={p.w} depth={p.d} rotation={p.r ?? 0} />
      ))}

      {/* Plaza tiles */}
      {PLAZA_TILES.map((t, i) => (
        <PlazaTile key={`plaza-${i}`} position={t.pos} color={t.color} />
      ))}

      {/* Manholes */}
      {MANHOLES.map((pos, i) => (
        <Manhole key={`mh-${i}`} position={pos} />
      ))}

      {/* Drain grates */}
      {DRAIN_GRATES.map((g, i) => (
        <DrainGrate key={`drain-${i}`} position={g.pos} rotation={g.r ?? 0} />
      ))}
    </group>
  );
}
