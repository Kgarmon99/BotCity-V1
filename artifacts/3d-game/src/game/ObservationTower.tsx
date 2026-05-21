import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// =====================================================================
// ObservationTower — tall slender tower at (60, 0, 35) with a viewing
// deck at y=22 and an animated radar dish + aviation beacon on top.
// =====================================================================
// Sits in the empty pocket between botbeach (44, 25) and botport
// (50, 48) — closest building edges ~14u away in both directions.
// Player ceiling is y=55 (Player.tsx MAX_ALTITUDE), so the tower top
// (y=28) is well within the play space and visible from anywhere
// in the SE quadrant.

export default function ObservationTower() {
  const dishRef = useRef<THREE.Group>(null!);
  const beaconRef = useRef<THREE.Mesh>(null!);
  const elevatorRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (dishRef.current) dishRef.current.rotation.y = t * 0.4;
    if (beaconRef.current) {
      const m = beaconRef.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = Math.sin(t * 2.4) > 0 ? 2 : 0.4;
    }
    // Elevator car rides up and down the external rail (y 1 → 21).
    if (elevatorRef.current) {
      const cycle = (t * 0.15) % 2;
      const up = cycle < 1 ? cycle : 2 - cycle;
      elevatorRef.current.position.y = 1 + up * 20;
    }
  });

  return (
    <group position={[90, 0, 52.5]}>
      {/* Base plaza */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4, 24]} />
        <meshStandardMaterial color="#a8a29e" />
      </mesh>
      {/* Tapered concrete shaft */}
      <mesh position={[0, 11, 0]} castShadow>
        <cylinderGeometry args={[0.5, 1.6, 22, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.4} />
      </mesh>
      {/* External elevator track (yellow strip) */}
      <mesh position={[1.8, 11, 0]}>
        <boxGeometry args={[0.18, 22, 0.4]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.4} />
      </mesh>
      {/* Glass elevator car (rides the track) */}
      <mesh ref={elevatorRef} position={[2.03, 1, 0]} castShadow>
        <boxGeometry args={[0.55, 1.0, 0.7]} />
        <meshStandardMaterial color="#67e8f9" transparent opacity={0.7} metalness={0.5} />
      </mesh>
      {/* Viewing deck floor */}
      <mesh position={[0, 22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3, 3.2, 0.6, 24]} />
        <meshStandardMaterial color="#1f2937" metalness={0.4} />
      </mesh>
      {/* Glass enclosure around deck */}
      <mesh position={[0, 22.85, 0]}>
        <cylinderGeometry args={[2.95, 2.95, 1.3, 24, 1, true]} />
        <meshStandardMaterial
          color="#67e8f9"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          metalness={0.3}
        />
      </mesh>
      {/* Top railing */}
      <mesh position={[0, 23.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.95, 0.05, 6, 32]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Conical roof */}
      <mesh position={[0, 24.4, 0]} castShadow>
        <coneGeometry args={[3.2, 1.6, 24]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      {/* Antenna mast */}
      <mesh position={[0, 26.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 2.6, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Rotating radar dish */}
      <group ref={dishRef} position={[0, 27.5, 0]}>
        <mesh rotation={[Math.PI / 3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.15, 0.1, 18, 1, true]} />
          <meshStandardMaterial color="#cbd5e1" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[1.05, 0, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.6} />
        </mesh>
      </group>
      {/* Blinking aviation beacon at the very top */}
      <mesh ref={beaconRef} position={[0, 28, 0]}>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      {/* Entrance archway on south face */}
      <mesh position={[0, 1.4, 2.55]} castShadow>
        <boxGeometry args={[0.9, 2.6, 0.15]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 1.4, 2.67]}>
        <boxGeometry args={[0.7, 2.3, 0.04]} />
        <meshStandardMaterial color="#67e8f9" emissive="#67e8f9" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
