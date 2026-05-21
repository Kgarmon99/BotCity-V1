// Civic plaza decoration in front of BotCityHall.
//
// BotCityHall sits at (19.5, 5, -45) with footprint x[17,22] z[-48,-42].
// The plaza extends NORTH from the building toward the inner ring road
// at z=-27 (south sidewalk edge ≈ z=-28.1). A 10×8 plaza centered at
// (19.5, -35) gives footprint x[14.5,24.5] z[-39,-31] — 3u gap south
// to CityHall's north face, 2.9u gap north to the road sidewalk.
//
// Features:
//   • Two-tone checker-tile floor + gold inset border + gold ring inlay
//     around the fountain base
//   • Cross walkway radiating N/S/E/W from the central fountain
//   • Two-tier fountain with rotating ring + bobbing water spray
//   • Welcome arch at the north entrance with hanging banner
//   • Memorial obelisk north of the fountain
//   • Bronze founder statue south of the fountain (mirrors obelisk)
//   • 4 ornate lamp posts (corners) with emissive lantern tops
//   • 6 small glowing bollards lining the cross walkways
//   • 4 wooden benches flanking the E-W walkway
//   • 4 planter trees in the inter-axis quadrants
//   • 3 animated pigeons pecking at the plaza floor
//   • Flagpole with green city flag

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

const PLAZA_CX = 19.5;
const PLAZA_CZ = -35;
const PLAZA_W = 10;
const PLAZA_D = 8;

function Fountain() {
  const ringRef = useRef<THREE.Mesh>(null);
  const sprayRef = useRef<THREE.Mesh>(null);
  const innerSprayRef = useRef<THREE.Mesh>(null);
  const waterMatRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) ringRef.current.rotation.y = t * 0.2;
    if (sprayRef.current) {
      const s = 1 + Math.sin(t * 2.5) * 0.08;
      sprayRef.current.scale.set(s, 1 + Math.sin(t * 2) * 0.15, s);
    }
    if (innerSprayRef.current) {
      const s = 1 + Math.sin(t * 3.2 + 1) * 0.12;
      innerSprayRef.current.scale.set(s, 1 + Math.sin(t * 2.8) * 0.2, s);
    }
    if (waterMatRef.current) {
      waterMatRef.current.emissiveIntensity = 0.5 + Math.sin(t * 1.5) * 0.2;
    }
  });
  return (
    <group position={[PLAZA_CX, 0.05, PLAZA_CZ]}>
      {/* Lower (outer) pool ring */}
      <mesh ref={ringRef} position={[0, 0.18, 0]} castShadow receiveShadow>
        <torusGeometry args={[1.8, 0.22, 16, 56]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Lower water disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <circleGeometry args={[1.75, 56]} />
        <meshStandardMaterial
          ref={waterMatRef}
          color="#0ea5e9"
          emissive="#22d3ee"
          emissiveIntensity={0.55}
          toneMapped={false}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Mid pedestal */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.7, 0.8, 24]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>
      {/* Upper basin */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <torusGeometry args={[0.85, 0.13, 12, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.06, 0]}>
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#22d3ee"
          emissiveIntensity={0.65}
          toneMapped={false}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Top pedestal */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.24, 0.5, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>
      {/* Tall central spray */}
      <mesh ref={sprayRef} position={[0, 2.4, 0]}>
        <coneGeometry args={[0.4, 2.0, 16, 1, true]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#22d3ee"
          emissiveIntensity={1.4}
          toneMapped={false}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Inner narrower jet — pulses at a different rate */}
      <mesh ref={innerSprayRef} position={[0, 2.2, 0]}>
        <coneGeometry args={[0.18, 1.6, 12, 1, true]} />
        <meshStandardMaterial
          color="#f0f9ff"
          emissive="#67e8f9"
          emissiveIntensity={1.8}
          toneMapped={false}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Soft cyan light bathing the plaza at night */}
      <pointLight color="#22d3ee" intensity={1.2} distance={8} position={[0, 1.6, 0]} />
    </group>
  );
}

function Obelisk() {
  // Slim civic monument just north of the fountain, commemorating BotCity.
  return (
    <group position={[PLAZA_CX, 0, PLAZA_CZ + 2.6]}>
      {/* Square base */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.4, 1.1]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>
      {/* Mid plinth */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.8, 0.3, 0.8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Tapered shaft */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.32, 2.3, 4]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Gold cap */}
      <mesh position={[0, 3.15, 0]} castShadow>
        <coneGeometry args={[0.16, 0.35, 4]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.7}
          metalness={0.6}
          toneMapped={false}
        />
      </mesh>
      {/* Engraved plaque text — facing south toward the fountain */}
      <Text
        position={[0, 0.7, 0.42]}
        fontSize={0.14}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#0b1220"
      >
        BOTCITY
      </Text>
      <Text
        position={[0, 0.5, 0.42]}
        fontSize={0.08}
        color="#cbd5e1"
        anchorX="center"
        anchorY="middle"
      >
        EST. 20XX
      </Text>
    </group>
  );
}

