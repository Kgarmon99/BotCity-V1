import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// =====================================================================
// StreetFurniture — benches, bus stops, trash cans, mailboxes,
// newspaper stands, and other urban props.
// =====================================================================

function Bench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.2, 0.06, 0.35]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.9} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.65, -0.15]} castShadow>
        <boxGeometry args={[1.2, 0.5, 0.04]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.9} />
      </mesh>
      {/* Legs */}
      {[-0.5, 0.5].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 0.17, 0.1]}>
            <boxGeometry args={[0.04, 0.34, 0.04]} />
            <meshStandardMaterial color="#1f2937" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.17, -0.1]}>
            <boxGeometry args={[0.04, 0.34, 0.04]} />
            <meshStandardMaterial color="#1f2937" metalness={0.7} />
          </mesh>
        </group>
      ))}
      {/* Arm rests */}
      {[-0.58, 0.58].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0]}>
          <boxGeometry args={[0.05, 0.04, 0.4]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function BusStop({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Shelter roof */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[2.2, 0.08, 1.2]} />
        <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Roof glow strip */}
      <mesh position={[0, 2.35, 0]}>
        <boxGeometry args={[2.0, 0.04, 1.0]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* Side posts */}
      {[-1, 1].map((x, i) => (
        <mesh key={i} position={[x, 1.2, -0.4]}>
          <boxGeometry args={[0.06, 2.4, 0.06]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} />
        </mesh>
      ))}
      {/* Back panel (glass-like) */}
      <mesh position={[0, 1.2, -0.42]}>
        <boxGeometry args={[2.1, 2.2, 0.04]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.25} metalness={0.9} roughness={0.05} />
      </mesh>
      {/* Bench inside */}
      <Bench position={[0, 0, -0.15]} />
      {/* Bus sign */}
      <mesh position={[0, 2.7, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.06]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 2.7, 0.035]}>
        <planeGeometry args={[0.7, 0.3]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
    </group>
  );
}

function TrashCan({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.2, 0.7, 12]} />
        <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Lid */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.24, 0.22, 0.06, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>
      {/* Opening */}
      <mesh position={[0, 0.6, 0.12]}>
        <boxGeometry args={[0.2, 0.15, 0.04]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

function Mailbox({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Post */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 6]} />
        <meshStandardMaterial color="#1f2937" metalness={0.7} />
      </mesh>
      {/* Box */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[0.35, 0.25, 0.2]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Slot */}
      <mesh position={[0, 1.3, 0.11]}>
        <boxGeometry args={[0.2, 0.03, 0.01]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Flag */}
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
      {/* Base */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.4]} />
        <meshStandardMaterial color="#1f2937" metalness={0.5} />
      </mesh>
      {/* Top display */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.55, 0.08, 0.35]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Papers */}
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
      {/* U-shaped racks */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0]}>
          <torusGeometry args={[0.12, 0.02, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} />
        </mesh>
      ))}
      {/* Base rail */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.9, 0.04, 0.04]} />
        <meshStandardMaterial color="#1f2937" metalness={0.7} />
      </mesh>
    </group>
  );
}

function FireHydrant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.3, 8]} />
        <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Top */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 8]} />
        <meshStandardMaterial color="#dc2626" metalness={0.4} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#991b1b" metalness={0.5} />
      </mesh>
      {/* Side nozzles */}
      {[-1, 1].map((s, i) => (
        <mesh key={i} position={[s * 0.1, 0.2, 0]} rotation={[0, 0, s * Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.08, 6]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// Placement data
const BENCHES: { pos: [number, number, number]; rot: number }[] = [
  { pos: [3, 0, 3], rot: 0.5 }, { pos: [-4, 0, 5], rot: -0.3 },
  { pos: [16, 0, -12], rot: 1.2 }, { pos: [-15, 0, 15], rot: -0.8 },
  { pos: [28, 0, 20], rot: 0.2 }, { pos: [-25, 0, -20], rot: 1.5 },
  { pos: [55, 0, 45], rot: 0.7 }, { pos: [-50, 0, 50], rot: -0.5 },
];

const BUS_STOPS: { pos: [number, number, number]; rot: number }[] = [
  { pos: [27, 0, 2], rot: 0 }, { pos: [-27, 0, -2], rot: Math.PI },
  { pos: [2, 0, 27], rot: -Math.PI / 2 }, { pos: [-2, 0, -27], rot: Math.PI / 2 },
];

const TRASH_CANS: { pos: [number, number, number]; rot: number }[] = [
  { pos: [5, 0, -5], rot: 0 }, { pos: [-8, 0, 8], rot: 0.5 },
  { pos: [20, 0, -18], rot: 0.2 }, { pos: [-18, 0, 20], rot: -0.3 },
  { pos: [35, 0, 35], rot: 0.7 }, { pos: [-30, 0, -30], rot: 1.1 },
  { pos: [50, 0, -10], rot: 0.4 }, { pos: [-55, 0, 10], rot: -0.6 },
];

const MAILBOXES: { pos: [number, number, number]; rot: number }[] = [
  { pos: [8, 0, 12], rot: 0.3 }, { pos: [-10, 0, -8], rot: -0.5 },
  { pos: [22, 0, 25], rot: 0.8 }, { pos: [-20, 0, -22], rot: -0.2 },
];

const NEWSPAPER_STANDS: { pos: [number, number, number]; rot: number }[] = [
  { pos: [6, 0, -8], rot: 0.4 }, { pos: [-6, 0, 10], rot: -0.7 },
  { pos: [30, 0, -15], rot: 0.1 }, { pos: [-35, 0, 25], rot: -0.4 },
];

const BIKE_RACKS: { pos: [number, number, number]; rot: number }[] = [
  { pos: [14, 0, 10], rot: 0.6 }, { pos: [-12, 0, -14], rot: -0.3 },
  { pos: [40, 0, 30], rot: 0.9 }, { pos: [-45, 0, -35], rot: -0.8 },
];

const FIRE_HYDRANTS: [number, number, number][] = [
  [2, 0, -3], [-5, 0, 7], [18, 0, -22], [-22, 0, 18],
  [45, 0, 40], [-48, 0, -42], [60, 0, -20], [-65, 0, 15],
];

export default function StreetFurniture() {
  return (
    <group>
      {BENCHES.map((b, i) => (
        <Bench key={`bench-${i}`} position={b.pos} rotation={b.rot} />
      ))}
      {BUS_STOPS.map((b, i) => (
        <BusStop key={`bus-${i}`} position={b.pos} rotation={b.rot} />
      ))}
      {TRASH_CANS.map((t, i) => (
        <TrashCan key={`trash-${i}`} position={t.pos} rotation={t.rot} />
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
      {FIRE_HYDRANTS.map((pos, i) => (
        <FireHydrant key={`hydrant-${i}`} position={pos} />
      ))}
    </group>
  );
}
