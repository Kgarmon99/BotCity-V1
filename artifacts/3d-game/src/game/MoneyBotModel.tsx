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
  /** Hold the animation as a static pose (no motion). Used for statues. */
  paused?: boolean;
}

export function MoneyBotModel({ scale = 1.5, animation = "Idle", phase = 0, paused = false }: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(MONEYBOT_MODEL_URL);

  // Skeleton-aware clone — each instance gets its own bones + animation
  // mixer state. A plain scene.clone() would share the skinned skeleton
  // across mounts, causing all statues to collapse to one position.
  const cloned = useMemo(() => cloneSkeleton(scene), [scene]);

  useEffect(() => {
    // Ground the model: shift the cloned root so the lowest mesh point
    // sits at y=0 in local space. This way callers can drop the group at
    // pedestal/floor level and the bot's feet land exactly there — no
    // more half-buried statues.
    cloned.position.set(0, 0, 0);
    cloned.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(cloned);
    if (Number.isFinite(box.min.y)) {
      cloned.position.y = -box.min.y;
    }
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
    action.reset().play();
    const dur = action.getClip().duration;
    if (paused) {
      // Snap to the frame we want to freeze on and stop the mixer ticking.
      // phase∈[0,1] picks which frame of the clip becomes the static pose.
      if (dur > 0) action.time = (phase % 1) * dur;
      action.paused = true;
    } else {
      // Animated: stagger start time so duplicates don't beat in unison.
      if (dur > 0) action.time = (phase % 1) * dur;
      action.fadeIn(0.4);
    }
    return () => {
      action.fadeOut(0.2);
      action.stop();
    };
  }, [actions, animation, phase, paused]);

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload(MONEYBOT_MODEL_URL);
