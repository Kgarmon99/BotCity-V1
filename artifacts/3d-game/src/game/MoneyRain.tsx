import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { randomAngle, randomBetween, randomCentered } from "./random";

const COUNT = 200;
const AREA = 70;
const HEIGHT = 25;

interface MoneyParticle {
  x: number;
  y: number;
  z: number;
  speed: number;
  rotSpeed: number;
  rotation: number;
}

function randomMoneyXz(): number {
  return randomCentered(AREA);
}

function createMoneyParticle(): MoneyParticle {
  return {
    x: randomMoneyXz(),
    y: randomBetween(0, HEIGHT),
    z: randomMoneyXz(),
    speed: randomBetween(0.5, 1.7),
    rotSpeed: randomCentered(3),
    rotation: randomAngle(),
  };
}

export default function MoneyRain() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => {
    return Array.from({ length: COUNT }, createMoneyParticle);
  }, []);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    for (let i = 0; i < COUNT; i++) {
      const p = data[i];
      p.y -= p.speed * delta;
      p.rotation += p.rotSpeed * delta;
      if (p.y < 0.2) {
        p.y = HEIGHT;
        p.x = randomMoneyXz();
        p.z = randomMoneyXz();
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
