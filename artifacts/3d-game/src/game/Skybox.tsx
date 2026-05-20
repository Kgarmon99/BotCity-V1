import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// Slowly shifting aurora band overhead
function Aurora() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.z = t * 0.02;
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 + Math.sin(t * 0.5) * 0.1;
    }
  });
  return (
    <mesh ref={ref} position={[0, 35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[20, 50, 64]} />
      <meshBasicMaterial
        color="#22c55e"
        transparent
        opacity={0.25}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function Aurora2() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.z = -t * 0.015;
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(t * 0.4 + 1) * 0.08;
    }
  });
  return (
    <mesh ref={ref} position={[0, 40, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[30, 60, 64]} />
      <meshBasicMaterial
        color="#fbbf24"
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Distant glowing moon
function Moon() {
  return (
    <group position={[-40, 30, -50]}>
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#dcfce7" />
      </mesh>
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.25} />
      </mesh>
      <mesh>
        <sphereGeometry args={[5.5, 32, 32]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

export default function Skybox() {
  return (
    <group>
      <Stars radius={120} depth={50} count={3000} factor={4} fade speed={0.5} />
      <Moon />
      <Aurora />
      <Aurora2 />
    </group>
  );
}
