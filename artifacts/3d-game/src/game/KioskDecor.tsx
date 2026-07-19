import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { BUILDING_DEFS } from "./buildingDefs";
import { useGameStore } from "./gameStore";
import { effectiveXZ } from "./buildingLayout";
import { LOT_SIZE } from "./cityConstants";

// Quarter-color paved plinth that travels with its kiosk in Build Mode.
// Same visual as the old static ReservedLot tile so the look is unchanged.
function KioskPlinth({ color }: { color: string }) {
  const half = LOT_SIZE / 2;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[LOT_SIZE, LOT_SIZE]} />
        <meshStandardMaterial color="#0b1220" roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[half - 0.3, half - 0.1, 4, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
          toneMapped={false}
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════
// KioskDecor — signature visual prop per outer-ring financial-ed kiosk.
//
// Each of the 30 Task #2 kiosks gets one bespoke decoration placed on
// the city-center-facing side of its lot (computed from kiosk position
// → origin direction). The kiosk body itself is the generic 1.8×1.8×3
// box from BUILDING_DEFS; this file adds the recognizable detail (chapel
// spire, stock ticker, rocket, scales, gift box, etc.) that lets the six
// quarters be told apart at a glance.
//
// All props are kept inside the kiosk's 8u reserved lot footprint.
// ════════════════════════════════════════════════════════════════════

const OUTER_KIOSK_IDS = new Set([
  // Foundations
  "botmint", "botbudget", "botsavings", "botcreditbureau", "botbehavioral",
  // Borrowing
  "botmortgage", "botstudentaid", "botautoloans", "botpayday", "botbankruptcy",
  // Investing
  "botindex", "botreit", "botcommodities", "botventure", "botbonds",
  // Life Events
  "botchapel", "botmaternity", "botestate", "bothealthplan", "botdivorce",
  // Consumer
  "botconsumer", "botads", "botthrift", "botgiving", "botfintech",
  // Macro
  "botecon", "botforex", "bottrade", "botinflation", "botpolicy",
]);

/** Unit vector from a kiosk toward the city center, on the XZ plane. */
function towardCenter(x: number, z: number): [number, number] {
  const len = Math.hypot(x, z) || 1;
  return [-x / len, -z / len];
}

// ── Small reusable bits ──────────────────────────────────────────────

function PulsingOrb({
  position,
  color,
  radius = 0.25,
  speed = 1.5,
}: {
  position: [number, number, number];
  color: string;
  radius?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((s) => {
    if (ref.current) {
      ref.current.emissiveIntensity = 1.6 + Math.sin(s.clock.elapsedTime * speed) * 0.6;
    }
  });
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 12, 12]} />
      <meshStandardMaterial
        ref={ref}
        color={color}
        emissive={color}
        emissiveIntensity={1.8}
        toneMapped={false}
      />
    </mesh>
  );
}

function FloatingGlyph({
  position,
  text,
  color,
  size = 0.9,
}: {
  position: [number, number, number];
  text: string;
  color: string;
  size?: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 1.2) * 0.12;
      ref.current.rotation.y = s.clock.elapsedTime * 0.4;
    }
  });
  return (
    <group ref={ref} position={position}>
      <Text fontSize={size} color={color} anchorX="center" anchorY="middle" outlineWidth={0.05} outlineColor="#0b1220">
        {text}
      </Text>
    </group>
  );
}

function SignBoard({
  position,
  rotY,
  text,
  color,
  width = 2.6,
  height = 1.1,
}: {
  position: [number, number, number];
  rotY: number;
  text: string;
  color: string;
  width?: number;
  height?: number;
}) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3.2, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <boxGeometry args={[width, height, 0.12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      <Text position={[0, 3.2, 0.08]} fontSize={0.42} color="#0b1220" anchorX="center" anchorY="middle" maxWidth={width - 0.2} outlineWidth={0.02} outlineColor={color}>
        {text}
      </Text>
    </group>
  );
}

// ── Per-kiosk signature props ────────────────────────────────────────

function PropCoinStack({ color }: { color: string }) {
  // BotMint: stack of coins with floating $ glyph
  return (
    <group>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.15 + i * 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.16, 24]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.85} roughness={0.25} toneMapped={false} />
        </mesh>
      ))}
      <FloatingGlyph position={[0, 2.2, 0]} text="$" color="#fde047" size={1.4} />
    </group>
  );
}

