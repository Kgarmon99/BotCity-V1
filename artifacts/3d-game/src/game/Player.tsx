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

  // Measure the model's natural bounding box so we can auto-scale it
  const box = new THREE.Box3().setFromObject(cloned);
  const size = new THREE.Vector3();
  box.getSize(size);

  // Target height: ~1.6 units (about 1.6m for a character)
  const targetHeight = 1.6;
  const scale = targetHeight / (size.y || 1);

  // Shift the model so its feet sit at y=0
  const center = new THREE.Vector3();
  box.getCenter(center);
  const yOffset = -(box.min.y * scale);

  cloned.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      (child as THREE.Mesh).castShadow = true;
    }
  });

  return (
    <primitive
      object={cloned}
      scale={[scale, scale, scale]}
      position={[0, yOffset, 0]}
    />
  );
}

function FallbackCharacter() {
  return (
    <group>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.5, 1.2, 0.35]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.24, 12, 12]} />
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
    if (back)    dir.z += 1;
    if (left)    dir.x -= 1;
    if (right)   dir.x += 1;

    dir.normalize().multiplyScalar(speed * delta);
    velocity.current.lerp(dir, 0.25);

    if (groupRef.current) {
      groupRef.current.position.x += velocity.current.x;
      groupRef.current.position.z += velocity.current.z;
      // Keep player on ground
      groupRef.current.position.y = 0;

      // Clamp to world bounds
      const bound = 22;
      groupRef.current.position.x = Math.max(-bound, Math.min(bound, groupRef.current.position.x));
      groupRef.current.position.z = Math.max(-bound, Math.min(bound, groupRef.current.position.z));

      // Face movement direction
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
    <group ref={groupRef} position={[0, 0, 0]}>
      <Suspense fallback={<FallbackCharacter />}>
        <SilverSkinModel />
      </Suspense>
    </group>
  );
}
