import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MoneyBotModel, type MoneyBotAnim } from "./MoneyBotModel";
import { BotMobile, BotVette } from "./CityDistricts";
import { useGameStore } from "./gameStore";
import { cameraInput } from "./cameraInput";
import { touchInput } from "./touchInput";
import { playerTracker } from "./playerTracker";
import { sound } from "./sound";
import { PLAYER_BOUND } from "./cityConstants";

interface Keys {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  jet: boolean;
}

interface PlayerProps {
  onPositionChange: (pos: THREE.Vector3) => void;
  onInteract: (pos: THREE.Vector3) => void;
  isMoving: React.MutableRefObject<boolean>;
}

const WALK_SPEED = 9;
const RIDE_SPEED = 22; // BotMobile boost (~2.4x walking)
const VETTE_SPEED = 42; // BotVette boost (~4.7x walking) — held with V
const JETPACK_THRUST = 32; // upward accel when Shift held (m/s²)
const JETPACK_TAKEOFF_IMPULSE = 9; // instant vertical kick on jet press near ground
const JETPACK_AIR_BOOST = 1.4; // horizontal-speed multiplier while jetting airborne
const SOFT_CEILING = 45; // start tapering thrust here for smooth approach
const GRAVITY = 22; // downward accel (m/s²)
const MAX_ALTITUDE = 55; // ceiling so we don't fly off the skybox
const TERMINAL_FALL = -30; // clamp downward velocity
const LANDING_THUD_VEL = -12; // |vy| above this on landing → louder thud

