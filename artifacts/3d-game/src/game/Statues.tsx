import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { MoneyBotModel, type MoneyBotAnim } from "./MoneyBotModel";

type Pose = "hero" | "thinker" | "wave" | "salute" | "point";

interface StatueProps {
  position: [number, number, number];
  rotation?: number;
  pose?: Pose;
  plaque: string;
}

// Each named "pose" maps to one of the GLB's baked animations so the
// hand-of-fame line-up reads with variety.
const POSE_TO_ANIM: Record<Pose, MoneyBotAnim> = {
  hero: "Idle",
  salute: "RightHand",
  wave: "LeftHand",
  thinker: "Idle",
  point: "UpPoint",
};

function Statue({ position, rotation = 0, pose = "hero", plaque }: StatueProps) {
  const glowRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.15;
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.08);
    }
  });

  // Deterministic per-statue phase offset (0..1) so identical animations
  // don't beat in unison across the 8-statue ensemble.
  const phase = (((position[0] * 13 + position[2] * 7) % 100) + 100) / 100;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Green aura halo */}
      <mesh ref={glowRef} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 2.2, 32]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      {/* Pedestal base */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[2.4, 0.8, 2.4]} />
        <meshStandardMaterial color="#052e16" emissive="#22c55e" emissiveIntensity={0.25} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Gold trim ring */}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[2.5, 0.06, 2.5]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.2} metalness={1} toneMapped={false} />
      </mesh>
      {/* Pedestal column */}
      <mesh castShadow receiveShadow position={[0, 1.4, 0]}>
        <boxGeometry args={[1.6, 1.2, 1.6]} />
        <meshStandardMaterial color="#052e16" emissive="#22c55e" emissiveIntensity={0.2} metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Plaque */}
      <mesh position={[0, 1.4, 0.81]}>
        <boxGeometry args={[1.2, 0.5, 0.04]} />
        <meshStandardMaterial color="#020617" emissive="#22c55e" emissiveIntensity={0.4} metalness={0.6} />
      </mesh>
      <Text
        position={[0, 1.55, 0.84]}
        fontSize={0.13}
        color="#86efac"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.1}
        textAlign="center"
      >
        {plaque}
      </Text>
      <Text
        position={[0, 1.28, 0.84]}
        fontSize={0.07}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.1}
        textAlign="center"
      >
        — MoneyBot Hall of Fame —
      </Text>
      {/* Official MoneyBot model frozen on top of the pedestal — pose
          comes from the animation clip evaluated at a fixed frame. */}
      <group position={[0, 2, 0]}>
        <MoneyBotModel scale={1.1} animation={POSE_TO_ANIM[pose]} phase={phase} paused />
      </group>
      {/* Green up-light */}
    </group>
  );
}

// Hall of Fame statues. Earlier versions placed these AT the secondary
// intersections (±18, ±18) and at the outer-avenue ends (0, ±36) / (±36, 0)
// — which put every pedestal directly in the middle of a road. They've
// been moved to the diagonal outer corners of each secondary intersection
// (±22, ±22), which sits on the empty block-corner sidewalk just past the
// crossroads, facing back toward the city center. We also pruned from 8
// statues down to 4 (one per quadrant) so the city reads less cluttered.
const statues: StatueProps[] = [
  // NW quadrant — pedestal sits on the NW outer corner of the (-18, -18)
  // intersection, looking SE toward downtown.
  { position: [-33, 0, -33], rotation:  Math.PI / 4,     pose: "hero",    plaque: "MOMOBOT\nThe Founder" },
  // NE quadrant — outer corner of the (18, -18) intersection.
  { position: [33, 0, -33], rotation: -Math.PI / 4,     pose: "thinker", plaque: "PROF.\nLEDGERINGTON" },
  // SW quadrant — outer corner of the (-18, 18) intersection.
  { position: [-33, 0, 33], rotation:  Math.PI * 3 / 4, pose: "wave",    plaque: "MAYOR\nBYTECOIN" },
  // SE quadrant — outer corner of the (18, 18) intersection.
  { position: [33, 0, 33], rotation: -Math.PI * 3 / 4, pose: "salute",  plaque: "GOVERNOR\nSILICONIA" },
];

export default function Statues() {
  return (
    <group>
      {statues.map((s, i) => (
        <Statue key={`statue-${i}`} {...s} />
      ))}
    </group>
  );
}
