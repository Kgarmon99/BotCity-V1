import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { WeatherMode } from "./gameStore";

// Weather particles follow the camera in a fixed-size box so the player always
// sees a roughly constant density of rain/snow regardless of where they roam.
// Particles that fall below y=0 (or drift outside the box) wrap back to the top
// at a new random x/z within the box around the camera.

const BOX_HALF = 40;      // particles live within ±BOX_HALF of the camera in x/z
const BOX_TOP = 28;       // spawn ceiling
const BOX_BOTTOM = -2;    // recycle floor (slightly below ground)

const RAIN_COUNT = 900;
const SNOW_COUNT = 700;

// Pre-built shared Object3D for matrix composition — reused per particle to
// avoid allocating thousands of THREE.Object3D / Matrix4 objects per frame.
const dummy = new THREE.Object3D();

function Rain() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const { camera } = useThree();

  // Per-particle state: position (relative to box) and fall speed.
  const particles = useMemo(() => {
    const arr: { x: number; y: number; z: number; vy: number }[] = [];
    for (let i = 0; i < RAIN_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 2 * BOX_HALF,
        y: Math.random() * (BOX_TOP - BOX_BOTTOM) + BOX_BOTTOM,
        z: (Math.random() - 0.5) * 2 * BOX_HALF,
        vy: -22 - Math.random() * 10, // 22–32 units/sec downward
      });
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const cx = camera.position.x;
    const cz = camera.position.z;
    // Clamp delta so a tab returning from background doesn't teleport every
    // raindrop through the ground in a single frame.
    const dt = Math.min(delta, 0.05);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += p.vy * dt;
      if (p.y < BOX_BOTTOM) {
        // Recycle to the top at a new random x/z relative to current camera.
        p.y = BOX_TOP;
        p.x = (Math.random() - 0.5) * 2 * BOX_HALF;
        p.z = (Math.random() - 0.5) * 2 * BOX_HALF;
      }
      dummy.position.set(cx + p.x, p.y, cz + p.z);
      // Stretch streaks along the velocity direction for a "fast fall" look.
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, RAIN_COUNT]} frustumCulled={false}>
      {/* Tall thin streak — cylinder oriented vertically by default. */}
      <cylinderGeometry args={[0.015, 0.015, 0.55, 4]} />
      <meshBasicMaterial color="#bae6fd" transparent opacity={0.55} depthWrite={false} />
    </instancedMesh>
  );
}

function Snow() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const { camera } = useThree();

  const particles = useMemo(() => {
    const arr: {
      x: number;
      y: number;
      z: number;
      vy: number;
      driftPhase: number;
      driftAmp: number;
    }[] = [];
    for (let i = 0; i < SNOW_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 2 * BOX_HALF,
        y: Math.random() * (BOX_TOP - BOX_BOTTOM) + BOX_BOTTOM,
        z: (Math.random() - 0.5) * 2 * BOX_HALF,
        vy: -1.6 - Math.random() * 1.2, // 1.6–2.8 units/sec — much slower than rain
        driftPhase: Math.random() * Math.PI * 2,
        driftAmp: 0.4 + Math.random() * 0.6,
      });
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const cx = camera.position.x;
    const cz = camera.position.z;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += p.vy * dt;
      if (p.y < BOX_BOTTOM) {
        p.y = BOX_TOP;
        p.x = (Math.random() - 0.5) * 2 * BOX_HALF;
        p.z = (Math.random() - 0.5) * 2 * BOX_HALF;
      }
      // Sinusoidal horizontal drift to sell the "snowflake floating" feel.
      const drift = Math.sin(t * 0.8 + p.driftPhase) * p.driftAmp;
      dummy.position.set(cx + p.x + drift, p.y, cz + p.z + drift * 0.6);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SNOW_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[0.08, 6, 6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.9} depthWrite={false} />
    </instancedMesh>
  );
}

interface WeatherProps {
  mode: WeatherMode;
}

export default function Weather({ mode }: WeatherProps) {
  return (
    <group>
      {mode === "rain" && <Rain />}
      {mode === "snow" && <Snow />}
    </group>
  );
}

/**
 * Returns the `<fog>` args + scene background color for the given weather.
 * Used by GameScene so fog density tightens in rain/snow/fog and the sky
 * color matches the mood.
 */
export function fogForWeather(mode: WeatherMode): {
  color: string;
  near: number;
  far: number;
  background: string;
} {
  switch (mode) {
    case "rain":
      return { color: "#1e293b", near: 25, far: 110, background: "#020617" };
    case "snow":
      return { color: "#cbd5e1", near: 20, far: 95, background: "#1e293b" };
    case "fog":
      return { color: "#475569", near: 8, far: 55, background: "#334155" };
    case "clear":
    default:
      return { color: "#052e16", near: 55, far: 160, background: "#021410" };
  }
}
