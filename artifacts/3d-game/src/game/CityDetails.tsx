import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// Sidewalk tile
function Sidewalk({ position, size, rotation = 0 }: { position: [number, number, number]; size: [number, number]; rotation?: number }) {
  return (
    <mesh
      receiveShadow
      rotation={[-Math.PI / 2, 0, rotation]}
      position={position}
    >
      <planeGeometry args={size} />
      <meshStandardMaterial
        color="#0a1f17"
        emissive="#22c55e"
        emissiveIntensity={0.15}
        metalness={0.4}
        roughness={0.5}
      />
    </mesh>
  );
}

// District marker pylon with text
function DistrictPylon({
  position,
  label,
  color,
  rotation = 0,
}: {
  position: [number, number, number];
  label: string;
  color: string;
  rotation?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.4;
    }
  });
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh ref={ref} position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[1.6, 2.4, 0.2]} />
        <meshStandardMaterial color="#052e16" emissive={color} emissiveIntensity={1} metalness={0.7} />
      </mesh>
      <mesh position={[0, 1.2, 0.11]}>
        <boxGeometry args={[1.4, 2.2, 0.02]} />
        <meshStandardMaterial color="#020617" emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <Text
        position={[0, 1.2, 0.13]}
        fontSize={0.22}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
        textAlign="center"
      >
        {label}
      </Text>
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[0.15, 0.3, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Hover platform — small floating disc with bot-friendly aesthetic
function HoverPlatform({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.3 + position[0]) * 0.2;
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });
  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.6, 0.8, 0.12, 16]} />
        <meshStandardMaterial color="#052e16" emissive={color} emissiveIntensity={0.6} metalness={0.85} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <torusGeometry args={[0.7, 0.04, 8, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ===== Neighborhood amenities (Park / Pool / Playground) =====
// Small ambient props placed in the empty middle-ring block interiors and a
// couple of outer-suburb plazas. They give residential breathing room between
// the major districts and make the city feel inhabited rather than just
// commercial. Each amenity has a documented local envelope so neighbors can
// be checked without re-reading the geometry.

// Park — 4×4 grass patch with a single tree, a bench, and a glowing lamp.
//   local x ∈ [-2, +2], local z ∈ [-2, +2]
function Park({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Grass pad */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
      {/* Tree trunk */}
      <mesh position={[-1, 0.6, -1]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 1.2, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Tree foliage */}
      <mesh position={[-1, 1.6, -1]} castShadow>
        <sphereGeometry args={[0.8, 12, 10]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      {/* Bench */}
      <Bench position={[0.6, 0, 0.6]} rotation={Math.PI / 4} />
      {/* Lamp post */}
      <mesh position={[1.5, 1, -1.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2, 6]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[1.5, 2.1, -1.5]}>
        <sphereGeometry args={[0.18, 10, 8]} />
        <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Pool — 5×3.5 deck with shimmering blue water, lounge chairs, sun umbrella.
//   local x ∈ [-2.5, +2.5], local z ∈ [-1.75, +1.75]
function Pool({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const waterRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (waterRef.current) {
      // Subtle vertical shimmer — cheaper than a real water shader.
      waterRef.current.position.y = 0.09 + Math.sin(state.clock.elapsedTime * 2.4) * 0.015;
    }
  });
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Sandy deck */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5, 3.5]} />
        <meshStandardMaterial color="#fde68a" />
      </mesh>
      {/* Water surface */}
      <mesh ref={waterRef} position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 2.2]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#0891b2"
          emissiveIntensity={0.45}
          transparent
          opacity={0.85}
          toneMapped={false}
        />
      </mesh>
      {/* Pool tile border (north/south) */}
      <mesh position={[0, 0.04, 1.2]}>
        <boxGeometry args={[3.8, 0.05, 0.18]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      <mesh position={[0, 0.04, -1.2]}>
        <boxGeometry args={[3.8, 0.05, 0.18]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      {/* Lounge chairs */}
      <mesh position={[-2, 0.18, 1.4]} castShadow>
        <boxGeometry args={[0.6, 0.12, 1.4]} />
        <meshStandardMaterial color="#f87171" />
      </mesh>
      <mesh position={[2, 0.18, 1.4]} castShadow>
        <boxGeometry args={[0.6, 0.12, 1.4]} />
        <meshStandardMaterial color="#f87171" />
      </mesh>
      {/* Umbrella pole + canopy */}
      <mesh position={[-2, 1.1, -1.3]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2, 6]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[-2, 2.0, -1.3]} castShadow>
        <coneGeometry args={[0.75, 0.45, 12]} />
        <meshStandardMaterial color="#fb7185" />
      </mesh>
      {/* Diving floaty */}
      <mesh position={[0.6, 0.18, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.1, 8, 16]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Playground — 4×4 sand pit with a red slide and a swinging seat.
//   local x ∈ [-2, +2], local z ∈ [-2, +2]
function Playground({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const swingRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (swingRef.current) {
      swingRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.4) * 0.35;
    }
  });
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Sand pit */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
      {/* Slide ramp (tilted) */}
      <mesh position={[-0.8, 0.7, -0.9]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <boxGeometry args={[1.8, 0.08, 0.55]} />
        <meshStandardMaterial color="#f87171" metalness={0.5} />
      </mesh>
      {/* Slide ladder */}
      <mesh position={[-1.6, 0.7, -0.9]} castShadow>
        <boxGeometry args={[0.08, 1.4, 0.45]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {/* Slide platform top */}
      <mesh position={[-1.6, 1.4, -0.9]} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.55]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      {/* Swing A-frame */}
      <mesh position={[1.2, 1, 0]} castShadow>
        <boxGeometry args={[0.1, 2, 0.08]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[1.2, 1, 1.2]} castShadow>
        <boxGeometry args={[0.1, 2, 0.08]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[1.2, 1.95, 0.6]}>
        <boxGeometry args={[0.1, 0.08, 1.4]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {/* Swinging seat */}
      <group ref={swingRef} position={[1.2, 1.95, 0.6]}>
        <mesh position={[-0.22, -0.4, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 4]} />
          <meshStandardMaterial color="#92400e" />
        </mesh>
        <mesh position={[0.22, -0.4, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 4]} />
          <meshStandardMaterial color="#92400e" />
        </mesh>
        <mesh position={[0, -0.8, 0]} castShadow>
          <boxGeometry args={[0.55, 0.08, 0.32]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      </group>
      {/* Spring bouncer */}
      <mesh position={[0.8, 0.4, -1.4]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.35]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.8, 0.12, -1.4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 6]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

// Bench
function Bench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.4, 0.1, 0.4]} />
        <meshStandardMaterial color="#052e16" emissive="#22c55e" emissiveIntensity={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[-0.6, 0.15, 0]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh position={[0.6, 0.15, 0]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
    </group>
  );
}

export default function CityDetails() {
  return (
    <group>
      {/* District pylons near each building — matches the building's accent color */}
      <DistrictPylon position={[-13, 0, -4]} label="WORK\nDISTRICT" color="#60a5fa" />
      <DistrictPylon position={[13, 0, -4]} label="MARKET\nDISTRICT" color="#fbbf24" />
      <DistrictPylon position={[-13, 0, 4]} label="FINANCIAL\nDISTRICT" color="#a78bfa" />
      <DistrictPylon position={[13, 0, 4]} label="GOV\nDISTRICT" color="#f87171" />

      {/* Welcome pylons at city entry points — off main avenue (x=0) */}
      <DistrictPylon position={[-4, 0, -22]} label="WELCOME\nTO\nBOTCITY" color="#4ade80" rotation={Math.PI / 12} />
      <DistrictPylon position={[ 4, 0,  22]} label="POP. 9001\nBOTS" color="#86efac" rotation={Math.PI + Math.PI / 12} />

      {/* Hover platforms scattered in block interiors */}
      <HoverPlatform position={[-6, 2.5, -6]} color="#22c55e" />
      <HoverPlatform position={[6, 2.5, -6]} color="#fbbf24" />
      <HoverPlatform position={[-6, 2.5, 6]} color="#4ade80" />
      <HoverPlatform position={[6, 2.5, 6]} color="#86efac" />

      {/* Benches in plaza corners (off the main avenues) */}
      <Bench position={[-4, 0, -4]} rotation={Math.PI / 4} />
      <Bench position={[ 4, 0, -4]} rotation={-Math.PI / 4} />
      <Bench position={[-4, 0,  4]} rotation={(3 * Math.PI) / 4} />
      <Bench position={[ 4, 0,  4]} rotation={-(3 * Math.PI) / 4} />

      {/* Neighborhood amenities — middle-ring block interiors. Each footprint
          is ≤ 5×3.5, placed between the secondary road band (±18) and the
          outer building ring (~±27), so they slot into the empty quadrants
          without touching either. */}
      <Park position={[-22, 0, -22]} rotation={Math.PI / 6} />
      <Playground position={[22, 0, -22]} rotation={-Math.PI / 8} />
      <Pool position={[22, 0, 22]} rotation={Math.PI / 12} />
      <Park position={[-22, 0, 22]} rotation={-Math.PI / 5} />

      {/* Outer-suburb plazas — between the major outer districts. */}
      <Pool position={[8, 0, -45]} rotation={Math.PI / 8} />
      <Playground position={[10, 0, 40]} rotation={-Math.PI / 6} />
    </group>
  );
}
