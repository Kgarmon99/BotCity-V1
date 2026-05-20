import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export interface BuildingData {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
  roofColor: string;
  width: number;
  depth: number;
  height: number;
  emoji: string;
  visited: boolean;
  available: boolean;
}

interface BuildingProps {
  data: BuildingData;
  playerPos: THREE.Vector3;
  isNear: boolean;
}

interface WindowGridProps {
  count: number;
  startY: number;
  spacing: number;
  faceWidth: number;
  z: number;
  rotationY?: number;
  color: string;
  windowsPerRow: number;
}

function WindowGrid({
  count,
  startY,
  spacing,
  faceWidth,
  z,
  rotationY = 0,
  color,
  windowsPerRow,
}: WindowGridProps) {
  // Distribute windows evenly across the face with margin on the sides.
  const margin = 0.5;
  const usable = faceWidth - margin * 2;
  const step = windowsPerRow > 1 ? usable / (windowsPerRow - 1) : 0;
  const xs =
    windowsPerRow === 1
      ? [0]
      : Array.from({ length: windowsPerRow }, (_, i) => -usable / 2 + i * step);

  return (
    <group rotation={[0, rotationY, 0]} position={[0, 0, 0]}>
      {Array.from({ length: count }).map((_, row) =>
        xs.map((x, col) => {
          const y = startY + row * spacing;
          return (
            <group key={`${row}-${col}`} position={[x, y, z]}>
              {/* Window pane */}
              <mesh>
                <boxGeometry args={[0.55, 0.4, 0.04]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={1.4}
                  toneMapped={false}
                />
              </mesh>
              {/* Frame — sits in front of the pane (no overlap with pane volume) */}
              <mesh position={[0, 0, 0.04]}>
                <boxGeometry args={[0.62, 0.47, 0.02]} />
                <meshStandardMaterial color="#0b1220" metalness={0.6} roughness={0.4} />
              </mesh>
              {/* Mullions (horizontal + vertical), in front of frame */}
              <mesh position={[0, 0, 0.06]}>
                <boxGeometry args={[0.55, 0.03, 0.01]} />
                <meshStandardMaterial color="#0b1220" />
              </mesh>
              <mesh position={[0, 0, 0.06]}>
                <boxGeometry args={[0.03, 0.4, 0.01]} />
                <meshStandardMaterial color="#0b1220" />
              </mesh>
            </group>
          );
        }),
      )}
    </group>
  );
}

export default function Building({ data, isNear }: BuildingProps) {
  const glowRef = useRef<THREE.Mesh>(null!);
  const trimRef = useRef<THREE.Mesh>(null!);
  const antennaRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (glowRef.current && isNear) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.04);
    }
    if (trimRef.current) {
      const mat = trimRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(t * 2 + data.position[0]) * 0.3;
    }
    if (antennaRef.current) {
      const mat = antennaRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.4 + Math.sin(t * 4 + data.position[2]) * 0.6;
    }
  });

  const { label, position, color, roofColor, width, depth, height, emoji, visited } = data;
  const doorH = Math.min(1.9, height * 0.42);
  const doorW = Math.min(1.1, width * 0.22);

  // Window rows scale with height.
  const windowRows = Math.max(1, Math.floor((height - 1.5) / 1.8));
  const windowSpacing = 1.8;
  const firstWindowY = -height / 2 + 1.6;
  const frontPerRow = width >= 4 ? 3 : 2;
  const sidePerRow = depth >= 4 ? 2 : 1;

  return (
    <group position={position}>
      {/* ─── Stoop / front step (lifted above ground to avoid z-fighting) ─ */}
      <mesh position={[0, -height / 2 + 0.13, depth / 2 + 0.45]} receiveShadow castShadow>
        <boxGeometry args={[doorW + 1.4, 0.2, 0.9]} />
        <meshStandardMaterial color="#0b1220" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, -height / 2 + 0.25, depth / 2 + 0.45]}>
        <boxGeometry args={[doorW + 1.5, 0.04, 0.95]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>

      {/* ─── Main building body ─────────────────────────── */}
      <mesh castShadow receiveShadow ref={glowRef}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive={color}
          emissiveIntensity={isNear ? 0.4 : 0.15}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* ─── Corner pillars (slim vertical edge accents) ── */}
      {[
        [width / 2, depth / 2],
        [-width / 2, depth / 2],
        [width / 2, -depth / 2],
        [-width / 2, -depth / 2],
      ].map(([px, pz], i) => (
        <mesh key={i} position={[px, 0, pz]}>
          <boxGeometry args={[0.16, height, 0.16]} />
          <meshStandardMaterial
            color={roofColor}
            emissive={roofColor}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* ─── Neon trim around base ──────────────────────── */}
      <mesh ref={trimRef} position={[0, -height / 2 + 0.1, 0]}>
        <boxGeometry args={[width + 0.18, 0.15, depth + 0.18]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>

      {/* ─── Mid-height belt trim (architectural divider) ─ */}
      {height >= 5 && (
        <mesh position={[0, -height / 2 + height * 0.55, 0]}>
          <boxGeometry args={[width + 0.06, 0.05, depth + 0.06]} />
          <meshStandardMaterial color={roofColor} emissive={roofColor} emissiveIntensity={0.6} />
        </mesh>
      )}

      {/* ─── Top neon trim ──────────────────────────────── */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width + 0.18, 0.1, depth + 0.18]} />
        <meshStandardMaterial color={roofColor} emissive={roofColor} emissiveIntensity={1.2} />
      </mesh>

      {/* ─── Parapet (low wall around roof edge) ────────── */}
      <group position={[0, height / 2 + 0.18, 0]}>
        {/* Front + back parapet strips */}
        <mesh position={[0, 0, depth / 2 + 0.05]}>
          <boxGeometry args={[width + 0.3, 0.25, 0.08]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, -depth / 2 - 0.05]}>
          <boxGeometry args={[width + 0.3, 0.25, 0.08]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} />
        </mesh>
        <mesh position={[width / 2 + 0.05, 0, 0]}>
          <boxGeometry args={[0.08, 0.25, depth + 0.3]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} />
        </mesh>
        <mesh position={[-width / 2 - 0.05, 0, 0]}>
          <boxGeometry args={[0.08, 0.25, depth + 0.3]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} />
        </mesh>
      </group>

      {/* ─── Rooftop equipment + antenna ────────────────── */}
      <group position={[0, height / 2 + 0.45, 0]}>
        {/* HVAC-style block */}
        <mesh position={[width * 0.2, 0.15, -depth * 0.2]} castShadow>
          <boxGeometry args={[Math.min(width * 0.35, 1.2), 0.3, Math.min(depth * 0.25, 0.7)]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.5} />
        </mesh>
        {/* Antenna base */}
        <mesh position={[-width * 0.25, 0.2, depth * 0.15]}>
          <cylinderGeometry args={[0.12, 0.16, 0.2, 8]} />
          <meshStandardMaterial color="#0b1220" metalness={0.8} />
        </mesh>
        {/* Antenna mast */}
        <mesh position={[-width * 0.25, 0.95, depth * 0.15]}>
          <cylinderGeometry args={[0.03, 0.03, 1.4, 6]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        {/* Antenna tip light (pulses) */}
        <mesh ref={antennaRef} position={[-width * 0.25, 1.7, depth * 0.15]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color={roofColor}
            emissive={roofColor}
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ─── Windows: front + back ──────────────────────── */}
      <WindowGrid
        count={windowRows}
        startY={firstWindowY}
        spacing={windowSpacing}
        faceWidth={width}
        z={depth / 2 + 0.03}
        color={color}
        windowsPerRow={frontPerRow}
      />
      <WindowGrid
        count={windowRows}
        startY={firstWindowY}
        spacing={windowSpacing}
        faceWidth={width}
        z={depth / 2 + 0.03}
        rotationY={Math.PI}
        color={color}
        windowsPerRow={frontPerRow}
      />
      {/* ─── Windows: left + right sides ────────────────── */}
      <WindowGrid
        count={windowRows}
        startY={firstWindowY}
        spacing={windowSpacing}
        faceWidth={depth}
        z={width / 2 + 0.03}
        rotationY={Math.PI / 2}
        color={color}
        windowsPerRow={sidePerRow}
      />
      <WindowGrid
        count={windowRows}
        startY={firstWindowY}
        spacing={windowSpacing}
        faceWidth={depth}
        z={width / 2 + 0.03}
        rotationY={-Math.PI / 2}
        color={color}
        windowsPerRow={sidePerRow}
      />

      {/* ─── Door frame ─────────────────────────────────── */}
      <mesh position={[0, -height / 2 + doorH / 2, depth / 2 + 0.005]}>
        <boxGeometry args={[doorW + 0.2, doorH + 0.18, 0.04]} />
        <meshStandardMaterial color={roofColor} emissive={roofColor} emissiveIntensity={0.7} />
      </mesh>
      {/* Door panel */}
      <mesh position={[0, -height / 2 + doorH / 2, depth / 2 + 0.025]} castShadow>
        <boxGeometry args={[doorW, doorH, 0.05]} />
        <meshStandardMaterial color="#0a0f1a" emissive={color} emissiveIntensity={0.5} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Door split line */}
      <mesh position={[0, -height / 2 + doorH / 2, depth / 2 + 0.052]}>
        <boxGeometry args={[0.02, doorH - 0.1, 0.01]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* Door handles */}
      <mesh position={[-0.12, -height / 2 + doorH / 2 - 0.1, depth / 2 + 0.06]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={roofColor} emissive={roofColor} emissiveIntensity={0.8} metalness={0.9} />
      </mesh>
      <mesh position={[0.12, -height / 2 + doorH / 2 - 0.1, depth / 2 + 0.06]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={roofColor} emissive={roofColor} emissiveIntensity={0.8} metalness={0.9} />
      </mesh>

      {/* ─── Awning over door ───────────────────────────── */}
      <mesh position={[0, -height / 2 + doorH + 0.25, depth / 2 + 0.35]} castShadow>
        <boxGeometry args={[doorW + 0.7, 0.08, 0.55]} />
        <meshStandardMaterial color="#0b1220" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Awning light strip (underside glow) */}
      <mesh position={[0, -height / 2 + doorH + 0.21, depth / 2 + 0.35]}>
        <boxGeometry args={[doorW + 0.55, 0.04, 0.4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>

      {/* ─── Visited badge — emerald disc with halo ─────── */}
      {visited && (
        <group position={[0, height / 2 + 1.4, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color="#15803d"
              emissive="#22c55e"
              emissiveIntensity={1.2}
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.42, 0.025, 8, 24]} />
            <meshStandardMaterial color="#86efac" emissive="#86efac" emissiveIntensity={2} toneMapped={false} />
          </mesh>
          <Text position={[0, 0, 0.32]} fontSize={0.32} color="#ffffff" anchorX="center" anchorY="middle">
            ✓
          </Text>
        </group>
      )}

      {/* ─── "Press E" prompt ───────────────────────────── */}
      {isNear && <InteractPrompt y={height / 2 + 2.2} />}

      {/* ─── Building label ─────────────────────────────── */}
      <Text
        position={[0, height / 2 + 0.85, depth / 2 + 0.3]}
        fontSize={0.45}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor={color}
      >
        {emoji} {label}
      </Text>
    </group>
  );
}

function InteractPrompt({ y }: { y: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const borderRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = y + Math.sin(t * 3) * 0.06;
    }
    if (borderRef.current) {
      (borderRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.8 + Math.sin(t * 3) * 0.15;
    }
  });
  return (
    <group ref={groupRef} position={[0, y, 0]}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[3.0, 0.85]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[2.7, 0.65]} />
        <meshBasicMaterial color="#021410" transparent opacity={0.9} />
      </mesh>
      <mesh ref={borderRef} position={[0, 0, -0.005]}>
        <planeGeometry args={[2.78, 0.73]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
      </mesh>
      <mesh position={[-1.3, 0, 0.01]}>
        <planeGeometry args={[0.08, 0.55]} />
        <meshBasicMaterial color="#22c55e" toneMapped={false} />
      </mesh>
      <Text position={[-0.6, 0, 0.02]} fontSize={0.3} color="#fbbf24" anchorX="center" anchorY="middle">
        E
      </Text>
      <Text position={[0.3, 0, 0.02]} fontSize={0.24} color="#ffffff" anchorX="center" anchorY="middle">
        to enter
      </Text>
    </group>
  );
}
