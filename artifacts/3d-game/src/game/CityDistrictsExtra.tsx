import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// =====================================================================
// EDUCATION ROW @ z=75 — three K-12 schools in a row along the north
// edge of the city. Buildings are sized PROGRESSIVELY (Elementary →
// Middle → High) to reflect the K-12 progression:
//   bothigh         (22, 75)  — 9×6 h8 footprint, x[17.5..26.5], z[72..78]
//   botmiddle       (40, 75)  — 7×5 h6 footprint, x[36.5..43.5], z[72.5..77.5]
//   botelementary   (55, 75)  — 5×4 h4 footprint, x[52.5..57.5], z[73..77]
// The components below add school-specific yards (football field with
// bleachers + scoreboard at High; basketball court + scoreboard at
// Middle; playground + swings + bus at Elementary). All decor anchors
// south of the building footprint to clear the larger buildings.
// =====================================================================

function SchoolBus({ position, color = "#fde047" }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[3, 1.2, 1.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Black stripe */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[3.02, 0.15, 1.22]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* Windshield */}
      <mesh position={[1.45, 0.85, 0]}>
        <boxGeometry args={[0.1, 0.5, 1.0]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.2} />
      </mesh>
      {/* Side windows */}
      {[-0.9, -0.3, 0.3, 0.9].map((x) => (
        <mesh key={`bw-${x}`} position={[x, 0.95, 0.62]}>
          <boxGeometry args={[0.45, 0.4, 0.02]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.2} />
        </mesh>
      ))}
      {/* Wheels */}
      {[[-1.0, -0.6], [1.0, -0.6], [-1.0, 0.6], [1.0, 0.6]].map(([x, z], i) => (
        <mesh key={`wh-${i}`} position={[x, 0.25, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 12]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      ))}
    </group>
  );
}

function Flagpole({ position }: { position: [number, number, number] }) {
  const flagRef = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(s.clock.elapsedTime * 2) * 0.3;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 6, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} />
      </mesh>
      <mesh position={[0, 5.95, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} />
      </mesh>
      <mesh ref={flagRef} position={[0, 5.4, 0]}>
        <group position={[0.55, 0, 0]}>
          <mesh>
            <planeGeometry args={[1.1, 0.7]} />
            <meshStandardMaterial color="#dc2626" side={THREE.DoubleSide} />
          </mesh>
        </group>
      </mesh>
    </group>
  );
}

