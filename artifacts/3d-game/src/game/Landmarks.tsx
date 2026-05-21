import * as THREE from "three";

// =====================================================================
// LANDMARKS — Eiffel Tower and St. Louis Arch
// Standalone iconic structures placed in the outer corners of the map
// so they're visible from far away and don't crowd inner districts.
//   • Eiffel Tower @ (120, 0, -120) — far NE corner, beyond
//     RocketStation's NE envelope (world ~x[50,97], z[-97,-45]).
//   • St. Louis Arch @ (120, 0,  120) — far SE corner, beyond BotPort.
// Map ground plane is 340×340 (World.tsx), so x=±170, z=±170.
// =====================================================================

// Helper: a single strut between two points, rendered as a thin box.
// Used to build the Eiffel Tower's lattice legs at any angle.
function Strut({
  a,
  b,
  thickness = 0.3,
  color = "#a16207",
}: {
  a: [number, number, number];
  b: [number, number, number];
  thickness?: number;
  color?: string;
}) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const dz = b[2] - a[2];
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const cx = (a[0] + b[0]) / 2;
  const cy = (a[1] + b[1]) / 2;
  const cz = (a[2] + b[2]) / 2;
  const dir = new THREE.Vector3(dx, dy, dz).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir,
  );
  const euler = new THREE.Euler().setFromQuaternion(quat);
  return (
    <mesh position={[cx, cy, cz]} rotation={[euler.x, euler.y, euler.z]} castShadow>
      <boxGeometry args={[thickness, len, thickness]} />
      <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} />
    </mesh>
  );
}

// One Eiffel section: 4 angled corner legs (bottom square → top square)
// plus an X-brace on each of the 4 vertical faces for the lattice look.
function EiffelSection({
  y0,
  y1,
  w0,
  w1,
  color,
  thickness,
}: {
  y0: number;
  y1: number;
  w0: number;
  w1: number;
  color: string;
  thickness: number;
}) {
  const h0 = w0 / 2;
  const h1 = w1 / 2;
  // Corners: (+x,+z), (+x,-z), (-x,+z), (-x,-z)
  const corners: Array<[number, number]> = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  return (
    <group>
      {/* 4 corner legs */}
      {corners.map(([sx, sz], i) => (
        <Strut
          key={`leg-${i}`}
          a={[sx * h0, y0, sz * h0]}
          b={[sx * h1, y1, sz * h1]}
          thickness={thickness}
          color={color}
        />
      ))}
      {/* X-braces on each of the 4 vertical faces (front/back/left/right) */}
      {[
        // Each face: connect two adjacent corners with an X
        { a0: [1, 1], a1: [1, -1] }, // +x face
        { a0: [-1, 1], a1: [-1, -1] }, // -x face
        { a0: [1, 1], a1: [-1, 1] }, // +z face
        { a0: [1, -1], a1: [-1, -1] }, // -z face
      ].map((face, i) => {
        const [ax0, az0] = face.a0 as [number, number];
        const [ax1, az1] = face.a1 as [number, number];
        // Diagonal 1: bottom of corner A → top of corner B
        // Diagonal 2: bottom of corner B → top of corner A
        return (
          <group key={`brace-${i}`}>
            <Strut
              a={[ax0 * h0, y0, az0 * h0]}
              b={[ax1 * h1, y1, az1 * h1]}
              thickness={thickness * 0.55}
              color={color}
            />
            <Strut
              a={[ax1 * h0, y0, az1 * h0]}
              b={[ax0 * h1, y1, az0 * h1]}
              thickness={thickness * 0.55}
              color={color}
            />
          </group>
        );
      })}
    </group>
  );
}

export function EiffelTower({
  position,
}: {
  position: [number, number, number];
}) {
  // Three tapering sections + antenna. Total height ~22u.
  const color = "#92400e";
  const sections = [
    { y0: 0, y1: 7, w0: 8, w1: 5, t: 0.45 },
    { y0: 7, y1: 14, w0: 5, w1: 2.8, t: 0.32 },
    { y0: 14, y1: 20, w0: 2.8, w1: 1.2, t: 0.22 },
  ];
  return (
    <group position={position}>
      {/* Stone plinth base */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[10, 0.3, 10]} />
        <meshStandardMaterial color="#57534e" roughness={0.9} />
      </mesh>
      {sections.map((s) => (
        <EiffelSection key={s.y0} {...s} color={color} thickness={s.t} />
      ))}
      {/* Observation deck at top of section 2 */}
      <mesh position={[0, 14, 0]} castShadow>
        <boxGeometry args={[3.4, 0.25, 3.4]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Mid platform at top of section 1 */}
      <mesh position={[0, 7, 0]} castShadow>
        <boxGeometry args={[5.6, 0.2, 5.6]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 20.2, 0]} castShadow>
        <boxGeometry args={[1.4, 0.3, 1.4]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Antenna spire */}
      <mesh position={[0, 21.4, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.12, 2.4, 8]} />
        <meshStandardMaterial color="#525252" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Red beacon light at the very top */}
      <mesh position={[0, 22.7, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

export function StLouisArch({
  position,
}: {
  position: [number, number, number];
}) {
  // Half-torus arch standing in the XY plane (Y up), facing along Z.
  // Radius 11, tube 0.7. Feet land at (±11, 0, 0). Peak at (0, 11, 0).
  const radius = 11;
  const tube = 0.7;
  return (
    <group position={position}>
      {/* The arch itself — torus geometry, arc = PI gives a half-ring */}
      <mesh castShadow>
        <torusGeometry args={[radius, tube, 18, 48, Math.PI]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.85}
          roughness={0.18}
        />
      </mesh>
      {/* Concrete plinths at each foot */}
      <mesh position={[radius, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1, 2.4]} />
        <meshStandardMaterial color="#475569" roughness={0.85} />
      </mesh>
      <mesh position={[-radius, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1, 2.4]} />
        <meshStandardMaterial color="#475569" roughness={0.85} />
      </mesh>
      {/* Small grass apron under the arch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[radius * 2 + 4, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.95} />
      </mesh>
    </group>
  );
}

export default function Landmarks() {
  return (
    <group>
      <EiffelTower position={[120, 0, -120]} />
      <StLouisArch position={[120, 0, 120]} />
    </group>
  );
}