function PropLedger({ color }: { color: string }) {
  // BotBudget: open ledger on a podium
  return (
    <group>
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.7, 1.4, 0.7]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[-0.5, 1.45, 0]} rotation={[-Math.PI / 6, 0, Math.PI / 14]} castShadow>
        <boxGeometry args={[1.1, 0.06, 0.9]} />
        <meshStandardMaterial color="#f8fafc" emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.5, 1.45, 0]} rotation={[-Math.PI / 6, 0, -Math.PI / 14]} castShadow>
        <boxGeometry args={[1.1, 0.06, 0.9]} />
        <meshStandardMaterial color="#f8fafc" emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <FloatingGlyph position={[0, 2.4, 0]} text="50/30/20" color={color} size={0.4} />
    </group>
  );
}

function PropPiggyBank({ color }: { color: string }) {
  // BotSavings: giant pink piggy
  return (
    <group>
      <mesh position={[0, 1.0, 0]} castShadow>
        <sphereGeometry args={[0.9, 16, 12]} />
        <meshStandardMaterial color="#f9a8d4" emissive="#ec4899" emissiveIntensity={0.25} roughness={0.5} />
      </mesh>
      <mesh position={[0.7, 1.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.3, 12]} />
        <meshStandardMaterial color="#f472b6" roughness={0.6} />
      </mesh>
      {[[-0.4,0.3,0.4],[0.4,0.3,0.4],[-0.4,0.3,-0.4],[0.4,0.3,-0.4]].map(([x,y,z],i)=>(
        <mesh key={i} position={[x,y,z]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.6, 8]} />
          <meshStandardMaterial color="#f9a8d4" roughness={0.6} />
        </mesh>
      ))}
      <PulsingOrb position={[0, 2.4, 0]} color={color} radius={0.18} />
    </group>
  );
}

function PropFilingCabinet({ color }: { color: string }) {
  // BotCreditBureau
  return (
    <group>
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[1.4, 1.8, 1.0]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
      </mesh>
      {[0.3, 0.9, 1.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0.52]}>
          <boxGeometry args={[1.2, 0.4, 0.05]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} toneMapped={false} />
        </mesh>
      ))}
      <FloatingGlyph position={[0, 2.8, 0]} text="FICO 740" color={color} size={0.32} />
    </group>
  );
}

function PropBrain({ color }: { color: string }) {
  // BotBehavioral
  const ref = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.5;
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial color="#fb7185" emissive={color} emissiveIntensity={0.5} roughness={0.4} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return <PulsingOrb key={i} position={[Math.cos(a) * 1.1, 1.5, Math.sin(a) * 1.1]} color={color} radius={0.1} speed={2 + i * 0.3} />;
      })}
    </group>
  );
}

function PropMiniHouse({ color }: { color: string }) {
  // BotMortgage
  return (
    <group>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1.4, 1.2, 1.4]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[1.1, 0.8, 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.45, 0.72]}>
        <boxGeometry args={[0.35, 0.6, 0.04]} />
        <meshStandardMaterial color="#1e293b" emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <FloatingGlyph position={[0, 2.6, 0]} text="30-YR FIXED" color={color} size={0.3} />
    </group>
  );
}

function PropGradCap({ color }: { color: string }) {
  // BotStudentAid
  return (
    <group>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[1.4, 0.08, 1.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      <mesh position={[0.5, 1.65, 0.5]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 1.4, 12]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <FloatingGlyph position={[0, 2.8, 0]} text="FAFSA" color={color} size={0.4} />
    </group>
  );
}

function PropCar({ color }: { color: string }) {
  // BotAutoLoans
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.8, 0.5, 0.9]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.6} roughness={0.3} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[1.0, 0.4, 0.85]} />
        <meshStandardMaterial color="#0b1220" metalness={0.7} roughness={0.2} />
      </mesh>
      {[[-0.6,0.15,0.45],[0.6,0.15,0.45],[-0.6,0.15,-0.45],[0.6,0.15,-0.45]].map(([x,y,z],i)=>(
        <mesh key={i} position={[x,y,z]} rotation={[Math.PI/2,0,0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.15, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}
      <FloatingGlyph position={[0, 1.8, 0]} text="APR 7.5%" color={color} size={0.32} />
    </group>
  );
}

function PropClockHourglass({ color }: { color: string }) {
  // BotPayday — ominous ticking
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 2) * 0.5;
  });
  return (
    <group>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.12, 24]} />
        <meshStandardMaterial color="#fef3c7" emissive={color} emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={ref} position={[0, 1.57, 0]}>
        <boxGeometry args={[0.05, 0.5, 0.02]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 1.4, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <FloatingGlyph position={[0, 2.4, 0]} text="391% APR" color="#ef4444" size={0.35} />
    </group>
  );
}

