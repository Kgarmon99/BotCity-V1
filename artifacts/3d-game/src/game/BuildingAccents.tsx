import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// =====================================================================
// Per-building rooftop / facade ornaments.
// =====================================================================
// Each accent is positioned in WORLD coordinates so the file can be
// dropped into the scene as a single mount. The base box for every
// building is rendered by Building.tsx from BUILDING_DEFS; these
// components add the architectural identity that a plain prism can't
// carry by itself (helipads, domes, clock towers, neon, parapets, etc.).
//
// Footprint reference (center XZ from BUILDING_DEFS):
//   workcorp        (8,-10)   5x4  h=6   top y=6
//   taxmart         (-9,-8)   6x5  h=4   top y=4
//   firstbank       (9,9)     5x4  h=5   top y=5
//   irs             (-9,9)    5x4  h=6   top y=6
//   bottrain        (14,12)   4x4  h=5   top y=5
//   moneybottowers  (13,-13)  4x4  h=12  top y=12
//   bothospital     (5,-27)   5x4  h=5   top y=5
//   botcityhall     (13,-30)  5x4  h=10  top y=10
//   botcrypto       (27,-5)   5x4  h=5   top y=5
//   botcharity      (-27,5)   5x4  h=5   top y=5
//   littlebots      (12,27)   5x4  h≈3.6 top y=3.6
//   botretirement   (-5,27)   5x4  h=5   top y=5

