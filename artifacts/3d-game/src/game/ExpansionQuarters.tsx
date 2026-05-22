import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { QUARTERS, RESERVED_LOTS, LOT_SIZE } from "./cityConstants";

// ════════════════════════════════════════════════════════════════════
// ExpansionQuarters — renders the 6 outer-ring financial-ed quarters.
// Each quarter ships with a glowing signpost at its inner-corner edge
// plus 5 themed paved plinths that the kiosks sit on.
//
// The lots used to be obvious "reserved / coming soon" placeholders
// (corner posts + floating ID label). Now that every lot has a real
// kiosk built on top, the plinths just provide quarter-color paving
// + a faint emissive accent ring around each kiosk's footprint.
// ════════════════════════════════════════════════════════════════════

function ReservedLot({
  position,
  color,
}: {
  position: [number, number];
  color: string;
}) {
  const [x, z] = position;
  const half = LOT_SIZE / 2;
  return (
    <group position={[x, 0, z]}>
      {/* Themed paving — slightly darker tint of the quarter color so the
          kiosk on top reads as belonging to its district. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[LOT_SIZE, LOT_SIZE]} />
        <meshStandardMaterial color="#0b1220" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Faint emissive border ring — subtle district color halo. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[half - 0.3, half - 0.1, 4, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}

function QuarterSignpost({
  position,
  rotation,
  label,
  emoji,
  color,
}: {
  position: [number, number, number];
  rotation: number;
  label: string;
  emoji: string;
  color: string;
}) {
  const orbRef = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.emissiveIntensity =
        1.4 + Math.sin(state.clock.elapsedTime * 1.5) * 0.5;
    }
  });
  const [px, py, pz] = position;
  return (
    <group position={[px, py, pz]} rotation={[0, rotation, 0]}>
      {/* Pole */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 4.4, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Plaque — faces +x (forward in local space; group rotation aims at center) */}
      <mesh position={[0.05, 4.4, 0]} castShadow>
        <boxGeometry args={[0.1, 1.2, 4.2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          metalness={0.5}
          roughness={0.4}
          toneMapped={false}
        />
      </mesh>
      {/* Plaque text (back-side faces away — readable from city side) */}
      <Text
        position={[0.11, 4.4, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.5}
        color="#0b1220"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor={color}
        maxWidth={3.8}
      >
        {emoji} {label.toUpperCase()}
      </Text>
      {/* Pulsing orb on top */}
      <mesh position={[0, 5.2, 0]}>
        <sphereGeometry args={[0.3, 14, 12]} />
        <meshStandardMaterial
          ref={orbRef}
          color={color}
          emissive={color}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      {/* Glow ring at the base */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.3, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function ExpansionQuarters() {
  return (
    <group>
      {RESERVED_LOTS.map((lot) => (
        <ReservedLot
          key={lot.id}
          position={lot.position}
          color={lot.color}
        />
      ))}
      {QUARTERS.map((q) => (
        <QuarterSignpost
          key={q.id}
          position={q.signpost}
          rotation={q.signpostRotY}
          label={q.name}
          emoji={q.emoji}
          color={q.color}
        />
      ))}
    </group>
  );
}
