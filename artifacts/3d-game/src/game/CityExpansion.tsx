import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────
// Train station addons: tracks + parked train cars next to BotTrain.
// Station sits at (14, *, 12); footprint x=12..16, z=10..14.
// Tracks run east-west at z = 15.5 (depth 1.4 → z=14.8..16.2, clear of the
// z=18 secondary street at 16.9..19.1, and clear of the station footprint).
// Rail x-range = -1..16 (length 17), clear of x=18 street (16.9..19.1).
// ─────────────────────────────────────────────────────────────────────

const TRACK_Z = 15.5;
const RAIL_LENGTH = 14;
const RAIL_CENTER_X = 9; // spans x = 2 .. 16 (clear of x=0 main avenue band -1.5..1.5)

function TrainCar({
  x,
  z,
  color,
  accent,
}: {
  x: number;
  z: number;
  color: string;
  accent: string;
}) {
  return (
    <group position={[x, 0, z]}>
      {/* Body */}
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 1.4, 1.4]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.35}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.65, 0]} castShadow>
        <boxGeometry args={[3.5, 0.15, 1.5]} />
        <meshStandardMaterial color="#0b1220" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Window strip (both long sides) */}
      {[0.76, -0.76].map((zOff) => (
        <mesh key={`w-${zOff}`} position={[0, 1.05, zOff]}>
          <boxGeometry args={[2.8, 0.4, 0.04]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* Wheels */}
      {[-1.1, 1.1].map((xOff) => (
        <group key={`wheels-${xOff}`}>
          {[0.76, -0.76].map((zOff) => (
            <mesh
              key={`wheel-${xOff}-${zOff}`}
              position={[xOff, 0.25, zOff]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
              <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.3} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Headlight (front-facing on +x end) */}
      <mesh position={[1.72, 0.95, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color="#fde047"
          emissive="#fde047"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function TrainTracks() {
  return (
    <group>
      {/* Ties */}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = RAIL_CENTER_X - RAIL_LENGTH / 2 + i * (RAIL_LENGTH / 17);
        return (
          <mesh key={`tie-${i}`} position={[x, 0.04, TRACK_Z]}>
            <boxGeometry args={[0.35, 0.08, 1.4]} />
            <meshStandardMaterial color="#1c1917" roughness={0.9} />
          </mesh>
        );
      })}
      {/* Rails */}
      {[0.45, -0.45].map((zOff) => (
        <mesh
          key={`rail-${zOff}`}
          position={[RAIL_CENTER_X, 0.1, TRACK_Z + zOff]}
        >
          <boxGeometry args={[RAIL_LENGTH, 0.08, 0.08]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.95}
            roughness={0.2}
            emissive="#475569"
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function TrainStationSign() {
  // South face of station (building footprint south edge at z=10); sign sits in
  // front of the wall at z=9.7 so plaza-side players see it clearly.
  return (
    <group position={[14, 4.5, 9.7]}>
      <mesh>
        <planeGeometry args={[3.2, 0.6]} />
        <meshStandardMaterial
          color="#0b1220"
          emissive="#fb923c"
          emissiveIntensity={0.6}
        />
      </mesh>
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.32}
        color="#fde68a"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#7c2d12"
      >
        🚆 BOTTRAIN STATION
      </Text>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Airport addons: BotPlane terminal at (-14, *, 12); footprint x=-16..-12,
// z=10..14. Runway runs east-west at z=15.5, width 1.8 (z=14.6..16.4),
// x = -16..-3 (length 13). Stays clear of:
//   - x=-18 street (-19.1..-16.9) — runway starts at -16
//   - x=0 main avenue (-1.5..1.5)  — runway ends at -3
//   - z=18 street (16.9..19.1)      — runway max z = 16.4
//   - Terminal footprint z=10..14   — runway min z = 14.6
//   - IRS at (-9, 9) z=7..11        — runway z=14.6+ is clear
// ─────────────────────────────────────────────────────────────────────

const RUNWAY_Z = 15.5;
const RUNWAY_WIDTH = 1.8;
const RUNWAY_X_MIN = -16;
const RUNWAY_X_MAX = -3;
const RUNWAY_LENGTH = RUNWAY_X_MAX - RUNWAY_X_MIN; // 13
const RUNWAY_CENTER_X = (RUNWAY_X_MIN + RUNWAY_X_MAX) / 2; // -9.5

function Runway() {
  return (
    <group>
      {/* Tarmac strip (rotated so its length runs along the X axis) */}
      <mesh
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        position={[RUNWAY_CENTER_X, 0.03, RUNWAY_Z]}
        receiveShadow
      >
        <planeGeometry args={[RUNWAY_WIDTH, RUNWAY_LENGTH]} />
        <meshStandardMaterial
          color="#1c1917"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>
      {/* Center dashed line — dashes along x-axis */}
      {Array.from({ length: 9 }).map((_, i) => {
        const t = (i + 0.5) / 9;
        const x = RUNWAY_X_MIN + t * RUNWAY_LENGTH;
        return (
          <mesh
            key={`dash-${i}`}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            position={[x, 0.05, RUNWAY_Z]}
          >
            <planeGeometry args={[0.15, 1.1]} />
            <meshStandardMaterial
              color="#fde047"
              emissive="#fde047"
              emissiveIntensity={1.1}
              toneMapped={false}
            />
          </mesh>
        );
      })}
      {/* Threshold markers at east end of runway (away from terminal) */}
      {[-0.5, 0.5].map((zOff) => (
        <mesh
          key={`th-${zOff}`}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          position={[RUNWAY_X_MAX - 0.6, 0.05, RUNWAY_Z + zOff]}
        >
          <planeGeometry args={[0.3, 0.8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Airplane({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!);
  const lightRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 0.4) * 0.05;
    }
    if (lightRef.current) {
      const mat = lightRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.5 + Math.sin(t * 4) * 1.2;
    }
  });
  // Plane nose points east (+x) along the runway — capsule's long axis is its
  // local Y, so rotate so local Y aligns with world +X.
  return (
    <group ref={ref} position={position} rotation={[0, 0, -Math.PI / 2]}>
      {/* Fuselage */}
      <mesh castShadow>
        <capsuleGeometry args={[0.45, 3.2, 8, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Cockpit windows (near +Y end of fuselage = nose) */}
      <mesh position={[0, 1.55, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.3, 0.5, 16]} />
        <meshStandardMaterial
          color="#0c4a6e"
          emissive="#38bdf8"
          emissiveIntensity={0.9}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      {/* Wings (perpendicular to fuselage) — wingspan 2.4 keeps max world z ≤ 16.7,
          clear of z=18 secondary street band (16.9..19.1). */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.95, 0.12, 2.4]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.55} roughness={0.4} />
      </mesh>
      {/* Tail vertical fin */}
      <mesh position={[0, -1.5, 0.45]} castShadow>
        <boxGeometry args={[0.08, 0.7, 0.7]} />
        <meshStandardMaterial color="#0c4a6e" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Tail horizontal stabilizer */}
      <mesh position={[0, -1.55, 0.1]} castShadow>
        <boxGeometry args={[0.08, 0.5, 1.4]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.55} roughness={0.4} />
      </mesh>
      {/* Engines under wings (kept inside shrunk wingspan) */}
      {[-0.85, 0.85].map((zOff) => (
        <mesh
          key={`eng-${zOff}`}
          position={[0, 0.1, zOff]}
          castShadow
        >
          <cylinderGeometry args={[0.18, 0.16, 0.7, 12]} />
          <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      {/* Tail beacon (blinking) */}
      <mesh ref={lightRef} position={[0, -1.5, 0.85]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function ControlTower() {
  // Sits in front of the airport terminal (south face) — between terminal and plaza.
  return (
    <group position={[-14, 0, 9]}>
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 6, 12]} />
        <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 6.4, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.7, 0.9, 16]} />
        <meshStandardMaterial
          color="#0c4a6e"
          emissive="#38bdf8"
          emissiveIntensity={1.2}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 7.05, 0]}>
        <coneGeometry args={[0.3, 0.6, 8]} />
        <meshStandardMaterial color="#0b1220" metalness={0.6} />
      </mesh>
    </group>
  );
}

export default function CityExpansion() {
  return (
    <group>
      {/* ─── Train station district (SE inner block) ─── */}
      <TrainTracks />
      <TrainCar x={5} z={TRACK_Z} color="#fb923c" accent="#fde68a" />
      <TrainCar x={9} z={TRACK_Z} color="#7c2d12" accent="#fde68a" />
      <TrainCar x={13} z={TRACK_Z} color="#fb923c" accent="#fde68a" />
      <TrainStationSign />

      {/* ─── Airport district (SW inner block) ─── */}
      <Runway />
      <Airplane position={[-10, 0.55, RUNWAY_Z]} />
      <ControlTower />
    </group>
  );
}