function PropScales({ color }: { color: string }) {
  // BotBankruptcy: scales of justice
  const ref = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 1.2) * 0.15;
  });
  return (
    <group>
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 2.0, 8]} />
        <meshStandardMaterial color="#facc15" emissive={color} emissiveIntensity={0.4} metalness={0.7} />
      </mesh>
      <group ref={ref} position={[0, 1.9, 0]}>
        <mesh>
          <boxGeometry args={[1.6, 0.06, 0.1]} />
          <meshStandardMaterial color="#facc15" metalness={0.7} />
        </mesh>
        {[-0.7, 0.7].map((x, i) => (
          <mesh key={i} position={[x, -0.35, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.3, 0.15, 12]} />
            <meshStandardMaterial color="#facc15" emissive={color} emissiveIntensity={0.5} metalness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function PropTicker({ color }: { color: string }) {
  // BotIndex: scrolling ticker billboard
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.0 + Math.sin(s.clock.elapsedTime * 3) * 0.6;
    }
  });
  return (
    <group>
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 2.0, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>
      <mesh ref={ref} position={[0, 2.2, 0]} castShadow>
        <boxGeometry args={[2.6, 0.7, 0.1]} />
        <meshStandardMaterial color="#0b1220" emissive={color} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <Text position={[0, 2.2, 0.06]} fontSize={0.32} color={color} anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#0b1220">
        S&P +0.42% ▲
      </Text>
    </group>
  );
}

function PropMiniTower({ color }: { color: string }) {
  // BotREIT: tiny skyscraper
  return (
    <group>
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.9, 2.8, 0.9]} />
        <meshStandardMaterial color="#0b1220" emissive={color} emissiveIntensity={0.4} metalness={0.7} roughness={0.3} />
      </mesh>
      {[0.5, 1.1, 1.7, 2.3].map((y, i) => (
        <mesh key={i} position={[0, y, 0.46]}>
          <boxGeometry args={[0.7, 0.16, 0.02]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      ))}
      <PulsingOrb position={[0, 2.95, 0]} color={color} radius={0.14} />
    </group>
  );
}

function PropBarrels({ color }: { color: string }) {
  // BotCommodities: gold/oil barrels + wheat
  return (
    <group>
      <mesh position={[-0.5, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 1.0, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive={color} emissiveIntensity={0.5} metalness={0.8} roughness={0.3} toneMapped={false} />
      </mesh>
      <mesh position={[0.5, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 1.0, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.5} />
      </mesh>
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 1.5, 0.6]} rotation={[0, 0, x * 0.6]}>
          <coneGeometry args={[0.08, 0.7, 6]} />
          <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function PropRocket({ color }: { color: string }) {
  // BotVenture
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (ref.current) {
      ref.current.position.y = 1.6 + Math.abs(Math.sin(s.clock.elapsedTime * 1.4)) * 0.3;
    }
  });
  return (
    <group>
      <mesh ref={ref} position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 1.4, 12]} />
        <meshStandardMaterial color="#f8fafc" emissive={color} emissiveIntensity={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <coneGeometry args={[0.25, 0.6, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <coneGeometry args={[0.45, 0.5, 6]} />
        <meshStandardMaterial color="#fb7185" emissive="#f97316" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
      <FloatingGlyph position={[0, 3.2, 0]} text="10×" color="#22c55e" size={0.5} />
    </group>
  );
}

function PropVault({ color }: { color: string }) {
  // BotBonds: vault door
  return (
    <group>
      <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.3, 24]} />
        <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.9, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.08, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.55, 0.9, 0.22]} rotation={[0, 0, a]} castShadow>
            <boxGeometry args={[0.3, 0.08, 0.06]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
          </mesh>
        );
      })}
      <FloatingGlyph position={[0, 2.2, 0]} text="3.5% YIELD" color={color} size={0.3} />
    </group>
  );
}

function PropChapelSpire({ color }: { color: string }) {
  // BotChapel
  return (
    <group>
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[1.2, 2.4, 1.2]} />
        <meshStandardMaterial color="#f8fafc" emissive={color} emissiveIntensity={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.9, 0]} castShadow>
        <coneGeometry args={[0.7, 1.4, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      <mesh position={[0, 3.85, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#fde047" emissive="#fbbf24" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <mesh position={[0, 3.95, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshStandardMaterial color="#fde047" emissive="#fbbf24" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

function PropCradle({ color }: { color: string }) {
  // BotMaternity
  const ref = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 1.0) * 0.15;
  });
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.0, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <group ref={ref} position={[0, 1.0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.4, 0.8]} />
          <meshStandardMaterial color="#fce7f3" emissive={color} emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.22, 12, 10]} />
          <meshStandardMaterial color="#fda4af" emissive={color} emissiveIntensity={0.5} />
        </mesh>
      </group>
      <FloatingGlyph position={[0, 2.2, 0]} text="529" color={color} size={0.45} />
    </group>
  );
}

