import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// ════════════════════════════════════════════════════════════════════
// MoneyBot Media District (NE strip) + Military Base (SW outer band).
//
//   • MoneyBotNews     @ (90, 0, -10)  — news studio + satellite dish
//   • MoneyBotRadio    @ (90, 0, -32)  — radio HQ + 22u antenna tower
//   • MoneyBotComic    @ (90, 0, -55)  — pop-art comic shop
//   • MilitaryBase     @ (-105, 0, -45) — walled compound vs BrokeBots
//
// All four register kiosks in BUILDING_DEFS at their local origin so the
// player can walk up to them. Decor here renders the surrounding scenery
// (towers, walls, tank, captured BrokeBots, etc).
// ════════════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────────────
// MoneyBot News — broadcast studio with rooftop satellite dish, an
// "ON AIR" beacon, and a wrap-around scrolling news ticker.
// ──────────────────────────────────────────────────────────────────
function MoneyBotNews() {
  const dishRef = useRef<THREE.Group>(null!);
  const onAirRef = useRef<THREE.MeshStandardMaterial>(null!);
  const tickerRef = useRef<THREE.Group>(null!);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (dishRef.current) dishRef.current.rotation.y = Math.sin(t * 0.4) * 0.5;
    if (onAirRef.current) {
      onAirRef.current.emissiveIntensity = 1.6 + Math.sin(t * 4) * 0.6;
    }
    if (tickerRef.current) {
      // Scroll the ticker text band around the building face
      tickerRef.current.position.x = ((t * 1.4) % 12) - 6;
    }
  });

  return (
    <group position={[90, 0, -10]}>
      {/* Plaza pavers */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Studio building — dark glass cube w/ red trim */}
      <mesh position={[0, 4, -3]} castShadow receiveShadow>
        <boxGeometry args={[8, 8, 5]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Front glass face */}
      <mesh position={[0, 4, -0.49]}>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#3b82f6"
          emissiveIntensity={0.5}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>
      {/* Red banner stripe */}
      <mesh position={[0, 7.8, -0.45]}>
        <planeGeometry args={[7.4, 0.6]} />
        <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
      <Text
        position={[0, 7.8, -0.43]}
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        MONEYBOT NEWS
      </Text>

      {/* Scrolling news ticker — clipped band */}
      <mesh position={[0, 1.1, -0.48]}>
        <planeGeometry args={[7, 0.5]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <group position={[0, 1.1, -0.47]}>
        <group ref={tickerRef}>
          <Text fontSize={0.32} color="#22c55e" anchorX="center" anchorY="middle">
            BREAKING: SAVINGS RATES UP • CPI COOLS • BUDGET YOUR DAY
          </Text>
        </group>
      </group>

      {/* "ON AIR" beacon on the corner */}
      <mesh position={[3.6, 8.5, -0.5]}>
        <boxGeometry args={[1.4, 0.5, 0.2]} />
        <meshStandardMaterial
          ref={onAirRef}
          color="#7f1d1d"
          emissive="#ef4444"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      <Text position={[3.6, 8.5, -0.39]} fontSize={0.24} color="#fff" anchorX="center" anchorY="middle">
        ON AIR
      </Text>

      {/* Roof-mounted satellite dish */}
      <group ref={dishRef} position={[-2, 8.3, -3]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 1.4, 10]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.5, 0.9, 0]} rotation={[0, 0, -0.6]}>
          <sphereGeometry args={[1.2, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.5} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        {/* Feed horn */}
        <mesh position={[1.0, 1.4, 0]}>
          <coneGeometry args={[0.15, 0.5, 8]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>

      {/* Broadcast antenna mast w/ red blinker */}
      <mesh position={[2.5, 9.6, -3]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 3.2, 6]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[2.5, 11.4, -3]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────
// MoneyBot Radio — broadcasting HQ with a 22u lattice antenna tower
// crowned by a pulsing red beacon and animated concentric "wave" rings.
// ──────────────────────────────────────────────────────────────────
function MoneyBotRadio() {
  const beaconRef = useRef<THREE.MeshStandardMaterial>(null!);
  const wave1 = useRef<THREE.Mesh>(null!);
  const wave2 = useRef<THREE.Mesh>(null!);
  const wave3 = useRef<THREE.Mesh>(null!);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (beaconRef.current) beaconRef.current.emissiveIntensity = 1.6 + Math.sin(t * 5) * 0.9;
    const animateWave = (ref: React.RefObject<THREE.Mesh>, offset: number) => {
      const m = ref.current;
      if (!m) return;
      const phase = ((t + offset) % 3) / 3;
      m.scale.set(1 + phase * 4, 1 + phase * 4, 1);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.6 * (1 - phase);
    };
    animateWave(wave1, 0);
    animateWave(wave2, 1);
    animateWave(wave3, 2);
  });

  return (
    <group position={[90, 0, -85]}>
      {/* Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color="#1c1917" roughness={0.8} metalness={0.15} />
      </mesh>

      {/* Art-deco radio HQ building */}
      <mesh position={[0, 2.5, -3.5]} castShadow receiveShadow>
        <boxGeometry args={[7, 5, 4]} />
        <meshStandardMaterial color="#92400e" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Stepped art-deco crown */}
      <mesh position={[0, 5.4, -3.5]} castShadow>
        <boxGeometry args={[5.5, 0.8, 3.2]} />
        <meshStandardMaterial color="#a16207" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 6.1, -3.5]} castShadow>
        <boxGeometry args={[3.8, 0.6, 2.4]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Gold trim band */}
      <mesh position={[0, 4.85, -1.49]}>
        <planeGeometry args={[6.6, 0.3]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Marquee sign */}
      <mesh position={[0, 3.2, -1.48]}>
        <planeGeometry args={[5.6, 1.0]} />
        <meshStandardMaterial color="#1c1917" emissive="#fbbf24" emissiveIntensity={0.5} />
      </mesh>
      <Text position={[0, 3.4, -1.46]} fontSize={0.42} color="#fbbf24" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000">
        MONEYBOT RADIO
      </Text>
      <Text position={[0, 2.9, -1.46]} fontSize={0.26} color="#fde68a" anchorX="center" anchorY="middle">
        99.7 FM • All Money, All Day
      </Text>

      {/* Lattice antenna tower — 4 corner posts + cross-braces, 22u tall */}
      <group position={[0, 0, 3]}>
        {[
          [-0.8, -0.8],
          [0.8, -0.8],
          [-0.8, 0.8],
          [0.8, 0.8],
        ].map((p, i) => (
          <mesh key={`post-${i}`} position={[p[0], 11, p[1]]} castShadow>
            <cylinderGeometry args={[0.09, 0.12, 22, 6]} />
            <meshStandardMaterial color="#dc2626" metalness={0.5} roughness={0.5} />
          </mesh>
        ))}
        {/* Horizontal struts at 4 heights */}
        {[3, 8, 13, 18].map((y, i) => (
          <group key={`ring-${i}`} position={[0, y, 0]}>
            <mesh>
              <boxGeometry args={[1.7, 0.1, 0.08]} />
              <meshStandardMaterial color="#fff" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.8]}>
              <boxGeometry args={[1.7, 0.1, 0.08]} />
              <meshStandardMaterial color="#fff" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, -0.8]}>
              <boxGeometry args={[1.7, 0.1, 0.08]} />
              <meshStandardMaterial color="#fff" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[1.7, 0.1, 0.08]} />
              <meshStandardMaterial color="#fff" metalness={0.5} roughness={0.4} />
            </mesh>
          </group>
        ))}
        {/* Diagonal X-braces on the south face for visual lattice */}
        {[0, 5, 10, 15].map((y, i) => (
          <group key={`x-${i}`} position={[0, y + 2.5, -0.8]}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[6, 0.06, 0.06]} />
              <meshStandardMaterial color="#fca5a5" metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]}>
              <boxGeometry args={[6, 0.06, 0.06]} />
              <meshStandardMaterial color="#fca5a5" metalness={0.4} roughness={0.5} />
            </mesh>
          </group>
        ))}
        {/* Pulsing red beacon on top */}
        <mesh position={[0, 22.4, 0]}>
          <sphereGeometry args={[0.4, 12, 12]} />
          <meshStandardMaterial
            ref={beaconRef}
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
        {/* Concentric broadcast wave rings */}
        {[wave1, wave2, wave3].map((r, i) => (
          <mesh key={`wave-${i}`} ref={r} position={[0, 22.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.6, 32]} />
            <meshBasicMaterial color="#fca5a5" transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────
// MoneyBot ComicShop — colorful pop-art shop with striped awning,
// big speech-bubble signage, and POW/BAM thought callouts on the wall.
// ──────────────────────────────────────────────────────────────────
function MoneyBotComic() {
  const bubbleRef = useRef<THREE.Group>(null!);
  const powRef = useRef<THREE.Group>(null!);
  const bamRef = useRef<THREE.Group>(null!);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (bubbleRef.current) bubbleRef.current.rotation.z = Math.sin(t * 1.2) * 0.06;
    if (powRef.current) powRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
    if (bamRef.current) bamRef.current.scale.setScalar(1 + Math.sin(t * 3 + 1.5) * 0.08);
  });

  return (
    <group position={[90, 0, -65]}>
      {/* Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[11, 9]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.85} />
      </mesh>
      {/* Shop body — bright yellow */}
      <mesh position={[0, 2.5, -2.5]} castShadow receiveShadow>
        <boxGeometry args={[7, 5, 4]} />
        <meshStandardMaterial color="#facc15" roughness={0.6} />
      </mesh>
      {/* Red roofline */}
      <mesh position={[0, 5.15, -2.5]} castShadow>
        <boxGeometry args={[7.3, 0.4, 4.3]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Striped awning over entrance — alternating red/white panels */}
      {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((x, i) => (
        <mesh key={`awn-${i}`} position={[x, 3.5, -0.3]} rotation={[Math.PI / 8, 0, 0]} castShadow>
          <boxGeometry args={[1, 0.1, 1.4]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#dc2626" : "#fff"} />
        </mesh>
      ))}
      {/* Front window (display) */}
      <mesh position={[-2, 2.2, -0.49]}>
        <planeGeometry args={[2.4, 2.2]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.6} metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[2, 2.2, -0.49]}>
        <planeGeometry args={[2.4, 2.2]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.6} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 1.4, -0.49]}>
        <planeGeometry args={[1.1, 2.4]} />
        <meshStandardMaterial color="#7f1d1d" />
      </mesh>

      {/* Big speech-bubble sign on roof */}
      <group ref={bubbleRef} position={[0, 6.5, -2.5]}>
        <mesh>
          <sphereGeometry args={[1.6, 18, 14]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.3} />
        </mesh>
        {/* Tail of the bubble */}
        <mesh position={[-0.6, -1.4, 0]} rotation={[0, 0, 0.4]}>
          <coneGeometry args={[0.4, 1.2, 8]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.3} />
        </mesh>
        <Text position={[0, 0.3, 1.5]} fontSize={0.42} color="#dc2626" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000">
          MONEYBOT
        </Text>
        <Text position={[0, -0.3, 1.5]} fontSize={0.5} color="#1d4ed8" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000">
          COMICS!
        </Text>
      </group>

      {/* POW! callout — wall-mounted starburst */}
      <group ref={powRef} position={[-3.2, 4.2, -0.45]}>
        <mesh rotation={[0, 0, 0.3]}>
          <circleGeometry args={[0.85, 12]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.9} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <Text position={[0, 0, 0.05]} fontSize={0.5} color="#fff" anchorX="center" anchorY="middle" outlineWidth={0.04} outlineColor="#000">
          POW!
        </Text>
      </group>
      {/* BAM! callout */}
      <group ref={bamRef} position={[3.2, 4.2, -0.45]}>
        <mesh rotation={[0, 0, -0.2]}>
          <circleGeometry args={[0.85, 12]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.9} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <Text position={[0, 0, 0.05]} fontSize={0.5} color="#fff" anchorX="center" anchorY="middle" outlineWidth={0.04} outlineColor="#000">
          BAM!
        </Text>
      </group>

      {/* Sandwich board sidewalk sign */}
      <group position={[-3.8, 0.5, 2]}>
        <mesh rotation={[0, 0, 0.15]}>
          <boxGeometry args={[1.0, 1.2, 0.05]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <Text position={[0, 0.2, 0.04]} rotation={[0, 0, 0.15]} fontSize={0.18} color="#dc2626" anchorX="center" anchorY="middle">
          NEW
        </Text>
        <Text position={[0, -0.1, 0.04]} rotation={[0, 0, 0.15]} fontSize={0.14} color="#000" anchorX="center" anchorY="middle">
          ISSUES!
        </Text>
      </group>
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────
// Military Base — walled compound that defends BotCity against
// brokeness and BrokeBots. Includes perimeter walls, 4 corner
// watchtowers, central HQ bunker, parked tank, anti-broke turret,
// radar dish, and a brig holding two captured BrokeBots.
// ──────────────────────────────────────────────────────────────────
function MilitaryBase() {
  const radarRef = useRef<THREE.Group>(null!);
  const turretRef = useRef<THREE.Group>(null!);
  const beaconRefs = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
  const brokeBot1 = useRef<THREE.Group>(null!);
  const brokeBot2 = useRef<THREE.Group>(null!);
  const flagRef = useRef<THREE.Mesh>(null!);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (radarRef.current) radarRef.current.rotation.y = t * 1.2;
    if (turretRef.current) turretRef.current.rotation.y = Math.sin(t * 0.5) * 0.7;
    const e = 1.2 + Math.sin(t * 3.5) * 0.9;
    for (const m of beaconRefs.current) if (m) m.emissiveIntensity = e;
    // Sad slumping BrokeBots
    if (brokeBot1.current) brokeBot1.current.rotation.z = -0.15 + Math.sin(t * 0.7) * 0.05;
    if (brokeBot2.current) brokeBot2.current.rotation.z = 0.15 + Math.sin(t * 0.7 + 1.2) * 0.05;
    if (flagRef.current) flagRef.current.rotation.y = Math.sin(t * 1.5) * 0.3;
  });

  // Helper: a single watchtower (3-leg base + cabin + searchlight)
  const Watchtower = ({ pos, idx }: { pos: [number, number]; idx: number }) => (
    <group position={[pos[0], 0, pos[1]]}>
      {/* Legs */}
      {[
        [-0.8, -0.8],
        [0.8, -0.8],
        [-0.8, 0.8],
        [0.8, 0.8],
      ].map((p, i) => (
        <mesh key={`leg-${i}`} position={[p[0], 3, p[1]]} castShadow>
          <cylinderGeometry args={[0.12, 0.16, 6, 6]} />
          <meshStandardMaterial color="#4b5563" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}
      {/* Cabin */}
      <mesh position={[0, 6.3, 0]} castShadow>
        <boxGeometry args={[2.4, 1.4, 2.4]} />
        <meshStandardMaterial color="#4d7c0f" roughness={0.7} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 7.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.8, 0.9, 4]} />
        <meshStandardMaterial color="#365314" roughness={0.7} />
      </mesh>
      {/* Beacon light */}
      <mesh position={[0, 7.95, 0]}>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshStandardMaterial
          ref={(m) => {
            beaconRefs.current[idx] = m;
          }}
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );

  return (
    <group position={[-105, 0, -45]}>
      {/* Compound apron — dirt/sand color */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color="#78716c" roughness={0.95} />
      </mesh>
      {/* Camo color blotches */}
      {[
        [-6, -4, 0.55],
        [5, -7, 0.7],
        [-3, 6, 0.6],
        [7, 5, 0.5],
        [-8, 2, 0.4],
      ].map(([x, z, r], i) => (
        <mesh key={`blot-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x as number, 0.03, z as number]}>
          <circleGeometry args={[r as number, 14]} />
          <meshStandardMaterial color="#3f3f29" roughness={0.95} />
        </mesh>
      ))}

      {/* Perimeter walls — 4 sides, with a gap in the south for the gate */}
      {/* North wall (z = -12.5), full length */}
      <mesh position={[0, 1.2, -12.5]} castShadow receiveShadow>
        <boxGeometry args={[24, 2.4, 0.6]} />
        <meshStandardMaterial color="#57534e" roughness={0.85} />
      </mesh>
      {/* East wall */}
      <mesh position={[12.2, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 2.4, 24]} />
        <meshStandardMaterial color="#57534e" roughness={0.85} />
      </mesh>
      {/* West wall */}
      <mesh position={[-12.2, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 2.4, 24]} />
        <meshStandardMaterial color="#57534e" roughness={0.85} />
      </mesh>
      {/* South wall — split into two halves, 4u gate in the middle */}
      <mesh position={[-7, 1.2, 12.5]} castShadow receiveShadow>
        <boxGeometry args={[10, 2.4, 0.6]} />
        <meshStandardMaterial color="#57534e" roughness={0.85} />
      </mesh>
      <mesh position={[7, 1.2, 12.5]} castShadow receiveShadow>
        <boxGeometry args={[10, 2.4, 0.6]} />
        <meshStandardMaterial color="#57534e" roughness={0.85} />
      </mesh>
      {/* Gate posts */}
      {[-2, 2].map((x) => (
        <mesh key={`post-${x}`} position={[x, 1.8, 12.5]} castShadow>
          <boxGeometry args={[0.4, 3.6, 0.6]} />
          <meshStandardMaterial color="#1c1917" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* Gate banner */}
      <mesh position={[0, 3.4, 12.5]}>
        <boxGeometry args={[4.4, 0.6, 0.1]} />
        <meshStandardMaterial color="#7f1d1d" emissive="#dc2626" emissiveIntensity={0.6} />
      </mesh>
      <Text position={[0, 3.4, 12.6]} fontSize={0.28} color="#fff" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000">
        ANTI-BROKE DEFENSE
      </Text>

      {/* Sandbag stacks flanking the gate */}
      {[-3, 3].map((x) =>
        [0, 0.4, 0.8].map((y, j) => (
          <mesh key={`sb-${x}-${j}`} position={[x, 0.25 + y, 11.6]} castShadow>
            <boxGeometry args={[1.4, 0.45, 0.55]} />
            <meshStandardMaterial color="#a8a29e" roughness={0.95} />
          </mesh>
        )),
      )}

      {/* Four corner watchtowers */}
      <Watchtower pos={[-11.5, -11.5]} idx={0} />
      <Watchtower pos={[11.5, -11.5]} idx={1} />
      <Watchtower pos={[-11.5, 11.5]} idx={2} />
      <Watchtower pos={[11.5, 11.5]} idx={3} />

      {/* Central HQ bunker — concrete with reinforced top */}
      <mesh position={[0, 1.5, -3]} castShadow receiveShadow>
        <boxGeometry args={[7, 3, 5]} />
        <meshStandardMaterial color="#4b5563" roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.15, -3]} castShadow>
        <boxGeometry args={[7.4, 0.3, 5.4]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>
      {/* Slit windows */}
      {[-2.5, 0, 2.5].map((x, i) => (
        <mesh key={`slit-${i}`} position={[x, 2.2, -0.49]}>
          <planeGeometry args={[1.2, 0.25]} />
          <meshStandardMaterial color="#000" emissive="#22c55e" emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
      ))}
      {/* Door */}
      <mesh position={[0, 1.1, -0.49]}>
        <planeGeometry args={[1.0, 2.0]} />
        <meshStandardMaterial color="#1c1917" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Flagpole + flag on HQ roof */}
      <mesh position={[3.2, 5.2, -3]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 4, 6]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh ref={flagRef} position={[3.7, 6.5, -3]} castShadow>
        <planeGeometry args={[1.0, 0.6]} />
        <meshStandardMaterial color="#dc2626" emissive="#7f1d1d" emissiveIntensity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Rotating radar dish on HQ roof */}
      <group ref={radarRef} position={[-2.5, 3.5, -3]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
          <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.5, 0]} rotation={[0.5, 0, 0]}>
          <sphereGeometry args={[0.9, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
          <meshStandardMaterial color="#e7e5e4" metalness={0.5} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.9, 0.5]}>
          <coneGeometry args={[0.1, 0.4, 6]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>

      {/* Parked tank — body, treads, turret, cannon barrel */}
      <group position={[-7, 0, 4]} rotation={[0, 0.4, 0]}>
        {/* Tracks */}
        <mesh position={[0, 0.35, -0.9]} castShadow>
          <boxGeometry args={[3.4, 0.7, 0.7]} />
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.35, 0.9]} castShadow>
          <boxGeometry args={[3.4, 0.7, 0.7]} />
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </mesh>
        {/* Hull */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[3.2, 0.8, 2.0]} />
          <meshStandardMaterial color="#4d7c0f" roughness={0.7} />
        </mesh>
        {/* Turret */}
        <mesh position={[0.2, 1.55, 0]} castShadow>
          <cylinderGeometry args={[0.9, 0.95, 0.7, 12]} />
          <meshStandardMaterial color="#3f6212" roughness={0.7} />
        </mesh>
        {/* Cannon barrel */}
        <mesh position={[1.8, 1.55, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 2.2, 10]} />
          <meshStandardMaterial color="#1c1917" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[2.9, 1.55, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.2, 10]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      </group>

      {/* Anti-Broke Turret — tripod mount with rotating gun */}
      <group ref={turretRef} position={[7, 0, 4]}>
        {/* Base */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.9, 1.0, 8]} />
          <meshStandardMaterial color="#27272a" metalness={0.6} roughness={0.5} />
        </mesh>
        {/* Gun body */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.2, 0.6, 0.6]} />
          <meshStandardMaterial color="#52525b" metalness={0.6} roughness={0.5} />
        </mesh>
        {/* Twin barrels */}
        <mesh position={[1.4, 1.3, -0.18]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.6, 8]} />
          <meshStandardMaterial color="#18181b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[1.4, 1.1, 0.18]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1.6, 8]} />
          <meshStandardMaterial color="#18181b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Ammo sign */}
        <Text position={[0, 2.1, 0]} fontSize={0.18} color="#fbbf24" anchorX="center" anchorY="middle" outlineWidth={0.015} outlineColor="#000">
          ANTI-BROKE
        </Text>
      </group>

      {/* Brig — captured BrokeBots behind bars (NE corner of compound) */}
      <group position={[8, 0, -7]}>
        {/* Cell pad */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
          <planeGeometry args={[4, 3]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.9} />
        </mesh>
        {/* Vertical bars */}
        {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((x, i) => (
          <mesh key={`bar-${i}`} position={[x, 1.3, 1.5]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 2.6, 6]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.7} roughness={0.4} />
          </mesh>
        ))}
        {/* Top + bottom rails */}
        <mesh position={[0, 0.05, 1.5]}>
          <boxGeometry args={[3.8, 0.1, 0.1]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.6} roughness={0.5} />
        </mesh>
        <mesh position={[0, 2.55, 1.5]}>
          <boxGeometry args={[3.8, 0.1, 0.1]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.6} roughness={0.5} />
        </mesh>
        {/* Captured BrokeBots — rusty, sad slump */}
        <group ref={brokeBot1} position={[-0.8, 0.65, 0.4]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 1.0, 0.5]} />
            <meshStandardMaterial color="#9a3412" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.85, 0]} castShadow>
            <boxGeometry args={[0.55, 0.55, 0.5]} />
            <meshStandardMaterial color="#7c2d12" roughness={0.9} />
          </mesh>
          {/* X eyes */}
          <Text position={[0, 0.9, 0.26]} fontSize={0.28} color="#000" anchorX="center" anchorY="middle">
            x_x
          </Text>
        </group>
        <group ref={brokeBot2} position={[0.8, 0.65, 0.4]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 1.0, 0.5]} />
            <meshStandardMaterial color="#7c2d12" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.85, 0]} castShadow>
            <boxGeometry args={[0.55, 0.55, 0.5]} />
            <meshStandardMaterial color="#9a3412" roughness={0.9} />
          </mesh>
          <Text position={[0, 0.9, 0.26]} fontSize={0.28} color="#000" anchorX="center" anchorY="middle">
            x_x
          </Text>
        </group>
        {/* Brig sign */}
        <Text position={[0, 3.0, 1.5]} fontSize={0.22} color="#fca5a5" anchorX="center" anchorY="middle" outlineWidth={0.015} outlineColor="#000">
          BROKEBOT BRIG
        </Text>
      </group>
    </group>
  );
}

// ──────────────────────────────────────────────────────────────────
// Combined export — all media + military scenery in one component.
// ──────────────────────────────────────────────────────────────────
export default function CityMedia() {
  return (
    <>
      <MoneyBotNews />
      <MoneyBotRadio />
      <MoneyBotComic />
      <MilitaryBase />
    </>
  );
}
