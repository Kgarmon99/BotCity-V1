import { useRef, useEffect, Suspense, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/SilverSkin.glb");

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

function SilverSkinModel({ isMoving }: { isMoving: React.MutableRefObject<boolean> }) {
  const { scene, animations } = useGLTF("/SilverSkin.glb");
  const group = useRef<THREE.Group>(null!);

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).castShadow = true;
      }
    });
    return c;
  }, [scene]);

  const { actions, names } = useAnimations(animations, group);

  const { scale, yOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const targetHeight = 1.8;
    const s = targetHeight / (size.y || 1);
    return { scale: s, yOffset: -(box.min.y * s) };
  }, [cloned]);

  // Play first available animation if any exist
  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]]!.reset().fadeIn(0.3).play();
    }
  }, [actions, names]);

  // Walking bob effect
  useFrame((state) => {
    if (group.current) {
      const moving = isMoving?.current ?? false;
      const t = state.clock.elapsedTime;
      group.current.position.y = moving ? Math.abs(Math.sin(t * 12)) * 0.08 : 0;
      group.current.rotation.z = moving ? Math.sin(t * 12) * 0.04 : 0;
    }
  });

  return (
    <group ref={group}>
      <primitive object={cloned} scale={[scale, scale, scale]} position={[0, yOffset, 0]} />
    </group>
  );
}

function FallbackCharacter() {
  return (
    <group>
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.6, 1.4, 0.4]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.15} emissive="#22d3ee" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 1.65, 0]} castShadow>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#a0a0b0" metalness={0.95} roughness={0.05} emissive="#22d3ee" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
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

      const bound = 22;
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
      {/* Player ring indicator - always visible */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.9, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} />
      </mesh>
      {/* Floating arrow above player */}
      <mesh position={[0, 2.8, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.18, 0.4, 4]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
      </mesh>
      <Suspense fallback={<FallbackCharacter />}>
        <SilverSkinModel isMoving={isMoving} />
      </Suspense>
    </group>
  );
}