function PropObelisk({ color }: { color: string }) {
  // BotEstate
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.6, 0.3, 1.6]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[0.5, 2.6, 0.5]} />
        <meshStandardMaterial color="#1e293b" emissive={color} emissiveIntensity={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 3.0, 0]} castShadow>
        <coneGeometry args={[0.35, 0.5, 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      <FloatingGlyph position={[0, 3.8, 0]} text="WILL · TRUST" color={color} size={0.28} />
    </group>
  );
}

function PropRedCross({ color }: { color: string }) {
  // BotHealthPlan
  return (
    <group>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.3, 1.6, 0.3]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.0} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[1.4, 0.3, 0.3]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.0} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 24]} />
        <meshStandardMaterial color="#f8fafc" emissive={color} emissiveIntensity={0.4} />
      </mesh>
      <FloatingGlyph position={[0, 2.8, 0]} text="HSA" color={color} size={0.45} />
    </group>
  );
}

function PropBrokenHeart({ color }: { color: string }) {
  // BotDivorce
  return (
    <group>
      <mesh position={[-0.45, 1.5, 0]} rotation={[0, 0, Math.PI / 12]} castShadow>
        <boxGeometry args={[0.6, 0.9, 0.18]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      <mesh position={[0.45, 1.5, 0]} rotation={[0, 0, -Math.PI / 12]} castShadow>
        <boxGeometry args={[0.6, 0.9, 0.18]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      <FloatingGlyph position={[0, 2.6, 0]} text="QDRO" color={color} size={0.4} />
    </group>
  );
}

function PropShield({ color }: { color: string }) {
  // BotConsumer Protection
  return (
    <group>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.5, 0.15, 5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} metalness={0.7} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.5, 0.1]}>
        <ringGeometry args={[0.35, 0.5, 24]} />
        <meshStandardMaterial color="#0b1220" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <FloatingGlyph position={[0, 2.6, 0]} text="CFPB" color={color} size={0.42} />
    </group>
  );
}

function PropTVScreen({ color }: { color: string }) {
  // BotAds
  const ref = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((s) => {
    if (ref.current) ref.current.emissiveIntensity = 0.8 + Math.abs(Math.sin(s.clock.elapsedTime * 4)) * 1.2;
  });
  return (
    <group>
      <mesh position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[2.0, 1.3, 0.18]} />
        <meshStandardMaterial color="#0b1220" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.6, 0.1]}>
        <boxGeometry args={[1.8, 1.1, 0.04]} />
        <meshStandardMaterial ref={ref} color={color} emissive={color} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 1.4, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <Text position={[0, 1.6, 0.13]} fontSize={0.28} color="#0b1220" anchorX="center" anchorY="middle">
        BUY NOW!
      </Text>
    </group>
  );
}

function PropRecycle({ color }: { color: string }) {
  // BotThrift
  const ref = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.8;
  });
  return (
    <group ref={ref}>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.55, 1.5, Math.sin(a) * 0.55]} rotation={[0, -a, Math.PI / 6]} castShadow>
            <coneGeometry args={[0.22, 0.7, 3]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} toneMapped={false} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 1.3, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}

function PropGiftBox({ color }: { color: string }) {
  // BotGiving
  return (
    <group>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1.3, 1.2, 1.3]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.2, 1.25, 1.32]} />
        <meshStandardMaterial color="#fde047" emissive="#fbbf24" emissiveIntensity={1.0} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.32, 1.25, 0.2]} />
        <meshStandardMaterial color="#fde047" emissive="#fbbf24" emissiveIntensity={1.0} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <torusGeometry args={[0.25, 0.08, 8, 16]} />
        <meshStandardMaterial color="#fde047" emissive="#fbbf24" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <FloatingGlyph position={[0, 2.4, 0]} text="DAF" color={color} size={0.45} />
    </group>
  );
}

function PropPhone({ color }: { color: string }) {
  // BotFinTech
  const ref = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((s) => {
    if (ref.current) ref.current.emissiveIntensity = 1.0 + Math.sin(s.clock.elapsedTime * 2.5) * 0.6;
  });
  return (
    <group>
      <mesh position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[0.9, 1.8, 0.12]} />
        <meshStandardMaterial color="#0b1220" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.65, 0.07]}>
        <boxGeometry args={[0.75, 1.55, 0.02]} />
        <meshStandardMaterial ref={ref} color={color} emissive={color} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 1.4, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <Text position={[0, 1.65, 0.1]} fontSize={0.35} color="#0b1220" anchorX="center" anchorY="middle">
        📱
      </Text>
    </group>
  );
}

