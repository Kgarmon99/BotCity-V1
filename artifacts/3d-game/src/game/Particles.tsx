import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ════════════════════════════════════════════════════════════════════
// Particles — ambient atmosphere effects rendered as THREE.Points.
//
//   • Fireflies — pulsing yellow points drifting around BotNational
//     Park, visible only when the DayNightCycle is in night phase.
//   • Steam — slow rising white puffs from BotEnergy's battery vent.
//   • Sparks — short-lived orange/yellow sparks shooting up from
//     BotFactory's conveyor + open shop door.
//
// All three systems use a single Points draw per emitter, animating
// the position buffer in useFrame. No per-frame allocations. The
// firefly night gating matches DayNightCycle's PERIOD so darkness
// and bug glow stay in sync.
// ════════════════════════════════════════════════════════════════════

const DAY_PERIOD = 180; // mirror DayNightCycle.PERIOD

function nightFactor(t: number): number {
  // DayNightCycle.dayFactor = max(0, sin(phase)). Night is its inverse.
  const phase = (t / DAY_PERIOD) * Math.PI * 2;
  return Math.max(0, -Math.sin(phase));
}

// ─── Fireflies ──────────────────────────────────────────────────────
interface FireflySwarmProps {
  count: number;
  center: [number, number, number];
  spread: [number, number, number];
  pulseSpeed?: number;
  color?: string;
}

function FireflySwarm({
  count,
  center,
  spread,
  pulseSpeed = 2.4,
  color = "#fde047",
}: FireflySwarmProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.PointsMaterial>(null!);

  const data = useMemo(() => {
    const homes = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      homes[i * 3 + 0] = center[0] + (Math.random() * 2 - 1) * spread[0];
      homes[i * 3 + 1] = center[1] + Math.random() * spread[1];
      homes[i * 3 + 2] = center[2] + (Math.random() * 2 - 1) * spread[2];
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.35 + Math.random() * 0.55;
    }
    return { homes, phases, speeds };
  }, [count, center, spread]);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(count * 3), 3),
    );
    return g;
  }, [count]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const nf = nightFactor(t);
    if (matRef.current) {
      // Whole-swarm glow pulse layered onto night gating.
      const pulse = 0.7 + Math.sin(t * pulseSpeed) * 0.3;
      matRef.current.opacity = nf * pulse;
    }
    // Skip buffer update entirely during day to save CPU.
    if (!pointsRef.current) return;
    pointsRef.current.visible = nf > 0.02;
    if (!pointsRef.current.visible) return;

    const pos = geom.getAttribute("position") as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const ph = data.phases[i];
      const sp = data.speeds[i];
      const hx = data.homes[i * 3 + 0];
      const hy = data.homes[i * 3 + 1];
      const hz = data.homes[i * 3 + 2];
      arr[i * 3 + 0] = hx + Math.sin(t * sp + ph) * 1.8;
      arr[i * 3 + 1] = hy + Math.sin(t * sp * 0.7 + ph * 1.3) * 0.6;
      arr[i * 3 + 2] = hz + Math.cos(t * sp * 0.9 + ph * 0.7) * 1.8;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geom}>
      <pointsMaterial
        ref={matRef}
        color={color}
        size={0.45}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

// ─── Steam plume ────────────────────────────────────────────────────
interface SteamPlumeProps {
  origin: [number, number, number];
  count?: number;
  height?: number;
  radius?: number;
  rise?: number;
  color?: string;
  size?: number;
  opacity?: number;
}

