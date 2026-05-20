import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import MoneyBot from "./MoneyBot";

interface Keys {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
}

interface PlayerProps {
  onPositionChange: (pos: THREE.Vector3) => void;
  onInteract: (pos: THREE.Vector3) => void;
  isMoving: React.MutableRefObject<boolean>;
}

export default function Player({ onPositionChange, onInteract, isMoving }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const velocity = useRef(new THREE.Vector3());
  const keys = useRef<Keys>({ forward: false, back: false, left: false, right: false });
  const speed = 7;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp"    || e.key === "w" || e.key === "W") keys.current.forward = true;
      if (e.key === "ArrowDown"  || e.key === "s" || e.key === "S") keys.current.back    = true;
      if (e.key === "ArrowLeft"  || e.key === "a" || e.key === "A") keys.current.left    = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.current.right   = true;
      if (e.key === "e" || e.key === "E") {
        if (groupRef.current) onInteract(groupRef.current.position.clone());
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp"    || e.key === "w" || e.key === "W") keys.current.forward = false;
      if (e.key === "ArrowDown"  || e.key === "s" || e.key === "S") keys.current.back    = false;
      if (e.key === "ArrowLeft"  || e.key === "a" || e.key === "A") keys.current.left    = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.current.right   = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [onInteract]);

  useFrame((_state, delta) => {
    const { forward, back, left, right } = keys.current;
    const dir = new THREE.Vector3();

    if (forward) dir.z -= 1;
    if (back)    dir.z += 1;
    if (left)    dir.x -= 1;
    if (right)   dir.x += 1;

    if (dir.length() > 0) dir.normalize();
    dir.multiplyScalar(speed * delta);
    velocity.current.lerp(dir, 0.3);

    if (groupRef.current) {
      groupRef.current.position.x += velocity.current.x;
      groupRef.current.position.z += velocity.current.z;

      const bound = 44;
      groupRef.current.position.x = Math.max(-bound, Math.min(bound, groupRef.current.position.x));
      groupRef.current.position.z = Math.max(-bound, Math.min(bound, groupRef.current.position.z));

      isMoving.current = velocity.current.length() > 0.02;

      if (isMoving.current) {
        const angle = Math.atan2(velocity.current.x, velocity.current.z);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          angle,
          0.2
        );
      }

      onPositionChange(groupRef.current.position.clone());
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Always-visible yellow arrow above bot */}
      <mesh position={[0, 2.6, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.18, 0.4, 4]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} toneMapped={false} />
      </mesh>
      <MoneyBot isMoving={isMoving} />
    </group>
  );
}
