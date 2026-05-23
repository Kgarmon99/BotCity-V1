import { useRef, useMemo } from "react";
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

// Shooting star that streaks across the sky
function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null!);
  const trailRef = useRef<THREE.Mesh>(null!);
  const data = useMemo(() => ({
    speed: 15 + Math.random() * 20,
    angle: Math.random() * Math.PI * 2,
    height: 40 + Math.random() * 30,
    delay: Math.random() * 10,
  }), []);

  useFrame((state) => {
    const t = (state.clock.elapsedTime + data.delay) % 15;
    if (t > 2) {
      if (ref.current) ref.current.visible = false;
      if (trailRef.current) trailRef.current.visible = false;
      return;
    }
    const progress = t / 2;
    const x = Math.cos(data.angle) * (60 - progress * 120);
    const z = Math.sin(data.angle) * (60 - progress * 120);
    const y = data.height - progress * 10;
    if (ref.current) {
      ref.current.visible = true;
      ref.current.position.set(x, y, z);
    }
    if (trailRef.current) {
      trailRef.current.visible = true;
      trailRef.current.position.set(x + Math.cos(data.angle) * 3, y, z + Math.sin(data.angle) * 3);
      trailRef.current.lookAt(x, y, z);
    }
  });

  return (
    <group>
      <mesh ref={ref} visible={false}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      <mesh ref={trailRef} visible={false}>
        <cylinderGeometry args={[0.02, 0.08, 6, 4]} />
        <meshBasicMaterial color="#86efac" transparent opacity={0.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Nebula cloud bands
function Nebula() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.005;
    }
  });
  return (
    <mesh ref={ref} position={[0, 60, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial
        color="#064e3b"
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function Skybox() {
  return (
    <group>
      <Stars radius={150} depth={80} count={8000} factor={5} fade speed={0.3} />
      <Moon />
      <Aurora />
      <Aurora2 />
      <Nebula />
      {/* Multiple shooting stars */}
      {Array.from({ length: 5 }).map((_, i) => (
        <ShootingStar key={`star-${i}`} />
      ))}
    </group>
  );
}
