import { useRef, useMemo } from "react";
import * as THREE from "three";

// =====================================================================
// StreetFurniture — instanced benches, bus stops, trash cans, etc.
// All repeated objects use THREE.InstancedMesh for single draw call.
// =====================================================================

function InstancedBenches() {
  const count = 12;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const { matrices } = useMemo(() => {
    const mats = new Float32Array(count * 16);
    const dummy = new THREE.Object3D();
    const positions: { pos: [number, number, number]; rot: number }[] = [
      { pos: [3, 0, 3], rot: 0.5 }, { pos: [-4, 0, 5], rot: -0.3 },
      { pos: [16, 0, -12], rot: 1.2 }, { pos: [-15, 0, 15], rot: -0.8 },
      { pos: [28, 0, 20], rot: 0.2 }, { pos: [-25, 0, -20], rot: 1.5 },
      { pos: [55, 0, 45], rot: 0.7 }, { pos: [-50, 0, 50], rot: -0.5 },
      { pos: [75, 0, -30], rot: 0.3 }, { pos: [-70, 0, 25], rot: -0.6 },
      { pos: [40, 0, -60], rot: 1.0 }, { pos: [-35, 0, -55], rot: -0.2 },
    ];
    for (let i = 0; i < count; i++) {
      const { pos, rot } = positions[i];
      dummy.position.set(pos[0], pos[1] + 0.35, pos[2]);
      dummy.rotation.set(0, rot, 0);
      dummy.scale.set(1.2, 1, 1);
      dummy.updateMatrix();
      dummy.matrix.toArray(mats, i * 16);
    }
    return { matrices: mats };
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      <boxGeometry args={[1.2, 0.06, 0.35]} />
      <meshStandardMaterial color="#7c2d12" roughness={0.9} />
      <instancedBufferAttribute attach="instanceMatrix" args={[new THREE.InstancedBufferAttribute(matrices, 16)]} />
    </instancedMesh>
  );
}

function InstancedTrashCans() {
  const count = 12;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const { matrices } = useMemo(() => {
    const mats = new Float32Array(count * 16);
    const dummy = new THREE.Object3D();
    const positions: { pos: [number, number, number]; rot: number }[] = [
      { pos: [5, 0, -5], rot: 0 }, { pos: [-8, 0, 8], rot: 0.5 },
      { pos: [20, 0, -18], rot: 0.2 }, { pos: [-18, 0, 20], rot: -0.3 },
      { pos: [35, 0, 35], rot: 0.7 }, { pos: [-30, 0, -30], rot: 1.1 },
      { pos: [50, 0, -10], rot: 0.4 }, { pos: [-55, 0, 10], rot: -0.6 },
      { pos: [65, 0, 20], rot: 0.1 }, { pos: [-65, 0, -20], rot: -0.4 },
      { pos: [80, 0, -40], rot: 0.8 }, { pos: [-80, 0, 40], rot: -0.1 },
    ];
    for (let i = 0; i < count; i++) {
      const { pos, rot } = positions[i];
      dummy.position.set(pos[0], pos[1] + 0.35, pos[2]);
      dummy.rotation.set(0, rot, 0);
      dummy.updateMatrix();
      dummy.matrix.toArray(mats, i * 16);
    }
    return { matrices: mats };
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <cylinderGeometry args={[0.2, 0.18, 0.7, 12]} />
      <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
      <instancedBufferAttribute attach="instanceMatrix" args={[new THREE.InstancedBufferAttribute(matrices, 16)]} />
    </instancedMesh>
  );
}

function InstancedFireHydrants() {
  const count = 12;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const { matrices } = useMemo(() => {
    const mats = new Float32Array(count * 16);
    const dummy = new THREE.Object3D();
    const positions: [number, number, number][] = [
      [2, 0, -3], [-5, 0, 7], [18, 0, -22], [-22, 0, 18],
      [45, 0, 40], [-48, 0, -42], [60, 0, -20], [-65, 0, 15],
      [85, 0, -60], [-90, 0, 50], [100, 0, 10], [-100, 0, -10],
    ];
    for (let i = 0; i < count; i++) {
      const [x, y, z] = positions[i];
      dummy.position.set(x, y + 0.25, z);
      dummy.rotation.set(0, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      dummy.matrix.toArray(mats, i * 16);
    }
    return { matrices: mats };
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <cylinderGeometry args={[0.1, 0.12, 0.5, 8]} />
      <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.5} />
      <instancedBufferAttribute attach="instanceMatrix" args={[new THREE.InstancedBufferAttribute(matrices, 16)]} />
    </instancedMesh>
  );
}

function BusStop({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[2.2, 0.08, 1.2]} />
        <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 2.35, 0]}>
        <boxGeometry args={[2.0, 0.04, 1.0]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {[-1, 1].map((x, i) => (
        <mesh key={i} position={[x, 1.2, -0.4]}>
          <boxGeometry args={[0.06, 2.4, 0.06]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 1.2, -0.42]}>
        <boxGeometry args={[2.1, 2.2, 0.04]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.25} metalness={0.9} roughness={0.05} />
      </mesh>
      <mesh position={[0, 0.35, -0.15]} castShadow>
        <boxGeometry args={[1.2, 0.06, 0.35]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.7, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.06]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

function Mailbox({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 6]} />
        <meshStandardMaterial color="#1f2937" metalness={0.7} />
      </mesh>
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[0.35, 0.25, 0.2]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.3, 0.11]}>
        <boxGeometry args={[0.2, 0.03, 0.01]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.2, 1.3, 0]}>
        <boxGeometry args={[0.08, 0.03, 0.12]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}

function NewspaperStand({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.4]} />
        <meshStandardMaterial color="#1f2937" metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.55, 0.08, 0.35]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[0.45, 0.06, 0.25]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
    </group>
  );
}

