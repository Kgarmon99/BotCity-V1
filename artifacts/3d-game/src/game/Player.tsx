import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
}

interface PlayerProps {
  onPositionChange: (pos: THREE.Vector3) => void;
  onInteract: (pos: THREE.Vector3) => void;
}

export default function Player({ onPositionChange, onInteract }: PlayerProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const velocity = useRef(new THREE.Vector3());
  const [, getKeys] = useKeyboardControls<Controls>();
  const speed = 6;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "e" || e.key === "E") {
        if (meshRef.current) {
          onInteract(meshRef.current.position.clone());
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onInteract]);

  useFrame((_state, delta) => {
    const { forward, back, left, right } = getKeys();
    const dir = new THREE.Vector3();

    if (forward) dir.z -= 1;
    if (back) dir.z += 1;
    if (left) dir.x -= 1;
    if (right) dir.x += 1;

    dir.normalize().multiplyScalar(speed * delta);
    velocity.current.lerp(dir, 0.2);

    if (meshRef.current) {
      meshRef.current.position.add(velocity.current);

      const bound = 22;
      meshRef.current.position.x = Math.max(-bound, Math.min(bound, meshRef.current.position.x));
      meshRef.current.position.z = Math.max(-bound, Math.min(bound, meshRef.current.position.z));
      meshRef.current.position.y = 0.75;

      if (dir.length() > 0.001) {
        const angle = Math.atan2(dir.x, dir.z);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          angle,
          0.15
        );
      }

      onPositionChange(meshRef.current.position.clone());
    }
  });

  return (
    <group ref={meshRef} position={[0, 0.75, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0, 0.35, 0.22]}>
        <boxGeometry args={[0.5, 0.55, 0.05]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
    </group>
  );
}