function HighSchool() {
  // Anchored at world (22, 0, 75). Largest school: building x[17.5..26.5],
  // z[72..78]. Field anchored at local z=+8 (world z=83) — 5u south
  // of building's south edge. Field 14×9 covers world z[78.5,87.5].
  // All decor stays at local z>=+3.5 to clear the larger building.
  const scoreboardRef = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (scoreboardRef.current) {
      const mat = scoreboardRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.4 + Math.sin(s.clock.elapsedTime * 2.5) * 0.4;
    }
  });
  return (
    <group position={[22, 0, 75]}>
      {/* Football-field lawn — much bigger (14×9), south of the building */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 8]} receiveShadow>
        <planeGeometry args={[14, 9]} />
        <meshStandardMaterial color="#16a34a" roughness={0.9} />
      </mesh>
      {/* Yard lines on the field (8 lines across the 9-deep field) */}
      {[-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((zx) => (
        <mesh
          key={`yl-${zx}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[zx * 1.7, 0.025, 8]}
        >
          <planeGeometry args={[0.12, 9]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.2} />
        </mesh>
      ))}
      {/* Midfield logo circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 8]}>
        <ringGeometry args={[1.2, 1.35, 32]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.6} />
      </mesh>
      {/* Goalposts (two H-frames at the field ends) */}
      {[3.7, 12.3].map((z, i) => (
        <group key={`gp-${i}`} position={[0, 0, z]}>
          <mesh position={[0, 1.4, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 2.8, 8]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, 2.8, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 3, 8]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.4} />
          </mesh>
          {[-1.5, 1.5].map((x) => (
            <mesh key={`u-${x}`} position={[x, 3.6, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 1.6, 8]} />
              <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.4} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Bleachers — tiered benches along both sides of the field */}
      {[-5.4, 5.4].map((bx, bi) => (
        <group key={`bl-${bi}`} position={[bx, 0, 8]}>
          {[0, 1, 2].map((tier) => (
            <mesh key={`tier-${tier}`} position={[bi === 0 ? -tier * 0.35 : tier * 0.35, 0.4 + tier * 0.45, 0]}>
              <boxGeometry args={[0.7, 0.12, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.4} />
            </mesh>
          ))}
          {/* Bleacher supports */}
          {[-3, 0, 3].map((sz, j) => (
            <mesh key={`bsup-${j}`} position={[0, 0.5, sz]}>
              <boxGeometry args={[1.0, 1.0, 0.15]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
          ))}
        </group>
      ))}
      {/* Scoreboard at the south end of the field */}
      <group position={[0, 0, 13.5]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[0.4, 3, 0.4]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[-1.2, 1.5, 0]}>
          <boxGeometry args={[0.4, 3, 0.4]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[1.2, 1.5, 0]}>
          <boxGeometry args={[0.4, 3, 0.4]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh ref={scoreboardRef} position={[0, 3.6, 0]}>
          <boxGeometry args={[3.4, 1.4, 0.25]} />
          <meshStandardMaterial color="#0b1220" emissive="#22d3ee" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        <Text position={[0, 3.7, 0.14]} fontSize={0.42} color="#fde047" anchorX="center" outlineWidth={0.04} outlineColor="#0b1220">
          HOME 21 · AWAY 14
        </Text>
        <Text position={[0, 3.15, 0.14]} fontSize={0.16} color="#22d3ee" anchorX="center">
          Q4 · 02:14
        </Text>
      </group>
      {/* Flagpole + flag — SW corner of field, south of building */}
      <Flagpole position={[-7, 0, 4]} />
      {/* Sign — bigger to match a larger school */}
      <Text
        position={[0, 6.2, 3.1]}
        fontSize={0.65}
        color="#f59e0b"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#0b1220"
      >
        🎓 BOT HIGH
      </Text>
      <Text
        position={[0, 5.45, 3.1]}
        fontSize={0.26}
        color="#f8fafc"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#0b1220"
      >
        Home of the Compilers · Grades 9-12
      </Text>
    </group>
  );
}

function MiddleSchool() {
  // Anchored at world (40, 0, 75). Mid-sized: building x[36.5..43.5],
  // z[72.5..77.5]. Court anchored at local z=+6 (world z=81) — 3.5u
  // south of building south edge. Court 7×5 covers world z[78.5,83.5].
  // All decor stays at local z>=+3 to clear the larger building.
  return (
    <group position={[40, 0, 75]}>
      {/* Basketball full court south of the building (bigger 7×5) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 6]} receiveShadow>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color="#b45309" roughness={0.85} />
      </mesh>
      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 6]}>
        <ringGeometry args={[0.9, 1.0, 24]} />
        <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} />
      </mesh>
      {/* Halfcourt line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 6]}>
        <planeGeometry args={[7, 0.1]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Perimeter line (tightened so envelope stays south of building) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.024, 6]}>
        <ringGeometry args={[2.9, 3.1, 4]} />
        <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} />
      </mesh>
      {/* Two hoops, one at each end */}
      {[3.6, 8.4].map((hz, i) => (
        <group key={`hoop-${i}`} position={[0, 0, hz]}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 3, 8]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          <mesh position={[0, 2.9, i === 0 ? 0.25 : -0.25]}>
            <boxGeometry args={[1.2, 0.7, 0.05]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 2.7, i === 0 ? 0.5 : -0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.25, 0.04, 8, 24]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}
      {/* Mini scoreboard pole on west sideline */}
      <group position={[-4, 0, 6]}>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 2.8, 6]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0, 2.6, 0]}>
          <boxGeometry args={[1.4, 0.8, 0.18]} />
          <meshStandardMaterial color="#0b1220" emissive="#22d3ee" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
        <Text position={[0, 2.6, 0.1]} fontSize={0.22} color="#fde047" anchorX="center" outlineWidth={0.02} outlineColor="#0b1220">
          42 · 38
        </Text>
      </group>
      {/* Picnic tables — south of court, clear of enlarged building */}
      {[-2.5, 0, 2.5].map((x) => (
        <group key={`pt-${x}`} position={[x, 0, 10]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.2, 0.1, 0.6]} />
            <meshStandardMaterial color="#92400e" />
          </mesh>
          {[-0.45, 0.45].map((xz) => (
            <mesh key={`l-${xz}`} position={[xz, 0.25, 0]}>
              <boxGeometry args={[0.08, 0.5, 0.6]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
          ))}
        </group>
      ))}
      {/* Bike rack — south of court */}
      <group position={[3.2, 0, 10]}>
        {[-0.5, 0, 0.5].map((bx, i) => (
          <mesh key={`bk-${i}`} position={[bx, 0.35, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.3, 0.04, 6, 16, Math.PI]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
        ))}
      </group>
      {/* Flagpole — west of court, south of building */}
      <Flagpole position={[-5, 0, 9]} />
      {/* Sign — sized between Elementary and High */}
      <Text
        position={[0, 5, 2.7]}
        fontSize={0.5}
        color="#f87171"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#0b1220"
      >
        🏫 BOT MIDDLE
      </Text>
      <Text
        position={[0, 4.45, 2.7]}
        fontSize={0.21}
        color="#f8fafc"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#0b1220"
      >
        Grades 6 · 7 · 8
      </Text>
    </group>
  );
}

function ElementarySchool() {
  // Anchored at world (55, 0, 75). x[52.5..57.5], z[73..77].
  const swingRef = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (swingRef.current) {
      swingRef.current.rotation.x = Math.sin(s.clock.elapsedTime * 1.5) * 0.4;
    }
  });
  return (
    <group position={[55, 0, 75]}>
      {/* Bright playground turf — pushed south to z=4.5 so its north edge
          (z=2.25) clears the building's south face (z=2.0) by 0.25u. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 4.5]}>
        <planeGeometry args={[6, 4.5]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.95} />
      </mesh>
      {/* Hopscotch grid */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={`hs-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-2.2, 0.03, 2.5 + i * 0.65]}
        >
          <planeGeometry args={[0.55, 0.55]} />
          <meshStandardMaterial
            color={["#ef4444", "#3b82f6", "#22c55e", "#a855f7"][i]}
            emissive={["#ef4444", "#3b82f6", "#22c55e", "#a855f7"][i]}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      {/* Slide */}
      <group position={[1.5, 0, 3]}>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[0.8, 2, 0.8]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.8, 1, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.1, 2.2, 0.8]} />
          <meshStandardMaterial color="#fde047" />
        </mesh>
      </group>
      {/* Swings (animated) */}
      <group position={[-0.5, 0, 5]}>
        {/* Frame */}
        <mesh position={[-1, 1.5, 0]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.5} />
        </mesh>
        <mesh position={[1, 1.5, 0]} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.5} />
        </mesh>
        <mesh position={[0, 2.3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.5} />
        </mesh>
        {/* Swing seats */}
        <group ref={swingRef} position={[0, 2.3, 0]}>
          {[-0.5, 0.5].map((x) => (
            <group key={`sw-${x}`} position={[x, 0, 0]}>
              <mesh position={[0, -0.85, 0]}>
                <boxGeometry args={[0.4, 0.05, 0.2]} />
                <meshStandardMaterial color="#dc2626" />
              </mesh>
              <mesh position={[0, -0.4, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
            </group>
          ))}
        </group>
      </group>
      {/* School bus parked at front — moved east from x=3.5 to x=4.5 so its
          west edge (x=3.0) clears the building's east face (x=2.5) by 0.5u. */}
      <SchoolBus position={[4.5, 0, -2]} />
      <Flagpole position={[-3, 0, -1]} />
      {/* Sign */}
      <Text
        position={[0, 3.5, 2.4]}
        fontSize={0.38}
        color="#ef4444"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#0b1220"
      >
        ✏️ BOT ELEMENTARY
      </Text>
      <Text
        position={[0, 3.1, 2.4]}
        fontSize={0.17}
        color="#0b1220"
        anchorX="center"
        anchorY="middle"
      >
        K · 1 · 2 · 3 · 4 · 5
      </Text>
    </group>
  );
}

// =====================================================================
// GOLF COURSE @ (-58, 0, -85) — clubhouse + driving range + 18 holes
// Footprint envelope: world x[-64..-24], z[-103..-87]
// NW-quadrant location near BotFarm; see GolfCourse() header for the
// full clearance breakdown.
// =====================================================================

function GolfCourse() {
  // Expanded BotGolf Country Club. Anchor world (-38, 0, -85).
  // Decor envelope: world x[-64..-24], z[-103..-87].
  // Relocated to the NW quadrant near BotFarm (-60,-61.5), out of the
  // BotPlane airport footprint entirely. Conflict checks:
  //   • BotFarm (-60,-61.5) → 25u north of CC envelope z=-87. clear.
  //   • BotMine (-75,-37.5) → far north. clear.
  //   • BotPark visitor center (-92,-78) + decor (lake ~(-85,-84),
  //     mountains z<-94) → CC envelope x_min=-64 is 19u east of lake;
  //     mountains all south of z=-94 → CC north edge z=-87 has 7u gap.
  //   • BotSoccer kiosk (-40.5,-76), stadium center (-27,-55) → kiosk
  //     z=-76 sits 11u north of CC; stadium decor far NE.
  // Clubhouse building lives at world (-58, -85); its sign sits over it
  // via local x=-20. Amenities fan out across the strip:
  //   • 18 numbered holes scattered across a 40×16 fairway
  //   • Members pool with deck, diving board, lounge chairs, umbrella
  //   • Tennis court with net, lines, fence posts, bouncing ball
  //   • Driving range, sand bunkers, water hazard pond
  //   • Patio with umbrellas + animated golfer figure
  // Conflict check:
  //   • R2 z[74..80] x[-75..-15] → 1u north of decor north edge z=73. clear.
  //   • R3 x[-27.5..-22.5] z[40..80] → 0.5u east of east edge x=-28. clear.
  //   • botfashion (-40.5, 59.25) 1.8×1.8 → world z[58.35..60.15],
  //     x[-41.4..-39.6]. Decor wraps around it (kiosk sits in fairway).
  //   • botzoo (-22.5, 87), botgallery (-75, 40.5) → far. clear.
  const ballRefs = useRef<Array<THREE.Mesh | null>>([]);
  const golferRef = useRef<THREE.Group>(null!);
  const tennisBallRef = useRef<THREE.Mesh>(null!);
  const poolMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const flagRefs = useRef<Array<THREE.Group | null>>([]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    ballRefs.current.forEach((m, i) => {
      if (m) m.position.y = 0.08 + Math.abs(Math.sin(t * 1.3 + i)) * 0.05;
    });
    if (golferRef.current) {
      golferRef.current.rotation.y = Math.sin(t * 0.8) * 0.5;
    }
    if (tennisBallRef.current) {
      tennisBallRef.current.position.y = 0.15 + Math.abs(Math.sin(t * 3)) * 1.0;
      tennisBallRef.current.position.x = Math.sin(t * 0.6) * 4.5;
    }
    if (poolMatRef.current) {
      poolMatRef.current.emissiveIntensity = 0.3 + Math.sin(t * 1.2) * 0.12;
    }
    flagRefs.current.forEach((g, i) => {
      if (g) g.rotation.y = Math.sin(t * 0.7 + i * 0.4) * 0.3;
    });
  });

  // 18 holes scattered across the main fairway.
  // Local fairway envelope: x[-26..14], z[-18..-2].
  const holes: Array<{ x: number; z: number; color: string; n: number }> = [
    { n: 1, x: -22, z: -16, color: "#dc2626" },
    { n: 2, x: -16, z: -14.5, color: "#3b82f6" },
    { n: 3, x: -10, z: -16, color: "#fde047" },
    { n: 4, x: -4, z: -14.5, color: "#dc2626" },
    { n: 5, x: 3, z: -16, color: "#3b82f6" },
    { n: 6, x: 10, z: -15, color: "#fde047" },
    { n: 7, x: 12, z: -10, color: "#dc2626" },
    { n: 8, x: 6, z: -9, color: "#3b82f6" },
    { n: 9, x: 0, z: -10, color: "#fde047" },
    { n: 10, x: -6, z: -9, color: "#dc2626" },
    { n: 11, x: -12, z: -10, color: "#3b82f6" },
    { n: 12, x: -18, z: -9, color: "#fde047" },
    { n: 13, x: -24, z: -10, color: "#dc2626" },
    { n: 14, x: -22, z: -5, color: "#3b82f6" },
    { n: 15, x: -14, z: -4, color: "#fde047" },
    { n: 16, x: -6, z: -5, color: "#dc2626" },
    { n: 17, x: 4, z: -4, color: "#3b82f6" },
    { n: 18, x: 12, z: -5.5, color: "#fde047" },
  ];

  return (
    <group position={[-38, 0, -85]}>
      {/* ─── Main fairway (40×16) ─── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.02, -10]} receiveShadow>
        <planeGeometry args={[40, 16]} />
        <meshStandardMaterial color="#16a34a" roughness={0.95} />
      </mesh>
      {/* Darker rough strips */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.024, -2.5]}>
        <planeGeometry args={[40, 1]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.024, -17.5]}>
        <planeGeometry args={[40, 1]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>

      {/* ─── Cart path — winding tan ribbon across the fairway ─── */}
      {[-24, -20, -16, -12, -8, -4, 0, 4, 8, 12].map((x, i) => (
        <mesh
          key={`cp-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.028, -7 + Math.sin(i * 0.7) * 1.5]}
        >
          <planeGeometry args={[4, 1.2]} />
          <meshStandardMaterial color="#d4a373" roughness={1} />
        </mesh>
      ))}

      {/* ─── 18 holes — green discs + numbered flags + cups ─── */}
      {holes.map((h, i) => (
        <group key={`h-${h.n}`}>
          {/* Putting green */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[h.x, 0.03, h.z]}>
            <circleGeometry args={[1.4, 20]} />
            <meshStandardMaterial color="#15803d" roughness={1} />
          </mesh>
          {/* Flag pole + waving flag */}
          <group
            ref={(g) => { flagRefs.current[i] = g; }}
            position={[h.x, 0, h.z]}
          >
            <mesh position={[0, 1, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 2, 8]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            <mesh position={[0.3, 1.75, 0]}>
              <planeGeometry args={[0.6, 0.35]} />
              <meshStandardMaterial color={h.color} side={THREE.DoubleSide} />
            </mesh>
            <Text
              position={[0.32, 1.75, 0.01]}
              fontSize={0.22}
              color="#0b1220"
              anchorX="center"
              anchorY="middle"
            >
              {String(h.n)}
            </Text>
            {/* Cup ring on the ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
              <ringGeometry args={[0.12, 0.18, 16]} />
              <meshStandardMaterial color="#0f172a" side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      ))}

      {/* ─── Sand bunkers scattered across the course ─── */}
      {[
        { x: -19, z: -7, r: 1.3 },
        { x: -7, z: -12, r: 1.4 },
        { x: 5, z: -7, r: 1.2 },
        { x: 9, z: -13, r: 1.5 },
        { x: -15, z: -13, r: 1.2 },
      ].map((s, i) => (
        <mesh
          key={`bk-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[s.x, 0.035, s.z]}
        >
          <circleGeometry args={[s.r, 24]} />
          <meshStandardMaterial color="#fde68a" roughness={1} />
        </mesh>
      ))}

      {/* ─── Water hazard pond ─── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.036, -7]}>
        <circleGeometry args={[1.6, 28]} />
        <meshStandardMaterial
          color="#0e7490"
          emissive="#22d3ee"
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* ─── Driving range tee mat + practice balls ─── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0.03, -2.6]}>
        <planeGeometry args={[8, 1.2]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
      {[-6, -4, -2, 0].map((x) => (
        <mesh key={`tee-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.035, -2.6]}>
          <planeGeometry args={[0.06, 1.2]} />
          <meshStandardMaterial color="#fde047" />
        </mesh>
      ))}
      {[
        [-7, -2.8], [-6, -2.6], [-5, -2.4], [-4, -2.5], [-3, -2.6],
        [-2, -2.4], [-1, -2.7], [0, -2.5],
      ].map(([x, z], i) => (
        <mesh
          key={`pb-${i}`}
          ref={(m) => { ballRefs.current[i] = m; }}
          position={[x, 0.08, z]}
        >
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* ─── Yardage signs on the driving range ─── */}
      {[100, 150, 200].map((yd, i) => (
        <group key={`dm-${yd}`} position={[-3 - i * 6, 0, -17]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1, 1, 0.1]} />
            <meshStandardMaterial color="#fde047" />
          </mesh>
          <Text
            position={[0, 0.5, 0.06]}
            fontSize={0.32}
            color="#0b1220"
            anchorX="center"
            anchorY="middle"
          >
            {`${yd}y`}
          </Text>
        </group>
      ))}

      {/* ─── Animated golfer figure on the tee mat ─── */}
      <group ref={golferRef} position={[-4, 0, -2.6]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.9, 10]} />
          <meshStandardMaterial color="#fef3c7" />
        </mesh>
        <mesh position={[0, 1.18, 0]} castShadow>
          <sphereGeometry args={[0.18, 14, 12]} />
          <meshStandardMaterial color="#fde68a" />
        </mesh>
        {/* Club shaft */}
        <mesh position={[0.35, 0.7, 0]} rotation={[0, 0, -0.6]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Club head */}
        <mesh position={[0.65, 0.15, 0]}>
          <boxGeometry args={[0.18, 0.06, 0.1]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.8} />
        </mesh>
      </group>

      {/* ─── MEMBERS POOL ─── */}
      <group position={[10, 0, -13.5]}>
        {/* Pool deck */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.038, 0]} receiveShadow>
          <planeGeometry args={[8, 5.5]} />
          <meshStandardMaterial color="#fef3c7" roughness={1} />
        </mesh>
        {/* Pool water */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <planeGeometry args={[5.5, 3.2]} />
          <meshStandardMaterial
            ref={poolMatRef}
            color="#0ea5e9"
            emissive="#38bdf8"
            emissiveIntensity={0.3}
            metalness={0.6}
            roughness={0.25}
          />
        </mesh>
        {/* Pool rim */}
        {[
          { p: [0, 0.1, 1.65] as [number, number, number], s: [5.7, 0.18, 0.18] as [number, number, number] },
          { p: [0, 0.1, -1.65] as [number, number, number], s: [5.7, 0.18, 0.18] as [number, number, number] },
          { p: [2.85, 0.1, 0] as [number, number, number], s: [0.18, 0.18, 3.4] as [number, number, number] },
          { p: [-2.85, 0.1, 0] as [number, number, number], s: [0.18, 0.18, 3.4] as [number, number, number] },
        ].map((r, i) => (
          <mesh key={`pr-${i}`} position={r.p}>
            <boxGeometry args={r.s} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        ))}
        {/* Diving board */}
        <group position={[-3.2, 0, 0]}>
          <mesh position={[0.5, 0.32, 0]}>
            <boxGeometry args={[1.2, 0.06, 0.5]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.2, 0.32, 0.3]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        </group>
        {/* Lounge chairs along the deck */}
        {[
          { x: -2.4, z: 2.1, r: 0 },
          { x: -0.8, z: 2.1, r: 0 },
          { x: 0.8, z: 2.1, r: 0 },
          { x: 2.4, z: 2.1, r: 0 },
          { x: -2, z: -2.1, r: Math.PI },
          { x: 0, z: -2.1, r: Math.PI },
          { x: 2, z: -2.1, r: Math.PI },
        ].map((c, i) => (
          <group key={`lc-${i}`} position={[c.x, 0, c.z]} rotation={[0, c.r, 0]}>
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[0.55, 0.08, 1.3]} />
              <meshStandardMaterial color="#f97316" />
            </mesh>
            <mesh position={[0, 0.4, -0.45]} rotation={[-0.5, 0, 0]}>
              <boxGeometry args={[0.55, 0.08, 0.6]} />
              <meshStandardMaterial color="#f97316" />
            </mesh>
          </group>
        ))}
        {/* Pool umbrella */}
        <group position={[3.0, 0, 2.0]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 2.4, 0]}>
            <coneGeometry args={[1.1, 0.5, 12]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
        {/* Pool sign */}
        <Text
          position={[0, 2.4, 2.9]}
          fontSize={0.32}
          color="#0ea5e9"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#0b1220"
        >
          🏊 MEMBERS POOL
        </Text>
      </group>

      {/* ─── TENNIS COURT ─── */}
      {/* Shifted from local x=-22 → -18 so the 13.2-wide run-off stays
          inside the declared envelope x_min=-68 (world x_min now ~-66.6). */}
      <group position={[-18, 0, -15.5]}>
        {/* Green run-off */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.039, 0]}>
          <planeGeometry args={[13.2, 7.2]} />
          <meshStandardMaterial color="#166534" />
        </mesh>
        {/* Court surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.041, 0]} receiveShadow>
          <planeGeometry args={[12, 6]} />
          <meshStandardMaterial color="#0369a1" roughness={0.9} />
        </mesh>
        {/* Court lines */}
        {[
          { p: [0, 0.046, 2.9] as [number, number, number], s: [11.8, 0.15] as [number, number] },
          { p: [0, 0.046, -2.9] as [number, number, number], s: [11.8, 0.15] as [number, number] },
          { p: [-5.9, 0.046, 0] as [number, number, number], s: [0.15, 5.8] as [number, number] },
          { p: [5.9, 0.046, 0] as [number, number, number], s: [0.15, 5.8] as [number, number] },
          { p: [0, 0.046, 0] as [number, number, number], s: [0.15, 4.0] as [number, number] },
          { p: [-3, 0.046, 0] as [number, number, number], s: [0.15, 4.0] as [number, number] },
          { p: [3, 0.046, 0] as [number, number, number], s: [0.15, 4.0] as [number, number] },
        ].map((l, i) => (
          <mesh
            key={`tl-${i}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={l.p}
          >
            <planeGeometry args={l.s} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        ))}
        {/* Net */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[12, 1, 0.06]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={0.6} />
        </mesh>
        <mesh position={[-6, 0.55, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.1, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[6, 0.55, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.1, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Bouncing tennis ball */}
        <mesh ref={tennisBallRef} position={[0, 0.15, 1.2]}>
          <sphereGeometry args={[0.12, 14, 10]} />
          <meshStandardMaterial color="#bef264" emissive="#bef264" emissiveIntensity={0.4} />
        </mesh>
        {/* Fence posts */}
        {[
          [-6.5, 3.6], [0, 3.6], [6.5, 3.6],
          [-6.5, -3.6], [0, -3.6], [6.5, -3.6],
        ].map(([x, z], i) => (
          <mesh key={`fp-${i}`} position={[x, 1.1, z]}>
            <cylinderGeometry args={[0.05, 0.05, 2.2, 6]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        ))}
        {/* Tennis sign */}
        <Text
          position={[0, 2.6, 4.0]}
          fontSize={0.3}
          color="#bef264"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#0b1220"
        >
          🎾 TENNIS COURT
        </Text>
      </group>

      {/* ─── Clubhouse patio (in front of clubhouse, local x≈-20) ─── */}
      <group position={[-19, 0, -7]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
          <planeGeometry args={[6, 3.5]} />
          <meshStandardMaterial color="#a78bfa" roughness={1} />
        </mesh>
        {[
          { p: [-1.6, -0.4] as [number, number], c: "#dc2626" },
          { p: [1.6, -0.4] as [number, number], c: "#3b82f6" },
          { p: [0, 1.0] as [number, number], c: "#fde047" },
        ].map(({ p, c }, i) => (
          <group key={`pu-${i}`} position={[p[0], 0, p[1]]}>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.45, 0.45, 0.08, 16]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, 1.0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 1.6, 6]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[0, 1.55, 0]}>
              <coneGeometry args={[0.9, 0.4, 10]} />
              <meshStandardMaterial color={c} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ─── Pine trees ringing the property ─── */}
      {/* Westmost pines pulled in from local x=-27 → -26 so world x stays
          inside the envelope x_min=-68. */}
      {[
        [-26, -3], [-25, -4], [-23, -3.5],
        [-10, -3], [-2, -3], [6, -3], [13, -3.2],
        [-26, -18], [-19, -18.5], [-3, -18], [13, -18],
      ].map(([x, z], i) => (
        <group key={`pt-${i}`} position={[x, 0, z]}>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.13, 0.18, 1.4, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 2.0, 0]}>
            <coneGeometry args={[0.9, 2.6, 10]} />
            <meshStandardMaterial color="#166534" />
          </mesh>
        </group>
      ))}

      {/* ─── Big clubhouse signage (over clubhouse at world x=-62) ─── */}
      {/* Sign moved from local z=2.4 → -2.5 to clear the R2 runway corridor
          at world z[74..80]. Now sits on the north face of the clubhouse
          (world z≈72.5) facing the rest of the course. */}
      <Text
        position={[-20, 5.0, -2.5]}
        fontSize={0.45}
        color="#15803d"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#0b1220"
      >
        ⛳ BOTGOLF COUNTRY CLUB
      </Text>
      <Text
        position={[-20, 4.4, -2.5]}
        fontSize={0.22}
        color="#65a30d"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#0b1220"
      >
        18 Holes · Pool · Tennis · Driving Range
      </Text>

      {/* ─── "MEMBERS ONLY" gate at east entry ─── */}
      <group position={[14, 0, -10]}>
        <mesh position={[0, 1.2, -1]}>
          <boxGeometry args={[0.3, 2.4, 0.3]} />
          <meshStandardMaterial color="#0b1220" />
        </mesh>
        <mesh position={[0, 1.2, 1]}>
          <boxGeometry args={[0.3, 2.4, 0.3]} />
          <meshStandardMaterial color="#0b1220" />
        </mesh>
        <mesh position={[0, 2.3, 0]}>
          <boxGeometry args={[0.2, 0.2, 2.4]} />
          <meshStandardMaterial color="#0b1220" />
        </mesh>
        <Text
          position={[0, 2.7, 0]}
          fontSize={0.22}
          color="#fde047"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0b1220"
        >
          MEMBERS ONLY
        </Text>
      </group>
    </group>
  );
}

// =====================================================================
// NATIONAL PARK @ (-92, 0, -78) — far SW corner
// Visitor center kiosk at x[-94.5..-89.5], z[-80..-76].
// Mountains, pines, and a lake fill the SW corner up to the world edge.
// Envelope: world x ∈ [-105, -78], z ∈ [-105, -50]
// Clear of botmine (-75,-37.5) and botfarm (-60,-61.5).
// =====================================================================

function Mountain({
  position,
  height,
  radius,
  cap = "#f8fafc",
  rock = "#475569",
}: {
  position: [number, number, number];
  height: number;
  radius: number;
  cap?: string;
  rock?: string;
}) {
  return (
    <group position={position}>
      {/* Base rock cone */}
      <mesh castShadow>
        <coneGeometry args={[radius, height, 8]} />
        <meshStandardMaterial color={rock} roughness={1} />
      </mesh>
      {/* Snow cap — smaller cone on top */}
      <mesh position={[0, height * 0.32, 0]}>
        <coneGeometry args={[radius * 0.45, height * 0.35, 8]} />
        <meshStandardMaterial color={cap} emissive={cap} emissiveIntensity={0.05} roughness={0.6} />
      </mesh>
    </group>
  );
}

function PineTree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 1.2, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, 2, 0]}>
        <coneGeometry args={[1.1, 3.5, 10]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
    </group>
  );
}

function NationalPark() {
  const lakeRef = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((s) => {
    if (lakeRef.current) {
      lakeRef.current.emissiveIntensity = 0.25 + Math.sin(s.clock.elapsedTime * 0.6) * 0.1;
    }
  });
  // Local origin (-92, 0, -78). Decor extends mostly NW (negative x,
  // negative z) to fill the empty SW corner. Significantly expanded:
  // pine floor 24×32 → 38×46 (~2.3×), additional mountains and trees,
  // larger lake. World footprint: x[-118,-80] × z[-114,-68].
  return (
    <group position={[-92, 0, -78]}>
      {/* Pine-forest floor — dark green meadow tinting the corner */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7, 0.018, -13]}>
        <planeGeometry args={[38, 46]} />
        <meshStandardMaterial color="#365314" roughness={1} />
      </mesh>
      {/* Outer wildflower meadow ring — slightly lighter green */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7, 0.012, -13]}>
        <ringGeometry args={[22, 26, 48]} />
        <meshStandardMaterial color="#4d7c0f" roughness={1} />
      </mesh>
      {/* Mountains — staggered behind the visitor center */}
      <Mountain position={[-9, 6, -22]} height={12} radius={5} />
      <Mountain position={[0, 7.5, -25]} height={15} radius={6} />
      <Mountain position={[9, 5.5, -23]} height={11} radius={4.5} cap="#e0e7ff" />
      <Mountain position={[-6, 4.5, -16]} height={9} radius={3.5} rock="#52525b" />
      {/* Expanded mountain range — far western and southern peaks */}
      <Mountain position={[-20, 8, -28]} height={16} radius={6.5} cap="#f1f5f9" />
      <Mountain position={[-23, 5.5, -18]} height={11} radius={4.5} rock="#475569" />
      <Mountain position={[-17, 7, -34]} height={14} radius={5.5} />
      <Mountain position={[6, 6, -32]} height={12} radius={5} cap="#e2e8f0" />
      <Mountain position={[-25, 4, -8]} height={8} radius={3.5} rock="#52525b" />
      {/* Lake — emissive blue plane east of the visitor center (enlarged) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7, 0.04, -6]}>
        <circleGeometry args={[5.5, 32]} />
        <meshStandardMaterial
          ref={lakeRef}
          color="#0e7490"
          emissive="#22d3ee"
          emissiveIntensity={0.25}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      {/* Second smaller alpine pond — south-west, fed by mountain streams */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-18, 0.04, -10]}>
        <circleGeometry args={[2.5, 24]} />
        <meshStandardMaterial
          color="#0c4a6e"
          emissive="#38bdf8"
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      {/* Pine forest — original 16 trees + 18 added across the expansion */}
      {[
        // Original spread
        [-12, -3], [-10, -7], [-14, -10], [-8, -12], [-12, -16],
        [-4, -8], [-2, -14], [2, -10], [4, -16], [-16, -6],
        [-6, 2], [-14, 0], [-2, 3], [3, 1], [10, 2], [12, -2],
        // Western expansion
        [-22, -4], [-20, -12], [-24, 2], [-19, 4], [-23, -14],
        [-26, -10], [-21, 6],
        // Southern expansion
        [-12, -22], [-6, -20], [2, -22], [-18, -24], [10, -18],
        [-2, -26], [-14, -28], [8, -26], [4, -30], [-8, -32],
        [12, 4],
      ].map(([x, z], i) => (
        <PineTree key={`pt-${i}`} x={x} z={z} scale={0.7 + ((i * 13) % 5) / 12} />
      ))}
      {/* Hiking trail — wood-plank path leading toward the mountains */}
      {[-2, -5, -8, -11, -14, -17].map((z, i) => (
        <mesh
          key={`trail-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-4 + i * 0.5, 0.05, z]}
        >
          <planeGeometry args={[1.2, 1.8]} />
          <meshStandardMaterial color="#92400e" roughness={1} />
        </mesh>
      ))}
      {/* Campfire near the lake */}
      <group position={[5, 0, -2]}>
        {/* Log ring */}
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2;
          return (
            <mesh
              key={`log-${i}`}
              position={[Math.cos(a) * 0.5, 0.1, Math.sin(a) * 0.5]}
              rotation={[0, a + Math.PI / 2, 0]}
            >
              <cylinderGeometry args={[0.08, 0.08, 0.8, 6]} />
              <meshStandardMaterial color="#451a03" />
            </mesh>
          );
        })}
        {/* Flame */}
        <mesh position={[0, 0.4, 0]}>
          <coneGeometry args={[0.3, 0.6, 8]} />
          <meshStandardMaterial
            color="#fb923c"
            emissive="#f97316"
            emissiveIntensity={1.5}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>
        <pointLight color="#fb923c" intensity={1.2} distance={6} position={[0, 0.5, 0]} />
      </group>
      {/* Park entrance sign — wooden plank above the visitor center */}
      <group position={[0, 3.5, 2.5]}>
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[5.5, 1.4, 0.1]} />
          <meshStandardMaterial color="#78350f" roughness={0.95} />
        </mesh>
        <Text
          position={[0, 0.25, 0.06]}
          fontSize={0.4}
          color="#fde68a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#0b1220"
        >
          🏔️ BOT NATIONAL PARK
        </Text>
        <Text
          position={[0, -0.3, 0.06]}
          fontSize={0.18}
          color="#facc15"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0b1220"
        >
          Mountains · Forest · Lake
        </Text>
      </group>
    </group>
  );
}

// =====================================================================
// Single export — render all five new districts.
// =====================================================================

export default function CityDistrictsExtra() {
  return (
    <group>
      <HighSchool />
      <MiddleSchool />
      <ElementarySchool />
      <GolfCourse />
      <NationalPark />
    </group>
  );
}
