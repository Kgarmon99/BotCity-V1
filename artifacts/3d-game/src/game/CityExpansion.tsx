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
// Rails extended to span the full corridor the moving train uses
// (train cycles x ≈ -42 .. 43), so the consist is always over visible
// track. Tracks cross several roads at grade — visually natural for a
// rail line and the rails sit at y=0.1 above the road surface (y=0.015).
const RAIL_LENGTH = 88;
const RAIL_CENTER_X = 1; // spans x = -43 .. 45

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
      {/* Ties — spacing ~1.5u keeps the count reasonable across the long rail */}
      {Array.from({ length: 60 }).map((_, i) => {
        const x = RAIL_CENTER_X - RAIL_LENGTH / 2 + i * (RAIL_LENGTH / 59);
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

// Animated train — three cars travelling east along the rails. The group
// wrapper translates the whole consist; each `TrainCar` is placed at a
// relative x-offset inside the group so they stay rigidly coupled. We
// move along x and wrap around once the lead car clears the visible span,
// re-entering from the west.
function MovingTrain() {
  const ref = useRef<THREE.Group>(null!);
  // Travel span well beyond the visible rails so the train appears to come
  // from somewhere and head somewhere, instead of popping into the middle.
  const RANGE_MIN = -30;
  const RANGE_MAX = 35;
  const TRAIN_LEN = 12; // 3 cars × 4u spacing + body overhang
  const SPEED = 4.5;
  const TOTAL = RANGE_MAX - RANGE_MIN + TRAIN_LEN;
  useFrame((state) => {
    if (!ref.current) return;
    const raw = state.clock.elapsedTime * SPEED;
    // Wrap so the train cycles continuously left-to-right.
    const x = ((raw % TOTAL) + TOTAL) % TOTAL + (RANGE_MIN - TRAIN_LEN);
    ref.current.position.x = x;
  });
  return (
    <group ref={ref}>
      {/* Locomotive (red roof, brighter headlight) + two coaches */}
      <TrainCar x={0} z={TRACK_Z} color="#7c2d12" accent="#fde68a" />
      <TrainCar x={4} z={TRACK_Z} color="#fb923c" accent="#fde68a" />
      <TrainCar x={8} z={TRACK_Z} color="#fb923c" accent="#fde68a" />
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
// Airport addons: BotPlane International — relocated from the inner block
// out to the far SW edge of the world. Terminal sits at (-50, *, 45),
// footprint x=-55..-45, z=42..48. A 35u-long runway runs E-W at z=55,
// width 5 (z=52.5..57.5), x = -65..-30. Empty corner — closest neighbors
// are botfarm at (-40, -41) (86u north) and botgigs at (-55, 6) (39u N).
// All runway/apron/hangar geometry stays well within the 150x150 ground.
// ─────────────────────────────────────────────────────────────────────

const RUNWAY_Z = 55;
const RUNWAY_WIDTH = 5;
const RUNWAY_X_MIN = -65;
const RUNWAY_X_MAX = -30;
const RUNWAY_LENGTH = RUNWAY_X_MAX - RUNWAY_X_MIN; // 35
const RUNWAY_CENTER_X = (RUNWAY_X_MIN + RUNWAY_X_MAX) / 2; // -47.5

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
      {Array.from({ length: 18 }).map((_, i) => {
        const t = (i + 0.5) / 18;
        const x = RUNWAY_X_MIN + t * RUNWAY_LENGTH;
        return (
          <mesh
            key={`dash-${i}`}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            position={[x, 0.05, RUNWAY_Z]}
          >
            <planeGeometry args={[0.3, 1.4]} />
            <meshStandardMaterial
              color="#fde047"
              emissive="#fde047"
              emissiveIntensity={1.1}
              toneMapped={false}
            />
          </mesh>
        );
      })}
      {/* Threshold markers at both ends */}
      {[-1.6, -0.8, 0.8, 1.6].flatMap((zOff) =>
        [RUNWAY_X_MIN + 1.2, RUNWAY_X_MAX - 1.2].map((x) => (
          <mesh
            key={`th-${zOff}-${x}`}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            position={[x, 0.05, RUNWAY_Z + zOff]}
          >
            <planeGeometry args={[0.5, 1.2]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
          </mesh>
        ))
      )}
      {/* Apron / tarmac in front of terminal */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-47, 0.02, 50]}
        receiveShadow
      >
        <planeGeometry args={[24, 8]} />
        <meshStandardMaterial color="#27272a" roughness={0.85} />
      </mesh>
      {/* Hangars — two big arched hangars flanking the terminal */}
      {[-60, -38].map((hx) => (
        <group key={`hangar-${hx}`} position={[hx, 0, 50]}>
          <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[5, 3.2, 4]} />
            <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.55} />
          </mesh>
          <mesh position={[0, 3.4, 0]} rotation={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[2.5, 2.5, 4, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.45} />
          </mesh>
          {/* Hangar door (slatted look) */}
          <mesh position={[0, 1.5, 2.01]}>
            <planeGeometry args={[4.4, 2.8]} />
            <meshStandardMaterial
              color="#1e293b"
              emissive="#38bdf8"
              emissiveIntensity={0.25}
              metalness={0.7}
              roughness={0.35}
            />
          </mesh>
        </group>
      ))}
      {/* Big airport sign */}
      <Text
        position={[-47, 5.5, 41.5]}
        fontSize={0.7}
        color="#38bdf8"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#0b1220"
      >
        ✈ BOTPLANE INTERNATIONAL
      </Text>
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
      {/* Wings — wingspan 4.4 (we're out at the airport corner now, no
          street clearance constraint). */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.1, 0.14, 4.4]} />
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
      {/* Engines under wings */}
      {[-1.6, 1.6].map((zOff) => (
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

// Takeoff plane — same mesh body as Airplane, but instead of bobbing in
// place it cycles through taxi → takeoff roll → climb → fly out → reset.
// One full cycle is CYCLE_SEC; the plane spends most of the loop airborne
// so the player almost always sees something happening at the airport.
function TakeoffPlane() {
  const ref = useRef<THREE.Group>(null!);
  const lightRef = useRef<THREE.Mesh>(null!);
  const CYCLE_SEC = 22;

  useFrame((state) => {
    const t = (state.clock.elapsedTime % CYCLE_SEC) / CYCLE_SEC; // 0..1
    let x: number;
    let y: number;
    let pitch: number; // radians, 0 = level, positive = nose up
    if (t < 0.15) {
      // Holding at west end of runway (pre-roll pause)
      x = RUNWAY_X_MIN + 10; // -55
      y = 0.75;
      pitch = 0;
    } else if (t < 0.4) {
      // Takeoff roll — accelerate east along the runway, still on the ground.
      // Pitch eases up smoothly so the transition into climb is continuous
      // (no attitude snap at the phase boundary).
      const u = (t - 0.15) / 0.25;
      x = (RUNWAY_X_MIN + 10) + u * 25; // -55 → -30
      y = 0.75;
      pitch = u * 0.2; // 0 → 0.2 rad over the roll
    } else if (t < 0.95) {
      // Climb out — continue east while ascending into the sky.
      // pitch(u=0) = 0.2 (matches roll end), arcs up to ~0.35 mid-climb,
      // then eases back to ~0.1 as the plane levels off at altitude.
      const u = (t - 0.4) / 0.55;
      x = -30 + u * 90; // -30 → 60
      y = 0.75 + u * 27;
      pitch = 0.2 + Math.sin(u * Math.PI) * 0.15 - u * 0.1;
    } else {
      // Off-screen / reset window — park well outside the visible area so
      // the plane "reappears" cleanly at the west end on the next cycle.
      x = 100;
      y = 40;
      pitch = 0;
    }

    if (ref.current) {
      ref.current.position.set(x, y, RUNWAY_Z);
      // Base orientation aligns local +Y with world +X (rotation.z = -π/2);
      // adding `pitch` rotates nose up around world +Z.
      ref.current.rotation.z = -Math.PI / 2 + pitch;
    }
    if (lightRef.current) {
      const mat = lightRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 4) * 1.2;
    }
  });

  return (
    <group ref={ref}>
      {/* Fuselage */}
      <mesh castShadow>
        <capsuleGeometry args={[0.45, 3.2, 8, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Cockpit windows */}
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
      {/* Wings */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.1, 0.14, 4.4]} />
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
      {/* Engines under wings */}
      {[-1.6, 1.6].map((zOff) => (
        <mesh key={`eng-${zOff}`} position={[0, 0.1, zOff]} castShadow>
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
  // Sits on the airport apron between terminal and runway.
  return (
    <group position={[-42, 0, 50]}>
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
      <MovingTrain />
      <TrainStationSign />

      {/* ─── Airport district (far SW edge) ─── */}
      <Runway />
      {/* One plane parked on the apron in front of the terminal, one on the
          runway actively cycling through takeoff. */}
      <Airplane position={[-70.5, 0.75, 75]} />
      <TakeoffPlane />
      <ControlTower />
    </group>
  );
}
