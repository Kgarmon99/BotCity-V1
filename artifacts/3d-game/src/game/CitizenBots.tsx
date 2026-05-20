import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Billboard, Text } from "@react-three/drei";
import { MoneyBotModel, type MoneyBotAnim } from "./MoneyBotModel";

// Tax / finance one-liners the citizen bots chatter while wandering. Kept
// short (≤ ~60 chars) so the chat bubble doesn't dwarf the bot.
const CHATTER: string[] = [
  "Did you max your Roth IRA this year?",
  "401(k) match is free money — grab it!",
  "Bracket creep hit me again 😤",
  "Long-term capital gains > short-term, always.",
  "Standard deduction or itemize?",
  "Don't forget the EITC if you qualify!",
  "HSA: triple tax advantage 🏥",
  "529 plan for the little bots 👶",
  "Wash sale rule got me last April.",
  "Estimated taxes due April 15 / June 15 / Sep 15 / Jan 15",
  "Bonds laddered, stocks indexed, sleep soundly 😴",
  "Compound interest = 8th wonder of the world",
  "Filed an extension, not a forgiveness.",
  "Cap gains harvesting before year-end!",
  "Mega backdoor Roth? Talk to HR.",
  "Section 179 = instant write-off 🚜",
  "Mileage log or actual expenses?",
  "Audit-proof your receipts!",
  "Tax-loss harvesting saved my year.",
  "FSA money expires — use it!",
  "Inflation is a tax nobody voted for.",
  "Diversify, don't gamble.",
  "Dollar-cost averaging > timing the market.",
  "Read the prospectus. Yes, all of it.",
  "Credits > deductions, every time.",
  "Saver's Credit if your AGI is low!",
  "QBI deduction — 20% off pass-through income.",
  "Don't sleep on the dependent care FSA.",
  "RMDs start at 73 now. Plan ahead!",
  "Beep boop, your fridge is a depreciating asset.",
];

function ChatBubble({ text, y }: { text: string; y: number }) {
  // Width auto-derived from the message length so short quips don't get a
  // huge plane behind them. (Each char ≈ 0.13 world units at fontSize 0.28.)
  const width = useMemo(() => Math.min(7, Math.max(2.4, text.length * 0.14 + 0.6)), [text]);
  return (
    <Billboard position={[0, y, 0]}>
      {/* Backing plate */}
      <mesh>
        <planeGeometry args={[width, 0.9]} />
        <meshBasicMaterial color="#0b1220" transparent opacity={0.85} depthWrite={false} />
      </mesh>
      {/* Border / glow */}
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[width + 0.12, 1.02]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.28}
        color="#86efac"
        anchorX="center"
        anchorY="middle"
        maxWidth={width - 0.3}
        outlineWidth={0.015}
        outlineColor="#0b1220"
      >
        {text}
      </Text>
      {/* Speech-bubble tail */}
      <mesh position={[-width * 0.25, -0.55, 0]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial color="#0b1220" transparent opacity={0.85} depthWrite={false} />
      </mesh>
    </Billboard>
  );
}

// Wandering MoneyBot citizens. The GLB doesn't ship a walk cycle, so we
// style them as hovering courier bots — small bob + ground glow. They patrol
// loops of waypoints along the main avenues so the city feels alive without
// blocking foot traffic on the plaza or building approaches.

interface Citizen {
  /** Closed loop of (x, z) waypoints — the bot interpolates between them. */
  waypoints: Array<[number, number]>;
  /** World units per second. */
  speed: number;
  scale: number;
  /** Static animation pose held while moving (no walk cycle in the GLB). */
  anim: MoneyBotAnim;
  /** Phase offset so duplicate poses don't beat in unison. */
  phase: number;
  /** Hover height baseline (the bot bobs around this y). */
  hover: number;
}

