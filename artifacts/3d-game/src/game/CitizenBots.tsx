import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MoneyBotModel, type MoneyBotAnim } from "./MoneyBotModel";

// Wandering MoneyBot citizens. The GLB doesn't ship a walk cycle, so we
// style them as hovering courier bots — small bob + ground glow. They patrol
// loops of waypoints along the main avenues so the city feels alive without
// blocking foot traffic on the plaza or building approaches.

interface Citizen {
  /** Closed loop of (x, z) waypoints — the bot interpolates between them. */
  waypoints: Array<[number, number]>;
  /** World units per second. */
  speed: number;
  scale: number;
  /** Static animation pose held while moving (no walk cycle in the GLB). */
  anim: MoneyBotAnim;
  /** Phase offset so duplicate poses don't beat in unison. */
  phase: number;
  /** Hover height baseline (the bot bobs around this y). */
  hover: number;
}

function CitizenBot({ waypoints, speed, scale, anim, phase, hover }: Citizen) {
  const groupRef = useRef<THREE.Group>(null!);
  const innerRef = useRef<THREE.Group>(null!);
  const segIdx = useRef(0);
  const segT = useRef(phase % 1);
  const yawRef = useRef(0);

  useFrame((state, delta) => {
    if (waypoints.length < 2) return;
    const i = segIdx.current;
    const next = (i + 1) % waypoints.length;
    const [ax, az] = waypoints[i];
    const [bx, bz] = waypoints[next];
    const dx = bx - ax;
    const dz = bz - az;
    const segLen = Math.hypot(dx, dz) || 0.0001;
    segT.current += (speed * delta) / segLen;
    while (segT.current >= 1) {
      segT.current -= 1;
      segIdx.current = (segIdx.current + 1) % waypoints.length;
    }
    const i2 = segIdx.current;
    const n2 = (i2 + 1) % waypoints.length;
    const [a2x, a2z] = waypoints[i2];
    const [b2x, b2z] = waypoints[n2];
    const x = a2x + (b2x - a2x) * segT.current;
    const z = a2z + (b2z - a2z) * segT.current;
    const heading = Math.atan2(b2x - a2x, b2z - a2z);
    yawRef.current = THREE.MathUtils.lerp(yawRef.current, heading, 0.1);
    const t = state.clock.elapsedTime + phase * 7;
    if (groupRef.current) {
      groupRef.current.position.set(x, hover + Math.sin(t * 2.5) * 0.12, z);
      groupRef.current.rotation.y = yawRef.current;
    }
    if (innerRef.current) {
      // Subtle lean into the direction of travel.
      innerRef.current.rotation.x = Math.sin(t * 2.5) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground glow under the hovering bot */}
      <mesh position={[0, -hover + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.7, 18]} />
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.32}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <group ref={innerRef}>
        <MoneyBotModel scale={scale} animation={anim} phase={phase} />
      </group>
    </group>
  );
}

// Loops are biased to the main east-west and north-south avenues (z=0, x=0)
// plus a couple of plaza laps. Stays away from building footprints.
const CITIZENS: Citizen[] = [
  // East-west promenade (z = -2, just south of the main avenue median)
  {
    waypoints: [
      [-32, -2],
      [32, -2],
    ],
    speed: 2.4,
    scale: 0.55,
    anim: "Idle",
    phase: 0.0,
    hover: 0.5,
  },
  {
    waypoints: [
      [30, 2],
      [-30, 2],
    ],
    speed: 2.0,
    scale: 0.6,
    anim: "LeftHand",
    phase: 0.35,
    hover: 0.4,
  },
  // North-south promenade (x = ±2 lanes)
  {
    waypoints: [
      [-2, -30],
      [-2, 30],
    ],
    speed: 2.2,
    scale: 0.5,
    anim: "Idle",
    phase: 0.6,
    hover: 0.45,
  },
  {
    waypoints: [
      [2, 30],
      [2, -30],
    ],
    speed: 1.8,
    scale: 0.55,
    anim: "RightHand",
    phase: 0.15,
    hover: 0.55,
  },
  // Inner plaza orbit (around the center, clear of statues at ±18)
  {
    waypoints: [
      [6, 6],
      [-6, 6],
      [-6, -6],
      [6, -6],
    ],
    speed: 1.6,
    scale: 0.5,
    anim: "Idle",
    phase: 0.25,
    hover: 0.4,
  },
  // Outer-ring courier (clears all buildings by staying near ±32 band)
  {
    waypoints: [
      [-32, 32],
      [32, 32],
      [32, -32],
      [-32, -32],
    ],
    speed: 3.0,
    scale: 0.55,
    anim: "Idle",
    phase: 0.8,
    hover: 0.5,
  },
];

export default function CitizenBots() {
  return (
    <group>
      {CITIZENS.map((c, i) => (
        <CitizenBot key={`citizen-${i}`} {...c} />
      ))}
    </group>
  );
}
