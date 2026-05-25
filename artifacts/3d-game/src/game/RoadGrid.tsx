import { ROAD_HALF, ROAD_XS, ROAD_ZS, ROAD_STYLE } from "./cityConstants";

interface RoadProps {
  position: [number, number, number];
  length: number;
  width: number;
  axis: "x" | "z";
  color?: string;
  emissive?: string;
}

function Road({ position, length, width, axis, color = "#0f1f15", emissive = "#22c55e" }: RoadProps) {
  const args: [number, number] = axis === "z" ? [width, length] : [length, width];
  const halfW = axis === "z" ? width / 2 : width / 2;
  
  return (
    <group position={position}>
      {/* Road base */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={args} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.25} metalness={0.4} roughness={0.6} />
      </mesh>
      
      {/* Curb lines - both sides */}
      {axis === "z" ? (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-width/2 + 0.06, 0.003, 0]}>
            <planeGeometry args={[0.12, length * 0.98]} />
            <meshStandardMaterial color={emissive} emissive={emissive} emissiveIntensity={1.2} toneMapped={false} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[width/2 - 0.06, 0.003, 0]}>
            <planeGeometry args={[0.12, length * 0.98]} />
            <meshStandardMaterial color={emissive} emissive={emissive} emissiveIntensity={1.2} toneMapped={false} />
          </mesh>
        </>
      ) : (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, -width/2 + 0.06]}>
            <planeGeometry args={[length * 0.98, 0.12]} />
            <meshStandardMaterial color={emissive} emissive={emissive} emissiveIntensity={1.2} toneMapped={false} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, width/2 - 0.06]}>
            <planeGeometry args={[length * 0.98, 0.12]} />
            <meshStandardMaterial color={emissive} emissive={emissive} emissiveIntensity={1.2} toneMapped={false} />
          </mesh>
        </>
      )}
      
      {/* Center lane marking */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <planeGeometry args={axis === "z" ? [0.08, length * 0.92] : [length * 0.92, 0.08]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      
      {/* Dashed lane lines for wider roads */}
      {width >= 2.4 && (
        <>
          {Array.from({ length: Math.floor(length / 6) }).map((_, i) => {
            const offset = -length / 2 + 3 + i * 6;
            return (
              <mesh key={`dash-${i}`} rotation={[-Math.PI / 2, 0, 0]} 
                position={axis === "z" ? [0, 0.005, offset] : [offset, 0.005, 0]}>
                <planeGeometry args={axis === "z" ? [0.06, 2] : [2, 0.06]} />
                <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.6} toneMapped={false} />
              </mesh>
            );
          })}
        </>
      )}
    </group>
  );
}

interface SidewalkProps {
  position: [number, number, number];
  length: number;
  width: number;
  axis: "x" | "z";
}

function Sidewalk({ position, length, width, axis }: SidewalkProps) {
  const args: [number, number] = axis === "z" ? [width, length] : [length, width];
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <planeGeometry args={args} />
      <meshStandardMaterial color="#0a1a12" emissive="#22c55e" emissiveIntensity={0.08} metalness={0.3} roughness={0.6} />
    </mesh>
  );
}