function PropFlask({ color }: { color: string }) {
  // BotEcon Lab
  const ref = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((s) => {
    if (ref.current) ref.current.emissiveIntensity = 1.2 + Math.sin(s.clock.elapsedTime * 1.8) * 0.6;
  });
  return (
    <group>
      <mesh position={[0, 0.8, 0]} castShadow>
        <coneGeometry args={[0.6, 1.4, 16]} />
        <meshStandardMaterial color="#f8fafc" transparent opacity={0.5} metalness={0.3} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <coneGeometry args={[0.45, 0.9, 16]} />
        <meshStandardMaterial ref={ref} color={color} emissive={color} emissiveIntensity={1.4} toneMapped={false} transparent opacity={0.85} />
      </mesh>
      <PulsingOrb position={[0, 1.9, 0]} color={color} radius={0.12} />
      <FloatingGlyph position={[0, 2.6, 0]} text="GDP" color={color} size={0.45} />
    </group>
  );
}

function PropForex({ color }: { color: string }) {
  // BotForex
  const ref = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.6;
  });
  return (
    <group ref={ref}>
      <Text position={[0, 1.8, 0]} fontSize={0.6} color={color} anchorX="center" anchorY="middle" outlineWidth={0.04} outlineColor="#0b1220">
        $ € ¥
      </Text>
      <Text position={[0, 1.2, 0]} fontSize={0.6} color="#fde047" anchorX="center" anchorY="middle" outlineWidth={0.04} outlineColor="#0b1220" rotation={[0, Math.PI, 0]}>
        £ ₹ ¢
      </Text>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.2, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}

function PropGlobe({ color }: { color: string }) {
  // BotTrade
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.5;
  });
  return (
    <group>
      <mesh ref={ref} position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.7, 16, 12]} />
        <meshStandardMaterial color="#1e3a8a" emissive={color} emissiveIntensity={0.4} metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <torusGeometry args={[0.75, 0.04, 8, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.75, 0.04, 8, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 1.4, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}

function PropBalloon({ color }: { color: string }) {
  // BotInflation
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (ref.current) {
      const scale = 1.0 + Math.sin(s.clock.elapsedTime * 0.6) * 0.15;
      ref.current.scale.setScalar(scale);
    }
  });
  return (
    <group>
      <mesh ref={ref} position={[0, 2.0, 0]} castShadow>
        <sphereGeometry args={[0.7, 16, 12]} />
        <meshStandardMaterial color="#ef4444" emissive={color} emissiveIntensity={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <coneGeometry args={[0.05, 0.15, 6]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.02, 1.2, 0.02]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <FloatingGlyph position={[0, 3.1, 0]} text="CPI" color={color} size={0.45} />
    </group>
  );
}

function PropCapitolDome({ color }: { color: string }) {
  // BotPolicy
  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.0, 0.4, 2.0]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </mesh>
      {[-0.7, -0.23, 0.23, 0.7].map((x, i) => (
        <mesh key={i} position={[x, 1.1, 0.8]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 1.4, 12]} />
          <meshStandardMaterial color="#f8fafc" emissive={color} emissiveIntensity={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 1.85, 0.8]} castShadow>
        <boxGeometry args={[2.0, 0.18, 0.18]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 2.3, 0]} castShadow>
        <sphereGeometry args={[0.7, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.5} toneMapped={false} />
      </mesh>
      <PulsingOrb position={[0, 3.05, 0]} color={color} radius={0.16} />
    </group>
  );
}

// ── Switch table ─────────────────────────────────────────────────────

