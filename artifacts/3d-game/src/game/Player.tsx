import { useRef, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/SilverSkin.glb");

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

function SilverSkinModel() {
  const { scene } = useGLTF("/SilverSkin.glb");
  const cloned = scene.clone(true);

  cloned.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      (child as THREE.Mesh).castShadow = true;
      (child as THREE.Mesh).receiveShadow = true;
    }
  });

  return <primitive object={cloned} scale={[1, 1, 1]} position={[0, -0.75, 0]} />;
}

function FallbackCharacter() {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color="#a0a0b0" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

export default function Player({ onPositionChange, onInteract }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const velocity = useRef(new THREE.Vector3());
  const [, getKeys] = useKeyboardControls<Controls>();
  const speed = 6;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "e" || e.key === "E") {
        if (groupRef.current) {
          onInteract(groupRef.current.position.clone());
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

    if (groupRef.current) {
      groupRef.current.position.add(velocity.current);

      const bound = 22;
      groupRef.current.position.x = Math.max(-bound, Math.min(bound, groupRef.current.position.x));
      groupRef.current.position.z = Math.max(-bound, Math.min(bound, groupRef.current.position.z));
      groupRef.current.position.y = 0.75;

      if (dir.length() > 0.001) {
        const angle = Math.atan2(dir.x, dir.z);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          angle,
          0.15
        );
      }

      onPositionChange(groupRef.current.position.clone());
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.75, 0]}>
      <Suspense fallback={<FallbackCharacter />}>
        <SilverSkinModel />
      </Suspense>
    </group>
  );
}
