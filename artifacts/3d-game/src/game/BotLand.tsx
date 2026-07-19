import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// ════════════════════════════════════════════════════════════════════
//  BotLand — The Ultimate Amusement Park
//  Roller coasters, Ferris wheel, carousel, water rides, and more
//  Positioned at southeast corner of the city (positive X, positive Z)
// ════════════════════════════════════════════════════════════════════

// ── Ferris Wheel ──────────────────────────────────────────────────────
function FerrisWheel({ position }: { position: [number, number, number] }) {
  const wheelRef = useRef<THREE.Group>(null!);
  const cabinsRef = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (wheelRef.current) {
      wheelRef.current.rotation.z = t * 0.15;
    }
    // Counter-rotate cabins so they stay upright
    cabinsRef.current.forEach((cabin, i) => {
      if (cabin) {
        cabin.rotation.z = -t * 0.15 + (i * Math.PI * 2) / 8;
      }
    });
  });

  const radius = 8;
  const cabins = 8;

  return (
    <group position={position}>
      {/* Support towers */}
      <mesh position={[-3, radius / 2, 0]} castShadow>
        <boxGeometry args={[0.5, radius, 0.5]} />
        <meshStandardMaterial color="#dc2626" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[3, radius / 2, 0]} castShadow>
        <boxGeometry args={[0.5, radius, 0.5]} />
        <meshStandardMaterial color="#dc2626" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Main wheel */}
      <group ref={wheelRef} position={[0, radius, 0]}>
        {/* Outer rim */}
        <mesh>
          <torusGeometry args={[radius, 0.3, 8, 32]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} metalness={0.8} />
        </mesh>
        {/* Inner rim */}
        <mesh>
          <torusGeometry args={[radius * 0.7, 0.2, 8, 32]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} metalness={0.8} />
        </mesh>
        {/* Spokes */}
        {Array.from({ length: cabins }).map((_, i) => {
          const angle = (i / cabins) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * radius * 0.35, Math.sin(angle) * radius * 0.35, 0]} rotation={[0, 0, angle]}>
              <boxGeometry args={[radius * 0.7, 0.1, 0.1]} />
              <meshStandardMaterial color="#dc2626" metalness={0.7} />
            </mesh>
          );
        })}
        {/* Cabins */}
        {Array.from({ length: cabins }).map((_, i) => {
          const angle = (i / cabins) * Math.PI * 2;
          return (
            <group
              key={`cabin-${i}`}
              ref={(el) => { if (el) cabinsRef.current[i] = el; }}
              position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            >
              <mesh castShadow>
                <boxGeometry args={[1.2, 1.2, 1]} />
                <meshStandardMaterial
                  color={i % 2 === 0 ? "#ef4444" : "#3b82f6"}
                  emissive={i % 2 === 0 ? "#ef4444" : "#3b82f6"}
                  emissiveIntensity={0.3}
                />
              </mesh>
              {/* Window */}
              <mesh position={[0, 0, 0.51]}>
                <planeGeometry args={[0.8, 0.6]} />
                <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.5} />
              </mesh>
            </group>
          );
        })}
      </group>
      {/* Base platform */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[5, 5, 0.2, 16]} />
        <meshStandardMaterial color="#1f2937" metalness={0.5} />
      </mesh>
      {/* Lights */}
    </group>
  );
}

// ── Roller Coaster ────────────────────────────────────────────────────
function RollerCoaster({ position }: { position: [number, number, number] }) {
  const cartRef = useRef<THREE.Mesh>(null!);
  const trackPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 4;
      const x = Math.cos(t) * 10 + Math.cos(t * 3) * 3;
      const y = Math.abs(Math.sin(t * 2)) * 6 + 2;
      const z = Math.sin(t) * 8 + Math.sin(t * 2) * 2;
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, []);

  const trackCurve = useMemo(() => new THREE.CatmullRomCurve3(trackPoints), [trackPoints]);

  useFrame((state) => {
    const t = (state.clock.elapsedTime * 0.08) % 1;
    if (cartRef.current) {
      const pos = trackCurve.getPointAt(t);
      const tangent = trackCurve.getTangentAt(t);
      cartRef.current.position.copy(pos);
      cartRef.current.lookAt(pos.clone().add(tangent));
    }
  });

  return (
    <group position={position}>
      {/* Track */}
      <mesh>
        <tubeGeometry args={[trackCurve, 120, 0.15, 8, false]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.3} metalness={0.8} />
      </mesh>
      {/* Support pillars */}
      {Array.from({ length: 15 }).map((_, i) => {
        const t = i / 14;
        const pos = trackCurve.getPointAt(t);
        const height = pos.y;
        return (
          <mesh key={i} position={[pos.x, height / 2, pos.z]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, height, 6]} />
            <meshStandardMaterial color="#374151" metalness={0.7} />
          </mesh>
        );
      })}
      {/* Cart */}
      <mesh ref={cartRef} castShadow>
        <boxGeometry args={[0.8, 0.6, 1.2]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} metalness={0.6} />
      </mesh>
      {/* Riders */}
      <mesh ref={cartRef} position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
    </group>
  );
}

