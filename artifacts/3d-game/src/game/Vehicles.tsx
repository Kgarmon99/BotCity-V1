import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function BotMobile({
  pos,
  color,
  accent,
  taillight = "#ef4444",
}: {
  pos: [number, number, number];
  color: string;
  accent: string;
  taillight?: string;
}) {
  return (
    <group position={pos}>
      {/* Lower body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2, 0.55, 1.05]} />
        <meshStandardMaterial
          color={color}
          emissive={accent}
          emissiveIntensity={0.35}
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>
      {/* Cabin / canopy */}
      <mesh position={[-0.1, 0.95, 0]} castShadow>
        <boxGeometry args={[1.2, 0.5, 0.92]} />
        <meshStandardMaterial
          color="#0b1220"
          emissive={accent}
          emissiveIntensity={0.55}
          metalness={0.5}
          roughness={0.35}
        />
      </mesh>
      {/* Front headlight bar */}
      <mesh position={[1.01, 0.45, 0]}>
        <boxGeometry args={[0.04, 0.12, 0.75]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      {/* Rear taillight bar */}
      <mesh position={[-1.01, 0.45, 0]}>
        <boxGeometry args={[0.04, 0.12, 0.75]} />
        <meshStandardMaterial
          color={taillight}
          emissive={taillight}
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
      {/* Wheels */}
      {[
        [-0.7, -0.55],
        [0.7, -0.55],
        [-0.7, 0.55],
        [0.7, 0.55],
      ].map(([wx, wz], i) => (
        <mesh
          key={`wheel-${i}`}
          position={[wx, 0.22, wz]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.22, 0.22, 0.18, 12]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// BotVette — low-slung sports-car silhouette used when the player holds V.
// Same forward axis as BotMobile (local +X = front) so the existing -π/2 Y
// rotation in Player.tsx aligns the nose with the player's heading.
export function BotVette({
  pos,
  color = "#dc2626",
  accent = "#fde047",
  taillight = "#ef4444",
}: {
  pos: [number, number, number];
  color?: string;
  accent?: string;
  taillight?: string;
}) {
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  useFrame((_, dt) => {
    // Spin the wheels — faster than BotMobile to feel sportier.
    for (const w of wheelRefs.current) {
      if (w) w.rotation.x += dt * 22;
    }
  });
  return (
    <group position={pos}>
      {/* Lower hull — long, wide, low */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[2.8, 0.32, 1.15]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.18}
        />
      </mesh>
      {/* Pointed nose */}
      <mesh position={[1.5, 0.32, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[0.55, 0.5, 4]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.18} />
      </mesh>
      {/* Hood scoop */}
      <mesh position={[0.55, 0.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.4]} />
        <meshStandardMaterial color="#0b1220" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Cabin / tinted canopy — short and slanted */}
      <mesh position={[-0.15, 0.66, 0]} castShadow>
        <boxGeometry args={[1.1, 0.38, 0.95]} />
        <meshStandardMaterial
          color="#0b1220"
          emissive={accent}
          emissiveIntensity={0.7}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      {/* Rear spoiler */}
      <mesh position={[-1.25, 0.62, 0]} castShadow>
        <boxGeometry args={[0.22, 0.05, 1.15]} />
        <meshStandardMaterial color="#0b1220" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-1.35, 0.5, 0.5]} castShadow>
        <boxGeometry args={[0.05, 0.25, 0.05]} />
        <meshStandardMaterial color="#0b1220" />
      </mesh>
      <mesh position={[-1.35, 0.5, -0.5]} castShadow>
        <boxGeometry args={[0.05, 0.25, 0.05]} />
        <meshStandardMaterial color="#0b1220" />
      </mesh>
      {/* Side racing stripe */}
      <mesh position={[0, 0.35, 0.58]}>
        <boxGeometry args={[2.4, 0.06, 0.01]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.35, -0.58]}>
        <boxGeometry args={[2.4, 0.06, 0.01]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      {/* Headlight pods */}
      <mesh position={[1.32, 0.32, 0.38]}>
        <sphereGeometry args={[0.1, 10, 8]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[1.32, 0.32, -0.38]}>
        <sphereGeometry args={[0.1, 10, 8]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      {/* Twin taillight bar */}
      <mesh position={[-1.4, 0.34, 0.3]}>
        <boxGeometry args={[0.04, 0.1, 0.25]} />
        <meshStandardMaterial color={taillight} emissive={taillight} emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      <mesh position={[-1.4, 0.34, -0.3]}>
        <boxGeometry args={[0.04, 0.1, 0.25]} />
        <meshStandardMaterial color={taillight} emissive={taillight} emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      {/* Dual exhaust */}
      <mesh position={[-1.42, 0.18, 0.22]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 10]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-1.42, 0.18, -0.22]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 10]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Wheels — bigger, lower */}
      {[
        [-0.95, -0.58],
        [0.95, -0.58],
        [-0.95, 0.58],
        [0.95, 0.58],
      ].map(([wx, wz], i) => (
        <mesh
          key={`vette-wheel-${i}`}
          ref={(m) => { if (m) wheelRefs.current[i] = m; }}
          position={[wx, 0.26, wz]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.28, 0.28, 0.2, 16]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.4} />
        </mesh>
      ))}
      {/* Underglow */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, 1.0]} />
        <meshBasicMaterial color={accent} transparent opacity={0.35} toneMapped={false} />
      </mesh>
    </group>
  );
}