// ----- WorkCorp: rooftop AC compressors + solar array. -----
function WorkCorpAccent() {
  return (
    <group position={[8, 6, -10]}>
      {/* AC compressor row */}
      <mesh position={[-1.5, 0.35, 0.8]} castShadow>
        <boxGeometry args={[0.9, 0.7, 0.9]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.4} />
      </mesh>
      <mesh position={[-0.2, 0.35, 0.8]} castShadow>
        <boxGeometry args={[0.9, 0.7, 0.9]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.4} />
      </mesh>
      {/* Fans on top of each compressor */}
      <mesh position={[-1.5, 0.71, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.04, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[-0.2, 0.71, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.04, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Tilted solar panels */}
      <mesh position={[1.2, 0.3, -0.6]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[1.6, 0.06, 1.0]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.7} emissive="#1e40af" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[1.2, 0.3, 0.6]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[1.6, 0.06, 1.0]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.7} emissive="#1e40af" emissiveIntensity={0.2} />
      </mesh>
      {/* Service hatch */}
      <mesh position={[0, 0.06, -1.5]}>
        <boxGeometry args={[0.7, 0.12, 0.7]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </group>
  );
}

// ----- TaxMart: rooftop neon sign + parapet wall. -----
function TaxMartAccent() {
  return (
    <group position={[-9, 4, -8]}>
      {/* Parapet wall around the perimeter (slightly inset from the 6x5 footprint) */}
      <mesh position={[0, 0.25, 2.4]}>
        <boxGeometry args={[5.8, 0.5, 0.15]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      <mesh position={[0, 0.25, -2.4]}>
        <boxGeometry args={[5.8, 0.5, 0.15]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      <mesh position={[2.9, 0.25, 0]}>
        <boxGeometry args={[0.15, 0.5, 4.8]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      <mesh position={[-2.9, 0.25, 0]}>
        <boxGeometry args={[0.15, 0.5, 4.8]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      {/* Neon sign frame (S facade) */}
      <mesh position={[0, 1.2, 2.1]} castShadow>
        <boxGeometry args={[4.6, 1.1, 0.14]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
      <Text position={[0, 1.2, 2.19]} fontSize={0.55} color="#fbbf24" anchorX="center" anchorY="middle">
        TAXMART
      </Text>
      {/* Sign struts */}
      <mesh position={[-1.8, 0.7, 2.1]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[1.8, 0.7, 2.1]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </group>
  );
}

// ----- FirstBank: rooftop dome + glowing gold "$" finial. -----
function FirstBankAccent() {
  const finialRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (finialRef.current) {
      const t = state.clock.elapsedTime;
      const m = finialRef.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1.0 + Math.sin(t * 1.8) * 0.4;
    }
  });
  return (
    <group position={[9, 5, 9]}>
      {/* Dome drum */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[1.3, 1.5, 0.5, 16]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      {/* Half-sphere dome */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[1.3, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Finial spire */}
      <mesh position={[0, 1.9, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.8, 6]} />
        <meshStandardMaterial color="#fde047" metalness={0.8} />
      </mesh>
      {/* Glowing $ orb */}
      <mesh ref={finialRef} position={[0, 2.45, 0]}>
        <sphereGeometry args={[0.22, 14, 12]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* Entrance columns on south facade. firstbank depth=4 → south face
          at world z=11. Column radius 0.18 must clear that, so center at
          local z=1.8 (world z=10.8, outer edge z=10.98 ≤ face). */}
      <mesh position={[-1.5, -2.3, 1.8]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 4.6, 12]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[1.5, -2.3, 1.8]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 4.6, 12]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
    </group>
  );
}

// ----- IRS: flagpole with a slowly waving flag. -----
function IRSAccent() {
  const flagRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (flagRef.current) {
      // Subtle ripple via Z rotation; no per-frame allocation.
      flagRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.6) * 0.08;
    }
  });
  return (
    <group position={[-9, 6, 9]}>
      {/* Stepped parapet */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[4.6, 0.3, 3.6]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3.2, 0.3, 2.4]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      {/* Flagpole */}
      <mesh position={[1.2, 1.9, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3.0, 8]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Flag — three horizontal stripes (no real cloth sim, just panels) */}
      <group ref={flagRef} position={[1.2, 3.0, 0]}>
        <mesh position={[0.6, 0.2, 0]}>
          <boxGeometry args={[1.2, 0.18, 0.04]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[1.2, 0.18, 0.04]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0.6, -0.2, 0]}>
          <boxGeometry args={[1.2, 0.18, 0.04]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
      </group>
      {/* Pole finial */}
      <mesh position={[1.2, 3.5, 0]}>
        <sphereGeometry args={[0.08, 10, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} />
      </mesh>
    </group>
  );
}

// ----- BotTrain: rooftop clock tower with rotating hour/minute hands. -----
function BotTrainAccent() {
  const hourRef = useRef<THREE.Mesh>(null!);
  const minuteRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (hourRef.current && minuteRef.current) {
      const t = state.clock.elapsedTime;
      // 60x sped up so the player can see it tick.
      minuteRef.current.rotation.z = -t * 0.5;
      hourRef.current.rotation.z = -t * 0.5 / 12;
    }
  });
  return (
    <group position={[14, 5, 12]}>
      {/* Clock tower box */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[1.5, 1.8, 1.5]} />
        <meshStandardMaterial color="#0f766e" />
      </mesh>
      {/* Pyramid roof */}
      <mesh position={[0, 2.1, 0]} castShadow>
        <coneGeometry args={[1.1, 0.9, 4]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      {/* Clock face on each side */}
      {[
        [0, 0.9, 0.76, 0],
        [0, 0.9, -0.76, Math.PI],
        [0.76, 0.9, 0, Math.PI / 2],
        [-0.76, 0.9, 0, -Math.PI / 2],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, r, 0]}>
          <circleGeometry args={[0.55, 24]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.5} toneMapped={false} />
        </mesh>
      ))}
      {/* Front-facing hands (only one face animates — the others are decorative) */}
      <mesh ref={hourRef} position={[0, 0.9, 0.77]}>
        <boxGeometry args={[0.06, 0.3, 0.02]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh ref={minuteRef} position={[0, 0.9, 0.78]}>
        <boxGeometry args={[0.04, 0.45, 0.02]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Tower finial */}
      <mesh position={[0, 2.65, 0]}>
        <sphereGeometry args={[0.1, 10, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} />
      </mesh>
    </group>
  );
}

// ----- MoneyBotTowers: helipad with rotating "H" + warning lights. -----
function MoneyBotTowersAccent() {
  const beaconRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (beaconRef.current) {
      const t = state.clock.elapsedTime;
      const m = beaconRef.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.6 + (Math.sin(t * 2.4) > 0 ? 1.4 : 0);
    }
  });
  return (
    <group position={[13, 12, -13]}>
      {/* Helipad disk */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.6, 24]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Painted ring */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.55, 32]} />
        <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.6} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* "H" letter on the pad */}
      <mesh position={[-0.35, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.18, 1.0]} />
        <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
      <mesh position={[0.35, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.18, 1.0]} />
        <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[0.18, 0.7]} />
        <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
      {/* Corner warning lights */}
      {[
        [1.4, 0.12, 1.4],
        [-1.4, 0.12, 1.4],
        [1.4, 0.12, -1.4],
        [-1.4, 0.12, -1.4],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.9} toneMapped={false} />
        </mesh>
      ))}
      {/* Aviation beacon mast */}
      <mesh position={[0, 0.9, -1.6]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 1.6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh ref={beaconRef} position={[0, 1.75, -1.6]}>
        <sphereGeometry args={[0.14, 10, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ----- BotHospital: red cross sign + small helipad. -----
function BotHospitalAccent() {
  return (
    <group position={[5, 5, -27]}>
      {/* Small helipad behind the cross */}
      <mesh position={[0, 0.04, -0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.0, 20]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 0.06, -0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 0.95, 24]} />
        <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.4} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* Red cross — two glowing bars perpendicular */}
      <mesh position={[0, 0.6, 1.4]} castShadow>
        <boxGeometry args={[1.4, 0.35, 0.12]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.6, 1.4]} castShadow>
        <boxGeometry args={[0.35, 1.4, 0.12]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      {/* Sign mast */}
      <mesh position={[0, 0.1, 1.4]}>
        <boxGeometry args={[0.1, 0.2, 0.1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </group>
  );
}

// ----- BotCityHall: domed roof + colonnade on south facade. -----
// cityhall: pos (13, 5, -30), w=5 d=6 h=8 → top y=9, south face z=-27.
function BotCityHallAccent() {
  return (
    <group position={[13, 9, -30]}>
      {/* Drum */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.7, 0.7, 18]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
      {/* Dome */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[1.5, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#15803d" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Finial */}
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.9, 6]} />
        <meshStandardMaterial color="#fde047" metalness={0.8} />
      </mesh>
      <mesh position={[0, 2.85, 0]}>
        <coneGeometry args={[0.15, 0.3, 6]} />
        <meshStandardMaterial color="#fde047" metalness={0.8} />
      </mesh>
      {/* Colonnade tight against south facade. South face at local z=3
          (world -27). Column radius 0.18 → center at local z=2.7. */}
      {[-1.6, -0.5, 0.5, 1.6].map((x) => (
        <mesh key={x} position={[x, -3.5, 2.7]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 5, 10]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      ))}
      {/* Architrave above the columns — flat lintel, no cone */}
      <mesh position={[0, -0.9, 2.7]}>
        <boxGeometry args={[3.6, 0.35, 0.18]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
    </group>
  );
}

// ----- BotCrypto: rooftop hologram disc + slow-spinning gear. -----
function BotCryptoAccent() {
  const ringRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.6;
    }
  });
  // botcrypto: pos (27, 2.5, -5), h=6 → roof top y=5.5
  return (
    <group position={[27, 5.5, -5]}>
      {/* Hologram base disk */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
      {/* Spinning glyph ring */}
      <group ref={ringRef} position={[0, 0.8, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.0, 0.06, 8, 32]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.7, 0.05, 8, 24]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
      </group>
      {/* Floating coin */}
      <mesh position={[0, 1.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 0.08, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.7} metalness={0.9} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ----- BotCharity: rooftop pulsing heart sign. -----
function BotCharityAccent() {
  const heartGroupRef = useRef<THREE.Group>(null!);
  const lobeLRef = useRef<THREE.Mesh>(null!);
  const lobeRRef = useRef<THREE.Mesh>(null!);
  const pointRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 2.0) * 0.07;
    const emiss = 0.9 + Math.sin(t * 2.0) * 0.5;
    if (heartGroupRef.current) heartGroupRef.current.scale.setScalar(pulse);
    const mL = lobeLRef.current?.material as THREE.MeshStandardMaterial | undefined;
    const mR = lobeRRef.current?.material as THREE.MeshStandardMaterial | undefined;
    const mP = pointRef.current?.material as THREE.MeshStandardMaterial | undefined;
    if (mL) mL.emissiveIntensity = emiss;
    if (mR) mR.emissiveIntensity = emiss;
    if (mP) mP.emissiveIntensity = emiss;
  });
  return (
    <group position={[-27, 5, 5]}>
      {/* Sign backplate */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[2.4, 1.5, 0.1]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
      {/* Heart = two spheres + a cone, all wrapped so the group can pulse */}
      <group ref={heartGroupRef} position={[0, 0.7, 0.1]}>
        <mesh ref={lobeLRef} position={[-0.3, 0.15, 0]}>
          <sphereGeometry args={[0.35, 14, 12]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.1} toneMapped={false} />
        </mesh>
        <mesh ref={lobeRRef} position={[0.3, 0.15, 0]}>
          <sphereGeometry args={[0.35, 14, 12]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.1} toneMapped={false} />
        </mesh>
        <mesh ref={pointRef} position={[0, -0.55, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.55, 0.95, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.1} toneMapped={false} />
        </mesh>
      </group>
      {/* Sign legs */}
      <mesh position={[-1, 0, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[1, 0, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </group>
  );
}

// ----- LittleBots Daycare: balloons tied to roof. -----
function LittleBotsAccent() {
  // littlebots: pos (12, 1.8, 27), h=3 → roof top y=3.3.
  const balloonsRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (balloonsRef.current) {
      balloonsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
      balloonsRef.current.position.y = 3.3 + Math.sin(state.clock.elapsedTime * 0.9) * 0.08;
    }
  });
  return (
    <group position={[12, 0, 27]}>
      {/* Anchor point on roof */}
      <mesh position={[0, 3.3, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <group ref={balloonsRef} position={[0, 3.3, 0]}>
        {[
          ["#f472b6", -0.4, 1.4, 0.2],
          ["#60a5fa", 0.3, 1.6, -0.1],
          ["#fbbf24", -0.1, 1.9, 0.4],
          ["#a78bfa", 0.4, 1.3, -0.4],
        ].map(([c, x, y, z], i) => (
          <group key={i} position={[x as number, y as number, z as number]}>
            <mesh castShadow>
              <sphereGeometry args={[0.32, 14, 12]} />
              <meshStandardMaterial color={c as string} emissive={c as string} emissiveIntensity={0.4} toneMapped={false} />
            </mesh>
            {/* String down to anchor */}
            <mesh position={[0, -(y as number) / 2, 0]}>
              <cylinderGeometry args={[0.01, 0.01, y as number, 4]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          </group>
        ))}
      </group>
      {/* Small chimney puff cloud */}
      <mesh position={[1.5, 3.8, 0]}>
        <sphereGeometry args={[0.32, 12, 10]} />
        <meshStandardMaterial color="#f8fafc" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

// ----- BotRetirement: rooftop greenhouse with garden. -----
function BotRetirementAccent() {
  return (
    <group position={[-5, 5, 27]}>
      {/* Greenhouse glass */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[2.4, 0.9, 1.6]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.55} metalness={0.3} />
      </mesh>
      {/* Pitched glass roof */}
      <mesh position={[0, 1.05, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.5, 0.5, 4]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.55} />
      </mesh>
      {/* Plant pots peeking out */}
      <mesh position={[-0.8, 0.55, 0.5]}>
        <sphereGeometry args={[0.18, 10, 8]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <mesh position={[0.8, 0.55, -0.5]}>
        <sphereGeometry args={[0.18, 10, 8]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
      <mesh position={[0, 0.55, 0.5]}>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color="#84cc16" />
      </mesh>
      {/* Small bench beside greenhouse */}
      <mesh position={[1.5, 0.25, 0]} castShadow>
        <boxGeometry args={[0.6, 0.08, 1.2]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
    </group>
  );
}

export default function BuildingAccents() {
  return (
    <group>
      <WorkCorpAccent />
      <TaxMartAccent />
      <FirstBankAccent />
      <IRSAccent />
      <BotTrainAccent />
      <MoneyBotTowersAccent />
      <BotHospitalAccent />
      <BotCityHallAccent />
      <BotCryptoAccent />
      <BotCharityAccent />
      <LittleBotsAccent />
      <BotRetirementAccent />
    </group>
  );
}
