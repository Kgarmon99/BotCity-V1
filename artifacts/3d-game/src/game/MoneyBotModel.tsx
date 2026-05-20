import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";

// Official MoneyBot character (SilverSkin GLB) served from /public.
// Materials: Face, Coin, Silver, Hat, eyes. Animations:
//   Flip, FlyDown, FlyUp, Idle, LeftHand, RightHand, TwistJump, UpPoint.
const MONEYBOT_MODEL_URL = `${import.meta.env.BASE_URL}moneybot.glb`;

export type MoneyBotAnim =
  | "Idle"
  | "UpPoint"
  | "Flip"
  | "FlyUp"
  | "FlyDown"
  | "TwistJump"
  | "LeftHand"
  | "RightHand";

interface Props {
  scale?: number;
  animation?: MoneyBotAnim;
  /** 0..1 phase offset so multiple instances don't move in lock-step. */
  phase?: number;
}

export function MoneyBotModel({ scale = 1.5, animation = "Idle", phase = 0 }: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(MONEYBOT_MODEL_URL);

  // Skeleton-aware clone — each instance gets its own bones + animation
  // mixer state. A plain scene.clone() would share the skinned skeleton
  // across mounts, causing all statues to collapse to one position.
  const cloned = useMemo(() => cloneSkeleton(scene), [scene]);

  useEffect(() => {
    cloned.traverse((obj) => {
      const m = obj as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
  }, [cloned]);

  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    const action = actions[animation];
    if (!action) return;
    action.reset().fadeIn(0.4).play();
    // Stagger start time so an 8-statue lineup doesn't beat in unison.
    const dur = action.getClip().duration;
    if (dur > 0) action.time = (phase % 1) * dur;
    return () => {
      action.fadeOut(0.2);
      action.stop();
    };
  }, [actions, animation, phase]);

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload(MONEYBOT_MODEL_URL);
