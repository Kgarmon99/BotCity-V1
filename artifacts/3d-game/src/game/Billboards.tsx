import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { BUILDING_DEFS } from "./GameScene";

// ════════════════════════════════════════════════════════════════════
// Billboards — animated roadside cross-promo signs that cycle ads for
// every kiosk in BUILDING_DEFS. Four billboards sit just outside the
// inner ring road (±54) at the cardinal city entries, facing incoming
// traffic. Each cycles independently with a staggered start index +
// slightly different cycle period so the four signs never sync up.
//
// Per ad swap: panel emissive flashes brightly for ~0.45s, LED border
// pulses continuously. Text (emoji + label + tagline) re-renders only
// on swap (every ~5s), so cost is minimal vs. one useFrame per sign.
//
// Note: imports BUILDING_DEFS from GameScene. The reference is read
// inside useMemo (after module init), so the cycle is fine in ESM.
// ════════════════════════════════════════════════════════════════════

interface Ad {
  emoji: string;
  label: string;
  color: string;
}

// Accent palette fallback for kiosks in BUILDING_DEFS without an explicit
// `color` field (most of the original big-building entries).
const ACCENT_FALLBACK = [
  "#06b6d4", "#22c55e", "#f59e0b", "#ec4899",
  "#a855f7", "#3b82f6", "#ef4444", "#14b8a6",
];

const TAGLINES = [
  "★ NOW OPEN ★",
  "★ VISIT TODAY ★",
  "★ FEATURED ★",
  "★ BOT-APPROVED ★",
  "★ FAN FAVORITE ★",
  "★ TRY IT FREE ★",
  "★ HOT SPOT ★",
  "★ DON'T MISS OUT ★",
];

interface BillboardProps {
  pos: [number, number, number];
  rotY: number;
  startIndex?: number;
  cycleSeconds?: number;
}