function Flagpole() {
  const flagRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.8) * 0.15;
    }
  });
  return (
    <group position={[PLAZA_CX - 4.2, 0, PLAZA_CZ - 3.2]}>
      {/* Stone base */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.42, 0.3, 12]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 7, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Gold finial */}
      <mesh position={[0, 7.1, 0]} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      {/* Flag */}
      <mesh ref={flagRef} position={[0.65, 6.3, 0]}>
        <planeGeometry args={[1.3, 0.8]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#16a34a"
          emissiveIntensity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function LampPost({ pos }: { pos: [number, number] }) {
  return (
    <group position={[pos[0], 0, pos[1]]}>
      {/* Base */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.24, 0.36, 12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 2.8, 12]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Lamp arm */}
      <mesh position={[0, 3.0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Lantern housing */}
      <mesh position={[0, 3.25, 0]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      {/* Emissive lamp core */}
      <mesh position={[0, 3.25, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#fbbf24"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      <pointLight color="#fbbf24" intensity={0.6} distance={5} position={[0, 3.25, 0]} />
      {/* Decorative cap */}
      <mesh position={[0, 3.6, 0]}>
        <coneGeometry args={[0.25, 0.3, 4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

function Bench({ pos, rotY = 0 }: { pos: [number, number]; rotY?: number }) {
  return (
    <group position={[pos[0], 0, pos[1]]} rotation={[0, rotY, 0]}>
      {/* Seat plank */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[1.6, 0.08, 0.4]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.75, -0.18]} castShadow>
        <boxGeometry args={[1.6, 0.5, 0.06]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.7, 0.2, 0]} castShadow>
        <boxGeometry args={[0.08, 0.42, 0.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.7, 0.2, 0]} castShadow>
        <boxGeometry args={[0.08, 0.42, 0.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

function WelcomeArch() {
  // Spans the plaza's north entrance with two columns + a hanging banner.
  // Columns sit just inside the north plaza edge (z = PLAZA_CZ + hd - 0.2 ≈ -31.2),
  // 3u east/west of center so the central N-S walkway (1.6u wide) passes
  // cleanly between them.
  const bannerRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (bannerRef.current) {
      bannerRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
    }
  });
  const Z = PLAZA_CZ + PLAZA_D / 2 - 0.2;
  return (
    <group>
      {/* Left column */}
      <group position={[PLAZA_CX - 3, 0, Z]}>
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.4, 0.7]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.1, 0]} castShadow>
          <boxGeometry args={[0.4, 3.4, 0.4]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0, 3.95, 0]} castShadow>
          <boxGeometry args={[0.55, 0.25, 0.55]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
      </group>
      {/* Right column */}
      <group position={[PLAZA_CX + 3, 0, Z]}>
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.4, 0.7]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.1, 0]} castShadow>
          <boxGeometry args={[0.4, 3.4, 0.4]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0, 3.95, 0]} castShadow>
          <boxGeometry args={[0.55, 0.25, 0.55]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
      </group>
      {/* Crossbeam spanning both columns */}
      <mesh position={[PLAZA_CX, 4.2, Z]} castShadow>
        <boxGeometry args={[6.6, 0.18, 0.4]} />
        <meshStandardMaterial color="#78350f" roughness={0.85} />
      </mesh>
      {/* Hanging banner — green city cloth with text */}
      <mesh ref={bannerRef} position={[PLAZA_CX, 3.45, Z + 0.02]} castShadow>
        <planeGeometry args={[5.4, 1.3]} />
        <meshStandardMaterial
          color="#16a34a"
          emissive="#15803d"
          emissiveIntensity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Gold trim along the banner top + bottom */}
      <mesh position={[PLAZA_CX, 4.05, Z + 0.03]}>
        <planeGeometry args={[5.4, 0.08]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
      <mesh position={[PLAZA_CX, 2.85, Z + 0.03]}>
        <planeGeometry args={[5.4, 0.08]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
      <Text
        position={[PLAZA_CX, 3.55, Z + 0.04]}
        fontSize={0.46}
        color="#fef3c7"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#052e16"
      >
        WELCOME TO BOTCITY
      </Text>
      <Text
        position={[PLAZA_CX, 3.05, Z + 0.04]}
        fontSize={0.18}
        color="#bbf7d0"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#052e16"
      >
        ★  CIVIC PLAZA  ★
      </Text>
    </group>
  );
}

function FounderStatue() {
  // Bronze figure on a stone plinth, mirroring the obelisk to the south
  // of the fountain. Local placement at PLAZA_CZ - 3 (≈ z=-38), 1u from
  // the plaza's south edge at z=-39.
  return (
    <group position={[PLAZA_CX, 0, PLAZA_CZ - 3]}>
      {/* Wide stone base */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.78, 0.36, 18]} />
        <meshStandardMaterial color="#64748b" roughness={0.65} />
      </mesh>
      {/* Mid plinth (square) */}
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[0.9, 0.5, 0.9]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Plaque face — bronze, facing north toward fountain */}
      <mesh position={[0, 0.62, 0.46]}>
        <planeGeometry args={[0.65, 0.36]} />
        <meshStandardMaterial color="#92400e" emissive="#b45309" emissiveIntensity={0.35} metalness={0.7} roughness={0.4} />
      </mesh>
      <Text
        position={[0, 0.72, 0.47]}
        fontSize={0.1}
        color="#fde68a"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.008}
        outlineColor="#451a03"
      >
        FOUNDER
      </Text>
      <Text
        position={[0, 0.58, 0.47]}
        fontSize={0.07}
        color="#fde68a"
        anchorX="center"
        anchorY="middle"
      >
        BOT McCITIZEN
      </Text>
      <Text
        position={[0, 0.48, 0.47]}
        fontSize={0.055}
        color="#fcd34d"
        anchorX="center"
        anchorY="middle"
      >
        "FINANCIAL LITERACY FOR ALL"
      </Text>
      {/* Bronze statue — legs / robe (tapered cylinder) */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.28, 1.2, 12]} />
        <meshStandardMaterial color="#7c2d12" metalness={0.65} roughness={0.45} emissive="#92400e" emissiveIntensity={0.15} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 2.25, 0]} castShadow>
        <boxGeometry args={[0.42, 0.6, 0.32]} />
        <meshStandardMaterial color="#7c2d12" metalness={0.65} roughness={0.45} emissive="#92400e" emissiveIntensity={0.15} />
      </mesh>
      {/* Left arm — bent, holding a tablet */}
      <mesh position={[-0.28, 2.2, 0.1]} rotation={[0.3, 0, 0.6]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.55, 8]} />
        <meshStandardMaterial color="#7c2d12" metalness={0.65} roughness={0.45} emissive="#92400e" emissiveIntensity={0.15} />
      </mesh>
      {/* Tablet of laws / financial principles */}
      <mesh position={[-0.42, 2.0, 0.22]} rotation={[0.4, 0.2, 0]} castShadow>
        <boxGeometry args={[0.32, 0.42, 0.05]} />
        <meshStandardMaterial color="#a16207" metalness={0.6} roughness={0.5} emissive="#78350f" emissiveIntensity={0.2} />
      </mesh>
      {/* Right arm — raised slightly */}
      <mesh position={[0.28, 2.25, 0]} rotation={[0, 0, -0.25]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.6, 8]} />
        <meshStandardMaterial color="#7c2d12" metalness={0.65} roughness={0.45} emissive="#92400e" emissiveIntensity={0.15} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.75, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 14]} />
        <meshStandardMaterial color="#7c2d12" metalness={0.65} roughness={0.45} emissive="#92400e" emissiveIntensity={0.15} />
      </mesh>
      {/* Tiny laurel-wreath circlet */}
      <mesh position={[0, 2.92, 0]}>
        <torusGeometry args={[0.18, 0.025, 8, 24]} />
        <meshStandardMaterial color="#16a34a" emissive="#22c55e" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function Bollard({ pos }: { pos: [number, number] }) {
  // Small glowing post lining the walkways.
  return (
    <group position={[pos[0], 0, pos[1]]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.13, 0.5, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Emissive cap */}
      <mesh position={[0, 0.54, 0]}>
        <sphereGeometry args={[0.13, 14, 12]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={2.0} toneMapped={false} />
      </mesh>
      <pointLight color="#fbbf24" intensity={0.25} distance={2.5} position={[0, 0.55, 0]} />
    </group>
  );
}

function Pigeon({ pos, phase }: { pos: [number, number]; phase: number }) {
  // Small bird that pecks (head bob) and occasionally hops in place.
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime + phase;
    if (bodyRef.current) {
      // Hop on every ~3.5s cycle, brief upward arc.
      const cyc = (t * 0.6) % 1;
      const hop = cyc < 0.18 ? Math.sin(cyc * Math.PI / 0.18) * 0.18 : 0;
      bodyRef.current.position.y = hop;
      // Slight body rotation when hopping forward.
      bodyRef.current.rotation.y = phase + Math.sin(t * 0.25) * 0.3;
    }
    if (headRef.current) {
      // Pecking head bob at ~3Hz.
      const bob = Math.max(0, Math.sin(t * 6));
      headRef.current.position.y = 0.16 - bob * 0.1;
      headRef.current.rotation.x = bob * 0.6;
    }
  });
  return (
    <group position={[pos[0], 0, pos[1]]}>
      <group ref={bodyRef}>
        {/* Body */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <sphereGeometry args={[0.12, 12, 10]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.85} />
        </mesh>
        {/* Tail */}
        <mesh position={[-0.13, 0.11, 0]} rotation={[0, 0, 0.25]}>
          <boxGeometry args={[0.1, 0.04, 0.08]} />
          <meshStandardMaterial color="#64748b" roughness={0.85} />
        </mesh>
        {/* Head */}
        <mesh ref={headRef} position={[0.11, 0.16, 0]} castShadow>
          <sphereGeometry args={[0.07, 10, 8]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
        </mesh>
        {/* Beak */}
        <mesh position={[0.19, 0.15, 0]}>
          <coneGeometry args={[0.025, 0.06, 6]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        {/* Tiny legs (suggestion only — two thin sticks) */}
        <mesh position={[0.02, 0.02, 0.04]}>
          <boxGeometry args={[0.015, 0.04, 0.015]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
        <mesh position={[0.02, 0.02, -0.04]}>
          <boxGeometry args={[0.015, 0.04, 0.015]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
      </group>
    </group>
  );
}

function PlanterTree({ pos }: { pos: [number, number] }) {
  return (
    <group position={[pos[0], 0, pos[1]]}>
      {/* Planter pot */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.38, 0.44, 16]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.9} />
      </mesh>
      {/* Soil disc */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 16]} />
        <meshStandardMaterial color="#451a03" roughness={1} />
      </mesh>
      {/* Trunk */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.8, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Foliage — three stacked spheres for a topiary feel */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.55, 16, 12]} />
        <meshStandardMaterial color="#16a34a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.95, 0]} castShadow>
        <sphereGeometry args={[0.42, 16, 12]} />
        <meshStandardMaterial color="#15803d" roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.3, 0]} castShadow>
        <sphereGeometry args={[0.26, 12, 10]} />
        <meshStandardMaterial color="#22c55e" roughness={0.85} />
      </mesh>
    </group>
  );
}