function KioskProp({ id, color }: { id: string; color: string }) {
  switch (id) {
    case "botmint":         return <PropCoinStack color={color} />;
    case "botbudget":       return <PropLedger color={color} />;
    case "botsavings":      return <PropPiggyBank color={color} />;
    case "botcreditbureau": return <PropFilingCabinet color={color} />;
    case "botbehavioral":   return <PropBrain color={color} />;
    case "botmortgage":     return <PropMiniHouse color={color} />;
    case "botstudentaid":   return <PropGradCap color={color} />;
    case "botautoloans":    return <PropCar color={color} />;
    case "botpayday":       return <PropClockHourglass color={color} />;
    case "botbankruptcy":   return <PropScales color={color} />;
    case "botindex":        return <PropTicker color={color} />;
    case "botreit":         return <PropMiniTower color={color} />;
    case "botcommodities":  return <PropBarrels color={color} />;
    case "botventure":      return <PropRocket color={color} />;
    case "botbonds":        return <PropVault color={color} />;
    case "botchapel":       return <PropChapelSpire color={color} />;
    case "botmaternity":    return <PropCradle color={color} />;
    case "botestate":       return <PropObelisk color={color} />;
    case "bothealthplan":   return <PropRedCross color={color} />;
    case "botdivorce":      return <PropBrokenHeart color={color} />;
    case "botconsumer":     return <PropShield color={color} />;
    case "botads":          return <PropTVScreen color={color} />;
    case "botthrift":       return <PropRecycle color={color} />;
    case "botgiving":       return <PropGiftBox color={color} />;
    case "botfintech":      return <PropPhone color={color} />;
    case "botecon":         return <PropFlask color={color} />;
    case "botforex":        return <PropForex color={color} />;
    case "bottrade":        return <PropGlobe color={color} />;
    case "botinflation":    return <PropBalloon color={color} />;
    case "botpolicy":       return <PropCapitolDome color={color} />;
    default:                return null;
  }
}

// ════════════════════════════════════════════════════════════════════
// Per-quarter signature monuments (Task #4)
//
// Complements the per-kiosk props above. Each of the 6 outer-ring
// quarters gets ONE oversized landmark — readable from a distance and
// on the minimap — so the city scans as 6 different neighborhoods,
// not just a uniform ring of differently-colored kiosks.
//
// Placement rules (rebased onto the tightened city grid):
//  • Corner quarters: positioned at (±115, ±115) — between the outer
//    edge of the + lot cluster (~±115) and the inner ring road at
//    ±120. Clear of all 5 lots, frames the quarter from the road.
//  • Strip quarters: arch over the main N-S avenue at z=±115 — between
//    the strip lots at z=±103 and the inner ring road at z=±120.
//  • Tall (≥ 7u) so they read above kiosks (~3u) from far away.
// ════════════════════════════════════════════════════════════════════

function MonumentLabel({
  position,
  color,
  text,
}: {
  position: [number, number, number];
  color: string;
  text: string;
}) {
  return (
    <Text
      position={position}
      fontSize={0.95}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.07}
      outlineColor="#0b1220"
    >
      {text}
    </Text>
  );
}

// ── Foundations: open book on a pedestal ─────────────────────────────
function FoundationsMonument({ position }: { position: [number, number] }) {
  const orbRef = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.emissiveIntensity =
        1.0 + Math.sin(state.clock.elapsedTime * 1.2) * 0.4;
    }
  });
  const [x, z] = position;
  const C = "#22d3ee";
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.8, 3, 8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <boxGeometry args={[2.6, 0.3, 2.0]} />
        <meshStandardMaterial color="#0c4a6e" roughness={0.7} />
      </mesh>
      <mesh position={[-0.9, 3.9, 0]} rotation={[0, 0, 0.35]} castShadow>
        <boxGeometry args={[1.8, 0.12, 1.9]} />
        <meshStandardMaterial color={C} emissive={C} emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      <mesh position={[0.9, 3.9, 0]} rotation={[0, 0, -0.35]} castShadow>
        <boxGeometry args={[1.8, 0.12, 1.9]} />
        <meshStandardMaterial color={C} emissive={C} emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      <mesh position={[0, 6.4, 0]}>
        <sphereGeometry args={[0.55, 16, 14]} />
        <meshStandardMaterial
          ref={orbRef}
          color="#fde68a"
          emissive={C}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 5.85, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.4, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      <MonumentLabel position={[0, 7.4, 0]} color={C} text="🧠 BASICS" />
    </group>
  );
}

// ── Borrowing & Credit: floating credit card with pulsing stripe ─────
function BorrowingMonument({ position }: { position: [number, number] }) {
  const cardRef = useRef<THREE.Group>(null!);
  const stripeRef = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (cardRef.current) {
      cardRef.current.rotation.y = t * 0.4;
      cardRef.current.position.y = 4.5 + Math.sin(t * 1.2) * 0.25;
    }
    if (stripeRef.current) {
      stripeRef.current.emissiveIntensity = 1.0 + Math.sin(t * 3) * 0.7;
    }
  });
  const [x, z] = position;
  const C = "#f472b6";
  return (
    <group position={[x, 0, z]}>
      {[-1.1, 1.1].map((px) => (
        <mesh key={px} position={[px, 1.7, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 3.4, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      <group ref={cardRef} position={[0, 4.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.2, 2.0, 0.18]} />
          <meshStandardMaterial
            color="#831843"
            emissive={C}
            emissiveIntensity={0.35}
            metalness={0.6}
            roughness={0.35}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.45, 0.1]}>
          <boxGeometry args={[3.0, 0.45, 0.04]} />
          <meshStandardMaterial
            ref={stripeRef}
            color={C}
            emissive={C}
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[-1.0, -0.2, 0.1]}>
          <boxGeometry args={[0.55, 0.4, 0.05]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.4, -0.65, 0.1]}>
          <boxGeometry args={[2.0, 0.15, 0.02]} />
          <meshStandardMaterial color="#fce7f3" />
        </mesh>
      </group>
      <MonumentLabel position={[0, 7.1, 0]} color={C} text="💳 CREDIT" />
    </group>
  );
}