// ── Carousel ──────────────────────────────────────────────────────────
function Carousel({ position }: { position: [number, number, number] }) {
  const platformRef = useRef<THREE.Group>(null!);
  const roofRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (platformRef.current) {
      platformRef.current.rotation.y = t * 0.3;
    }
    if (roofRef.current) {
      roofRef.current.rotation.y = -t * 0.1;
    }
  });

  const horses = 6;

  return (
    <group position={position}>
      {/* Center pole */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 6, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Rotating platform */}
      <group ref={platformRef}>
        <mesh position={[0, 0.2, 0]} receiveShadow>
          <cylinderGeometry args={[4, 4, 0.4, 32]} />
          <meshStandardMaterial color="#7c2d12" metalness={0.4} />
        </mesh>
        {/* Horses */}
        {Array.from({ length: horses }).map((_, i) => {
          const angle = (i / horses) * Math.PI * 2;
          const radius = 2.5;
          return (
            <group key={i} position={[Math.cos(angle) * radius, 1, Math.sin(angle) * radius]}>
              <mesh castShadow>
                <boxGeometry args={[0.5, 0.8, 0.3]} />
                <meshStandardMaterial color={i % 2 === 0 ? "#ec4899" : "#8b5cf6"} />
              </mesh>
              {/* Horse head */}
              <mesh position={[0, 0.6, 0.2]} castShadow>
                <boxGeometry args={[0.3, 0.4, 0.4]} />
                <meshStandardMaterial color={i % 2 === 0 ? "#ec4899" : "#8b5cf6"} />
              </mesh>
              {/* Pole */}
              <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 3, 6]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.8} />
              </mesh>
            </group>
          );
        })}
      </group>
      {/* Roof */}
      <mesh ref={roofRef} position={[0, 6, 0]}>
        <coneGeometry args={[5, 2, 12]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

// ── Water Slide ───────────────────────────────────────────────────────
function WaterSlide({ position }: { position: [number, number, number] }) {
  const slidePoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      points.push(new THREE.Vector3(
        Math.sin(t * Math.PI * 3) * 3,
        8 * (1 - t) + 1,
        t * 12 - 6
      ));
    }
    return points;
  }, []);

  const slideCurve = useMemo(() => new THREE.CatmullRomCurve3(slidePoints), [slidePoints]);

  return (
    <group position={position}>
      {/* Slide tube */}
      <mesh>
        <tubeGeometry args={[slideCurve, 50, 0.5, 8, false]} />
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Water inside */}
      <mesh>
        <tubeGeometry args={[slideCurve, 50, 0.3, 8, false]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.3} transparent opacity={0.8} />
      </mesh>
      {/* Support towers */}
      {[0, 0.25, 0.5, 0.75].map((t, i) => {
        const pos = slideCurve.getPointAt(t);
        return (
          <mesh key={i} position={[pos.x, pos.y / 2, pos.z]}>
            <cylinderGeometry args={[0.15, 0.2, pos.y, 6]} />
            <meshStandardMaterial color="#0891b2" metalness={0.6} />
          </mesh>
        );
      })}
      {/* Pool at bottom */}
      <mesh position={[0, 0.1, 6]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3, 16]} />
        <meshStandardMaterial color="#0891b2" emissive="#22d3ee" emissiveIntensity={0.2} metalness={0.8} roughness={0.1} />
      </mesh>
    </group>
  );
}