function SteamPlume({
  origin,
  count = 50,
  height = 6,
  radius = 0.8,
  rise = 1.3,
  color = "#e2e8f0",
  size = 0.9,
  opacity = 0.55,
}: SteamPlumeProps) {
  const data = useMemo(() => {
    const ages = new Float32Array(count);
    const radial = new Float32Array(count * 2); // angle, normalized radius
    const speeds = new Float32Array(count);
    const lifespan = height / rise;
    for (let i = 0; i < count; i++) {
      // Stagger initial ages so the column is steady-state from frame 0.
      ages[i] = (i / count) * lifespan;
      radial[i * 2 + 0] = Math.random() * Math.PI * 2;
      radial[i * 2 + 1] = Math.random();
      speeds[i] = 0.85 + Math.random() * 0.4;
    }
    return { ages, radial, speeds, lifespan };
  }, [count, height, rise]);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(count * 3), 3),
    );
    return g;
  }, [count]);

  const lastT = useRef(0);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const dt = Math.min(0.05, t - lastT.current);
    lastT.current = t;
    const pos = geom.getAttribute("position") as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      data.ages[i] += dt * data.speeds[i];
      if (data.ages[i] > data.lifespan) {
        data.ages[i] -= data.lifespan;
        data.radial[i * 2 + 0] = Math.random() * Math.PI * 2;
        data.radial[i * 2 + 1] = Math.random();
      }
      const y = data.ages[i] * rise;
      // Plume widens as it rises.
      const r =
        radius * (0.2 + data.radial[i * 2 + 1] * 0.8) * (0.3 + (y / height) * 1.4);
      const a = data.radial[i * 2 + 0] + t * 0.18;
      arr[i * 3 + 0] = origin[0] + Math.cos(a) * r;
      arr[i * 3 + 1] = origin[1] + y;
      arr[i * 3 + 2] = origin[2] + Math.sin(a) * r;
    }
    pos.needsUpdate = true;
  });

  return (
    <points geometry={geom}>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

// ─── Spark burst ────────────────────────────────────────────────────
interface SparkBurstProps {
  origin: [number, number, number];
  count?: number;
  color?: string;
  upBias?: number; // base upward velocity
  spread?: number; // lateral velocity scale
}

function SparkBurst({
  origin,
  count = 35,
  color = "#fbbf24",
  upBias = 2.8,
  spread = 0.9,
}: SparkBurstProps) {
  const data = useMemo(() => {
    const vel = new Float32Array(count * 3);
    const ages = new Float32Array(count);
    const lifes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      lifes[i] = 0.55 + Math.random() * 0.7;
      ages[i] = Math.random() * lifes[i]; // stagger
      const a = Math.random() * Math.PI * 2;
      const r = Math.random();
      vel[i * 3 + 0] = Math.cos(a) * spread * r;
      vel[i * 3 + 1] = upBias + Math.random() * 2.4;
      vel[i * 3 + 2] = Math.sin(a) * spread * r;
    }
    return { vel, ages, lifes };
  }, [count, upBias, spread]);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(count * 3), 3),
    );
    return g;
  }, [count]);

  const lastT = useRef(0);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const dt = Math.min(0.05, t - lastT.current);
    lastT.current = t;
    const pos = geom.getAttribute("position") as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const g = -8.5; // gravity (units/s²)
    for (let i = 0; i < count; i++) {
      data.ages[i] += dt;
      if (data.ages[i] > data.lifes[i]) {
        // Respawn at origin with fresh velocity.
        data.ages[i] = 0;
        data.lifes[i] = 0.5 + Math.random() * 0.7;
        const a = Math.random() * Math.PI * 2;
        const r = Math.random();
        data.vel[i * 3 + 0] = Math.cos(a) * spread * r;
        data.vel[i * 3 + 1] = upBias + Math.random() * 2.4;
        data.vel[i * 3 + 2] = Math.sin(a) * spread * r;
      }
      const age = data.ages[i];
      arr[i * 3 + 0] = origin[0] + data.vel[i * 3 + 0] * age;
      arr[i * 3 + 1] = origin[1] + data.vel[i * 3 + 1] * age + 0.5 * g * age * age;
      arr[i * 3 + 2] = origin[2] + data.vel[i * 3 + 2] * age;
    }
    pos.needsUpdate = true;
  });

  return (
    <points geometry={geom}>
      <pointsMaterial
        color={color}
        size={0.22}
        sizeAttenuation
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

// ─── Top-level grouping ─────────────────────────────────────────────
export default function Particles() {
  return (
    <group>
      {/* Fireflies at BotNational Park.
          Park world envelope (scale=1.5 at origin (-92,-78)) covers roughly
          x[-131,-74] × z[-126,-69]. Two overlapping swarms with different
          centers + pulse rates give a more organic look than one big cloud. */}
      <FireflySwarm
        count={55}
        center={[-100, 0.9, -90]}
        spread={[26, 2.0, 22]}
        pulseSpeed={2.4}
      />
      <FireflySwarm
        count={35}
        center={[-115, 1.0, -110]}
        spread={[18, 1.8, 16]}
        pulseSpeed={3.1}
        color="#fef08a"
      />

      {/* Steam at BotEnergy — battery monolith vent.
          Battery is at local (2, 0, 8) inside group origin (41, 0, 96),
          box height 2.4 → top y=2.4. Steam emits from just above the cap. */}
      <SteamPlume
        origin={[43, 2.5, 104]}
        count={45}
        height={5.5}
        radius={0.55}
        rise={1.25}
      />

      {/* Sparks at BotFactory — conveyor belt and shop door.
          Conveyor at local (4, 0.7, 2) inside group origin (-15, 0, -73)
          → world (-11, 0.7, -71). Sliding door at local (0, 1.4, 2.55-3)
          inside group → world (-15, 1.4, -70.45). */}
      <SparkBurst origin={[-11, 0.9, -71]} count={32} color="#fbbf24" />
      <SparkBurst
        origin={[-15, 1.2, -70.4]}
        count={26}
        color="#fb923c"
        upBias={3.4}
        spread={0.6}
      />
    </group>
  );
}
