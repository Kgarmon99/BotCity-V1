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
// Airport addons: BotPlane International — pushed to the far SW outskirts.
// All coords below are LOCAL to the airport district's wrapping <group>
// in the default export (translated by (-15, 0, +5) into world space).
// Local terminal sits at (-50, *, 45) → world (-65, *, 50). Runway 1 runs
// E-W at local z=55 (world z=60), x = -65..-30 → world x = -80..-45.
// Runway 2 (after the X_MAX shortening below) runs local x=-70..-30 →
// world x=-85..-45, clearing BotShops west edge x=-43 by 2u.
// All runway/apron/hangar geometry stays well within the 150x150 ground.
// ─────────────────────────────────────────────────────────────────────

const RUNWAY_Z = 55;
const RUNWAY_WIDTH = 5;
const RUNWAY_X_MIN = -65;
const RUNWAY_X_MAX = -30;
const RUNWAY_LENGTH = RUNWAY_X_MAX - RUNWAY_X_MIN; // 35
const RUNWAY_CENTER_X = (RUNWAY_X_MIN + RUNWAY_X_MAX) / 2; // -47.5

// ─── Multi-runway expansion ──────────────────────────────────────────
// Runway 2: longer parallel E-W runway, south of the terminal.
// Runway 3: N-S cross runway east of the terminal/apron.
// Runway 2 moved from z=77 to z=30 — pulled north of R1 (z=55) so the
// south airport apron no longer crowds BotGolf Country Club at z≈85.
// X-min shortened from -75 → -70 so R2 clears the BOTAIR hangar at
// (-75, 19) (x[-78,-72]) and the GREEN WINGS hangar at (-78, 32).
// X-max shortened from -15 → -30 so after the district-wide (-15) world
// shift, R2's east end sits at world x=-45, clearing BotShops west
// edge x=-43 by 2u (shops fp x[-43,-38]).
const RUNWAY2_Z = 30;
const RUNWAY2_WIDTH = 6;
const RUNWAY2_X_MIN = -70;
const RUNWAY2_X_MAX = -30;
const RUNWAY2_LEN = RUNWAY2_X_MAX - RUNWAY2_X_MIN; // 40
const RUNWAY2_CX = (RUNWAY2_X_MIN + RUNWAY2_X_MAX) / 2; // -50