// ── Swing Ride ────────────────────────────────────────────────────────
function SwingRide({ position }: { position: [number, number, number] }) {
  const armRef = useRef<THREE.Group>(null!);
  const swingRefs = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (armRef.current) {
      armRef.current.rotation.y = t * 0.5;
    }
    swingRefs.current.forEach((swing, i) => {
      if (swing) {
        swing.rotation.z = Math.sin(t * 2 + i * 0.8) * 0.4;
      }
    });
  });

  const swings = 12;

  return (
    <group position={position}>
      {/* Center tower */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.6, 8, 8]} />
        <meshStandardMaterial color="#dc2626" metalness={0.7} />
      </mesh>
      {/* Rotating top */}
      <group ref={armRef} position={[0, 8, 0]}>
        <mesh>
          <cylinderGeometry args={[3, 0.5, 0.3, 12]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} metalness={0.8} />
        </mesh>
        {/* Swings */}
        {Array.from({ length: swings }).map((_, i) => {
          const angle = (i / swings) * Math.PI * 2;
          return (
            <group
              key={i}
              ref={(el) => { if (el) swingRefs.current[i] = el; }}
              position={[Math.cos(angle) * 2.5, 0, Math.sin(angle) * 2.5]}
            >
              {/* Chain */}
              <mesh position={[0, -2.5, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 5, 4]} />
                <meshStandardMaterial color="#9ca3af" metalness={0.9} />
              </mesh>
              {/* Seat */}
              <mesh position={[0, -5, 0]} castShadow>
                <boxGeometry args={[0.6, 0.1, 0.4]} />
                <meshStandardMaterial color={i % 3 === 0 ? "#ef4444" : i % 3 === 1 ? "#3b82f6" : "#22c55e"} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

// ── Drop Tower ────────────────────────────────────────────────────────
function DropTower({ position }: { position: [number, number, number] }) {
  const carRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Drop cycle: rise slowly, drop fast, repeat
    const cycle = (t * 0.3) % 1;
    let y: number;
    if (cycle < 0.6) {
      y = cycle / 0.6 * 10; // Rise
    } else {
      y = 10 - ((cycle - 0.6) / 0.4) * 10; // Drop
    }
    if (carRef.current) {
      carRef.current.position.y = y;
    }
  });

  return (
    <group position={position}>
      {/* Tower */}
      <mesh position={[0, 6, 0]} castShadow>
        <boxGeometry args={[1.5, 12, 1.5]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Side rails */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 6, 0]}>
          <boxGeometry args={[0.1, 12, 0.1]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} metalness={0.8} />
        </mesh>
      ))}
      {/* Drop car */}
      <mesh ref={carRef} position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 1, 1.2]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.4} />
      </mesh>
      {/* Top light */}
      <mesh position={[0, 12.5, 0]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ── Bumper Cars Arena ─────────────────────────────────────────────────
function BumperCars({ position }: { position: [number, number, number] }) {
  const carsRef = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    carsRef.current.forEach((car, i) => {
      if (car) {
        const angle = t * 0.5 + (i * Math.PI * 2) / 4;
        const radius = 3 + Math.sin(t + i) * 1;
        car.position.x = Math.cos(angle) * radius;
        car.position.z = Math.sin(angle) * radius;
        car.rotation.y = angle + Math.PI / 2;
      }
    });
  });

  return (
    <group position={position}>
      {/* Floor */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5, 32]} />
        <meshStandardMaterial color="#1f2937" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Railing */}
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[5, 0.15, 8, 32]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.3} metalness={0.8} />
      </mesh>
      {/* Cars */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group
          key={i}
          ref={(el) => { if (el) carsRef.current[i] = el; }}
        >
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.5, 0.8]} />
            <meshStandardMaterial
              color={["#ef4444", "#3b82f6", "#22c55e", "#fbbf24"][i]}
              emissive={["#ef4444", "#3b82f6", "#22c55e", "#fbbf24"][i]}
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      ))}
      {/* Overhead grid */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[8, 0.1, 8]} />
        <meshStandardMaterial color="#374151" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// ── Main BotLand Component ────────────────────────────────────────────
export default function BotLand() {
  return (
    <group position={[0, 0, 0]}>
      {/* BotLand sign */}
      <Text
        position={[55, 8, 55]}
        fontSize={2.5}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.15}
        outlineColor="#dc2626"
      >
        🎢 BOTLAND 🎡
      </Text>
      <Text
        position={[55, 5.5, 55]}
        fontSize={0.8}
        color="#86efac"
        anchorX="center"
        anchorY="middle"
      >
        The Ultimate Amusement Park
      </Text>

      {/* Ferris Wheel */}
      <FerrisWheel position={[45, 0, 45]} />

      {/* Roller Coaster */}
      <RollerCoaster position={[65, 0, 50]} />

      {/* Carousel */}
      <Carousel position={[50, 0, 65]} />

      {/* Water Slide */}
      <WaterSlide position={[60, 0, 70]} />

      {/* Swing Ride */}
      <SwingRide position={[40, 0, 60]} />

      {/* Drop Tower */}
      <DropTower position={[70, 0, 60]} />

      {/* Bumper Cars */}
      <BumperCars position={[55, 0, 80]} />

      {/* Ambient lighting for the park */}
    </group>
  );
}
