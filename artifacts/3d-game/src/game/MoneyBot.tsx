import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface MoneyBotProps {
  isMoving: React.MutableRefObject<boolean>;
}

export default function MoneyBot({ isMoving }: MoneyBotProps) {
  const bodyRef = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Group>(null!);
  const leftArmRef = useRef<THREE.Group>(null!);
  const rightArmRef = useRef<THREE.Group>(null!);
  const leftLegRef = useRef<THREE.Group>(null!);
  const rightLegRef = useRef<THREE.Group>(null!);
  const auraRef = useRef<THREE.Mesh>(null!);
  const aura2Ref = useRef<THREE.Mesh>(null!);
  const eyeLRef = useRef<THREE.MeshStandardMaterial>(null!);
  const eyeRRef = useRef<THREE.MeshStandardMaterial>(null!);
  const chestRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const moving = isMoving?.current ?? false;
    const walkSpeed = moving ? 10 : 0;
    const walkPhase = Math.sin(t * walkSpeed);
    const walkPhase2 = Math.cos(t * walkSpeed);

    // Body bob
    if (bodyRef.current) {
      const idleFloat = Math.sin(t * 2) * 0.05;
      const walkBob = moving ? Math.abs(walkPhase) * 0.1 : 0;
      bodyRef.current.position.y = 0.55 + idleFloat + walkBob;
      bodyRef.current.rotation.z = moving ? walkPhase * 0.04 : 0;
    }

    // Head wobble
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.5) * 0.15;
      headRef.current.rotation.z = moving ? walkPhase * 0.05 : Math.sin(t * 2) * 0.03;
    }

    // Arm swings
    if (leftArmRef.current && rightArmRef.current) {
      const armSwing = moving ? walkPhase * 0.6 : Math.sin(t * 1.5) * 0.1;
      leftArmRef.current.rotation.x = armSwing;
      rightArmRef.current.rotation.x = -armSwing;
    }

    // Leg swings
    if (leftLegRef.current && rightLegRef.current) {
      const legSwing = moving ? walkPhase * 0.7 : 0;
      leftLegRef.current.rotation.x = legSwing;
      rightLegRef.current.rotation.x = -legSwing;
    }

    // Aura pulse
    if (auraRef.current) {
      const pulse = 1 + Math.sin(t * 2.5) * 0.15;
      auraRef.current.scale.setScalar(pulse);
      (auraRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.35 + Math.sin(t * 2.5) * 0.15;
    }
    if (aura2Ref.current) {
      const pulse2 = 1.3 + Math.sin(t * 1.8 + 1) * 0.2;
      aura2Ref.current.scale.setScalar(pulse2);
      (aura2Ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.18 + Math.sin(t * 1.8 + 1) * 0.08;
    }

    // Eye blink
    if (eyeLRef.current && eyeRRef.current) {
      const blink = Math.sin(t * 8) > 0.97 ? 0 : 1;
      eyeLRef.current.emissiveIntensity = 2.5 * blink;
      eyeRRef.current.emissiveIntensity = 2.5 * blink;
    }

    // Chest emblem pulse
    if (chestRef.current) {
      chestRef.current.emissiveIntensity = 1.5 + Math.sin(t * 3) * 0.7;
    }
  });

  return (
    <group>
      {/* Aura rings on the ground */}
      <mesh ref={auraRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.1, 32]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={aura2Ref} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.6, 32]} />
        <meshBasicMaterial color="#86efac" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Glow point light following bot */}
      <pointLight position={[0, 1.5, 0]} intensity={2} color="#22c55e" distance={8} />

      {/* Bot body */}
      <group ref={bodyRef} position={[0, 0.55, 0]}>
        {/* Torso (rounded box) */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.9, 0.45]} />
          <meshStandardMaterial
            color="#15803d"
            emissive="#22c55e"
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>

        {/* Belly panel */}
        <mesh position={[0, -0.05, 0.23]}>
          <boxGeometry args={[0.45, 0.55, 0.02]} />
          <meshStandardMaterial
            color="#052e16"
            emissive="#86efac"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Chest $ emblem */}
        <Text
          position={[0, 0.1, 0.25]}
          fontSize={0.32}
          anchorX="center"
          anchorY="middle"
        >
          $
          <meshStandardMaterial
            ref={chestRef}
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </Text>

        {/* Shoulder bolts */}
        <mesh position={[0.38, 0.35, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#86efac" emissive="#86efac" emissiveIntensity={0.8} metalness={0.9} />
        </mesh>
        <mesh position={[-0.38, 0.35, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#86efac" emissive="#86efac" emissiveIntensity={0.8} metalness={0.9} />
        </mesh>

        {/* Head */}
        <group ref={headRef} position={[0, 0.7, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.5, 0.5]} />
            <meshStandardMaterial
              color="#166534"
              emissive="#22c55e"
              emissiveIntensity={0.35}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Eye visor backplate */}
          <mesh position={[0, 0.02, 0.26]}>
            <boxGeometry args={[0.42, 0.18, 0.02]} />
            <meshStandardMaterial color="#000000" />
          </mesh>

          {/* Eyes */}
          <mesh position={[-0.1, 0.02, 0.28]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial
              ref={eyeLRef}
              color="#bbf7d0"
              emissive="#22c55e"
              emissiveIntensity={2.5}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0.1, 0.02, 0.28]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial
              ref={eyeRRef}
              color="#bbf7d0"
              emissive="#22c55e"
              emissiveIntensity={2.5}
              toneMapped={false}
            />
          </mesh>

          {/* Mouth grille */}
          <mesh position={[0, -0.13, 0.26]}>
            <boxGeometry args={[0.2, 0.04, 0.02]} />
            <meshStandardMaterial color="#86efac" emissive="#86efac" emissiveIntensity={0.6} />
          </mesh>

          {/* Antenna */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.25, 6]} />
            <meshStandardMaterial color="#374151" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
          <pointLight position={[0, 0.5, 0]} intensity={1} color="#fbbf24" distance={4} />

          {/* Side fins */}
          <mesh position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI / 8]}>
            <boxGeometry args={[0.04, 0.18, 0.3]} />
            <meshStandardMaterial color="#86efac" emissive="#22c55e" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 8]}>
            <boxGeometry args={[0.04, 0.18, 0.3]} />
            <meshStandardMaterial color="#86efac" emissive="#22c55e" emissiveIntensity={0.6} />
          </mesh>
        </group>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.38, 0.25, 0]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
            <meshStandardMaterial color="#166534" emissive="#22c55e" emissiveIntensity={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.6, 0]} castShadow>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#15803d" emissive="#86efac" emissiveIntensity={0.5} metalness={0.9} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.38, 0.25, 0]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
            <meshStandardMaterial color="#166534" emissive="#22c55e" emissiveIntensity={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.6, 0]} castShadow>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#15803d" emissive="#86efac" emissiveIntensity={0.5} metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.18, 0.3, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
          <meshStandardMaterial color="#166534" emissive="#22c55e" emissiveIntensity={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.43, 0.05]} castShadow>
          <boxGeometry args={[0.22, 0.12, 0.3]} />
          <meshStandardMaterial color="#0f172a" emissive="#22c55e" emissiveIntensity={0.4} metalness={0.85} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.18, 0.3, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
          <meshStandardMaterial color="#166534" emissive="#22c55e" emissiveIntensity={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.43, 0.05]} castShadow>
          <boxGeometry args={[0.22, 0.12, 0.3]} />
          <meshStandardMaterial color="#0f172a" emissive="#22c55e" emissiveIntensity={0.4} metalness={0.85} />
        </mesh>
      </group>
    </group>
  );
}