function BikeRack({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0]}>
          <torusGeometry args={[0.12, 0.02, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.9, 0.04, 0.04]} />
        <meshStandardMaterial color="#1f2937" metalness={0.7} />
      </mesh>
    </group>
  );
}

const BUS_STOPS: { pos: [number, number, number]; rot: number }[] = [
  { pos: [27, 0, 2], rot: 0 }, { pos: [-27, 0, -2], rot: Math.PI },
  { pos: [2, 0, 27], rot: -Math.PI / 2 }, { pos: [-2, 0, -27], rot: Math.PI / 2 },
  { pos: [52, 0, 0], rot: 0 }, { pos: [-52, 0, 0], rot: Math.PI },
];

const MAILBOXES: { pos: [number, number, number]; rot: number }[] = [
  { pos: [8, 0, 12], rot: 0.3 }, { pos: [-10, 0, -8], rot: -0.5 },
  { pos: [22, 0, 25], rot: 0.8 }, { pos: [-20, 0, -22], rot: -0.2 },
  { pos: [38, 0, -30], rot: 0.1 }, { pos: [-42, 0, 35], rot: -0.7 },
];

const NEWSPAPER_STANDS: { pos: [number, number, number]; rot: number }[] = [
  { pos: [6, 0, -8], rot: 0.4 }, { pos: [-6, 0, 10], rot: -0.7 },
  { pos: [30, 0, -15], rot: 0.1 }, { pos: [-35, 0, 25], rot: -0.4 },
  { pos: [48, 0, 12], rot: 0.6 }, { pos: [-50, 0, -18], rot: -0.3 },
];

const BIKE_RACKS: { pos: [number, number, number]; rot: number }[] = [
  { pos: [14, 0, 10], rot: 0.6 }, { pos: [-12, 0, -14], rot: -0.3 },
  { pos: [40, 0, 30], rot: 0.9 }, { pos: [-45, 0, -35], rot: -0.8 },
  { pos: [58, 0, -25], rot: 0.2 }, { pos: [-60, 0, 20], rot: -0.5 },
];

export default function StreetFurniture() {
  return (
    <group>
      <InstancedBenches />
      <InstancedTrashCans />
      <InstancedFireHydrants />
      {BUS_STOPS.map((b, i) => (
        <BusStop key={`bus-${i}`} position={b.pos} rotation={b.rot} />
      ))}
      {MAILBOXES.map((m, i) => (
        <Mailbox key={`mail-${i}`} position={m.pos} rotation={m.rot} />
      ))}
      {NEWSPAPER_STANDS.map((n, i) => (
        <NewspaperStand key={`news-${i}`} position={n.pos} rotation={n.rot} />
      ))}
      {BIKE_RACKS.map((b, i) => (
        <BikeRack key={`bike-${i}`} position={b.pos} rotation={b.rot} />
      ))}
    </group>
  );
}