// ── Investing: rising candlestick chart column ───────────────────────
function InvestingMonument({ position }: { position: [number, number] }) {
  const arrowRef = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((state) => {
    if (arrowRef.current) {
      arrowRef.current.emissiveIntensity =
        1.1 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });
  const [x, z] = position;
  const C = "#fbbf24";
  const bars: Array<[number, string]> = [
    [1.2, "#22c55e"],
    [2.0, "#22c55e"],
    [1.6, "#ef4444"],
    [3.0, "#22c55e"],
    [4.2, "#22c55e"],
  ];
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.4, 0]} receiveShadow>
        <boxGeometry args={[5.0, 0.8, 2.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.85} />
      </mesh>
      {bars.map(([h, col], i) => {
        const bx = -1.8 + i * 0.9;
        return (
          <group key={i} position={[bx, 0.8, 0]}>
            <mesh position={[0, h * 0.5 + 0.3, 0]}>
              <cylinderGeometry args={[0.05, 0.05, h + 0.6, 6]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, h * 0.5 + 0.3, 0]} castShadow>
              <boxGeometry args={[0.55, h, 0.55]} />
              <meshStandardMaterial
                color={col}
                emissive={col}
                emissiveIntensity={0.45}
                toneMapped={false}
              />
            </mesh>
          </group>
        );
      })}
      <mesh position={[2.0, 6.0, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <coneGeometry args={[0.55, 1.4, 4]} />
        <meshStandardMaterial
          ref={arrowRef}
          color={C}
          emissive={C}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
      <MonumentLabel position={[0, 7.6, 0]} color={C} text="📈 INVEST" />
    </group>
  );
}

// ── Life Events: wedding arch with a ring on top ─────────────────────
function LifeEventsMonument({ position }: { position: [number, number] }) {
  const ringRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });
  const [x, z] = position;
  const C = "#a78bfa";
  return (
    <group position={[x, 0, z]}>
      <mesh position={[-1.8, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 5, 10]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
      <mesh position={[1.8, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 5, 10]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
      <mesh position={[0, 5.0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.8, 0.18, 8, 18, Math.PI]} />
        <meshStandardMaterial color={C} emissive={C} emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
      {[-1.4, 1.4].map((px) => (
        <mesh key={px} position={[px, 4.6, 0]}>
          <sphereGeometry args={[0.35, 10, 8]} />
          <meshStandardMaterial
            color="#fbcfe8"
            emissive="#fb7185"
            emissiveIntensity={0.5}
            toneMapped={false}
          />
        </mesh>
      ))}
      <group ref={ringRef} position={[0, 6.6, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.12, 10, 24]} />
          <meshStandardMaterial
            color="#fde047"
            emissive="#fbbf24"
            emissiveIntensity={1.2}
            metalness={0.9}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.1, 0.7]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color="#e0f2fe"
            emissive="#22d3ee"
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
      </group>
      <MonumentLabel position={[0, 7.8, 0]} color={C} text="💍 LIFE EVENTS" />
    </group>
  );
}

