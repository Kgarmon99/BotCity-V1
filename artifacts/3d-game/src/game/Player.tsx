import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import MoneyBot from "./MoneyBot";
import { BotMobile } from "./CityDistricts";
import { useGameStore } from "./gameStore";
import { cameraInput } from "./cameraInput";
import { touchInput } from "./touchInput";
import { playerTracker } from "./playerTracker";

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

const WALK_SPEED = 7;
const RIDE_SPEED = 17; // BotMobile boost (~2.4x walking)

export default function Player({ onPositionChange, onInteract, isMoving }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const velocity = useRef(new THREE.Vector3());
  const keys = useRef<Keys>({ forward: false, back: false, left: false, right: false });
  const ridingRef = useRef(false);
  const [riding, setRiding] = useState(false);
  const cameraMode = useGameStore((s) => s.cameraMode);
  // Track the last touch interact tick we've consumed so a single tap fires
  // onInteract exactly once.
  const lastInteractTick = useRef(touchInput.interactTick);
  // Latch the on-screen ride button state so we can stop riding on release
  // even when the keyboard space-bar isn't involved.
  const lastTouchRide = useRef(false);

  useEffect(() => {
    // Ignore game keys while the user is typing in a form input.
    const isTypingInForm = (target: EventTarget | null) => {
      const t = target as HTMLElement | null;
      return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
    };
    const stopRiding = () => {
      if (ridingRef.current) {
        ridingRef.current = false;
        setRiding(false);
      }
    };

    const down = (e: KeyboardEvent) => {
      if (isTypingInForm(e.target)) return;
      if (e.key === "ArrowUp"    || e.key === "w" || e.key === "W") keys.current.forward = true;
      if (e.key === "ArrowDown"  || e.key === "s" || e.key === "S") keys.current.back    = true;
      if (e.key === "ArrowLeft"  || e.key === "a" || e.key === "A") keys.current.left    = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.current.right   = true;
      if (e.key === "e" || e.key === "E") {
        if (groupRef.current) onInteract(groupRef.current.position.clone());
      }
      if (e.code === "Space" || e.key === " ") {
        // Prevent the browser from scrolling the page while we drive.
        e.preventDefault();
        if (!ridingRef.current) {
          ridingRef.current = true;
          setRiding(true);
        }
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp"    || e.key === "w" || e.key === "W") keys.current.forward = false;
      if (e.key === "ArrowDown"  || e.key === "s" || e.key === "S") keys.current.back    = false;
      if (e.key === "ArrowLeft"  || e.key === "a" || e.key === "A") keys.current.left    = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.current.right   = false;
      if (e.code === "Space" || e.key === " ") {
        stopRiding();
      }
    };
    // If the window loses focus (Alt+Tab, etc) we never get the keyup —
    // clear all held keys so the player doesn't run off / get stuck in the car.
    const onBlur = () => {
      keys.current.forward = false;
      keys.current.back = false;
      keys.current.left = false;
      keys.current.right = false;
      stopRiding();
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", onBlur);
    };
  }, [onInteract]);

  useFrame((_state, delta) => {
    // Touch interact button — edge-triggered (tap once, fire once).
    if (touchInput.interactTick !== lastInteractTick.current) {
      lastInteractTick.current = touchInput.interactTick;
      if (groupRef.current) onInteract(groupRef.current.position.clone());
    }
    // Touch ride button — held = riding, released = stop.
    if (touchInput.rideHeld !== lastTouchRide.current) {
      lastTouchRide.current = touchInput.rideHeld;
      if (touchInput.rideHeld) {
        if (!ridingRef.current) {
          ridingRef.current = true;
          setRiding(true);
        }
      } else if (ridingRef.current) {
        ridingRef.current = false;
        setRiding(false);
      }
    }

    const { forward, back, left, right } = keys.current;
    // Merge keyboard (binary) with joystick (analog). Take the larger
    // magnitude per axis so holding the joystick fully forward + tapping W
    // doesn't double up.
    const kbX = (right ? 1 : 0) - (left ? 1 : 0);
    const kbZ = (back ? 1 : 0) - (forward ? 1 : 0); // back = +Z, forward = -Z
    const pickAxis = (kb: number, touch: number) =>
      Math.abs(kb) >= Math.abs(touch) ? kb : touch;
    const inX = pickAxis(kbX, touchInput.moveX);
    const inZ = pickAxis(kbZ, touchInput.moveZ * -1); // joystick fwd = -Z
    const dir = new THREE.Vector3();

    if (cameraMode === 4) {
      // Orbit mode: input is camera-relative. inZ < 0 = forward (away from
      // camera), inX > 0 = right. Build movement vector in world space using
      // the camera's yaw.
      const yaw = cameraInput.yaw;
      const fx = -Math.sin(yaw);
      const fz = -Math.cos(yaw);
      const rx = -fz;
      const rz = fx;
      // -inZ because inZ "back" is +Z in world; we want forward to drive +f.
      dir.x += fx * -inZ + rx * inX;
      dir.z += fz * -inZ + rz * inX;
    } else {
      dir.x += inX;
      dir.z += inZ;
    }

    // Cap magnitude at 1 so analog joystick + keyboard combo never moves
    // faster than the speed limit.
    if (dir.length() > 1) dir.normalize();
    const speed = ridingRef.current ? RIDE_SPEED : WALK_SPEED;
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

      // Mirror the position into the shared tracker so out-of-Canvas UI
      // (MiniMap) can read it without subscribing to React state.
      playerTracker.x = groupRef.current.position.x;
      playerTracker.z = groupRef.current.position.z;
      playerTracker.yaw = groupRef.current.rotation.y;

      onPositionChange(groupRef.current.position.clone());
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <PlayerIndicator />
      {riding ? (
        // BotMobile's headlights are along its local +X axis. Rotating by
        // -π/2 around Y maps local +X → local +Z, aligning the car's front
        // with the player's "forward" convention so it drives nose-first.
        <group rotation={[0, -Math.PI / 2, 0]}>
          <BotMobile pos={[0, 0, 0]} color="#dc2626" accent="#fde047" />
        </group>
      ) : (
        <MoneyBot isMoving={isMoving} />
      )}
    </group>
  );
}

// Floating gold-and-green halo above the player so they can spot themselves at a glance.
function PlayerIndicator() {
  const ringRef = useRef<THREE.Mesh>(null!);
  const orbRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ringRef.current) ringRef.current.rotation.z = t * 0.8;
    if (orbRef.current) {
      orbRef.current.position.y = 2.7 + Math.sin(t * 2) * 0.08;
      (orbRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        1.8 + Math.sin(t * 3) * 0.6;
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(t * 2) * 0.12;
      glowRef.current.scale.set(s, s, s);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(t * 2) * 0.12;
    }
  });
  return (
    <group>
      <mesh ref={glowRef} position={[0, 2.7, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh ref={ringRef} position={[0, 2.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.04, 8, 24]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh ref={orbRef} position={[0, 2.7, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#86efac" emissive="#22c55e" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}