function CitizenBot({ waypoints, speed, scale, anim, phase, hover }: Citizen) {
  const groupRef = useRef<THREE.Group>(null!);
  const innerRef = useRef<THREE.Group>(null!);
  const segIdx = useRef(0);
  const segT = useRef(phase % 1);
  const yawRef = useRef(0);

  // Chatter state — each bot independently cycles between "say a line" and
  // "stay quiet". Visible for ~4s, hidden for ~6-10s, then picks a new line.
  // `chatRef` mirrors `chat` so the useFrame timer can decide what to do next
  // without depending on the React state updater (which is scheduled async).
  // That avoids stacking `setChat` calls across frames before React flushes.
  const [chat, setChat] = useState<string | null>(null);
  const chatRef = useRef<string | null>(null);
  // Stagger the initial silence so 6 bots don't all start talking at once.
  const nextChangeRef = useRef(2 + phase * 8 + Math.random() * 4);

  useFrame((state, delta) => {
    // Chat scheduler — refs only, with exactly one setChat per threshold cross.
    nextChangeRef.current -= delta;
    if (nextChangeRef.current <= 0) {
      if (chatRef.current === null) {
        // Pick a fresh line, hold for ~4 seconds
        const line = CHATTER[Math.floor(Math.random() * CHATTER.length)];
        chatRef.current = line;
        nextChangeRef.current = 3.5 + Math.random() * 1.5;
        setChat(line);
      } else {
        // Go quiet for 6–10 seconds
        chatRef.current = null;
        nextChangeRef.current = 6 + Math.random() * 4;
        setChat(null);
      }
    }

    if (waypoints.length < 2) return;
    const i = segIdx.current;
    const next = (i + 1) % waypoints.length;
    const [ax, az] = waypoints[i];
    const [bx, bz] = waypoints[next];
    const dx = bx - ax;
    const dz = bz - az;
    const segLen = Math.hypot(dx, dz) || 0.0001;
    segT.current += (speed * delta) / segLen;
    while (segT.current >= 1) {
      segT.current -= 1;
      segIdx.current = (segIdx.current + 1) % waypoints.length;
    }
    const i2 = segIdx.current;
    const n2 = (i2 + 1) % waypoints.length;
    const [a2x, a2z] = waypoints[i2];
    const [b2x, b2z] = waypoints[n2];
    const x = a2x + (b2x - a2x) * segT.current;
    const z = a2z + (b2z - a2z) * segT.current;
    const heading = Math.atan2(b2x - a2x, b2z - a2z);
    yawRef.current = THREE.MathUtils.lerp(yawRef.current, heading, 0.1);
    const t = state.clock.elapsedTime + phase * 7;
    if (groupRef.current) {
      groupRef.current.position.set(x, hover + Math.sin(t * 2.5) * 0.12, z);
      groupRef.current.rotation.y = yawRef.current;
    }
    if (innerRef.current) {
      // Subtle lean into the direction of travel.
      innerRef.current.rotation.x = Math.sin(t * 2.5) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground glow under the hovering bot */}
      <mesh position={[0, -hover + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.7, 18]} />
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.32}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <group ref={innerRef}>
        <MoneyBotModel scale={scale} animation={anim} phase={phase} />
      </group>
      {chat && <ChatBubble text={chat} y={2 + scale * 1.8} />}
    </group>
  );
}

// Loops are biased to the main east-west and north-south avenues (z=0, x=0)
// plus a couple of plaza laps. Stays away from building footprints.
const CITIZENS: Citizen[] = [
  // East-west promenade (z = -2, just south of the main avenue median)
  {
    waypoints: [
      [-32, -2],
      [32, -2],
    ],
    speed: 2.4,
    scale: 0.55,
    anim: "Idle",
    phase: 0.0,
    hover: 0.5,
  },
  {
    waypoints: [
      [30, 2],
      [-30, 2],
    ],
    speed: 2.0,
    scale: 0.6,
    anim: "LeftHand",
    phase: 0.35,
    hover: 0.4,
  },
  // North-south promenade (x = ±2 lanes)
  {
    waypoints: [
      [-2, -30],
      [-2, 30],
    ],
    speed: 2.2,
    scale: 0.5,
    anim: "Idle",
    phase: 0.6,
    hover: 0.45,
  },
  {
    waypoints: [
      [2, 30],
      [2, -30],
    ],
    speed: 1.8,
    scale: 0.55,
    anim: "RightHand",
    phase: 0.15,
    hover: 0.55,
  },
  // Inner plaza orbit (around the center, clear of statues at ±18)
  {
    waypoints: [
      [6, 6],
      [-6, 6],
      [-6, -6],
      [6, -6],
    ],
    speed: 1.6,
    scale: 0.5,
    anim: "Idle",
    phase: 0.25,
    hover: 0.4,
  },
  // Outer-ring courier (clears all buildings by staying near ±32 band)
  {
    waypoints: [
      [-32, 32],
      [32, 32],
      [32, -32],
      [-32, -32],
    ],
    speed: 3.0,
    scale: 0.55,
    anim: "Idle",
    phase: 0.8,
    hover: 0.5,
  },
];

export default function CitizenBots() {
  return (
    <group>
      {CITIZENS.map((c, i) => (
        <CitizenBot key={`citizen-${i}`} {...c} />
      ))}
    </group>
  );
}
