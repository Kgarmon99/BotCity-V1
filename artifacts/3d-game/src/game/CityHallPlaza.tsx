// Civic plaza decoration in front of BotCityHall.
//
// BotCityHall sits at (13, 5, -30) with footprint x[10.5..15.5] z[-33..-27].
// The plaza extends SOUTH from the building toward the secondary street at
// z=-18 — about 7 units of open civic space. Includes a tiled stone floor,
// a central fountain, a flagpole, and four corner bollards with pulsing
// emerald lights so the plaza reads at night.

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PLAZA_CX = 19.5;
// Plaza must sit between CityHall's south face (z=-27) and the secondary
// street's north sidewalk (z=-19.9, per RoadGrid). A 6-deep plaza centered
// at z=-24 gives footprint z[-27..-21] — touches the building (intentional)
// and leaves a 1.1u gap to the sidewalk so the player can walk around it.
const PLAZA_CZ = -36;
const PLAZA_W = 7;
const PLAZA_D = 6;

function Fountain() {
  const ringRef = useRef<THREE.Mesh>(null);
  const sprayRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) ringRef.current.rotation.y = t * 0.2;
    if (sprayRef.current) {
      const s = 1 + Math.sin(t * 2.5) * 0.08;
      sprayRef.current.scale.set(s, 1 + Math.sin(t * 2) * 0.15, s);
    }
  });
  return (
    <group position={[PLAZA_CX, 0.05, PLAZA_CZ]}>
      {/* Outer pool ring */}
      <mesh ref={ringRef} position={[0, 0.15, 0]} castShadow receiveShadow>
        <torusGeometry args={[1.4, 0.18, 16, 48]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Water disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.16, 0]}>
        <circleGeometry args={[1.35, 48]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#22d3ee" emissiveIntensity={0.6} toneMapped={false} transparent opacity={0.85} />
      </mesh>
      {/* Center pedestal */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.6, 24]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>
      {/* Water spray */}
      <mesh ref={sprayRef} position={[0, 1.4, 0]}>
        <coneGeometry args={[0.35, 1.6, 16, 1, true]} />
        <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={1.2} toneMapped={false} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Flagpole() {
  const flagRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (flagRef.current) {
      // Subtle wave by rotating the flag plane.
      flagRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.8) * 0.15;
    }
  });
  return (
    <group position={[PLAZA_CX - 2.6, 0, PLAZA_CZ - 2.6]}>
      {/* Pole */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 6, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Gold finial */}
      <mesh position={[0, 6.15, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      {/* Flag */}
      <mesh ref={flagRef} position={[0.55, 5.4, 0]}>
        <planeGeometry args={[1.1, 0.7]} />
        <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Bollard({ pos }: { pos: [number, number] }) {
  return (
    <group position={[pos[0], 0, pos[1]]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 1, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#22c55e" emissive="#4ade80" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function CityHallPlaza() {
  // Corner bollards sit just inside the plaza tile edges so the
  // glow forms a clean rectangle around it.
  const hw = PLAZA_W / 2 - 0.4;
  const hd = PLAZA_D / 2 - 0.4;
  return (
    <group>
      {/* Tile floor — slightly raised so it overdraws roads cleanly */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PLAZA_CX, 0.03, PLAZA_CZ]} receiveShadow>
        <planeGeometry args={[PLAZA_W, PLAZA_D]} />
        <meshStandardMaterial color="#1e293b" roughness={0.75} metalness={0.2} />
      </mesh>
      {/* Inset gold border to frame the plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PLAZA_CX, 0.035, PLAZA_CZ]}>
        <ringGeometry args={[PLAZA_W / 2 - 0.5, PLAZA_W / 2 - 0.2, 4, 1, 0, Math.PI * 2]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      {/* Diagonal pathway accent — cosmetic stripe on the N-S axis */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PLAZA_CX, 0.04, PLAZA_CZ]}>
        <planeGeometry args={[1.2, PLAZA_D - 1]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      <Fountain />
      <Flagpole />

      <Bollard pos={[PLAZA_CX - hw, PLAZA_CZ - hd]} />
      <Bollard pos={[PLAZA_CX + hw, PLAZA_CZ - hd]} />
      <Bollard pos={[PLAZA_CX - hw, PLAZA_CZ + hd]} />
      <Bollard pos={[PLAZA_CX + hw, PLAZA_CZ + hd]} />
    </group>
  );
}