// ── Consumer: giant shopping-cart arch over the main avenue ──────────
function ConsumerArch({ position }: { position: [number, number] }) {
  const wheelRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z = state.clock.elapsedTime * 0.8;
    }
  });
  const [x, z] = position;
  const C = "#34d399";
  return (
    <group position={[x, 0, z]}>
      {[-5, 5].map((px) => (
        <mesh key={px} position={[px, 3.5, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.3, 7, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 7.1, 0]} castShadow>
        <boxGeometry args={[10.8, 0.35, 0.6]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.4} />
      </mesh>
      <group position={[0, 5.8, 0]}>
        {[-2.0, -1.2, -0.4, 0.4, 1.2, 2.0].map((bx) => (
          <mesh key={`v${bx}`} position={[bx, 0, 0]}>
            <boxGeometry args={[0.1, 1.5, 0.1]} />
            <meshStandardMaterial color={C} emissive={C} emissiveIntensity={0.6} toneMapped={false} />
          </mesh>
        ))}
        {[-0.7, 0.7].map((by) => (
          <mesh key={`h${by}`} position={[0, by, 0]}>
            <boxGeometry args={[4.4, 0.1, 0.1]} />
            <meshStandardMaterial color={C} emissive={C} emissiveIntensity={0.6} toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[2.6, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.08, 6, 12, Math.PI / 2]} />
          <meshStandardMaterial color={C} emissive={C} emissiveIntensity={0.7} toneMapped={false} />
        </mesh>
      </group>
      <group ref={wheelRef} position={[-1.5, 4.7, 0]}>
        <mesh>
          <torusGeometry args={[0.35, 0.08, 6, 14]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.6, 0.06, 0.06]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.6, 0.06, 0.06]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
      <MonumentLabel position={[0, 8.0, 0]} color={C} text="🛒 CONSUMER" />
    </group>
  );
}

// ── Macro: rotating globe with orbital ring ──────────────────────────
function MacroMonument({ position }: { position: [number, number] }) {
  const globeRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (globeRef.current) globeRef.current.rotation.y = t * 0.3;
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2.6;
      ringRef.current.rotation.z = t * 0.6;
    }
  });
  const [x, z] = position;
  const C = "#fb923c";
  return (
    <group position={[x, 0, z]}>
      {[-3.5, 3.5].map((px) => (
        <mesh key={px} position={[px, 2, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.28, 4, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 4.0, 0]} castShadow>
        <boxGeometry args={[7.4, 0.3, 0.5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 5.0, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 1.2, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh ref={globeRef} position={[0, 6.4, 0]} castShadow>
        <sphereGeometry args={[1.1, 24, 18]} />
        <meshStandardMaterial color="#0c4a6e" emissive={C} emissiveIntensity={0.4} roughness={0.5} toneMapped={false} />
      </mesh>
      <mesh position={[0, 6.4, 0]}>
        <sphereGeometry args={[1.11, 24, 18]} />
        <meshStandardMaterial color="#22c55e" transparent opacity={0.18} toneMapped={false} />
      </mesh>
      <group ref={ringRef} position={[0, 6.4, 0]}>
        <mesh>
          <torusGeometry args={[1.7, 0.06, 8, 36]} />
          <meshStandardMaterial color={C} emissive={C} emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
        <mesh position={[1.7, 0, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#fde68a" emissive={C} emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      </group>
      <MonumentLabel position={[0, 8.4, 0]} color={C} text="🌐 MACRO" />
    </group>
  );
}

// ── Top-level component ──────────────────────────────────────────────

export default function KioskDecor() {
  const kiosks = useMemo(
    () => BUILDING_DEFS.filter((b) => OUTER_KIOSK_IDS.has(b.id)),
    []
  );
  const cityLayout = useGameStore((s) => s.cityLayout);
  const selectedBuildingId = useGameStore((s) => s.selectedBuildingId);
  const hoverPos = useGameStore((s) => s.hoverPos);
  return (
    <group>
      {kiosks.map((b) => {
        const [x, z] = effectiveXZ(b.position, b.id, cityLayout, selectedBuildingId, hoverPos);
        const [ux, uz] = towardCenter(x, z);
        // Place the prop 2.6u toward city center from the kiosk center.
        // The kiosk body has 0.9u half-width, so a 2.6u offset leaves
        // ~1.7u clear between kiosk wall and prop — fits inside the 8u lot.
        const px = x + ux * 2.6;
        const pz = z + uz * 2.6;
        const rotY = Math.atan2(ux, uz); // face away from kiosk (toward center)
        return (
          <group key={b.id}>
            {/* Plinth follows the kiosk so the paved tile moves with it. */}
            <group position={[x, 0, z]}>
              <KioskPlinth color={b.color} />
            </group>
            <group position={[px, 0, pz]} rotation={[0, rotY, 0]}>
              <KioskProp id={b.id} color={b.color} />
            </group>
          </group>
        );
      })}
      {/* Per-quarter signature monuments (Task #4) — visible from afar */}
      <FoundationsMonument position={[-13, -111]} />
      <BorrowingMonument position={[115, -115]} />
      <InvestingMonument position={[115, 115]} />
      <LifeEventsMonument position={[-115, 147]} />
      <ConsumerArch position={[0, -115]} />
      <MacroMonument position={[0, 115]} />
    </group>
  );
}
