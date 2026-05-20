import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const messages = [
  "💰 PAY YOUR\n  TAXES",
  "📈 BotCity\nINVESTS!",
  "🤖 BE A\nGOOD BOT",
  "💵 W-2 = YOUR\n  INCOME",
  "🏦 BANK\n  ON IT",
  "⚡ TAX SEASON\n IS NOW",
];

interface BillboardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  msgIndex: number;
}

function Billboard({ position, rotation, color, msgIndex }: BillboardProps) {
  const [currentMsg, setCurrentMsg] = useState(msgIndex % messages.length);
  const frameRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentMsg((c) => (c + 1) % messages.length);
    }, 3500 + (msgIndex % 3) * 700);
    return () => clearInterval(id);
  }, [msgIndex]);

  useFrame((state) => {
    if (frameRef.current) {
      const mat = frameRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.2 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.5;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Post */}
      <mesh position={[0, -2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 4, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      {/* Frame */}
      <mesh ref={frameRef} position={[0, 0, 0]}>
        <boxGeometry args={[3.5, 2.2, 0.15]} />
        <meshStandardMaterial color="#052e16" emissive={color} emissiveIntensity={1.2} metalness={0.5} />
      </mesh>
      {/* Inner glowing panel */}
      <mesh position={[0, 0, 0.09]}>
        <boxGeometry args={[3.2, 1.9, 0.02]} />
        <meshStandardMaterial color="#020617" emissive={color} emissiveIntensity={0.4} />
      </mesh>
      {/* Text */}
      <Text
        position={[0, 0, 0.12]}
        fontSize={0.32}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        maxWidth={3}
        textAlign="center"
      >
        {messages[currentMsg]}
      </Text>
    </group>
  );
}

const billboards: BillboardProps[] = [
  { position: [-12, 3, -12], rotation: [0, Math.PI / 4, 0], color: "#4ade80", msgIndex: 0 },
  { position: [12, 3, -12], rotation: [0, -Math.PI / 4, 0], color: "#fbbf24", msgIndex: 1 },
  { position: [-12, 3, 12], rotation: [0, (3 * Math.PI) / 4, 0], color: "#22c55e", msgIndex: 2 },
  { position: [12, 3, 12], rotation: [0, -(3 * Math.PI) / 4, 0], color: "#86efac", msgIndex: 3 },
  { position: [0, 3, -20], rotation: [0, 0, 0], color: "#4ade80", msgIndex: 4 },
  { position: [0, 3, 20], rotation: [0, Math.PI, 0], color: "#fbbf24", msgIndex: 5 },
];

// ─── GetMoneyBot.com brand billboards ────────────────────────────────
// Larger purple/cyan-glow billboards at the 4 cardinal edges, in the
// 7.9-unit gap between the outer ring street (±36) and the world bound
// (±45). They face inward toward the city center so they're visible from
// the main avenues. Taglines cycle through GMB brand copy.

const GMB_TAGLINES = [
  "TAX HACKS\n  DAILY",
  "FREE FILING\n  TOOLS",
  "JOIN 1M+ BOTS\n  ALREADY",
  "MAX YOUR\n  REFUND",
  "DEDUCTION\nFINDER AI",
];

interface GmbBillboardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  seed: number;
}

function GmbBillboard({ position, rotation, seed }: GmbBillboardProps) {
  const [tagIdx, setTagIdx] = useState(seed % GMB_TAGLINES.length);
  const frameRef = useRef<THREE.Mesh>(null!);
  const scanRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    const id = setInterval(() => {
      setTagIdx((c) => (c + 1) % GMB_TAGLINES.length);
    }, 4200 + (seed % 4) * 500);
    return () => clearInterval(id);
  }, [seed]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (frameRef.current) {
      const mat = frameRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.4 + Math.sin(t * 2.5 + seed) * 0.6;
    }
    // Scanline drifts vertically across the panel
    if (scanRef.current) {
      const y = ((t * 0.8 + seed * 0.3) % 2.6) - 1.3;
      scanRef.current.position.y = y;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Twin posts for the wide billboard */}
      <mesh position={[-1.8, -3, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 6, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} />
      </mesh>
      <mesh position={[1.8, -3, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 6, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} />
      </mesh>
      {/* Outer glowing frame (cyan) */}
      <mesh ref={frameRef} position={[0, 0, 0]}>
        <boxGeometry args={[5.4, 3.2, 0.2]} />
        <meshStandardMaterial
          color="#1e1b4b"
          emissive="#22d3ee"
          emissiveIntensity={1.5}
          metalness={0.55}
        />
      </mesh>
      {/* Inner panel (deep purple) */}
      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[5.05, 2.85, 0.02]} />
        <meshStandardMaterial color="#0b0823" emissive="#7c3aed" emissiveIntensity={0.5} />
      </mesh>
      {/* Drifting scanline */}
      <mesh ref={scanRef} position={[0, 0, 0.13]}>
        <planeGeometry args={[5.0, 0.12]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1.4}
          transparent
          opacity={0.35}
          toneMapped={false}
        />
      </mesh>
      {/* Brand mark (top) */}
      <Text
        position={[0, 1.0, 0.16]}
        fontSize={0.42}
        color="#22d3ee"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.035}
        outlineColor="#0b0823"
        maxWidth={5}
        textAlign="center"
      >
        💰 GETMONEYBOT
      </Text>
      {/* URL (small, under brand) */}
      <Text
        position={[0, 0.55, 0.16]}
        fontSize={0.2}
        color="#f9a8d4"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.018}
        outlineColor="#0b0823"
      >
        .COM
      </Text>
      {/* Rotating tagline (center/bottom) */}
      <Text
        position={[0, -0.4, 0.16]}
        fontSize={0.34}
        color="#fde047"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#7c3aed"
        maxWidth={4.8}
        textAlign="center"
      >
        {GMB_TAGLINES[tagIdx]}
      </Text>
    </group>
  );
}

// 4 cardinal billboards in the 7.9-unit outer ring → world edge gap.
// Each post bases sit at y=-3 below billboard center y=5, so post bottoms
// touch ground (y=0..6 vertical span). All clear of road bands.
const gmbBillboards: GmbBillboardProps[] = [
  // North edge — facing south (toward city center)
  { position: [0, 5, -40], rotation: [0, 0, 0], seed: 0 },
  // South edge — facing north
  { position: [0, 5, 40], rotation: [0, Math.PI, 0], seed: 1 },
  // West edge — facing east
  { position: [-40, 5, 0], rotation: [0, Math.PI / 2, 0], seed: 2 },
  // East edge — facing west
  { position: [40, 5, 0], rotation: [0, -Math.PI / 2, 0], seed: 3 },
];

export default function Billboards() {
  return (
    <group>
      {billboards.map((b, i) => (
        <Billboard key={`bb-${i}`} {...b} />
      ))}
      {gmbBillboards.map((b, i) => (
        <GmbBillboard key={`gmb-${i}`} {...b} />
      ))}
    </group>
  );
}
