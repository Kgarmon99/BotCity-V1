import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BotMobile } from "./CityDistricts";

// Traffic on the two main avenues (x=0 N-S and z=0 E-W). Cars cruise in
// dedicated lanes offset slightly from the avenue centerline and wrap
// around at the city edges so traffic feels continuous without ever
// requiring AI / collision logic.
//
// Lane convention (right-hand drive):
//   • z=0 avenue: east-bound (+x) cars in z=-0.8 lane; west-bound in z=+0.8
//   • x=0 avenue: south-bound (+z) cars in x=-0.8 lane; north-bound in x=+0.8

interface CarPath {
  axis: "x" | "z"; // which axis the car moves along
  lane: number;    // coordinate on the OTHER axis (the perpendicular offset)
  dir: 1 | -1;     // travel direction
  speed: number;   // world units / second
  color: string;
  accent: string;
  /** 0..1 — staggers cars on the same route so they don't bunch at spawn. */
  phase: number;
}

// City extends roughly ±60 along each main avenue; using ±65 keeps the
// wrap-around well outside the visible spawn camera frame.
const RANGE_MIN = -105;
const RANGE_MAX = 105;
const RANGE = RANGE_MAX - RANGE_MIN;

const CARS: CarPath[] = [
  // ── East-west avenue (z = 0) ─────────────────────────────────────────
  { axis: "x", lane: -0.8, dir: +1, speed: 7.0, color: "#22d3ee", accent: "#67e8f9", phase: 0.05 },
  { axis: "x", lane: -0.8, dir: +1, speed: 6.0, color: "#a78bfa", accent: "#c4b5fd", phase: 0.55 },
  { axis: "x", lane:  0.8, dir: -1, speed: 7.0, color: "#fb923c", accent: "#fde68a", phase: 0.20 },
  { axis: "x", lane:  0.8, dir: -1, speed: 6.5, color: "#22c55e", accent: "#bbf7d0", phase: 0.75 },
  // ── North-south avenue (x = 0) ───────────────────────────────────────
  { axis: "z", lane: -0.8, dir: +1, speed: 6.5, color: "#dc2626", accent: "#fca5a5", phase: 0.15 },
  { axis: "z", lane: -0.8, dir: +1, speed: 7.0, color: "#f59e0b", accent: "#fde68a", phase: 0.65 },
  { axis: "z", lane:  0.8, dir: -1, speed: 6.5, color: "#0ea5e9", accent: "#7dd3fc", phase: 0.30 },
  { axis: "z", lane:  0.8, dir: -1, speed: 7.0, color: "#ec4899", accent: "#fbcfe8", phase: 0.85 },
];

// BotMobile's mesh has the headlight on +x (nose-east at rotation.y = 0).
// Map each direction of travel to the y-rotation that points the nose into
// the direction of motion:
//   • +x movement → 0
//   • -x movement → π
//   • +z movement → -π/2  (rotating +x around +y by -π/2 gives +z)
//   • -z movement → +π/2
function yawFor(axis: "x" | "z", dir: 1 | -1): number {
  if (axis === "x") return dir > 0 ? 0 : Math.PI;
  return dir > 0 ? -Math.PI / 2 : Math.PI / 2;
}

function Car({ path }: { path: CarPath }) {
  const ref = useRef<THREE.Group>(null!);
  const yaw = yawFor(path.axis, path.dir);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // Position along travel axis, wrapped into [RANGE_MIN, RANGE_MAX].
    const raw = path.phase * RANGE + t * path.speed * path.dir;
    const wrapped = ((raw - RANGE_MIN) % RANGE + RANGE) % RANGE + RANGE_MIN;
    if (path.axis === "x") {
      ref.current.position.set(wrapped, 0, path.lane);
    } else {
      ref.current.position.set(path.lane, 0, wrapped);
    }
  });

  return (
    <group ref={ref} rotation={[0, yaw, 0]}>
      <BotMobile pos={[0, 0, 0]} color={path.color} accent={path.accent} />
    </group>
  );
}

export default function Traffic() {
  return (
    <group>
      {CARS.map((p, i) => (
        <Car key={`car-${i}`} path={p} />
      ))}
    </group>
  );
}
