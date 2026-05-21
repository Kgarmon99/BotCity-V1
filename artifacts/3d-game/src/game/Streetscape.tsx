import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// =====================================================================
// Streetscape — boulevard trees, lamp posts at intersections, crosswalks.
// =====================================================================
// Lives at world y≈0 and fills the previously empty road corridors and
// intersections so the city reads as inhabited public space, not a
// scattering of isolated buildings.
//
// Conventions:
//  - Main avenues run along x=0 (N-S) and z=0 (E-W), road band ~±2.1u.
//  - Secondary roads at x=±18 and z=±18.
//  - All ornament positions sit on the sidewalk shoulder, never on
//    asphalt, and clear of every BUILDING_DEFS footprint.

// --- Single boulevard tree (taller, more formal than the park tree). ---
function BoulevardTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.24, 2.2, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Two-tier foliage */}
      <mesh position={[0, 2.6, 0]} castShadow>
        <sphereGeometry args={[1.0, 14, 12]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
      <mesh position={[0, 3.3, 0]} castShadow>
        <sphereGeometry args={[0.7, 12, 10]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
    </group>
  );
}

// --- Street lamp: tall pole + curved arm + glowing globe with halo. ---
function StreetLamp({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base plinth */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.3, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 3.7, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>
      {/* Cross arm */}
      <mesh position={[0.5, 3.85, 0]} castShadow>
        <boxGeometry args={[1.1, 0.06, 0.06]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Bulb housing */}
      <mesh position={[1, 3.7, 0]}>
        <sphereGeometry args={[0.22, 14, 12]} />
        <meshStandardMaterial
          color="#fde047"
          emissive="#fde047"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
      {/* Halo ring */}
      <mesh position={[1, 3.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.02, 6, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
    </group>
  );
}

// --- Crosswalk: 6 white stripes across a road band. ---
function Crosswalk({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((x) => (
        <mesh key={x} position={[x, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.35, 3.6]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// --- District wayfinding signpost: small kiosk with a glowing arrow. ---
function Signpost({
  position,
  rotation = 0,
  label,
  color,
}: {
  position: [number, number, number];
  rotation?: number;
  label: string;
  color: string;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 1.8, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Arrow-shaped plate */}
      <mesh position={[0.5, 1.5, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 0.45, 0.08]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      {/* Tiny notched tip on the right */}
      <mesh position={[1.15, 1.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.32, 0.32, 0.08]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      {/* Label not strictly drawn (drei Text would balloon the file);
          the color is the wayfinding cue, paired with the directional arrow. */}
      <mesh position={[0.5, 1.5, 0.05]}>
        <boxGeometry args={[1.0, 0.28, 0.02]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.5, 1.5, 0.07]}>
        <boxGeometry args={[0.9, 0.18, 0.01]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Keep label arg referenced for future text upgrade. */}
      <group userData={{ label }} />
    </group>
  );
}

// --- Hovering wayfinder above the main intersection. ---
// Sits well above traffic (y=8) so it doesn't intrude on the road band
// at (0,0,0). Acts as a floating compass — large enough to spot from
// anywhere in the inner block.
function CenterPlaqueRotor() {
  const groupRef = useRef<THREE.Group>(null!);
  const bobRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.15;
    if (bobRef.current) bobRef.current.position.y = 8 + Math.sin(t * 0.9) * 0.15;
  });
  return (
    <group ref={bobRef} position={[0, 8, 0]}>
      {/* Anti-grav disc */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.25, 18]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} emissive="#22d3ee" emissiveIntensity={0.3} />
      </mesh>
      {/* Glow ring underneath */}
      <mesh position={[0, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.04, 6, 24]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* Rotating top with 4 colored fins */}
      <group ref={groupRef} position={[0, 0.3, 0]}>
        {[
          ["#60a5fa", 0],
          ["#fbbf24", Math.PI / 2],
          ["#a78bfa", Math.PI],
          ["#f87171", (3 * Math.PI) / 2],
        ].map(([c, r], i) => (
          <mesh key={i} rotation={[0, r as number, 0]} position={[0, 0, 0]}>
            <boxGeometry args={[2.4, 0.2, 0.15]} />
            <meshStandardMaterial
              color={c as string}
              emissive={c as string}
              emissiveIntensity={0.6}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function Streetscape() {
  // Tree positions along the OUTER stretches of the main avenues only,
  // so we never collide with the dense inner block buildings.
  //
  // For each stretch we list a small array of distances along the avenue
  // and emit a tree on each shoulder (±2.6u off the asphalt). This keeps
  // the data dense without copy-pasting JSX 32 times.
  const mainNorthZs = useMemo(() => [-32, -38, -44, -50], []);
  const mainSouthZs = useMemo(() => [32, 38, 44, 50], []);
  const mainEastXs = useMemo(() => [32, 38, 44, 50], []);
  const mainWestXs = useMemo(() => [-32, -38, -44, -50], []);

  return (
    <group>
      {/* === Boulevard tree lines (main N-S avenue, outer stretches) === */}
      {mainNorthZs.map((z) => (
        <group key={`mn-${z}`}>
          <BoulevardTree position={[-2.6, 0, z]} scale={0.95 + (z % 3) * 0.05} />
          <BoulevardTree position={[2.6, 0, z]} scale={0.95 + (z % 4) * 0.04} />
        </group>
      ))}
      {mainSouthZs.map((z) => (
        <group key={`ms-${z}`}>
          <BoulevardTree position={[-2.6, 0, z]} scale={0.95 + (z % 3) * 0.05} />
          <BoulevardTree position={[2.6, 0, z]} scale={0.95 + (z % 4) * 0.04} />
        </group>
      ))}
      {/* === Boulevard tree lines (main E-W avenue, outer stretches) === */}
      {mainEastXs.map((x) => (
        <group key={`me-${x}`}>
          <BoulevardTree position={[x, 0, -2.6]} scale={0.95 + (x % 3) * 0.05} />
          <BoulevardTree position={[x, 0, 2.6]} scale={0.95 + (x % 4) * 0.04} />
        </group>
      ))}
      {mainWestXs.map((x) => (
        <group key={`mw-${x}`}>
          <BoulevardTree position={[x, 0, -2.6]} scale={0.95 + (x % 3) * 0.05} />
          <BoulevardTree position={[x, 0, 2.6]} scale={0.95 + (x % 4) * 0.04} />
        </group>
      ))}

      {/* === Lamp posts at the four secondary intersections (±18, ±18) === */}
      {/* Each intersection gets 4 lamps in opposite corners off the asphalt. */}
      {[
        [18, 18],
        [-18, 18],
        [18, -18],
        [-18, -18],
      ].map(([cx, cz]) => (
        <group key={`int-${cx}-${cz}`}>
          <StreetLamp position={[cx + 2.4, 0, cz + 2.4]} />
          <StreetLamp position={[cx - 2.4, 0, cz + 2.4]} rotation={Math.PI / 2} />
          <StreetLamp position={[cx + 2.4, 0, cz - 2.4]} rotation={-Math.PI / 2} />
          <StreetLamp position={[cx - 2.4, 0, cz - 2.4]} rotation={Math.PI} />
        </group>
      ))}

      {/* === Outer-avenue lamp posts (every ~14u along each main avenue) === */}
      {[-35, -49].map((z) => (
        <group key={`lmpN-${z}`}>
          <StreetLamp position={[-2.6, 0, z]} />
          <StreetLamp position={[2.6, 0, z]} rotation={Math.PI} />
        </group>
      ))}
      {[35, 49].map((z) => (
        <group key={`lmpS-${z}`}>
          <StreetLamp position={[-2.6, 0, z]} />
          <StreetLamp position={[2.6, 0, z]} rotation={Math.PI} />
        </group>
      ))}
      {[-35, -49].map((x) => (
        <group key={`lmpW-${x}`}>
          <StreetLamp position={[x, 0, -2.6]} rotation={Math.PI / 2} />
          <StreetLamp position={[x, 0, 2.6]} rotation={-Math.PI / 2} />
        </group>
      ))}
      {[35, 49].map((x) => (
        <group key={`lmpE-${x}`}>
          <StreetLamp position={[x, 0, -2.6]} rotation={Math.PI / 2} />
          <StreetLamp position={[x, 0, 2.6]} rotation={-Math.PI / 2} />
        </group>
      ))}

      {/* === Crosswalks at the four secondary intersections === */}
      {/* North/south bars across the secondary E-W roads at z=±18. */}
      {[18, -18].map((z) => (
        <group key={`cw-z-${z}`}>
          <Crosswalk position={[18, 0, z]} />
          <Crosswalk position={[-18, 0, z]} />
        </group>
      ))}
      {/* East/west bars across the secondary N-S roads at x=±18. */}
      {[18, -18].map((x) => (
        <group key={`cw-x-${x}`}>
          <Crosswalk position={[x, 0, 18]} rotation={Math.PI / 2} />
          <Crosswalk position={[x, 0, -18]} rotation={Math.PI / 2} />
        </group>
      ))}

      {/* === District wayfinding signposts at the four cardinal exits === */}
      {/* Each points outward toward the major outer district. Colors match
          the destination's emissive accent so the signs read at a glance. */}
      <Signpost position={[4.2, 0, -33]} rotation={-Math.PI / 2} label="N → BotPlane" color="#60a5fa" />
      <Signpost position={[-4.2, 0, 33]} rotation={Math.PI / 2} label="S → BotKids" color="#f472b6" />
      <Signpost position={[33, 0, 4.2]} rotation={Math.PI} label="E → BotBroker" color="#fbbf24" />
      <Signpost position={[-33, 0, -4.2]} rotation={0} label="W → BotGigs" color="#a78bfa" />

      {/* === Center rotating wayfinder === */}
      <CenterPlaqueRotor />
    </group>
  );
}
