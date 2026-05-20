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
      {/* District pylons near each building */}
      <DistrictPylon position={[-13, 0, -8]} label="WORK\nDISTRICT" color="#60a5fa" />
      <DistrictPylon position={[13, 0, -8]} label="MARKET\nDISTRICT" color="#fbbf24" />
      <DistrictPylon position={[-13, 0, 8]} label="FINANCIAL\nDISTRICT" color="#a78bfa" />
      <DistrictPylon position={[13, 0, 8]} label="GOV\nDISTRICT" color="#f87171" />

      {/* Welcome pylons at city entry points */}
      <DistrictPylon position={[0, 0, -22]} label="WELCOME\nTO\nBOTCITY" color="#4ade80" />
      <DistrictPylon position={[0, 0, 22]} label="POP. 9001\nBOTS" color="#86efac" rotation={Math.PI} />

      {/* Hover platforms scattered */}
      <HoverPlatform position={[-6, 2.5, -6]} color="#22c55e" />
      <HoverPlatform position={[6, 2.5, -6]} color="#fbbf24" />
      <HoverPlatform position={[-6, 2.5, 6]} color="#4ade80" />
      <HoverPlatform position={[6, 2.5, 6]} color="#86efac" />

      {/* Benches around plaza */}
      <Bench position={[-5, 0, 0]} rotation={Math.PI / 2} />
      <Bench position={[5, 0, 0]} rotation={-Math.PI / 2} />
      <Bench position={[0, 0, -5]} />
      <Bench position={[0, 0, 5]} rotation={Math.PI} />
    </group>
  );
}