function Billboard({ pos, rotY, startIndex = 0, cycleSeconds = 4.5 }: BillboardProps) {
  const ads = useMemo<Ad[]>(
    () =>
      BUILDING_DEFS.map((b, i) => ({
        emoji: b.emoji,
        label: b.label,
        // Inline-defined newer kiosks include a `color` field; older defs
        // don't, so fall back to a deterministic palette index.
        color: (b as { color?: string }).color ?? ACCENT_FALLBACK[i % ACCENT_FALLBACK.length],
      })),
    [],
  );

  const [idx, setIdx] = useState(() => startIndex % Math.max(1, ads.length));
  const tRef = useRef(0);
  const panelRef = useRef<THREE.MeshStandardMaterial>(null!);
  const ledRefs = useRef<Array<THREE.MeshStandardMaterial | null>>([]);

  useFrame((_, dt) => {
    tRef.current += dt;
    if (tRef.current >= cycleSeconds) {
      tRef.current -= cycleSeconds;
      setIdx((i) => (i + 1) % ads.length);
    }
    // Brief panel flash on swap, then ease back to base glow.
    const flash = Math.max(0, 1 - tRef.current / 0.45);
    if (panelRef.current) {
      panelRef.current.emissiveIntensity = 0.55 + flash * 1.8;
    }
    // LED border twinkles at ~6Hz.
    const ledPulse = 1.1 + Math.sin(tRef.current * 6) * 0.45;
    for (const m of ledRefs.current) {
      if (m) m.emissiveIntensity = ledPulse;
    }
  });

  const ad = ads[idx];
  const tagline = TAGLINES[idx % TAGLINES.length];

  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {/* Twin support poles — 4u tall, panel mounts above */}
      {[-3.5, 3.5].map((px) => (
        <group key={`pole-${px}`} position={[px, 0, 0]}>
          {/* Concrete footing */}
          <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.85, 0.35, 0.85]} />
            <meshStandardMaterial color="#1f2937" roughness={0.85} />
          </mesh>
          {/* Steel pole */}
          <mesh position={[0, 2.1, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, 4.0, 10]} />
            <meshStandardMaterial color="#3f3f46" metalness={0.55} roughness={0.45} />
          </mesh>
        </group>
      ))}

      {/* Panel back / frame (dark) — gives the sign body depth */}
      <mesh position={[0, 5.5, -0.12]} castShadow receiveShadow>
        <boxGeometry args={[8.6, 4.0, 0.25]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Panel face — tinted by current ad color (the cycling element) */}
      <mesh position={[0, 5.5, 0.02]}>
        <planeGeometry args={[8.2, 3.6]} />
        <meshStandardMaterial
          ref={panelRef}
          color={ad.color}
          emissive={ad.color}
          emissiveIntensity={0.55}
          toneMapped={false}
        />
      </mesh>

      {/* LED border — 4 thin emissive bars around the panel */}
      <mesh position={[0, 7.4, 0.05]}>
        <planeGeometry args={[8.2, 0.18]} />
        <meshStandardMaterial
          ref={(el) => { ledRefs.current[0] = el; }}
          color="#fde047"
          emissive="#fde047"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 3.6, 0.05]}>
        <planeGeometry args={[8.2, 0.18]} />
        <meshStandardMaterial
          ref={(el) => { ledRefs.current[1] = el; }}
          color="#fde047"
          emissive="#fde047"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-4.01, 5.5, 0.05]}>
        <planeGeometry args={[0.18, 3.8]} />
        <meshStandardMaterial
          ref={(el) => { ledRefs.current[2] = el; }}
          color="#fde047"
          emissive="#fde047"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[4.01, 5.5, 0.05]}>
        <planeGeometry args={[0.18, 3.8]} />
        <meshStandardMaterial
          ref={(el) => { ledRefs.current[3] = el; }}
          color="#fde047"
          emissive="#fde047"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* AD CONTENT — keyed by idx so Text remounts cleanly each cycle */}
      {/* Big emoji on the left */}
      <Text
        key={`emoji-${idx}`}
        position={[-2.7, 5.7, 0.08]}
        fontSize={1.85}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#0b1220"
      >
        {ad.emoji}
      </Text>
      {/* Kiosk name on the right — wraps if long */}
      <Text
        key={`label-${idx}`}
        position={[0.9, 6.15, 0.08]}
        fontSize={0.6}
        color="#fef3c7"
        anchorX="center"
        anchorY="middle"
        maxWidth={4.8}
        outlineWidth={0.05}
        outlineColor="#0b1220"
        textAlign="center"
      >
        {ad.label.toUpperCase()}
      </Text>
      {/* Tagline */}
      <Text
        key={`tag-${idx}`}
        position={[0.9, 5.05, 0.08]}
        fontSize={0.34}
        color="#fde047"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#0b1220"
      >
        {tagline}
      </Text>
      {/* Footer line — fixed, identifies the network */}
      <Text
        position={[0.9, 4.25, 0.08]}
        fontSize={0.18}
        color="#fef3c7"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#0b1220"
      >
        ★ BOTCITY CROSS-PROMO NETWORK ★
      </Text>
    </group>
  );
}

export default function Billboards() {
  // Positions: 6u outside the inner ring road (z=±54 / x=±54) on each
  // cardinal axis. Each face points OUTWARD so incoming traffic sees
  // the ad before crossing into the city core.
  //
  // Collision-checked vs BUILDING_DEFS:
  //   • (0,-60) N: 5u south of BotFactory edge (z=-65); x∈[-3.5,3.5]
  //     clears factory footprint x[-22,-8]. ✓
  //   • (0, 60) S: closest kiosks BotKids (-9,82.5) 23u, BotRetirement
  //     (-7.5,40.5) 20u. ✓
  //   • (60, 0) E: closest BotCrypto (40.5,-7.5) 21u, BotBroker
  //     (82.5,-9) 24u. ✓
  //   • (-60, 0) W: closest BotGallery (-75,-10) 18u, BotGigs
  //     (-82.5,9) 24u. ✓
  //
  // Each billboard has a unique startIndex (spread across the ~70-kiosk
  // list) and a slightly different cycleSeconds so they never desync
  // into matching frames.
  return (
    <group>
      <Billboard pos={[0,   0, -60]} rotY={Math.PI}     startIndex={0}  cycleSeconds={4.5} />
      <Billboard pos={[0,   0,  60]} rotY={0}           startIndex={17} cycleSeconds={5.1} />
      <Billboard pos={[60,  0,   0]} rotY={Math.PI / 2} startIndex={34} cycleSeconds={4.8} />
      <Billboard pos={[-60, 0,   0]} rotY={-Math.PI / 2} startIndex={51} cycleSeconds={5.4} />
    </group>
  );
}