const RUNWAY3_X = -25;
const RUNWAY3_WIDTH = 5;
const RUNWAY3_Z_MIN = 40;
const RUNWAY3_Z_MAX = 80;
const RUNWAY3_LEN = RUNWAY3_Z_MAX - RUNWAY3_Z_MIN; // 40
const RUNWAY3_CZ = (RUNWAY3_Z_MIN + RUNWAY3_Z_MAX) / 2; // 60

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

      {/* ═══════════════ RUNWAY 2 — main long parallel E-W ═══════════════
          z=77, x[-75,-15], width 6, length 60 — south of the terminal */}
      <mesh
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        position={[RUNWAY2_CX, 0.03, RUNWAY2_Z]}
        receiveShadow
      >
        <planeGeometry args={[RUNWAY2_WIDTH, RUNWAY2_LEN]} />
        <meshStandardMaterial color="#1c1917" roughness={0.95} metalness={0.05} />
      </mesh>
      {/* Center dashes */}
      {Array.from({ length: 28 }).map((_, i) => {
        const t = (i + 0.5) / 28;
        const x = RUNWAY2_X_MIN + t * RUNWAY2_LEN;
        return (
          <mesh
            key={`r2dash-${i}`}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            position={[x, 0.05, RUNWAY2_Z]}
          >
            <planeGeometry args={[0.35, 1.6]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1.1} toneMapped={false} />
          </mesh>
        );
      })}
      {/* Threshold piano keys at both ends */}
      {[-2.0, -1.0, 1.0, 2.0].flatMap((zOff) =>
        [RUNWAY2_X_MIN + 1.4, RUNWAY2_X_MAX - 1.4].map((x) => (
          <mesh
            key={`r2th-${zOff}-${x}`}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            position={[x, 0.05, RUNWAY2_Z + zOff]}
          >
            <planeGeometry args={[0.6, 1.4]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
        ))
      )}
      {/* Runway 2 number markers "09" / "27" */}
      <Text
        position={[RUNWAY2_X_MIN + 3.5, 0.06, RUNWAY2_Z]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        fontSize={1.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        09
      </Text>
      <Text
        position={[RUNWAY2_X_MAX - 3.5, 0.06, RUNWAY2_Z]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        fontSize={1.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        27
      </Text>
      {/* Blue edge lights along runway 2 — paired north/south */}
      {Array.from({ length: 16 }).map((_, i) => {
        const x = RUNWAY2_X_MIN + (i + 0.5) * (RUNWAY2_LEN / 16);
        return [-RUNWAY2_WIDTH / 2 - 0.2, RUNWAY2_WIDTH / 2 + 0.2].map((zOff, j) => (
          <mesh key={`r2el-${i}-${j}`} position={[x, 0.1, RUNWAY2_Z + zOff]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
        ));
      })}
      {/* PAPI lights at runway 2 east threshold (4-light vertical bar) */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`papi-${i}`} position={[RUNWAY2_X_MAX - 1.5, 0.25, RUNWAY2_Z - 4 + i * 0.5]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color={i < 2 ? "#ef4444" : "#f8fafc"} emissive={i < 2 ? "#ef4444" : "#f8fafc"} emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      ))}
      {/* East-threshold approach lights removed: after the airport's
          district-wide world shift + R2 east-end shortening, the east
          ILS corridor would land inside BotShops kiosk at world (-40.5,
          30.75). Real outskirts airports have their ILS corridors over
          open land — the west approach light bars in AirportExpansion
          serve as the (visible) runway 27 approach. */}

      {/* ═══════════════ RUNWAY 3 — N-S cross runway ═══════════════════
          x=-25, z[40,80], width 5, length 40 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[RUNWAY3_X, 0.03, RUNWAY3_CZ]}
        receiveShadow
      >
        <planeGeometry args={[RUNWAY3_WIDTH, RUNWAY3_LEN]} />
        <meshStandardMaterial color="#1c1917" roughness={0.95} metalness={0.05} />
      </mesh>
      {Array.from({ length: 20 }).map((_, i) => {
        const t = (i + 0.5) / 20;
        const z = RUNWAY3_Z_MIN + t * RUNWAY3_LEN;
        return (
          <mesh
            key={`r3dash-${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[RUNWAY3_X, 0.05, z]}
          >
            <planeGeometry args={[0.3, 1.4]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1.1} toneMapped={false} />
          </mesh>
        );
      })}
      {[-2.0, -1.0, 1.0, 2.0].flatMap((xOff) =>
        [RUNWAY3_Z_MIN + 1.2, RUNWAY3_Z_MAX - 1.2].map((z) => (
          <mesh
            key={`r3th-${xOff}-${z}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[RUNWAY3_X + xOff, 0.05, z]}
          >
            <planeGeometry args={[1.2, 0.5]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
        ))
      )}
      {/* Blue edge lights along runway 3 */}
      {Array.from({ length: 12 }).map((_, i) => {
        const z = RUNWAY3_Z_MIN + (i + 0.5) * (RUNWAY3_LEN / 12);
        return [-RUNWAY3_WIDTH / 2 - 0.2, RUNWAY3_WIDTH / 2 + 0.2].map((xOff, j) => (
          <mesh key={`r3el-${i}-${j}`} position={[RUNWAY3_X + xOff, 0.1, z]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
        ));
      })}

      {/* Taxiway connecting all 3 runways — green-edged path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-25, 0.025, 66]}>
        <planeGeometry args={[2, 24]} />
        <meshStandardMaterial color="#27272a" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-50, 0.025, 66]}>
        <planeGeometry args={[2, 24]} />
        <meshStandardMaterial color="#27272a" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-37.5, 0.025, 66]}>
        <planeGeometry args={[27, 2]} />
        <meshStandardMaterial color="#27272a" />
      </mesh>
    </group>
  );
}

// ═════════════════════ AIRPORT EXPANSION ═════════════════════════════
// Concourse wings, jet bridges, parked aircraft, landing plane, radar
// tower, helipad, fuel depot, cargo terminal, parking lot, big approach
// signage. Everything anchored to the SW airport corner. The terminal
// itself is at world (-75, 3, 67.5) with footprint x[-80,-70] z[64.5,70.5].
// ═════════════════════════════════════════════════════════════════════
function AirportExpansion() {
  const radarRef = useRef<THREE.Group>(null!);
  const heloBladeRef = useRef<THREE.Group>(null!);
  const heloTailRef = useRef<THREE.Group>(null!);
  const beaconMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const towerMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const landingPlaneRef = useRef<THREE.Group>(null!);
  const landingBeaconRef = useRef<THREE.Mesh>(null!);
  const windsockRef = useRef<THREE.Group>(null!);
  const fuelTruckRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const T = state.clock.elapsedTime;
    if (radarRef.current) radarRef.current.rotation.y = T * 0.8;
    if (heloBladeRef.current) heloBladeRef.current.rotation.y = T * 12;
    if (heloTailRef.current) heloTailRef.current.rotation.x = T * 18;
    if (beaconMatRef.current) beaconMatRef.current.emissiveIntensity = 1.0 + Math.sin(T * 3) * 0.9;
    if (towerMatRef.current) towerMatRef.current.emissiveIntensity = 0.8 + (Math.sin(T * 2) > 0 ? 1.2 : 0);
    if (windsockRef.current) windsockRef.current.rotation.y = Math.sin(T * 0.3) * 0.6;
    // Landing plane on runway 2 — cycles approach → flare → touchdown → roll-out → reset
    if (landingPlaneRef.current) {
      const CYC = 26;
      const t = (T % CYC) / CYC;
      let x: number;
      let y: number;
      let pitch: number;
      if (t < 0.45) {
        // Long descending approach from west of map → east threshold of R2
        const u = t / 0.45;
        x = -120 + u * (RUNWAY2_X_MIN - 8 - (-120)); // -120 → ~-83
        y = 28 - u * 26; // 28 → 2
        pitch = -0.12;
      } else if (t < 0.55) {
        // Flare — pitch up just before touchdown
        const u = (t - 0.45) / 0.10;
        x = (RUNWAY2_X_MIN - 8) + u * 6; // -83 → -77
        y = 2 - u * 1.25; // 2 → 0.75
        pitch = -0.12 + u * 0.18; // -0.12 → 0.06
      } else if (t < 0.85) {
        // Roll-out east along runway 2 decelerating
        const u = (t - 0.55) / 0.30;
        const ease = 1 - (1 - u) * (1 - u);
        x = -77 + ease * (RUNWAY2_X_MAX - 4 - (-77)); // -77 → ~-19
        y = 0.75;
        pitch = 0.06 - u * 0.06;
      } else {
        // Taxi off / reset — park off-frame
        x = 140;
        y = 30;
        pitch = 0;
      }
      landingPlaneRef.current.position.set(x, y, RUNWAY2_Z);
      landingPlaneRef.current.rotation.z = -Math.PI / 2 + pitch;
    }
    if (landingBeaconRef.current) {
      const mat = landingBeaconRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.5 + Math.sin(T * 5) * 1.3;
    }
    // Fuel truck drives slowly along the apron between hangars
    if (fuelTruckRef.current) {
      const u = (Math.sin(T * 0.25) + 1) / 2; // 0..1
      fuelTruckRef.current.position.x = -58 + u * 22;
      fuelTruckRef.current.rotation.y = Math.cos(T * 0.25) > 0 ? 0 : Math.PI;
    }
  });

  return (
    <group>
      {/* ────────── EXTENDED TERMINAL CONCOURSE — east of main terminal ────────── */}
      <group position={[-58, 0, 67.5]}>
        {/* Long glass concourse */}
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[14, 4, 5]} />
          <meshStandardMaterial color="#0c4a6e" emissive="#38bdf8" emissiveIntensity={0.45} metalness={0.6} roughness={0.3} transparent opacity={0.92} />
        </mesh>
        {/* Roof trim */}
        <mesh position={[0, 4.15, 0]}>
          <boxGeometry args={[14.4, 0.3, 5.4]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Window mullions every 2u */}
        {[-6, -4, -2, 0, 2, 4, 6].map((mx) => (
          <mesh key={`mul-${mx}`} position={[mx, 2, 2.51]}>
            <boxGeometry args={[0.15, 4, 0.04]} />
            <meshStandardMaterial color="#0b1220" />
          </mesh>
        ))}
        {/* Concourse sign */}
        <Text
          position={[0, 5.0, 2.6]}
          fontSize={0.5}
          color="#fde047"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.035}
          outlineColor="#0b1220"
        >
          ✈ CONCOURSE B · GATES 7–14
        </Text>
      </group>

      {/* ────────── JET BRIDGES + GATE-SIDE PARKED PLANES ────────── */}
      {[-64, -58, -52].map((gx, i) => (
        <group key={`gate-${i}`} position={[gx, 0, 60.5]}>
          {/* Jet bridge — angled tube from concourse to plane */}
          <mesh position={[0, 1.6, 1.5]} rotation={[0, 0, 0]}>
            <boxGeometry args={[2.5, 0.7, 3.0]} />
            <meshStandardMaterial color="#cbd5e1" emissive="#38bdf8" emissiveIntensity={0.25} metalness={0.5} />
          </mesh>
          <mesh position={[0, 1.6, 1.5]}>
            <boxGeometry args={[2.4, 0.5, 2.9]} />
            <meshStandardMaterial color="#0c4a6e" emissive="#38bdf8" emissiveIntensity={0.6} transparent opacity={0.8} />
          </mesh>
          {/* Bridge support legs */}
          {[[-1, 3], [1, 3], [-1, 0], [1, 0]].map(([lx, lz], j) => (
            <mesh key={`bl-${j}`} position={[lx, 0.8, lz]}>
              <cylinderGeometry args={[0.1, 0.12, 1.6, 6]} />
              <meshStandardMaterial color="#475569" metalness={0.6} />
            </mesh>
          ))}
          {/* Gate number */}
          <Text
            position={[0, 3.0, 3.2]}
            fontSize={0.3}
            color="#fde047"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.022}
            outlineColor="#0b1220"
          >
            GATE {7 + i * 2}
          </Text>
          {/* Parked plane (nose facing -x for pushback) */}
          <group position={[0, 0.75, -2.0]} rotation={[0, 0, -Math.PI / 2]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.45, 3.2, 8, 16]} />
              <meshStandardMaterial color={i === 0 ? "#fef3c7" : i === 1 ? "#e2e8f0" : "#fecaca"} metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh position={[0, 1.55, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.4, 0.3, 0.5, 16]} />
              <meshStandardMaterial color="#0c4a6e" emissive="#38bdf8" emissiveIntensity={0.7} />
            </mesh>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[1.1, 0.14, 4.4]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.55} />
            </mesh>
            <mesh position={[0, -1.5, 0.45]} castShadow>
              <boxGeometry args={[0.08, 0.7, 0.7]} />
              <meshStandardMaterial color={i === 0 ? "#b45309" : i === 1 ? "#0c4a6e" : "#7f1d1d"} />
            </mesh>
            <mesh position={[0, -1.55, 0.1]} castShadow>
              <boxGeometry args={[0.08, 0.5, 1.4]} />
              <meshStandardMaterial color="#cbd5e1" />
            </mesh>
            {[-1.6, 1.6].map((zOff) => (
              <mesh key={`pe-${zOff}`} position={[0, 0.1, zOff]} castShadow>
                <cylinderGeometry args={[0.18, 0.16, 0.7, 12]} />
                <meshStandardMaterial color="#1f2937" metalness={0.9} />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* ────────── BIG TERMINAL APRON — connecting concourse to runways ────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-58, 0.02, 62]} receiveShadow>
        <planeGeometry args={[28, 6]} />
        <meshStandardMaterial color="#27272a" roughness={0.85} />
      </mesh>
      {/* Apron taxi lines */}
      {[-66, -60, -54].map((tx, i) => (
        <mesh key={`atl-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[tx, 0.03, 62]}>
          <planeGeometry args={[0.2, 5]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.7} toneMapped={false} />
        </mesh>
      ))}

      {/* ────────── NEW ATC CONTROL TOWER — taller, with rotating radar ────────── */}
      <group position={[-30, 0, 62]}>
        {/* Base building */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[4, 3, 4]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        {/* Tower shaft */}
        <mesh position={[0, 7, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.7, 9, 14]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.35} />
        </mesh>
        {/* Glass control room — bigger, octagonal feel */}
        <mesh position={[0, 12, 0]} castShadow>
          <cylinderGeometry args={[1.6, 1.3, 1.6, 8]} />
          <meshStandardMaterial color="#0c4a6e" emissive="#38bdf8" emissiveIntensity={0.85} metalness={0.7} roughness={0.2} transparent opacity={0.85} />
        </mesh>
        {/* Tower-top crown ring with lights */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <mesh key={`tcl-${i}`} position={[Math.cos((i * Math.PI) / 4) * 1.55, 12.9, Math.sin((i * Math.PI) / 4) * 1.55]}>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
        ))}
        {/* Antenna spire */}
        <mesh position={[0, 14.4, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 3.2, 6]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        {/* Spire beacon (pulsing) */}
        <mesh position={[0, 16.3, 0]}>
          <sphereGeometry args={[0.22, 10, 10]} />
          <meshStandardMaterial ref={beaconMatRef} color="#ef4444" emissive="#ef4444" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        {/* Big rotating radar dish on top */}
        <group ref={radarRef} position={[0, 13.5, 0]}>
          <mesh position={[1.4, 0, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[2.8, 0.08, 0.5]} />
            <meshStandardMaterial color="#f8fafc" emissive="#22d3ee" emissiveIntensity={0.5} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[1.4, 0.05, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        </group>
        {/* Tower sign */}
        <mesh position={[0, 3.3, 2.05]}>
          <boxGeometry args={[3, 0.4, 0.05]} />
          <meshStandardMaterial color="#0b1220" />
        </mesh>
        <Text position={[0, 3.3, 2.09]} fontSize={0.28} color="#fde047" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#0b1220">
          ATC TOWER · KBOT
        </Text>
      </group>

      {/* ────────── HELIPAD with rotating helicopter ────────── */}
      {/* Moved to (-50, 70) — south of R1 (z=55) in the band freed up by
          BotGolf's relocation to NW. Gives the helipad real space for
          approach/departure clear of the runway pattern. R3 east edge is
          x=-22.5 → 27.5u east; R1 south edge z=57.5 → 12.5u north. */}
      <group position={[-50, 0, 70]}>
        {/* Pad */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
          <circleGeometry args={[3, 32]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[2.6, 2.85, 32]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.6} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <Text
          position={[0, 0.06, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={2.2}
          color="#fde047"
          anchorX="center"
          anchorY="middle"
        >
          H
        </Text>
        {/* Helicopter */}
        <group position={[0, 0, 0]}>
          {/* Body */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <sphereGeometry args={[0.7, 14, 10]} />
            <meshStandardMaterial color="#0c4a6e" emissive="#38bdf8" emissiveIntensity={0.2} metalness={0.5} />
          </mesh>
          {/* Tail boom */}
          <mesh position={[0, 1.05, -1.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.18, 1.6, 8]} />
            <meshStandardMaterial color="#0c4a6e" />
          </mesh>
          {/* Tail rotor (rotating around X) */}
          <group ref={heloTailRef} position={[0.18, 1.05, -2.15]}>
            <mesh>
              <boxGeometry args={[0.04, 0.7, 0.04]} />
              <meshStandardMaterial color="#0b1220" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.04, 0.7, 0.04]} />
              <meshStandardMaterial color="#0b1220" />
            </mesh>
          </group>
          {/* Tail vertical fin */}
          <mesh position={[0, 1.3, -2.0]}>
            <boxGeometry args={[0.05, 0.45, 0.3]} />
            <meshStandardMaterial color="#0c4a6e" />
          </mesh>
          {/* Cockpit window */}
          <mesh position={[0, 0.95, 0.5]}>
            <sphereGeometry args={[0.45, 12, 10, 0, Math.PI, 0, Math.PI]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.65} transparent opacity={0.8} />
          </mesh>
          {/* Landing skids */}
          {[-0.45, 0.45].map((sx, i) => (
            <mesh key={`sk-${i}`} position={[sx, 0.2, 0]}>
              <boxGeometry args={[0.06, 0.06, 1.4]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
          ))}
          {/* Main rotor mast */}
          <mesh position={[0, 1.55, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.3, 6]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          {/* Main rotor blades (rotating) */}
          <group ref={heloBladeRef} position={[0, 1.75, 0]}>
            <mesh>
              <boxGeometry args={[3.4, 0.05, 0.18]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[3.4, 0.05, 0.18]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
          </group>
          {/* Belly beacon */}
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial ref={towerMatRef} color="#ef4444" emissive="#ef4444" emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* ────────── FUEL DEPOT ────────── */}
      {/* Held at (-15, 20) — north of R2 (z=27 south edge). Berm ring
          (center local z=1.25, radius 4.1) → world z[16.15, 25.35],
          giving 1.65u clearance to R2. (Tried moving south to (-15, 75)
          but the berm clipped BotZoo's lawn at z=78+.) */}
      <group position={[-15, 0, 20]}>
        {[[-2, 0], [0, 0], [2, 0], [-1, 2.5], [1, 2.5]].map(([fx, fz], i) => (
          <group key={`ft-${i}`} position={[fx, 0, fz]}>
            <mesh position={[0, 1, 0]} castShadow>
              <cylinderGeometry args={[0.8, 0.8, 2.0, 16]} />
              <meshStandardMaterial color="#e5e7eb" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 2.05, 0]}>
              <sphereGeometry args={[0.8, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#e5e7eb" metalness={0.7} />
            </mesh>
            {/* Stripe */}
            <mesh position={[0, 1.4, 0]}>
              <cylinderGeometry args={[0.82, 0.82, 0.18, 16]} />
              <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.5} />
            </mesh>
            <Text position={[0, 1.4, 0.83]} fontSize={0.18} color="#fff" anchorX="center" anchorY="middle">
              JET-A
            </Text>
          </group>
        ))}
        {/* Containment berm */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 1.25]}>
          <ringGeometry args={[3.8, 4.1, 32]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.4} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <Text position={[0, 0.5, -3.2]} fontSize={0.3} color="#ef4444" anchorX="center" anchorY="middle" outlineWidth={0.022} outlineColor="#fef9c3">
          ⚠ FUEL DEPOT — NO SMOKING
        </Text>
      </group>

      {/* Fuel truck driving on apron */}
      <group ref={fuelTruckRef} position={[-50, 0, 64]}>
        {/* Cab */}
        <mesh position={[-0.9, 0.55, 0]} castShadow>
          <boxGeometry args={[0.9, 0.9, 0.8]} />
          <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.3} />
        </mesh>
        {/* Cab window */}
        <mesh position={[-0.9, 0.85, 0]}>
          <boxGeometry args={[0.92, 0.4, 0.5]} />
          <meshStandardMaterial color="#0c4a6e" emissive="#38bdf8" emissiveIntensity={0.6} />
        </mesh>
        {/* Tank */}
        <mesh position={[0.4, 0.65, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 1.8, 16]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.7} />
        </mesh>
        <Text position={[0.4, 0.65, 0.51]} fontSize={0.18} color="#0b1220" anchorX="center" anchorY="middle">
          JET-A
        </Text>
        {/* Wheels */}
        {[[-1.1, 0.5], [-1.1, -0.5], [0.0, 0.5], [0.0, -0.5], [0.9, 0.5], [0.9, -0.5]].map(([wx, wz], i) => (
          <mesh key={`fw-${i}`} position={[wx, 0.18, wz]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 10]} />
            <meshStandardMaterial color="#0b1220" />
          </mesh>
        ))}
      </group>

      {/* ────────── CARGO TERMINAL ────────── */}
      <group position={[-65, 0, 33]}>
        {/* Main warehouse */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <boxGeometry args={[10, 4.4, 7]} />
          <meshStandardMaterial color="#a16207" roughness={0.7} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 4.55, 0]}>
          <boxGeometry args={[10.4, 0.3, 7.4]} />
          <meshStandardMaterial color="#0b1220" />
        </mesh>
        {/* Loading doors (3 garage doors on south face) */}
        {[-3, 0, 3].map((dx, i) => (
          <mesh key={`cd-${i}`} position={[dx, 1.5, 3.51]}>
            <boxGeometry args={[2.2, 2.8, 0.05]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.4} />
          </mesh>
        ))}
        {/* Cargo containers stacked outside */}
        {[
          { p: [5.5, 0.75, -2], c: "#dc2626" },
          { p: [5.5, 0.75, 0], c: "#0c4a6e" },
          { p: [5.5, 0.75, 2], c: "#15803d" },
          { p: [5.5, 2.3, -1], c: "#f59e0b" },
          { p: [5.5, 2.3, 1], c: "#7c3aed" },
        ].map((c, i) => (
          <mesh key={`cc-${i}`} position={c.p as [number, number, number]} castShadow>
            <boxGeometry args={[1.6, 1.5, 1.8]} />
            <meshStandardMaterial color={c.c} emissive={c.c} emissiveIntensity={0.2} />
          </mesh>
        ))}
        {/* Sign */}
        <Text
          position={[0, 5.0, 3.6]}
          fontSize={0.5}
          color="#fde047"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.035}
          outlineColor="#0b1220"
        >
          📦 CARGO TERMINAL
        </Text>
      </group>

      {/* ────────── LANDING PLANE (on runway 2) ────────── */}
      <group ref={landingPlaneRef}>
        <mesh castShadow>
          <capsuleGeometry args={[0.5, 3.6, 8, 16]} />
          <meshStandardMaterial color="#0c4a6e" emissive="#38bdf8" emissiveIntensity={0.2} metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.7, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.45, 0.32, 0.55, 16]} />
          <meshStandardMaterial color="#0b1220" emissive="#38bdf8" emissiveIntensity={1.1} />
        </mesh>
        {/* Bigger wings */}
        <mesh castShadow>
          <boxGeometry args={[1.3, 0.16, 5.2]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.55} />
        </mesh>
        {/* Tail */}
        <mesh position={[0, -1.7, 0.55]} castShadow>
          <boxGeometry args={[0.1, 0.85, 0.85]} />
          <meshStandardMaterial color="#0c4a6e" />
        </mesh>
        <mesh position={[0, -1.75, 0.1]} castShadow>
          <boxGeometry args={[0.1, 0.55, 1.8]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        {/* 4 engines (twinjet on each side, mainline jet feel) */}
        {[-2.0, -1.0, 1.0, 2.0].map((zOff) => (
          <mesh key={`lpe-${zOff}`} position={[0, 0.1, zOff]} castShadow>
            <cylinderGeometry args={[0.2, 0.18, 0.8, 12]} />
            <meshStandardMaterial color="#1f2937" metalness={0.9} />
          </mesh>
        ))}
        {/* Landing strobe (blink) */}
        <mesh ref={landingBeaconRef} position={[0, -1.6, 1.0]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>

      {/* ────────── WIND SOCK ────────── */}
      <group ref={windsockRef} position={[-30, 0, 50]}>
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.05, 0.07, 3, 6]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 3.0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
        <mesh position={[0.8, 3.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.35, 1.4, 12, 1, true]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ────────── PARKING LOT ────────── */}
      {/* Moved to (-50, 88) — south of R3 (z_max=80) in the BotGolf-vacated
          band. Lot is 14×6 (x[-57,-43], z[85,91]); 5u clear of R3 in z,
          20u east of botplane kiosk at x=-75, far west of BotZoo (x=-22.5). */}
      <group position={[-50, 0, 88]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
          <planeGeometry args={[14, 6]} />
          <meshStandardMaterial color="#374151" roughness={0.9} />
        </mesh>
        {/* Parking line stripes */}
        {[-6, -4, -2, 0, 2, 4, 6].map((sx) => (
          <mesh key={`pls-${sx}`} rotation={[-Math.PI / 2, 0, 0]} position={[sx, 0.03, 0]}>
            <planeGeometry args={[0.08, 5.5]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.4} toneMapped={false} />
          </mesh>
        ))}
        {/* Parked cars (6) — alternating colors */}
        {[
          { p: [-5, -1], c: "#dc2626" },
          { p: [-3, -1], c: "#1e3a8a" },
          { p: [-1, -1], c: "#16a34a" },
          { p: [1, -1], c: "#f59e0b" },
          { p: [3, -1], c: "#0b1220" },
          { p: [5, -1], c: "#e2e8f0" },
        ].map((c, i) => (
          <group key={`pc-${i}`} position={[c.p[0], 0, c.p[1]]}>
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[1.0, 0.55, 1.8]} />
              <meshStandardMaterial color={c.c} metalness={0.4} />
            </mesh>
            <mesh position={[0, 0.78, 0]} castShadow>
              <boxGeometry args={[0.9, 0.35, 1.0]} />
              <meshStandardMaterial color={c.c} metalness={0.4} />
            </mesh>
            <mesh position={[0, 0.78, 0]}>
              <boxGeometry args={[0.92, 0.32, 0.96]} />
              <meshStandardMaterial color="#0c4a6e" emissive="#38bdf8" emissiveIntensity={0.3} transparent opacity={0.85} />
            </mesh>
          </group>
        ))}
        {/* Lot sign */}
        <Text position={[0, 1.0, 3.5]} fontSize={0.32} color="#38bdf8" anchorX="center" anchorY="middle" outlineWidth={0.022} outlineColor="#0b1220">
          🅿 SHORT-TERM PARKING
        </Text>
      </group>

      {/* ────────── BIG ARRIVALS/DEPARTURES SIGN — east approach ────────── */}
      <group position={[-15, 0, 67.5]}>
        <mesh position={[0, 3.5, 0]}>
          <boxGeometry args={[6, 2.5, 0.2]} />
          <meshStandardMaterial color="#0b1220" />
        </mesh>
        <mesh position={[0, 3.5, 0.11]}>
          <boxGeometry args={[5.7, 2.2, 0.04]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.9} toneMapped={false} />
        </mesh>
        <Text position={[0, 4.2, 0.14]} fontSize={0.42} color="#0b1220" anchorX="center" anchorY="middle" outlineWidth={0.025} outlineColor="#22d3ee">
          ✈ BOTPLANE INTL
        </Text>
        <Text position={[0, 3.5, 0.14]} fontSize={0.26} color="#0b1220" anchorX="center" anchorY="middle">
          ARRIVALS ▲ · DEPARTURES ▼
        </Text>
        <Text position={[0, 2.95, 0.14]} fontSize={0.22} color="#0b1220" anchorX="center" anchorY="middle">
          3 RUNWAYS · 14 GATES
        </Text>
        {/* Support posts */}
        {[-2.7, 2.7].map((px, i) => (
          <mesh key={`sps-${i}`} position={[px, 1.25, 0]}>
            <boxGeometry args={[0.2, 2.5, 0.2]} />
            <meshStandardMaterial color="#475569" metalness={0.6} />
          </mesh>
        ))}
      </group>

      {/* ────────── BAGGAGE CART TRAIN — tractor + 3 wagons ──────────
            Parked east of the ATC tower (-30, 62, base x[-32,-28] z[60,64])
            on the south side of the airfield road, at world (-25, 0, 66).
            Train span world x[-25.5, -20.5], z[65.7, 66.3]:
              • 5u east of fuel-truck patrol band (truck reaches at most
                x≈-36 at z=64; train sits at z=66 anyway → no overlap).
              • 2u south of ATC base (z=64); 3u east of ATC east face.
              • 2.5u west of departures sign (-15, 67.5), 6×2.5 footprint.
              • south of concourse-B box (z=65..70 only between x=-65..-51). */}
      <group position={[-25, 0, 66]}>
        {/* Tractor cab */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[1.0, 0.6, 0.7]} />
            <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.4} metalness={0.5} />
          </mesh>
          <mesh position={[0.1, 0.8, 0]}>
            <boxGeometry args={[0.5, 0.35, 0.62]} />
            <meshStandardMaterial color="#22d3ee" transparent opacity={0.65} emissive="#22d3ee" emissiveIntensity={0.5} />
          </mesh>
          {/* Wheels */}
          {[[-0.35, 0.35], [-0.35, -0.35], [0.35, 0.35], [0.35, -0.35]].map(([wx, wz], i) => (
            <mesh key={`bt-w-${i}`} position={[wx, 0.15, wz]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.1, 8]} />
              <meshStandardMaterial color="#0b1220" />
            </mesh>
          ))}
        </group>
        {/* 3 baggage wagons trailing east */}
        {[1.4, 2.7, 4.0].map((bx, i) => (
          <group key={`bag-wagon-${i}`} position={[bx, 0, 0]}>
            {/* Flatbed */}
            <mesh position={[0, 0.22, 0]} castShadow>
              <boxGeometry args={[1.0, 0.1, 0.65]} />
              <meshStandardMaterial color="#475569" metalness={0.6} />
            </mesh>
            {/* Side rails */}
            {[-0.3, 0.3].map((rz, j) => (
              <mesh key={`bw-rail-${i}-${j}`} position={[0, 0.45, rz]}>
                <boxGeometry args={[0.95, 0.35, 0.04]} />
                <meshStandardMaterial color="#334155" />
              </mesh>
            ))}
            {/* Suitcases piled inside */}
            {[
              { p: [-0.3, 0.5, -0.05], c: "#7c2d12" },
              { p: [0.0, 0.5, 0.1], c: "#0c4a6e" },
              { p: [0.3, 0.5, -0.08], c: "#7f1d1d" },
              { p: [-0.1, 0.75, 0.0], c: "#15803d" },
            ].map((sc, j) => (
              <mesh key={`bw-sc-${i}-${j}`} position={sc.p as [number, number, number]} castShadow>
                <boxGeometry args={[0.32, 0.22, 0.18]} />
                <meshStandardMaterial color={sc.c} roughness={0.7} />
              </mesh>
            ))}
            {/* Wheels */}
            {[[-0.35, 0.3], [-0.35, -0.3], [0.35, 0.3], [0.35, -0.3]].map(([wx, wz], j) => (
              <mesh key={`bw-w-${i}-${j}`} position={[wx, 0.1, wz]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.07, 6]} />
                <meshStandardMaterial color="#0b1220" />
              </mesh>
            ))}
            {/* Coupling bar */}
            <mesh position={[-0.55, 0.22, 0]}>
              <boxGeometry args={[0.2, 0.04, 0.04]} />
              <meshStandardMaterial color="#1c1917" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ────────── APPROACH LIGHTS — runway 2 west threshold ──────────
            Standard ALSF-style row of light bars extending west from R2
            threshold (x=-70). Lamps at x=-79, -82, -85, -88, -91, -94 at
            z=RUNWAY2_Z=30. Landing plane animation:
              • approach (y: 28→2 over x: -120→-78)
              • flare    (y:  2→0.75 over x: -78→-72)
              • rollout  (y=0.75 from x=-77 east)
            Plane wing box [1.3,0.16,5.2] under rotation.z=-π/2 has
            world-Y half-extent ≈0.65, so its bottom reaches y≈0.10
            during rollout. Lamps are kept STRICTLY WEST of x=-78 so the
            plane is in approach (y ≥ ~2.05 at x=-79) or beyond reach
            (rollout begins at x=-77, never crosses west). At westmost
            possible interaction x=-79: u=(-79+120)/42=0.976, y=28-0.976*26≈2.62,
            wing bottom ≈1.97 — well above lamp top y=0.27. No threshold
            bar at x=-71 (would clip rollout). Clear of fuel depot
            (berm z≤25.35). Westernmost lamp at local x=-82 → world x=-97
            after district shift (1u inside ±98 ground edge). Trimmed
            from 6 lights to 2: lamps at local -85/-88/-91/-94 would have
            mapped to world -100..-109, past the ground plane. */}
      {[-79, -82].map((ax, i) => (
        <group key={`appr-${i}`} position={[ax, 0, RUNWAY2_Z]}>
          {/* Light bar — 5 lamps in a row across the centerline */}
          {[-0.8, -0.4, 0, 0.4, 0.8].map((zOff, j) => (
            <mesh key={`appr-l-${i}-${j}`} position={[0, 0.18, zOff]}>
              <boxGeometry args={[0.18, 0.18, 0.18]} />
              <meshStandardMaterial
                color="#fef9c3"
                emissive="#fde047"
                emissiveIntensity={1.6}
                toneMapped={false}
              />
            </mesh>
          ))}
          {/* Stanchion bar holding the lights */}
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[0.08, 0.12, 1.9]} />
            <meshStandardMaterial color="#1c1917" />
          </mesh>
        </group>
      ))}
      {/* (No threshold bar at x=-71: that strip would sit directly under
          the landing plane's rolled-out belly at y=0.75 and clip its wing
          box, whose world-Y bottom is ~0.10 after the z=-π/2 rotation.) */}

      {/* ────────── HANGARS row — new airline-branded hangars west ────────── */}
      {/* North hangar moved from (-78, 14) to (-75, 19) — clears BotGigs at
          (-82.5, 9). South hangar at (-78, 32) is clear of all neighbors. */}
      {[
        { x: -75, z: 19, color: "#dc2626", label: "BOTAIR" },
        { x: -78, z: 32, color: "#16a34a", label: "GREEN WINGS" },
      ].map((h, i) => (
        <group key={`nh-${i}`} position={[h.x, 0, h.z]}>
          <mesh position={[0, 1.8, 0]} castShadow>
            <boxGeometry args={[6, 3.6, 5]} />
            <meshStandardMaterial color="#475569" metalness={0.5} />
          </mesh>
          <mesh position={[0, 3.8, 0]} castShadow>
            <cylinderGeometry args={[3.0, 3.0, 5, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#64748b" metalness={0.6} />
          </mesh>
          <mesh position={[0, 1.7, 2.51]}>
            <planeGeometry args={[5.4, 3.2]} />
            <meshStandardMaterial color={h.color} emissive={h.color} emissiveIntensity={0.45} />
          </mesh>
          <Text position={[0, 1.7, 2.54]} fontSize={0.5} color="#fde047" anchorX="center" anchorY="middle" outlineWidth={0.035} outlineColor="#0b1220">
            {h.label}
          </Text>
        </group>
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

      {/* ─── Airport district (pushed FURTHER OUT to the far SW corner,
         and expanded 2.25× by area) ───
         Whole district shifted by (-30, 0, -12) AND uniformly scaled 1.5×
         around the local origin. The detailed terminal now spans world
         x=-105±, z=55.5±, runways and parking lot all 1.5× longer/wider.
         World envelope after transform: x[-147, -63.75] × z[16.5, 117].
         Clearances:
           • Outer ring road x=-150 inner edge -148.7 → 1.7u gap to airport
             west edge -147 (airport sits between the two ring roads).
           • Inner ring road z=120 north edge 118.7 → 1.7u gap to airport
             south edge 117 (parking lot world z[108,117]).
           • Life Events quarter (-103,135), nearest lot north edge z=123
             → 6u gap to airport south edge.
           • Airport east edge -63.75 sits 8u west of the inner ring road
             at x=-54 (band west edge -55.1) — no road crossing on the
             east side now.
         Inner constants (RUNWAY_Z, RUNWAY2_X_MIN/MAX, RUNWAY3_X, etc.)
         remain local. Animation refs (TakeoffPlane, landing plane, fuel
         truck) write to refs inside this group so their coords are
         already local — under scale 1.5 their travel range expands
         proportionally with the runway, which is correct. */}
      <group position={[-30, 0, -12]} scale={1.5}>
        <Runway />
        <Airplane position={[-50, 0.75, 49]} />
        <TakeoffPlane />
        <ControlTower />
        <AirportExpansion />
      </group>
    </group>
  );
}