export default function Player({ onPositionChange, onInteract, isMoving }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const velocity = useRef(new THREE.Vector3());
  const verticalVel = useRef(0);
  const keys = useRef<Keys>({ forward: false, back: false, left: false, right: false, jet: false });
  const ridingRef = useRef(false);
  const [riding, setRiding] = useState(false);
  const vetteRef = useRef(false);
  const [vetteOn, setVetteOn] = useState(false);
  const [jetting, setJetting] = useState(false);
  const [anim, setAnim] = useState<MoneyBotAnim>("Idle");
  // Track the last value pushed to sound.setJetpack so we only call it on
  // transitions, not 60x/sec from useFrame. Belt-and-suspenders alongside
  // sound.ts's own idempotency check.
  const lastJetSound = useRef(false);
  // Per-frame ref for JetpackFlame to read (avoids stale-prop bug where
  // Player doesn't re-render every time the jet key transitions while
  // already airborne).
  const thrustingRef = useRef(false);
  // Wrapper around MoneyBotModel for banking/pitch tilt while flying or
  // running. Separate from groupRef so we don't fight the yaw lerp.
  const tiltRef = useRef<THREE.Group>(null!);
  // Footstep cadence: accumulate horizontal distance moved on the ground and
  // fire a step thud every STEP_DISTANCE units. Alternates left/right pitch.
  const stepDistAccum = useRef(0);
  const stepAlt = useRef(false);
  const cameraMode = useGameStore((s) => s.cameraMode);
  const pendingTeleport = useGameStore((s) => s.pendingTeleport);
  const clearTeleport = useGameStore((s) => s.clearTeleport);

  // Fast-travel: when a dialog button sets `pendingTeleport`, snap the player
  // to the destination, kill velocity / vertical state, and clear the request.
  useEffect(() => {
    if (!pendingTeleport || !groupRef.current) return;
    const [x, y, z] = pendingTeleport;
    groupRef.current.position.set(x, y, z);
    velocity.current.set(0, 0, 0);
    verticalVel.current = 0;
    // Dismount any active vehicle so the bot actually appears at the spot.
    ridingRef.current = false;
    vetteRef.current = false;
    setRiding(false);
    setVetteOn(false);
    onPositionChange(groupRef.current.position.clone());
    clearTeleport();
  }, [pendingTeleport, clearTeleport, onPositionChange]);
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
    const stopVette = () => {
      if (vetteRef.current) {
        vetteRef.current = false;
        setVetteOn(false);
      }
      stopRiding();
    };

    const down = (e: KeyboardEvent) => {
      if (isTypingInForm(e.target)) return;
      if (e.key === "ArrowUp"    || e.key === "w" || e.key === "W") keys.current.forward = true;
      if (e.key === "ArrowDown"  || e.key === "s" || e.key === "S") keys.current.back    = true;
      if (e.key === "ArrowLeft"  || e.key === "a" || e.key === "A") keys.current.left    = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.current.right   = true;
      if (e.key === "Shift" || e.code === "ShiftLeft" || e.code === "ShiftRight") {
        keys.current.jet = true;
      }
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
      if (e.key === "v" || e.key === "V") {
        // Hold V to swap the BotMobile for a faster BotVette (Corvette-style).
        if (!vetteRef.current) {
          vetteRef.current = true;
          setVetteOn(true);
        }
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
      if (e.key === "Shift" || e.code === "ShiftLeft" || e.code === "ShiftRight") {
        keys.current.jet = false;
      }
      if (e.code === "Space" || e.key === " ") {
        stopRiding();
      }
      if (e.key === "v" || e.key === "V") {
        stopVette();
      }
    };
    // If the window loses focus (Alt+Tab, etc) we never get the keyup —
    // clear all held keys so the player doesn't run off / get stuck in the car.
    const onBlur = () => {
      keys.current.forward = false;
      keys.current.back = false;
      keys.current.left = false;
      keys.current.right = false;
      keys.current.jet = false;
      stopVette();
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", onBlur);
      // If the Player unmounts mid-thrust (HMR, route change), make sure
      // the whoosh doesn't outlive the component.
      sound.setJetpack(false);
      lastJetSound.current = false;
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

    // City editor freezes the player so the camera + cursor stay still.
    if (useGameStore.getState().editMode) {
      velocity.current.set(0, 0, 0);
      return;
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
    // While airborne with the jetpack active, give horizontal movement a
    // boost so flying actually feels like flying instead of slow drifting.
    const yNow = groupRef.current ? groupRef.current.position.y : 0;
    const jetHeldNow = (keys.current.jet || touchInput.jetHeld) && !ridingRef.current;
    const airBoost = yNow > 0.5 && jetHeldNow ? JETPACK_AIR_BOOST : 1;
    const speed = (vetteRef.current ? VETTE_SPEED : ridingRef.current ? RIDE_SPEED : WALK_SPEED) * airBoost;
    dir.multiplyScalar(speed * delta);
    velocity.current.lerp(dir, 0.3);

    if (groupRef.current) {
      groupRef.current.position.x += velocity.current.x;
      groupRef.current.position.z += velocity.current.z;

      // ── Jetpack: Shift (or on-screen button) adds upward thrust; gravity
      // pulls back down. Disabled while riding the BotMobile (cars don't fly).
      const jetActive = (keys.current.jet || touchInput.jetHeld) && !ridingRef.current;
      thrustingRef.current = jetActive;
      // Drive the jetpack whoosh sound + apply a takeoff impulse only on
      // transitions. The takeoff impulse gives an instant felt kick on
      // jet press from (near) the ground instead of waiting for thrust
      // to overcome gravity over several frames.
      if (jetActive !== lastJetSound.current) {
        if (jetActive && groupRef.current.position.y < 0.6) {
          verticalVel.current = Math.max(verticalVel.current, JETPACK_TAKEOFF_IMPULSE);
        }
        lastJetSound.current = jetActive;
        sound.setJetpack(jetActive);
      }
      // Soft ceiling: linearly taper UPWARD thrust as we approach the
      // skybox cap so the player eases into hover instead of slamming
      // into an invisible wall.
      const yPos = groupRef.current.position.y;
      const ceilingTaper =
        yPos > SOFT_CEILING
          ? Math.max(0, 1 - (yPos - SOFT_CEILING) / (MAX_ALTITUDE - SOFT_CEILING))
          : 1;
      const thrust = jetActive ? JETPACK_THRUST * ceilingTaper : 0;
      const accel = thrust - GRAVITY;
      verticalVel.current = Math.max(TERMINAL_FALL, verticalVel.current + accel * delta);
      groupRef.current.position.y += verticalVel.current * delta;
      if (groupRef.current.position.y <= 0) {
        // Landing: trigger a thud if we hit the ground with significant
        // downward speed (felt like a real landing, not a feather touch).
        if (verticalVel.current < LANDING_THUD_VEL) {
          sound.step(false);
          sound.step(true);
        }
        groupRef.current.position.y = 0;
        if (verticalVel.current < 0) verticalVel.current = 0;
      }
      if (groupRef.current.position.y >= MAX_ALTITUDE) {
        groupRef.current.position.y = MAX_ALTITUDE;
        if (verticalVel.current > 0) verticalVel.current = 0;
      }
      const isAirborne = groupRef.current.position.y > 0.01;
      const showJet = jetActive || isAirborne;
      if (showJet !== jetting) setJetting(showJet);

      // Pick MoneyBot animation based on movement / jetpack state.
      //   • Airborne + going up  → FlyUp
      //   • Airborne + going down → FlyDown
      //   • Moving on ground      → TwistJump (closest "active" loop in clip set)
      //   • Otherwise             → Idle
      let nextAnim: MoneyBotAnim = "Idle";
      if (isAirborne) {
        nextAnim = verticalVel.current >= 0 ? "FlyUp" : "FlyDown";
      } else if (isMoving.current) {
        nextAnim = "TwistJump";
      }
      if (nextAnim !== anim) setAnim(nextAnim);

      const bound = PLAYER_BOUND;
      groupRef.current.position.x = Math.max(-bound, Math.min(bound, groupRef.current.position.x));
      groupRef.current.position.z = Math.max(-bound, Math.min(bound, groupRef.current.position.z));

      isMoving.current = velocity.current.length() > 0.02;

      // Footsteps: only on the ground, only while actually walking (not in
      // the BotMobile — wheels don't go thud). Accumulate horizontal
      // displacement (velocity here is per-frame meters) and fire a step
      // every STEP_DISTANCE units of ground travel. At WALK_SPEED=9 u/s,
      // 3.0u/step → ~3 Hz cadence, which sounds like a natural jog. We
      // subtract (not reset) the threshold so leftover distance carries
      // over to the next step → cadence stays stable across frame hiccups.
      const STEP_DISTANCE = 3.0;
      if (isMoving.current && !isAirborne && !ridingRef.current) {
        stepDistAccum.current += velocity.current.length();
        if (stepDistAccum.current >= STEP_DISTANCE) {
          stepDistAccum.current -= STEP_DISTANCE;
          stepAlt.current = !stepAlt.current;
          sound.step(stepAlt.current);
        }
      } else {
        // Reset so the first step after stopping/landing isn't immediate.
        stepDistAccum.current = 0;
      }

      if (isMoving.current) {
        const angle = Math.atan2(velocity.current.x, velocity.current.z);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          angle,
          0.2
        );
      }

      // ── Banking / pitch tilt on the model wrapper. Pitch nose-up while
      // climbing, nose-down while diving; small forward lean when sprinting
      // on the ground. Lives on tiltRef so it doesn't fight the yaw lerp.
      if (tiltRef.current) {
        const targetPitch = isAirborne
          ? THREE.MathUtils.clamp(-verticalVel.current * 0.022, -0.55, 0.4)
          : isMoving.current
            ? 0.18
            : 0;
        tiltRef.current.rotation.x = THREE.MathUtils.lerp(
          tiltRef.current.rotation.x,
          targetPitch,
          0.16,
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
      {jetting && !riding && (
        <JetpackFlame thrustingRef={thrustingRef} playerRef={groupRef} />
      )}
      {riding ? (
        // BotMobile/BotVette headlights are along local +X. Rotating by -π/2
        // around Y maps local +X → local +Z, aligning the nose with the
        // player's "forward" convention so it drives nose-first.
        <group rotation={[0, -Math.PI / 2, 0]}>
          {vetteOn ? (
            <BotVette pos={[0, 0, 0]} color="#dc2626" accent="#fde047" />
          ) : (
            <BotMobile pos={[0, 0, 0]} color="#dc2626" accent="#fde047" />
          )}
        </group>
      ) : (
        <group ref={tiltRef}>
          <MoneyBotModel scale={0.4} animation={anim} />
        </group>
      )}
    </group>
  );
}

// Twin jetpack flames under the player. Reads thrust + altitude through
// refs every frame so visuals never go stale even when the parent doesn't
// re-render (e.g. when toggling Shift mid-air).
//
// Layers (back to front):
//   • Black jet-pod housings with hot orange glow rims.
//   • Wide orange/yellow flame cones (flicker scale).
//   • Blue-white plasma core cones (inner, narrower, brighter).
//   • Trailing grey smoke puffs that drift downward + fade.
//   • Ground shockwave ring that pulses when hovering close to the ground.
//   • Dynamic point light that brightens with thrust.
function JetpackFlame({
  thrustingRef,
  playerRef,
}: {
  thrustingRef: React.MutableRefObject<boolean>;
  playerRef: React.MutableRefObject<THREE.Group | null>;
}) {
  const leftRef = useRef<THREE.Mesh>(null!);
  const rightRef = useRef<THREE.Mesh>(null!);
  const leftCoreRef = useRef<THREE.Mesh>(null!);
  const rightCoreRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const shockRef = useRef<THREE.Mesh>(null!);
  const shockMatRef = useRef<THREE.MeshBasicMaterial>(null!);
  const smoke0 = useRef<THREE.Mesh>(null!);
  const smoke1 = useRef<THREE.Mesh>(null!);
  const smoke2 = useRef<THREE.Mesh>(null!);
  const smoke3 = useRef<THREE.Mesh>(null!);
  const smokeRefs = [smoke0, smoke1, smoke2, smoke3];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const thrusting = thrustingRef.current;
    const altitude = playerRef.current?.position.y ?? 0;

    // Outer cones flicker more violently under thrust; idle plume is small.
    const base = thrusting ? 1 : 0.3;
    const flicker = base + Math.sin(t * 40) * 0.2 + Math.cos(t * 31) * 0.13;
    const s = Math.max(0.15, flicker);
    const wob1 = 0.78 + Math.sin(t * 22) * 0.08;
    const wob2 = 0.78 + Math.cos(t * 24) * 0.08;
    if (leftRef.current) leftRef.current.scale.set(wob1, s * 1.85, wob1);
    if (rightRef.current) rightRef.current.scale.set(wob2, s * 1.85, wob2);
    // Inner plasma core — slightly tighter timing for a hotter look.
    const coreS = Math.max(0.1, base * 1.05 + Math.sin(t * 55) * 0.18);
    if (leftCoreRef.current) leftCoreRef.current.scale.set(0.45, coreS * 1.5, 0.45);
    if (rightCoreRef.current) rightCoreRef.current.scale.set(0.45, coreS * 1.5, 0.45);

    if (lightRef.current) {
      lightRef.current.intensity = thrusting ? 5.5 + Math.sin(t * 30) * 1.3 : 1.2;
      lightRef.current.color.setHex(thrusting ? 0xfb923c : 0xf59e0b);
    }

    // Ground shockwave ring: fades in as we hover close to the ground
    // while thrusting (heat exhaust kicking up dust). At y > 7 the
    // effect is fully off so it doesn't show in mid-air.
    const groundProximity = Math.max(0, 1 - altitude / 6);
    const groundEffect = thrusting ? groundProximity : 0;
    if (shockRef.current) {
      const ringScale = 0.7 + (1 - groundProximity) * 0.6 + Math.sin(t * 9) * 0.07;
      shockRef.current.scale.set(ringScale, ringScale, ringScale);
      // Plant the ring at world Y ~= 0.08 regardless of player altitude
      // (player group sits at altitude → subtract it back out, plus the
      // [0, 0.15, 0] group offset of this JetpackFlame parent → net y in
      // local space is -altitude - 0.07 to land at world 0.08).
      shockRef.current.position.y = -altitude - 0.07;
    }
    if (shockMatRef.current) {
      shockMatRef.current.opacity = groundEffect * (0.55 + Math.sin(t * 12) * 0.18);
    }

    // Trailing smoke: 4 puffs cycling phases, drifting down and BEHIND the
    // player (-Z) so they trail the body instead of puffing through it.
    smokeRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const phase = ((t * 1.8 + i * 0.25) % 1);
      const xSide = i % 2 === 0 ? -0.28 : 0.28;
      ref.current.position.x = xSide + Math.sin(t * 3 + i) * 0.07;
      ref.current.position.y = -0.15 - phase * 1.7;
      ref.current.position.z = -0.55 + Math.cos(t * 2.5 + i) * 0.05;
      const ss = thrusting ? 0.2 + phase * 0.55 : 0.06;
      ref.current.scale.set(ss, ss, ss);
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = thrusting ? (1 - phase) * 0.4 : 0;
    });
  });

  // ── Geometry layout notes ────────────────────────────────────────────
  // MoneyBot faces local +Z, so the BACK of the player is -Z. To stop
  // the jetpack from clipping into his torso we mount the whole rig at
  // z = -0.42 (behind the spine) with the backpack housing covering his
  // upper back and the twin nozzles sitting just below the housing.
  // Flames emerge DOWNWARD AND SLIGHTLY BACK so they never intersect
  // his legs. depthWrite={false} stays off (transparent flames need it)
  // but separation in space prevents the bleed-through artifacts.
  const BACK_Z = -0.42;
  const POD_X = 0.28;
  const POD_Y = 0.55; // upper-back / shoulder height
  const FLAME_Y = 0.05; // below the nozzle, clear of the torso
  return (
    <group position={[0, 0.15, 0]}>
      {/* Backpack housing — sits flush against MoneyBot's upper back */}
      <group position={[0, 0.7, BACK_Z]}>
        {/* Main body */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.85, 0.32]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.7}
            roughness={0.35}
            emissive="#f97316"
            emissiveIntensity={0.18}
          />
        </mesh>
        {/* Yellow "MONEYBOT" warning stripe on the back */}
        <mesh position={[0, 0.05, -0.165]}>
          <boxGeometry args={[0.55, 0.12, 0.02]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
        {/* Two glowing fuel indicator dots */}
        {[-0.18, 0.18].map((xOff, i) => (
          <mesh key={`fuel-${i}`} position={[xOff, -0.25, -0.17]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#22c55e" toneMapped={false} />
          </mesh>
        ))}
        {/* Shoulder straps wrapping forward over the shoulders */}
        {[-0.22, 0.22].map((xOff, i) => (
          <mesh key={`strap-${i}`} position={[xOff, 0.15, 0.2]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.1, 0.55, 0.05]} />
            <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Jet-pod housings — mounted below the backpack, nozzles down */}
      {[-POD_X, POD_X].map((xOff, i) => (
        <group key={`pod-${i}`} position={[xOff, POD_Y, BACK_Z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.13, 0.17, 0.5, 14]} />
            <meshStandardMaterial
              color="#0f172a"
              metalness={0.9}
              roughness={0.25}
              emissive="#f97316"
              emissiveIntensity={0.6}
            />
          </mesh>
          {/* Glowing nozzle ring at the bottom of each pod */}
          <mesh position={[0, -0.26, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.16, 0.035, 8, 18]} />
            <meshBasicMaterial color="#fbbf24" toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* Outer orange/yellow flames — emerge below the nozzles, angled
          slightly back so they trail BEHIND the legs, not through them. */}
      {[-POD_X, POD_X].map((xOff, i) => (
        <mesh
          key={`flame-${i}`}
          ref={xOff < 0 ? leftRef : rightRef}
          position={[xOff, FLAME_Y, BACK_Z]}
          rotation={[Math.PI - 0.15, 0, 0]}
          renderOrder={2}
        >
          <coneGeometry args={[0.22, 1.4, 14, 1, true]} />
          <meshStandardMaterial
            color="#fde047"
            emissive="#f97316"
            emissiveIntensity={4.5}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Inner blue/white plasma core */}
      {[-POD_X, POD_X].map((xOff, i) => (
        <mesh
          key={`core-${i}`}
          ref={xOff < 0 ? leftCoreRef : rightCoreRef}
          position={[xOff, FLAME_Y + 0.04, BACK_Z]}
          rotation={[Math.PI - 0.15, 0, 0]}
          renderOrder={3}
        >
          <coneGeometry args={[0.1, 0.95, 10, 1, true]} />
          <meshBasicMaterial
            color="#e0f2fe"
            transparent
            opacity={0.95}
            side={THREE.DoubleSide}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Trailing smoke puffs (animation positions them at z ≈ -0.55) */}
      {smokeRefs.map((ref, i) => (
        <mesh key={`smoke-${i}`} ref={ref} position={[0, -0.15, -0.55]} renderOrder={1}>
          <sphereGeometry args={[0.32, 8, 8]} />
          <meshBasicMaterial
            color="#cbd5e1"
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Ground shockwave ring (only visible when hovering low) */}
      <mesh ref={shockRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]}>
        <ringGeometry args={[0.4, 1.3, 32]} />
        <meshBasicMaterial
          ref={shockMatRef}
          color="#fbbf24"
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight ref={lightRef} position={[0, 0, BACK_Z - 0.2]} color="#f97316" distance={9} intensity={1.2} />
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
