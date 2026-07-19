import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getDayFactor } from "./DayNightCycle";
import { randomAngle, randomBetween, randomCentered } from "./random";

// =====================================================================
// River — animated waterway with waves, shoreline rocks, reeds,
// lily pads, fish, and a stone arched bridge.
// =====================================================================

function ArchedBridge({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Stone deck */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.3, 2.2]} />
        <meshStandardMaterial color="#a8a29e" roughness={0.9} />
      </mesh>
      {/* End abutments */}
      {[-2.9, 2.9].map((x) => (
        <mesh key={x} position={[x, 0.4, 0]} castShadow>
          <boxGeometry args={[0.5, 1.0, 2.4]} />
          <meshStandardMaterial color="#78716c" roughness={0.85} />
        </mesh>
      ))}
      {/* Half-torus arch under the deck on each side */}
      {[1, -1].map((s) => (
        <mesh
          key={s}
          position={[0, 0.05, s * 1.05]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[1.1, 0.16, 8, 20, Math.PI]} />
          <meshStandardMaterial color="#78716c" roughness={0.8} />
        </mesh>
      ))}
      {/* Wooden railings */}
      {[1, -1].map((s) => (
        <group key={s}>
          <mesh position={[0, 1.05, s * 1.0]}>
            <boxGeometry args={[6, 0.08, 0.08]} />
            <meshStandardMaterial color="#7c2d12" roughness={0.8} />
          </mesh>
          {[-2.6, -1.3, 0, 1.3, 2.6].map((x) => (
            <mesh key={x} position={[x, 0.85, s * 1.0]}>
              <boxGeometry args={[0.08, 0.5, 0.08]} />
              <meshStandardMaterial color="#7c2d12" roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Lanterns on bridge */}
      {[-2.5, 0, 2.5].map((x) => (
        <group key={x} position={[x, 1.15, 0]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.05, 0.3, 6]} />
            <meshStandardMaterial color="#1f2937" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={2} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Rock({
  position,
  scale = 1,
  color = "#57534e",
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <dodecahedronGeometry args={[0.4, 1]} />
      <meshStandardMaterial color={color} flatShading roughness={0.9} />
    </mesh>
  );
}

function WaterSurface({ width, length, position }: { width: number; length: number; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, length, 20, 20);
    return geo;
  }, [width, length]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      const posAttr = meshRef.current.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        // Multiple wave frequencies for realistic water
        const wave1 = Math.sin(x * 2 + t * 1.5) * 0.03;
        const wave2 = Math.sin(y * 3 + t * 2.0) * 0.02;
        const wave3 = Math.sin((x + y) * 1.5 + t * 1.2) * 0.015;
        posAttr.setZ(i, wave1 + wave2 + wave3);
      }
      posAttr.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }
    if (materialRef.current) {
      const dayFactor = getDayFactor();
      // Water is more reflective and blue at night
      materialRef.current.emissiveIntensity = 0.15 + (1 - dayFactor) * 0.15;
      materialRef.current.roughness = 0.15 + dayFactor * 0.15;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      geometry={geometry}
    >
      <meshStandardMaterial
        ref={materialRef}
        color="#0ea5e9"
        transparent
        opacity={0.82}
        emissive="#38bdf8"
        emissiveIntensity={0.15}
        metalness={0.85}
        roughness={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const SHORELINE_TUFT_COUNT = 40;
const SHORELINE_GRASS_COLORS = ["#16a34a", "#22c55e", "#15803d"] as const;
const REED_BASES: [number, number][] = [
  [1.1, 54],
  [4.9, 57],
  [1.1, 62],
  [4.9, 65],
  [1.1, 70],
  [4.9, 72],
];
const REED_OFFSETS = [0, 0.2, -0.15, 0.1, -0.05] as const;

interface ShorelineTuft {
  x: number;
  z: number;
  height: number;
  rotationY: number;
  color: string;
}

interface ReedCluster {
  position: [number, number, number];
  stems: {
    dx: number;
    y: number;
    height: number;
    color: string;
  }[];
}

function createReedClusters(): ReedCluster[] {
  return REED_BASES.map(([x, z]) => ({
    position: [x, 0, z],
    stems: REED_OFFSETS.map((dx, index) => ({
      dx,
      y: randomBetween(0.4, 0.6),
      height: randomBetween(0.7, 1.0),
      color: index % 2 === 0 ? "#65a30d" : "#84cc16",
    })),
  }));
}

function ShorelineGrass({ x, zStart, zEnd }: { x: number; zStart: number; zEnd: number }) {
  const tufts = useMemo(() => {
    return Array.from({ length: SHORELINE_TUFT_COUNT }, (_, index): ShorelineTuft => ({
      x: x + randomCentered(0.6),
      z: randomBetween(zStart, zEnd),
      height: randomBetween(0.15, 0.35),
      rotationY: randomBetween(0, Math.PI),
      color: SHORELINE_GRASS_COLORS[index % SHORELINE_GRASS_COLORS.length],
    }));
  }, [x, zStart, zEnd]);

  return (
    <group>
      {/* Base grass strip */}
      <mesh position={[x, 0.03, (zStart + zEnd) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.2, zEnd - zStart]} />
        <meshStandardMaterial color="#15803d" roughness={0.95} />
      </mesh>
      {/* Individual grass tufts */}
      {tufts.map((t, i) => (
        <mesh key={i} position={[t.x, t.height / 2, t.z]} rotation={[0, t.rotationY, 0.1]}>
          <boxGeometry args={[0.03, t.height, 0.03]} />
          <meshStandardMaterial color={t.color} />
        </mesh>
      ))}
    </group>
  );
}

function Fish({ startPos }: { startPos: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!);
  const offset = useMemo(() => randomAngle(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime + offset;
    if (ref.current) {
      ref.current.position.x = startPos[0] + Math.sin(t * 0.5) * 1.2;
      ref.current.position.z = startPos[2] + Math.cos(t * 0.3) * 2;
      ref.current.position.y = startPos[1] + Math.sin(t * 1.2) * 0.05;
      ref.current.rotation.y = Math.atan2(Math.cos(t * 0.5) * 1.2, -Math.sin(t * 0.3) * 2);
    }
  });

  return (
    <group ref={ref} position={startPos}>
      <mesh>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.08, 0, 0]}>
        <coneGeometry args={[0.04, 0.08, 4]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

export default function River() {
  const lilyRef1 = useRef<THREE.Mesh>(null!);
  const lilyRef2 = useRef<THREE.Mesh>(null!);
  const lilyRef3 = useRef<THREE.Mesh>(null!);
  const reedClusters = useMemo(createReedClusters, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (lilyRef1.current) {
      lilyRef1.current.position.x = 2.6 + Math.sin(t * 0.4) * 0.08;
      lilyRef1.current.position.z = 36 + Math.sin(t * 0.3) * 0.06;
      lilyRef1.current.rotation.z = Math.sin(t * 0.2) * 0.1;
    }
    if (lilyRef2.current) {
      lilyRef2.current.position.x = 3.4 + Math.cos(t * 0.35) * 0.08;
      lilyRef2.current.position.z = 48 + Math.cos(t * 0.25) * 0.06;
      lilyRef2.current.rotation.z = Math.cos(t * 0.25) * 0.1;
    }
    if (lilyRef3.current) {
      lilyRef3.current.position.x = 5.0 + Math.sin(t * 0.3) * 0.1;
      lilyRef3.current.position.z = 58 + Math.sin(t * 0.4) * 0.08;
      lilyRef3.current.rotation.z = Math.sin(t * 0.3) * 0.08;
    }
  });

  return (
    <group>
      {/* Riverbed — dark base */}
      <mesh position={[4.5, 0.01, 63]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 22]} />
        <meshStandardMaterial color="#0f172a" roughness={1} />
      </mesh>

      {/* Animated water surface */}
      <WaterSurface width={3.5} length={21} position={[4.5, 0.08, 63]} />

      {/* Secondary water layer for depth */}
      <mesh position={[4.5, 0.04, 63]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 20]} />
        <meshStandardMaterial color="#0369a1" transparent opacity={0.5} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Shoreline grass with tufts */}
      <ShorelineGrass x={1.1} zStart={52} zEnd={74} />
      <ShorelineGrass x={4.9} zStart={52} zEnd={74} />

      {/* Extended banks */}
      <mesh position={[1.1, 0.04, 48]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.0, 8]} />
        <meshStandardMaterial color="#166534" roughness={0.95} />
      </mesh>
      <mesh position={[4.9, 0.04, 48]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.0, 8]} />
        <meshStandardMaterial color="#166534" roughness={0.95} />
      </mesh>

      {/* Rocks along the banks — more variety */}
      <Rock position={[1.4, 0.22, 53]} scale={0.9} />
      <Rock position={[1.3, 0.18, 56]} scale={0.6} color="#44403c" />
      <Rock position={[4.8, 0.22, 55]} scale={1.1} color="#44403c" />
      <Rock position={[1.5, 0.22, 67]} scale={0.8} />
      <Rock position={[4.7, 0.22, 70]} scale={1.0} color="#57534e" />
      <Rock position={[4.6, 0.18, 73]} scale={0.7} color="#44403c" />
      <Rock position={[4.5, 0.12, 76]} scale={0.6} />
      <Rock position={[1.4, 0.15, 60]} scale={0.5} color="#78716c" />

      {/* Drifting lily pads — with flowers */}
      <group ref={lilyRef1} position={[3.9, 0.09, 54]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <circleGeometry args={[0.4, 12]} />
          <meshStandardMaterial color="#22c55e" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.1, 0.05, 0]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={0.3} />
        </mesh>
      </group>
      <group ref={lilyRef2} position={[5.1, 0.09, 66]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <circleGeometry args={[0.35, 10]} />
          <meshStandardMaterial color="#16a34a" side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group ref={lilyRef3} position={[4.2, 0.09, 58]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <circleGeometry args={[0.3, 10]} />
          <meshStandardMaterial color="#4ade80" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.05, 0.04, 0]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Fish swimming */}
      <Fish startPos={[4.0, 0.04, 60]} />
      <Fish startPos={[4.8, 0.04, 56]} />
      <Fish startPos={[3.5, 0.04, 68]} />

      {/* Reeds along the banks */}
      {reedClusters.map((cluster, i) => (
        <group key={i} position={cluster.position}>
          {cluster.stems.map((stem, j) => (
            <mesh key={j} position={[stem.dx, stem.y, 0]}>
              <cylinderGeometry args={[0.02, 0.025, stem.height, 4]} />
              <meshStandardMaterial color={stem.color} />
            </mesh>
          ))}
          {/* Reed head */}
          <mesh position={[0.05, 0.85, 0]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#92400e" />
          </mesh>
        </group>
      ))}

      {/* Arched bridge */}
      <ArchedBridge position={[4.5, 0, 60]} />
    </group>
  );
}
