import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// ════════════════════════════════════════════════════════════════════
// DistrictGateways — themed arches at the inner-facing approach of each
// of the 6 outer-ring quarters defined in cityConstants.QUARTERS.
//
// Each arch is positioned so the player walks THROUGH it when traveling
// from city center outward into the district. The banner faces the city
// center; columns are perpendicular to the player's approach vector.
//
// rotY convention:
//   • Local +x is the column-line direction (cols at (±4, 0, 0)).
//     After R_y(rotY), columns end up at world (4cos rotY, 0, -4sin rotY).
//   • Local +z is the banner front face. After R_y(rotY) it points
//     world (sin rotY, 0, cos rotY).
//   • So banner faces a chosen world direction D=(dx,dz):
//       rotY=0   → +z (south)
//       rotY=π/2 → +x (east)
//       rotY=π   → -z (north)
//       rotY=-π/2→ -x (west)
//       rotY=±π/4, ±3π/4 → 4 diagonals
//
// Coordinates verified against BUILDING_DEFS / QUARTERS:
//   foundations  — interior quarter, arch on its east edge (cluster at
//                  x=-13 z=-91, east lot at x=-5, arch at x=2 is 3u
//                  east of lot edge; rotY=-π/2 faces east into city).
//   borrowing    — NE corner cluster (103,-103); arch at (92,-92) sits
//                  on the SW approach; cols at (94.83,-89.17)+(89.17,-94.83),
//                  both outside the inner-kiosk |x|,|z|≤92 band.
//   investing    — SE corner cluster (103,103); arch at (92,92), cols
//                  mirror borrowing's.
//   lifeevents   — SW outer cluster (-103,135); arch at (-95,125) is
//                  11u south of BotPlane airport edge (z=114).
//   consumer     — north strip kiosks at z=-103; arch at (0,0,-95) on
//                  the main avenue (cols at x=±4, clear of strip kiosks
//                  at x∈{-95,-40,-13,40,95}).
//   macro        — south strip kiosks at z=103; arch at (0,0,95) mirrors
//                  consumer with rotY=π so the banner faces north.
// ════════════════════════════════════════════════════════════════════

interface GatewayDef {
  id: string;
  pos: [number, number, number];
  rotY: number;
  label: string;
  emoji: string;
  color: string;
}

const GATEWAYS: GatewayDef[] = [
  // Foundations sits at x=8 (not x=2) to keep visual breathing room from the
  // consumer arch at (0,-95). rotY=+π/2 (not -π/2) so the banner faces world
  // +x = east, i.e. toward the city center the player is walking AWAY from.
  { id: "foundations", pos: [8,   0, -91], rotY:  Math.PI / 2,       label: "Foundations",           emoji: "🧠", color: "#22d3ee" },
  { id: "borrowing",   pos: [92,  0, -92], rotY: -Math.PI / 4,       label: "Borrowing & Credit",    emoji: "💳", color: "#f472b6" },
  { id: "investing",   pos: [92,  0,  92], rotY: -(3 * Math.PI) / 4, label: "Investing",             emoji: "📈", color: "#fbbf24" },
  { id: "lifeevents",  pos: [-95, 0, 125], rotY:  (3 * Math.PI) / 4, label: "Life Events",           emoji: "💍", color: "#a78bfa" },
  { id: "consumer",    pos: [0,   0, -95], rotY:  0,                 label: "Consumer & Behavioral", emoji: "🛒", color: "#34d399" },
  { id: "macro",       pos: [0,   0,  95], rotY:  Math.PI,           label: "Macro & Money",         emoji: "🌐", color: "#fb923c" },
];

function Pillar({ x, color }: { x: number; color: string }) {
  return (
    <group position={[x, 0, 0]}>
      {/* Stone base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.5, 1.4]} />
        <meshStandardMaterial color="#475569" roughness={0.85} />
      </mesh>
      {/* Pillar shaft */}
      <mesh position={[0, 3.25, 0]} castShadow>
        <boxGeometry args={[0.8, 6.0, 0.8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.55} metalness={0.15} />
      </mesh>
      {/* Quarter-color accent band at mid-height */}
      <mesh position={[0, 3.25, 0]}>
        <boxGeometry args={[0.92, 0.22, 0.92]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
          toneMapped={false}
        />
      </mesh>
      {/* Capital */}
      <mesh position={[0, 6.45, 0]} castShadow>
        <boxGeometry args={[1.1, 0.4, 1.1]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </mesh>
    </group>
  );
}

function GatewayArch({ pos, rotY, label, emoji, color }: Omit<GatewayDef, "id">) {
  const orbRef = useRef<THREE.MeshStandardMaterial>(null!);
  const bannerRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (orbRef.current) {
      orbRef.current.emissiveIntensity = 1.6 + Math.sin(t * 1.6) * 0.6;
    }
    if (bannerRef.current) {
      // Gentle banner flutter (rotate about local x = pitch).
      bannerRef.current.rotation.x = Math.sin(t * 1.1) * 0.045;
    }
  });

  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <Pillar x={-4} color={color} />
      <Pillar x={4} color={color} />

      {/* Crossbeam */}
      <mesh position={[0, 6.75, 0]} castShadow>
        <boxGeometry args={[9.0, 0.3, 0.8]} />
        <meshStandardMaterial color="#78350f" roughness={0.85} />
      </mesh>

      {/* Hanging banner — gently waves */}
      <group ref={bannerRef} position={[0, 5.4, 0]}>
        <mesh castShadow>
          <planeGeometry args={[8.4, 1.7]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.45}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        {/* Gold trim — top */}
        <mesh position={[0, 0.78, 0.02]}>
          <planeGeometry args={[8.4, 0.12]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={0.9}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        {/* Gold trim — bottom */}
        <mesh position={[0, -0.78, 0.02]}>
          <planeGeometry args={[8.4, 0.12]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={0.9}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>

        {/* Front-side text (faces local +z, banner front toward city center) */}
        <Text
          position={[0, 0.2, 0.03]}
          fontSize={0.6}
          color="#0b1220"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor={color}
          maxWidth={8}
        >
          {emoji}  {label.toUpperCase()}
        </Text>
        <Text
          position={[0, -0.42, 0.03]}
          fontSize={0.22}
          color="#0b1220"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor={color}
        >
          ★  DISTRICT GATEWAY  ★
        </Text>

        {/* Back-side text (mirrored so the banner reads from both sides) */}
        <Text
          position={[0, 0.2, -0.03]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.6}
          color="#0b1220"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor={color}
          maxWidth={8}
        >
          {emoji}  {label.toUpperCase()}
        </Text>
        <Text
          position={[0, -0.42, -0.03]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.22}
          color="#0b1220"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor={color}
        >
          ★  DISTRICT GATEWAY  ★
        </Text>
      </group>

      {/* Pulsing finial orb on top of the crossbeam */}
      <mesh position={[0, 7.55, 0]} castShadow>
        <sphereGeometry args={[0.45, 16, 14]} />
        <meshStandardMaterial
          ref={orbRef}
          color={color}
          emissive={color}
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>

      {/* Threshold glow strip on the ground spanning the archway */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.4, 0.4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function DistrictGateways() {
  return (
    <group>
      {GATEWAYS.map((g) => (
        <GatewayArch
          key={g.id}
          pos={g.pos}
          rotY={g.rotY}
          label={g.label}
          emoji={g.emoji}
          color={g.color}
        />
      ))}
    </group>
  );
}
