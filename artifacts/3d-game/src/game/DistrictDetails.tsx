import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// =====================================================================
// DistrictDetails — adds the iconic landmarks to four outer districts
// that were still reading as their building alone:
//   BotBeach (44, 25)  — palms, lifeguard tower, volleyball, surfboards
//   BotFarm  (-40,-41) — crop rows, scarecrow, barn
//   BotMine  (-50,-25) — minecart on rails, ore piles, crate
//   BotPort  (50, 48)  — cargo ship, two cranes, container stacks
// =====================================================================

// ------------------------- Beach -------------------------

function Palm({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const fronds = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (fronds.current) {
      fronds.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
    }
  });
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.2, 3.2, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <group ref={fronds} position={[0, 3.1, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh
            key={i}
            rotation={[-0.35, (i * Math.PI * 2) / 6, 0]}
            position={[0.8, 0, 0]}
          >
            <boxGeometry args={[1.6, 0.06, 0.45]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
        ))}
        {/* Coconuts cluster */}
        <mesh position={[0.15, -0.15, 0.1]}>
          <sphereGeometry args={[0.15, 8, 6]} />
          <meshStandardMaterial color="#422006" />
        </mesh>
        <mesh position={[-0.1, -0.15, -0.12]}>
          <sphereGeometry args={[0.14, 8, 6]} />
          <meshStandardMaterial color="#422006" />
        </mesh>
      </group>
    </group>
  );
}

function LifeguardTower({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Stilts */}
      {[
        [-1, 0, 1],
        [1, 0, 1],
        [-1, 0, -1],
        [1, 0, -1],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], 1, p[2]]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 2, 6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      ))}
      {/* Floor */}
      <mesh position={[0, 2.1, 0]} castShadow>
        <boxGeometry args={[2.4, 0.15, 2.4]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 2.7, -1.1]} castShadow>
        <boxGeometry args={[2.4, 1.2, 0.1]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Side walls */}
      {[1, -1].map((s) => (
        <mesh key={s} position={[s * 1.15, 2.7, 0]} castShadow>
          <boxGeometry args={[0.1, 1.2, 2.2]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      ))}
      {/* Roof (hip) */}
      <mesh position={[0, 3.55, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.85, 0.8, 4]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      {/* Ladder */}
      <mesh position={[0, 1.0, 1.35]} rotation={[Math.PI / 8, 0, 0]}>
        <boxGeometry args={[0.55, 2.1, 0.06]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Red cross sign on back */}
      <mesh position={[0, 2.95, -1.16]}>
        <boxGeometry args={[0.6, 0.15, 0.04]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 2.95, -1.16]}>
        <boxGeometry args={[0.15, 0.6, 0.04]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
    </group>
  );
}

