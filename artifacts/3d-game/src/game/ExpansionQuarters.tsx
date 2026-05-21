import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { QUARTERS, RESERVED_LOTS, LOT_SIZE } from "./cityConstants";

// ════════════════════════════════════════════════════════════════════
// ExpansionQuarters — renders the 6 outer-ring quarters carved out by
// Task #1. Each quarter ships with a signpost at its inner-corner edge
// and ~5 subtle paved lots that Task #2 will replace with kiosks.
//
// The lots intentionally look placeholdery (dark paved square + corner
// posts + a tiny ID label) so it's obvious during playtest that this
// land is "reserved" rather than just empty.
// ════════════════════════════════════════════════════════════════════

function ReservedLot({
  position,
  color,
  id,
}: {
  position: [number, number];
  color: string;
  id: string;
}) {
  const [x, z] = position;
  const half = LOT_SIZE / 2;
  return (
    <group position={[x, 0, z]}>
      {/* Paved square */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[LOT_SIZE, LOT_SIZE]} />
        <meshStandardMaterial color="#1e293b" roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Accent border ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[half - 0.25, half - 0.05, 4, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
          opacity={0.55}
        />
      </mesh>
      {/* Four corner posts — short emissive cylinders */}
      {[
        [-half + 0.5, -half + 0.5],
        [half - 0.5, -half + 0.5],
        [-half + 0.5, half - 0.5],
        [half - 0.5, half - 0.5],
      ].map(([cx, cz], i) => (
        <group key={i} position={[cx, 0, cz]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 1.0, 6]} />
            <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.05, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.4}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
      {/* Tiny floating ID label — helps planners see which lot is which */}
      <Text
        position={[0, 0.06, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.55}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#0b1220"
      >
        {id.toUpperCase()}
      </Text>
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
          id={lot.id}
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