export default function CityHallPlaza() {
  const hw = PLAZA_W / 2;
  const hd = PLAZA_D / 2;
  // Tile grid: 5 cols × 4 rows of 2×2 tiles. Alternating dark/lighter slate.
  const tiles: Array<{ x: number; z: number; light: boolean }> = [];
  const cols = 5;
  const rows = 4;
  const tileW = PLAZA_W / cols;
  const tileD = PLAZA_D / rows;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      tiles.push({
        x: PLAZA_CX - hw + tileW * (i + 0.5),
        z: PLAZA_CZ - hd + tileD * (j + 0.5),
        light: (i + j) % 2 === 0,
      });
    }
  }
  return (
    <group>
      {/* Base plaza floor — dark slate underlay */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[PLAZA_CX, 0.025, PLAZA_CZ]}
        receiveShadow
      >
        <planeGeometry args={[PLAZA_W, PLAZA_D]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      {/* Checker tiles on top of the underlay */}
      {tiles.map((t, i) => (
        <mesh
          key={`tile-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[t.x, 0.03, t.z]}
          receiveShadow
        >
          <planeGeometry args={[tileW - 0.08, tileD - 0.08]} />
          <meshStandardMaterial
            color={t.light ? "#475569" : "#1e293b"}
            roughness={0.75}
            metalness={0.15}
          />
        </mesh>
      ))}
      {/* Gold inset frame around the perimeter */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PLAZA_CX, 0.04, PLAZA_CZ - hd + 0.18]}>
        <planeGeometry args={[PLAZA_W - 0.6, 0.12]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PLAZA_CX, 0.04, PLAZA_CZ + hd - 0.18]}>
        <planeGeometry args={[PLAZA_W - 0.6, 0.12]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PLAZA_CX - hw + 0.18, 0.04, PLAZA_CZ]}>
        <planeGeometry args={[0.12, PLAZA_D - 0.6]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PLAZA_CX + hw - 0.18, 0.04, PLAZA_CZ]}>
        <planeGeometry args={[0.12, PLAZA_D - 0.6]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      {/* Cross walkways radiating from the fountain — lighter stone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PLAZA_CX, 0.045, PLAZA_CZ]}>
        <planeGeometry args={[1.6, PLAZA_D - 0.5]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PLAZA_CX, 0.045, PLAZA_CZ]}>
        <planeGeometry args={[PLAZA_W - 0.5, 1.6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </mesh>
      {/* Gold ring inlay around the fountain — ties the fountain to the
          floor pattern and reads as a civic medallion at night. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PLAZA_CX, 0.046, PLAZA_CZ]}>
        <ringGeometry args={[1.95, 2.15, 48]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.7}
          toneMapped={false}
        />
      </mesh>
      {/* Eight short gold rays radiating outward from the ring */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={`ray-${i}`}
            rotation={[-Math.PI / 2, 0, -a]}
            position={[PLAZA_CX + Math.cos(a) * 2.45, 0.046, PLAZA_CZ + Math.sin(a) * 2.45]}
          >
            <planeGeometry args={[0.45, 0.1]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.55} toneMapped={false} />
          </mesh>
        );
      })}

      <Fountain />
      <Obelisk />
      <FounderStatue />
      <Flagpole />
      <WelcomeArch />

      {/* Lamp posts at the four plaza corners */}
      <LampPost pos={[PLAZA_CX - hw + 0.5, PLAZA_CZ - hd + 0.5]} />
      <LampPost pos={[PLAZA_CX + hw - 0.5, PLAZA_CZ - hd + 0.5]} />
      <LampPost pos={[PLAZA_CX - hw + 0.5, PLAZA_CZ + hd - 0.5]} />
      <LampPost pos={[PLAZA_CX + hw - 0.5, PLAZA_CZ + hd - 0.5]} />

      {/* Walkway bollards — small glowing posts lining the cross walks.
          Pairs at ±2.6 along each axis flank the fountain ring without
          blocking the 1.6u walkway. */}
      <Bollard pos={[PLAZA_CX - 2.6, PLAZA_CZ - 0.95]} />
      <Bollard pos={[PLAZA_CX - 2.6, PLAZA_CZ + 0.95]} />
      <Bollard pos={[PLAZA_CX + 2.6, PLAZA_CZ - 0.95]} />
      <Bollard pos={[PLAZA_CX + 2.6, PLAZA_CZ + 0.95]} />
      <Bollard pos={[PLAZA_CX - 0.95, PLAZA_CZ - 2.6]} />
      <Bollard pos={[PLAZA_CX + 0.95, PLAZA_CZ - 2.6]} />

      {/* Benches flanking the E-W walkway, facing it */}
      <Bench pos={[PLAZA_CX - 3.0, PLAZA_CZ - 1.4]} rotY={Math.PI} />
      <Bench pos={[PLAZA_CX + 3.0, PLAZA_CZ - 1.4]} rotY={Math.PI} />
      <Bench pos={[PLAZA_CX - 3.0, PLAZA_CZ + 1.4]} rotY={0} />
      <Bench pos={[PLAZA_CX + 3.0, PLAZA_CZ + 1.4]} rotY={0} />

      {/* Planter trees in the four corner quadrants of the plaza */}
      <PlanterTree pos={[PLAZA_CX - hw + 1.4, PLAZA_CZ - hd + 1.6]} />
      <PlanterTree pos={[PLAZA_CX + hw - 1.4, PLAZA_CZ - hd + 1.6]} />
      <PlanterTree pos={[PLAZA_CX - hw + 1.4, PLAZA_CZ + hd - 1.6]} />
      <PlanterTree pos={[PLAZA_CX + hw - 1.4, PLAZA_CZ + hd - 1.6]} />

      {/* Pigeons pecking at the plaza floor — scattered, with phase
          offsets so they peck and hop on staggered cycles. */}
      <Pigeon pos={[PLAZA_CX - 1.2, PLAZA_CZ - 2.1]} phase={0} />
      <Pigeon pos={[PLAZA_CX + 1.6, PLAZA_CZ + 2.2]} phase={1.8} />
      <Pigeon pos={[PLAZA_CX + 2.1, PLAZA_CZ - 0.4]} phase={3.4} />
    </group>
  );
}