function VolleyNet({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[-2, 1, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[2, 1, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Net (wireframe gives mesh look) */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[4, 0.6, 0.02]} />
        <meshStandardMaterial color="#f8fafc" transparent opacity={0.55} wireframe />
      </mesh>
      {/* Volleyball lying nearby */}
      <mesh position={[1.1, 0.32, 1.2]} castShadow>
        <sphereGeometry args={[0.28, 14, 12]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

function Surfboard({
  position,
  rotation = 0,
  tilt = Math.PI / 4,
  color,
}: {
  position: [number, number, number];
  rotation?: number;
  tilt?: number;
  color: string;
}) {
  return (
    <mesh position={position} rotation={[tilt, rotation, 0]} castShadow>
      <boxGeometry args={[0.32, 2.0, 0.08]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function BeachDetails() {
  return (
    <group>
      <Palm position={[40, 0, 22]} scale={1.1} />
      <Palm position={[48, 0, 22]} scale={1.0} />
      <Palm position={[40, 0, 28]} scale={1.15} />
      <Palm position={[48, 0, 28]} scale={0.95} />
      <Palm position={[36, 0, 25]} scale={1.0} />
      <LifeguardTower position={[44, 0, 31]} rotation={Math.PI} />
      <VolleyNet position={[42, 0, 19]} rotation={Math.PI / 6} />
      <Surfboard position={[47, 0.5, 19]} rotation={Math.PI / 4} color="#22d3ee" />
      <Surfboard position={[48, 0.5, 20.5]} rotation={-Math.PI / 8} color="#f472b6" />
      <Surfboard position={[39, 0.5, 30]} rotation={Math.PI / 2} color="#fbbf24" />
    </group>
  );
}

// ------------------------- Farm -------------------------

function CropRow({
  position,
  rotation = 0,
  cols = 6,
  rows = 4,
  color = "#84cc16",
}: {
  position: [number, number, number];
  rotation?: number;
  cols?: number;
  rows?: number;
  color?: string;
}) {
  const plants: [number, number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      plants.push([(c - cols / 2) * 0.55, 0.2, (r - rows / 2) * 0.55]);
    }
  }
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {plants.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <coneGeometry args={[0.14, 0.4, 5]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      {/* Tilled ground tint */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[cols * 0.6 + 0.4, rows * 0.6 + 0.4]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
    </group>
  );
}

function Scarecrow({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2.8, 6]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 6]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, 2.55, 0]} castShadow>
        <sphereGeometry args={[0.26, 12, 10]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
      <mesh position={[0, 2.85, 0]} castShadow>
        <coneGeometry args={[0.38, 0.45, 8]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      <mesh position={[0, 1.85, 0]} castShadow>
        <boxGeometry args={[0.75, 0.8, 0.3]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Black button eyes */}
      <mesh position={[-0.08, 2.6, 0.22]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.08, 2.6, 0.22]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

function Barn({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[3, 2.4, 2]} />
        <meshStandardMaterial color="#7f1d1d" />
      </mesh>
      {/* Hip roof */}
      <mesh position={[0, 2.7, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.9, 1.1, 4]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* White trim cross on the front */}
      <mesh position={[0, 1.2, 1.02]}>
        <boxGeometry args={[2.8, 0.15, 0.04]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0, 1.2, 1.02]}>
        <boxGeometry args={[0.15, 2.2, 0.04]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Hayloft door */}
      <mesh position={[0, 2.2, 1.02]}>
        <boxGeometry args={[0.55, 0.55, 0.04]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

function FarmDetails() {
  // botfarm (-40, *, -41). Crops radiate around the building, clear of
  // its 5×4 footprint.
  return (
    <group>
      <CropRow position={[-46, 0, -47]} color="#84cc16" />
      <CropRow position={[-34, 0, -47]} color="#fbbf24" />
      <CropRow position={[-46, 0, -35]} color="#22c55e" />
      <CropRow position={[-34, 0, -35]} color="#a3e635" />
      <Scarecrow position={[-46, 0, -47]} />
      <Barn position={[-47, 0, -37]} rotation={Math.PI / 8} />
    </group>
  );
}

// ------------------------- Mine -------------------------
// (Removed) MineCart / OrePile / MineDetails — the mine moved from
// world (-50,-25) to (-75,-37.5) and the canonical Mine() decor in
// CityDistricts.tsx now covers the full expanded quarry complex.

// ------------------------- Port -------------------------

function CargoShip({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Hull */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[6, 1.0, 1.7]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      {/* Lower hull stripe */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[6.05, 0.25, 1.72]} />
        <meshStandardMaterial color="#7f1d1d" />
      </mesh>
      {/* Deck cabin */}
      <mesh position={[-1.8, 1.4, 0]} castShadow>
        <boxGeometry args={[1.5, 0.8, 1.3]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Cabin windows */}
      <mesh position={[-1.8, 1.55, 0.66]}>
        <boxGeometry args={[1.2, 0.3, 0.02]} />
        <meshStandardMaterial color="#0f172a" emissive="#22d3ee" emissiveIntensity={0.4} />
      </mesh>
      {/* Smokestack */}
      <mesh position={[-1.8, 2.25, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.7, 10]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Containers stacked on deck */}
      {[
        [0.6, 0, "#dc2626"],
        [0.6, 0.65, "#fbbf24"],
        [1.7, 0, "#16a34a"],
        [1.7, 0.65, "#a78bfa"],
        [2.7, 0, "#22d3ee"],
      ].map(([dx, dy, c], i) => (
        <mesh
          key={i}
          position={[dx as number, 1.05 + (dy as number), 0]}
          castShadow
        >
          <boxGeometry args={[0.95, 0.6, 1.1]} />
          <meshStandardMaterial color={c as string} />
        </mesh>
      ))}
    </group>
  );
}

function PortCrane({ position }: { position: [number, number, number] }) {
  const armRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (armRef.current) {
      armRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    }
  });
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.5, 0.6, 1.5]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Mast */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <boxGeometry args={[0.45, 5.8, 0.45]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      {/* Swinging arm */}
      <group ref={armRef} position={[0, 6, 0]}>
        <mesh position={[1.6, 0, 0]} castShadow>
          <boxGeometry args={[3.2, 0.32, 0.32]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        {/* Counter-balance */}
        <mesh position={[-0.8, 0, 0]} castShadow>
          <boxGeometry args={[1, 0.5, 0.5]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Hook line */}
        <mesh position={[2.9, -1, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2, 4]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Hook */}
        <mesh position={[2.9, -2.05, 0]}>
          <boxGeometry args={[0.28, 0.28, 0.28]} />
          <meshStandardMaterial color="#374151" metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function PortDetails() {
  return (
    <group>
      <CargoShip position={[58, 0, 56]} rotation={Math.PI / 6} />
      <PortCrane position={[54, 0, 46]} />
      <PortCrane position={[46, 0, 46]} />
      {/* Container stacks on the dock */}
      {[
        [42, 0, 52, "#dc2626"],
        [42, 0.65, 52, "#16a34a"],
        [43.2, 0, 52, "#fbbf24"],
        [43.2, 0, 50.8, "#a78bfa"],
        [42, 0, 50.8, "#22d3ee"],
      ].map(([x, y, z, c], i) => (
        <mesh
          key={i}
          position={[x as number, (y as number) + 0.32, z as number]}
          castShadow
        >
          <boxGeometry args={[1.1, 0.65, 1.1]} />
          <meshStandardMaterial color={c as string} />
        </mesh>
      ))}
      {/* Bollards along the dock edge */}
      {[44, 47, 50, 53].map((x) => (
        <mesh key={x} position={[x, 0.25, 54]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.5, 10]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}
    </group>
  );
}

// ------------------------- Default export -------------------------

export default function DistrictDetails() {
  return (
    <group>
      <BeachDetails />
      <FarmDetails />
      <PortDetails />
    </group>
  );
}
