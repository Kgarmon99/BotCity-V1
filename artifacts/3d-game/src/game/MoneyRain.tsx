import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 200;
const AREA = 50;
const HEIGHT = 25;

export default function MoneyRain() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => {
    return Array.from({ length: COUNT }).map(() => ({
      x: (Math.random() - 0.5) * AREA,
      y: Math.random() * HEIGHT,
      z: (Math.random() - 0.5) * AREA,
      speed: 0.5 + Math.random() * 1.2,
      rotSpeed: (Math.random() - 0.5) * 3,
      rotation: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    for (let i = 0; i < COUNT; i++) {
      const p = data[i];
      p.y -= p.speed * delta;
      p.rotation += p.rotSpeed * delta;
      if (p.y < 0.2) {
        p.y = HEIGHT;
        p.x = (Math.random() - 0.5) * AREA;
        p.z = (Math.random() - 0.5) * AREA;
      }
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rotation, p.rotation * 0.7, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <planeGeometry args={[0.18, 0.08]} />
      <meshStandardMaterial
        color="#22c55e"
        emissive="#22c55e"
        emissiveIntensity={1.5}
        side={THREE.DoubleSide}
        transparent
        opacity={0.85}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