function Crosswalk({ position, axis = "x" }: { position: [number, number, number]; axis?: "x" | "z" }) {
  return (
    <group position={position}>
      {[-1.2, -0.6, 0, 0.6, 1.2].map((offset) => (
        <mesh key={offset} rotation={[-Math.PI / 2, 0, 0]} 
          position={axis === "x" ? [0, 0.006, offset] : [offset, 0.006, 0]}>
          <planeGeometry args={axis === "x" ? [2.4, 0.25] : [0.25, 2.4]} />
          <meshStandardMaterial color="#86efac" emissive="#86efac" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Streetlight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 3, 6]} />
        <meshStandardMaterial color="#1a2f1f" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.05, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#86efac" emissive="#22c55e" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      {/* Light glow */}
      <pointLight position={[0, 2.8, 0]} color="#22c55e" intensity={0.8} distance={12} />
    </group>
  );
}

function Roundabout({ position, radius = 6 }: { position: [number, number, number]; radius?: number }) {
  return (
    <group position={position}>
      {/* Road circle */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 1.2, radius + 1.2, 32]} />
        <meshStandardMaterial color="#0f1f15" emissive="#22c55e" emissiveIntensity={0.25} metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Center island */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius - 1.2, 32]} />
        <meshStandardMaterial color="#0a2a15" emissive="#22c55e" emissiveIntensity={0.15} />
      </mesh>
      {/* Curb ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 1.3, radius - 1.1, 32]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius + 1.1, radius + 1.3, 32]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

const HALF = ROAD_HALF;

// Build road descriptors from the canonical constant arrays
const verticalRoads = ROAD_XS.map((x) => ({ x, ...ROAD_STYLE[Math.abs(x)] }));
const horizontalRoads = ROAD_ZS.map((z) => ({ z, ...ROAD_STYLE[Math.abs(z)] }));

// ─── Connector Roads to Districts ──────────────────────────────
// These connect the main grid to all the scattered buildings

interface ConnectorRoad {
  position: [number, number, number];
  length: number;
  width: number;
  axis: "x" | "z";
  color: string;
}

const connectorRoads: ConnectorRoad[] = [
  // Media District (east side, x=90) - connector from x=54 to x=90
  { position: [72, 0.015, -7], length: 36, width: 2.2, axis: "x", color: "#4ade80" },
  { position: [72, 0.015, -62], length: 36, width: 2.2, axis: "x", color: "#4ade80" },
  { position: [72, 0.015, -82], length: 36, width: 2.2, axis: "x", color: "#4ade80" },
  { position: [90, 0.015, -44.5], length: 75, width: 2.2, axis: "z", color: "#4ade80" },
  
  // Military Base (west side, x=-105) - connector from x=-54 to x=-105
  { position: [-79.5, 0.015, -31.5], length: 51, width: 2.2, axis: "x", color: "#4ade80" },
  
  // BotPlane (north, z=107) - connector from z=54 to z=107
  { position: [-85, 0.015, 80.5], length: 53, width: 2.2, axis: "z", color: "#4ade80" },
  
  // BotBeach (southeast, x=66, z=37.5) - connector from grid
  { position: [66, 0.015, 46], length: 17, width: 2, axis: "z", color: "#86efac" },
  { position: [60, 0.015, 37.5], length: 12, width: 2, axis: "x", color: "#86efac" },
  
  // BotLand (southeast corner, x=50-70, z=50-80) - connector from z=54
  { position: [55, 0.015, 67], length: 26, width: 2.2, axis: "z", color: "#dc2626" },
  { position: [55, 0.015, 54], length: 20, width: 2.2, axis: "x", color: "#dc2626" },
  
  // AI District (northeast corner, x=130-138, z=-130 to -122)
  { position: [134, 0.015, -104], length: 52, width: 2.2, axis: "z", color: "#06b6d4" },
  { position: [127, 0.015, -120], length: 26, width: 2.2, axis: "x", color: "#06b6d4" },
  
  // BotPort (east, x=75, z=72) - connector
  { position: [75, 0.015, 63], length: 18, width: 2, axis: "z", color: "#86efac" },
  { position: [64.5, 0.015, 72], length: 21, width: 2, axis: "x", color: "#86efac" },
  
  // BotZoo (north, x=-28, z=95) - connector
  { position: [-28, 0.015, 74.5], length: 41, width: 2, axis: "z", color: "#86efac" },
  { position: [-41, 0.015, 54], length: 26, width: 2, axis: "x", color: "#86efac" },
  
  // BotRocket (northeast, x=75, z=-75) - connector
  { position: [75, 0.015, -64.5], length: 21, width: 2, axis: "z", color: "#86efac" },
  { position: [64.5, 0.015, -75], length: 21, width: 2, axis: "x", color: "#86efac" },
  
  // BotCasino (east, x=52.5, z=-60) - connector
  { position: [52.5, 0.015, -57], length: 6, width: 2, axis: "z", color: "#86efac" },
  { position: [48, 0.015, -60], length: 9, width: 2, axis: "x", color: "#86efac" },
  
  // BotMine (west, x=-75, z=-37.5) - connector
  { position: [-75, 0.015, -46], length: 17, width: 2, axis: "z", color: "#86efac" },
  { position: [-64.5, 0.015, -37.5], length: 21, width: 2, axis: "x", color: "#86efac" },
  
  // BotFarm (northwest, x=-60, z=-61.5) - connector
  { position: [-60, 0.015, -57.75], length: 7.5, width: 2, axis: "z", color: "#86efac" },
  { position: [-57, 0.015, -54], length: 12, width: 2, axis: "x", color: "#86efac" },
  
  // Bothaus (south, x=9, z=-82.5) - connector
  { position: [9, 0.015, -68.25], length: 28.5, width: 2, axis: "z", color: "#86efac" },
  
  // BotBroker (east, x=82.5, z=-9) - connector
  { position: [82.5, 0.015, -9], length: 27, width: 2, axis: "x", color: "#86efac" },
  
  // BotKids (north, x=-9, z=82.5) - connector
  { position: [-9, 0.015, 68.25], length: 28.5, width: 2, axis: "z", color: "#86efac" },
  
  // BotGigs (west, x=-82.5, z=9) - connector
  { position: [-82.5, 0.015, 9], length: 27, width: 2, axis: "x", color: "#86efac" },
  
  // LittleBots (east, x=18, z=40.5) - connector
  { position: [18, 0.015, 47.25], length: 13.5, width: 2, axis: "z", color: "#86efac" },
  { position: [13.5, 0.015, 40.5], length: 9, width: 2, axis: "x", color: "#86efac" },
  
  // CityHall (south, x=19.5, z=-45) - connector
  { position: [19.5, 0.015, -39], length: 12, width: 2, axis: "z", color: "#86efac" },
  
  // Sports district connections
  { position: [-40.5, 0.015, -65.25], length: 21.5, width: 2, axis: "z", color: "#86efac" },
  { position: [40.5, 0.015, 20], length: 28, width: 2, axis: "z", color: "#86efac" },
  
  // Financial district internal roads
  { position: [12, 0.015, -13.5], length: 6, width: 1.8, axis: "z", color: "#4ade80" },
  { position: [0, 0.015, -15], length: 24, width: 1.8, axis: "x", color: "#4ade80" },
  { position: [0, 0.015, 13.5], length: 27, width: 1.8, axis: "x", color: "#4ade80" },
  { position: [-13.5, 0.015, 0], length: 27, width: 1.8, axis: "z", color: "#4ade80" },
  { position: [13.5, 0.015, 0], length: 27, width: 1.8, axis: "z", color: "#4ade80" },
];

// Streetlights along main roads and connectors
const streetlights: [number, number, number][] = [];

// Main grid intersections
for (const v of verticalRoads) {
  if (Math.abs(v.x) > 54) continue; // Only inner grid
  for (const h of horizontalRoads) {
    if (Math.abs(h.z) > 54) continue;
    if (v.x === 0 && h.z === 0) continue;
    const ox = v.x === 0 ? 2.4 : (v.x > 0 ? -1.8 : 1.8);
    const oz = h.z === 0 ? 2.4 : (h.z > 0 ? -1.8 : 1.8);
    streetlights.push([v.x + ox, 0, h.z + oz]);
  }
}

// Streetlights along connector roads
const connectorLights: [number, number, number][] = [
  // Media district
  [72, 0, -20], [72, 0, -35], [72, 0, -50],
  [80, 0, -7], [85, 0, -7],
  [80, 0, -62], [85, 0, -62],
  [80, 0, -82], [85, 0, -82],
  
  // Military base
  [-65, 0, -31.5], [-80, 0, -31.5], [-95, 0, -31.5],
  
  // BotPlane
  [-85, 0, 65], [-85, 0, 80], [-85, 0, 95],
  
  // BotLand
  [55, 0, 60], [55, 0, 75],
  [45, 0, 54], [65, 0, 54],
  
  // AI District
  [134, 0, -110], [134, 0, -125],
  [125, 0, -120], [142, 0, -120],
  
  // Port
  [75, 0, 65], [75, 0, 78],
  
  // Zoo
  [-28, 0, 65], [-28, 0, 80], [-28, 0, 90],
];

streetlights.push(...connectorLights);

// Crosswalks at key intersections
const crosswalks: { pos: [number, number, number]; axis: "x" | "z" }[] = [
  // Main grid
  ...[-54, -27, 27, 54].flatMap(x => [{ pos: [x, 0, 0] as [number, number, number], axis: "z" as const }, { pos: [0, 0, x] as [number, number, number], axis: "x" as const }]),
  
  // Media district
  { pos: [90, 0, -7], axis: "z" },
  { pos: [90, 0, -62], axis: "z" },
  { pos: [90, 0, -82], axis: "z" },
  
  // BotLand
  { pos: [55, 0, 54], axis: "x" },
  
  // AI District
  { pos: [134, 0, -120], axis: "x" },
];

// Roundabouts at major junctions
const roundabouts: { pos: [number, number, number]; radius: number }[] = [
  { pos: [0, 0.01, 0], radius: 5 },
  { pos: [54, 0.01, 54], radius: 4 },
  { pos: [-54, 0.01, 54], radius: 4 },
  { pos: [54, 0.01, -54], radius: 4 },
  { pos: [-54, 0.01, -54], radius: 4 },
];

export default function RoadGrid() {
  return (
    <group>
      {/* Main grid roads */}
      {verticalRoads.map((r) => (
        <Road key={`vr-${r.x}`} position={[r.x, 0.015, 0]} length={HALF * 2} width={r.width} axis="z" emissive={r.color} />
      ))}
      {horizontalRoads.map((r) => (
        <Road key={`hr-${r.z}`} position={[0, 0.015, r.z]} length={HALF * 2} width={r.width} axis="x" emissive={r.color} />
      ))}

      {/* Connector roads to districts */}
      {connectorRoads.map((r, i) => (
        <Road key={`conn-${i}`} position={r.position} length={r.length} width={r.width} axis={r.axis} emissive={r.color} />
      ))}

      {/* Sidewalks along main avenues */}
      <Sidewalk position={[ 2.4, 0.02, 0]} length={HALF * 2} width={1.2} axis="z" />
      <Sidewalk position={[-2.4, 0.02, 0]} length={HALF * 2} width={1.2} axis="z" />
      <Sidewalk position={[0, 0.02,  2.4]} length={HALF * 2} width={1.2} axis="x" />
      <Sidewalk position={[0, 0.02, -2.4]} length={HALF * 2} width={1.2} axis="x" />

      {/* Secondary sidewalks */}
      {[-18, 18].map((x) => (
        <group key={`vs-${x}`}>
          <Sidewalk position={[x + 1.9, 0.02, 0]} length={HALF * 2} width={0.8} axis="z" />
          <Sidewalk position={[x - 1.9, 0.02, 0]} length={HALF * 2} width={0.8} axis="z" />
        </group>
      ))}
      {[-18, 18].map((z) => (
        <group key={`hs-${z}`}>
          <Sidewalk position={[0, 0.02, z + 1.9]} length={HALF * 2} width={0.8} axis="x" />
          <Sidewalk position={[0, 0.02, z - 1.9]} length={HALF * 2} width={0.8} axis="x" />
        </group>
      ))}

      {/* Roundabouts */}
      {roundabouts.map((r, i) => <Roundabout key={`rb-${i}`} position={r.pos} radius={r.radius} />)}

      {/* Crosswalks */}
      {crosswalks.map((c, i) => <Crosswalk key={`cw-${i}`} position={c.pos} axis={c.axis} />)}
      
      {/* Streetlights */}
      {streetlights.map((p, i) => <Streetlight key={`sl-${i}`} position={p} />)}
    </group>
  );
}
