import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// GetMoneyBot.com brand blimp — slow circular orbit at altitude over the city.
// Path: radius 40 (just inside the world bound ±45), altitude 22 (well above
// the tallest outer skyscrapers at h=16). One full orbit takes ~60s.
const RADIUS = 78;
const ALTITUDE = 22;
const PERIOD = 60;

export default function Blimp() {
  const root = useRef<THREE.Group>(null!);
  const propRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!root.current) return;
    const t = state.clock.elapsedTime;
    const angle = (t / PERIOD) * Math.PI * 2;
    root.current.position.set(
      Math.cos(angle) * RADIUS,
      ALTITUDE + Math.sin(t * 0.45) * 0.6,
      Math.sin(angle) * RADIUS,
    );
    // Face direction of travel: tangent to the circle.
    // At angle=0 the blimp is at (R,0,0) moving toward +Z; setting
    // rotation.y = -angle - π/2 rotates the local +X (nose) to align.
    root.current.rotation.y = -angle - Math.PI / 2;
    // Gentle banking on the bob
    root.current.rotation.z = Math.sin(t * 0.45) * 0.06;

    if (propRef.current) propRef.current.rotation.x = t * 8;
  });

  return (
    <group ref={root}>
      {/* Elongated body — scaled sphere along local X (nose direction) */}
      <group scale={[3, 1, 1]}>
        <mesh castShadow>
          <sphereGeometry args={[1.5, 28, 18]} />
          <meshStandardMaterial
            color="#ede9fe"
            emissive="#a855f7"
            emissiveIntensity={0.28}
            metalness={0.25}
            roughness={0.55}
          />
        </mesh>
      </group>

      {/* Side banner — left flank (+Z) */}
      <mesh position={[0, 0, 2.22]}>
        <planeGeometry args={[7, 1.4]} />
        <meshStandardMaterial
          color="#0b0823"
          emissive="#7c3aed"
          emissiveIntensity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Text
        position={[0, 0, 2.28]}
        fontSize={0.7}
        color="#22d3ee"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.045}
        outlineColor="#0b0823"
        maxWidth={6.6}
      >
        💰 GETMONEYBOT.COM
      </Text>

      {/* Side banner — right flank (-Z), flipped so it reads from outside */}
      <mesh position={[0, 0, -2.22]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[7, 1.4]} />
        <meshStandardMaterial
          color="#0b0823"
          emissive="#7c3aed"
          emissiveIntensity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Text
        position={[0, 0, -2.28]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.7}
        color="#22d3ee"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.045}
        outlineColor="#0b0823"
        maxWidth={6.6}
      >
        💰 GETMONEYBOT.COM
      </Text>

      {/* Tail fins at rear (-X) — vertical + two horizontals */}
      <mesh position={[-6.15, 0.9, 0]}>
        <boxGeometry args={[1.3, 1.3, 0.08]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#a855f7"
          emissiveIntensity={0.7}
        />
      </mesh>
      <mesh position={[-6.15, 0, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[1.3, 1.1, 0.08]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#a855f7"
          emissiveIntensity={0.7}
        />
      </mesh>
      <mesh position={[-6.15, 0, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[1.3, 1.1, 0.08]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#a855f7"
          emissiveIntensity={0.7}
        />
      </mesh>

      {/* Gondola hanging below */}
      <mesh position={[0.6, -1.6, 0]} castShadow>
        <boxGeometry args={[1.8, 0.55, 0.85]} />
        <meshStandardMaterial
          color="#1e1b4b"
          emissive="#22d3ee"
          emissiveIntensity={0.4}
          metalness={0.55}
          roughness={0.4}
        />
      </mesh>
      {/* Gondola window strip */}
      <mesh position={[0.6, -1.55, 0.65]}>
        <boxGeometry args={[1.5, 0.22, 0.02]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.6, -1.55, -0.64]}>
        <boxGeometry args={[1.5, 0.22, 0.02]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>

      {/* Spinning rear propeller */}
      <mesh ref={propRef} position={[-6.9, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.04, 1.2, 0.12]} />
        <meshStandardMaterial color="#0b0823" metalness={0.7} />
      </mesh>

      {/* Belly running lights (4 small emissive points) */}
      {[-2.5, -0.8, 0.9, 2.6].map((x, i) => (
        <mesh key={`light-${i}`} position={[x, -1.05, 0]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#fde047" : "#22d3ee"}
            emissive={i % 2 === 0 ? "#fde047" : "#22d3ee"}
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
