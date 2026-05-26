import { useRef, useMemo } from "react";
import * as THREE from "three";

// =====================================================================
// GroundDetails — instanced grass, pavement, parking, plazas.
// Uses THREE.InstancedMesh for repeated objects to minimize draw calls.
// =====================================================================

function InstancedGrass() {
  const count = 40;
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  const { matrices, colors } = useMemo(() => {
    const mats = new Float32Array(count * 16);
    const cols = new Float32Array(count * 3);
    const dummy = new THREE.Object3D();
    const palette = [
      new THREE.Color("#16a34a"),
      new THREE.Color("#22c55e"),
      new THREE.Color("#15803d"),
      new THREE.Color("#4ade80"),
    ];

    const positions: [number, number, number][] = [
      [-8, 0, 8], [-6, 0, 10], [-10, 0, 6], [-5, 0, 5],
      [8, 0, -8], [10, 0, -6], [6, 0, -10], [5, 0, -5],
      [-50, 0, -50], [-52, 0, -48], [-48, 0, -52],
      [50, 0, 50], [52, 0, 48], [48, 0, 52],
      [-20, 0, 30], [25, 0, -25], [-30, 0, -20], [35, 0, 35],
      [-15, 0, -35], [40, 0, -40], [-45, 0, 15], [20, 0, 45],
      [-60, 0, 20], [60, 0, -20], [15, 0, 55], [-25, 0, -50],
      [45, 0, 25], [-55, 0, -15], [30, 0, -45], [-40, 0, 40],
      [75, 0, 10], [-75, 0, -10], [10, 0, 75], [-10, 0, -75],
      [100, 0, 30], [-100, 0, -30], [30, 0, 100], [-30, 0, -100],
      [0, 0, 60], [0, 0, -60],
    ];

    for (let i = 0; i < count; i++) {
      const [bx, by, bz] = positions[i] || [0, 0, 0];
      dummy.position.set(bx + (Math.random() - 0.5) * 2, by, bz + (Math.random() - 0.5) * 2);
      dummy.scale.setScalar(0.6 + Math.random() * 0.8);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.updateMatrix();
      dummy.matrix.toArray(mats, i * 16);

      const col = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }
    return { matrices: mats, colors: cols };
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} receiveShadow>
      <boxGeometry args={[0.02, 0.15, 0.02]} />
      <meshStandardMaterial />
      <instancedBufferAttribute attach="instanceMatrix" args={[new THREE.InstancedBufferAttribute(matrices, 16)]} />
      <instancedBufferAttribute attach="instanceColor" args={[new THREE.InstancedBufferAttribute(colors, 3)]} />
    </instancedMesh>
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
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#0f172a" roughness={0.95} />
      </mesh>
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
      {[-0.15, 0, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.04, 0.45]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

const PAVEMENT_PATCHES: { pos: [number, number, number]; w: number; d: number; r?: number }[] = [
  { pos: [12, 0.01, -15], w: 8, d: 8 },
  { pos: [-13.5, 0.01, -12], w: 9, d: 9 },
  { pos: [13.5, 0.01, 13.5], w: 6, d: 6 },
  { pos: [-13.5, 0.01, 13.5], w: 6, d: 6 },
  { pos: [19.5, 0.01, -19.5], w: 7, d: 7 },
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

const PLAZA_TILES = Array.from({ length: 5 }, (_, i) =>
  Array.from({ length: 5 }, (_, j) => ({
    pos: [(-2 + i) * 2, 0.02, (-2 + j) * 2] as [number, number, number],
    color: (i + j) % 2 === 0 ? "#1e293b" : "#334155",
  }))
).flat().concat(
  Array.from({ length: 4 }, (_, i) =>
    Array.from({ length: 4 }, (_, j) => ({
      pos: [17 + i * 2, 0.02, -43 + j * 2] as [number, number, number],
      color: (i + j) % 2 === 0 ? "#1e293b" : "#0f172a",
    }))
  ).flat()
);

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
      <InstancedGrass />
      {PAVEMENT_PATCHES.map((p, i) => (
        <PavementPatch key={`pave-${i}`} position={p.pos} width={p.w} depth={p.d} rotation={p.r ?? 0} />
      ))}
      {PARKING_LOTS.map((p, i) => (
        <ParkingLot key={`park-${i}`} position={p.pos} width={p.w} depth={p.d} rotation={p.r ?? 0} />
      ))}
      {PLAZA_TILES.map((t, i) => (
        <PlazaTile key={`plaza-${i}`} position={t.pos} color={t.color} />
      ))}
      {MANHOLES.map((pos, i) => (
        <Manhole key={`mh-${i}`} position={pos} />
      ))}
      {DRAIN_GRATES.map((g, i) => (
        <DrainGrate key={`drain-${i}`} position={g.pos} rotation={g.r ?? 0} />
      ))}
    </group>
  );
}
