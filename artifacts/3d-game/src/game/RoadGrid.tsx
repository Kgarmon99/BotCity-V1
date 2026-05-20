import * as THREE from "three";

interface RoadProps {
  position: [number, number, number];
  length: number;
  width: number;
  axis: "x" | "z";
  color?: string;
  emissive?: string;
}

function Road({ position, length, width, axis, color = "#052e16", emissive = "#22c55e" }: RoadProps) {
  const args: [number, number] = axis === "z" ? [width, length] : [length, width];
  return (
    <group position={position}>
      {/* Road surface */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={args} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.45} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Center dashed line — emissive strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={axis === "z" ? [0.12, length * 0.92] : [length * 0.92, 0.12]} />
        <meshStandardMaterial color={emissive} emissive={emissive} emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
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
      <meshStandardMaterial color="#0a1f17" emissive="#22c55e" emissiveIntensity={0.12} metalness={0.4} roughness={0.5} />
    </mesh>
  );
}

// Crosswalk: a stripe pattern at an intersection
function Crosswalk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-1.2, -0.6, 0, 0.6, 1.2].map((offset) => (
        <mesh key={offset} rotation={[-Math.PI / 2, 0, 0]} position={[offset, 0.006, 0]}>
          <planeGeometry args={[0.25, 2.4]} />
          <meshStandardMaterial color="#86efac" emissive="#86efac" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

// Streetlight to anchor blocks
function Streetlight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 3, 6]} />
        <meshStandardMaterial color="#0a1f17" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.05, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#86efac" emissive="#22c55e" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

const HALF = 45;       // city half-extent
const MAIN_W = 3;      // main avenue width
const SEC_W = 2.2;     // secondary street width

// Main avenues: at x=0 and z=0
// Secondary streets: at x=±18 and z=±18
// Outer ring streets: at x=±36 and z=±36
const verticalRoads = [
  { x: 0,   w: MAIN_W, color: "#22c55e" },
  { x: 18,  w: SEC_W,  color: "#4ade80" },
  { x: -18, w: SEC_W,  color: "#4ade80" },
  { x: 36,  w: SEC_W,  color: "#86efac" },
  { x: -36, w: SEC_W,  color: "#86efac" },
];

const horizontalRoads = [
  { z: 0,   w: MAIN_W, color: "#4ade80" },
  { z: 18,  w: SEC_W,  color: "#22c55e" },
  { z: -18, w: SEC_W,  color: "#22c55e" },
  { z: 36,  w: SEC_W,  color: "#86efac" },
  { z: -36, w: SEC_W,  color: "#86efac" },
];

const streetlights: [number, number, number][] = [];
// Place streetlights at every intersection of main+secondary roads (skip 0,0 which is plaza)
for (const v of verticalRoads) {
  for (const h of horizontalRoads) {
    if (v.x === 0 && h.z === 0) continue;
    // Offset slightly off the road so they sit on corner sidewalks
    const ox = v.x === 0 ? 2.4 : (v.x > 0 ? -1.8 : 1.8);
    const oz = h.z === 0 ? 2.4 : (h.z > 0 ? -1.8 : 1.8);
    streetlights.push([v.x + ox, 0, h.z + oz]);
  }
}

const crosswalks: [number, number, number][] = [];
// Crosswalks where main avenues meet secondary streets
for (const v of [-36, -18, 18, 36]) {
  crosswalks.push([v, 0, 0]); // east-west avenue crosses vertical street
}
for (const h of [-36, -18, 18, 36]) {
  crosswalks.push([0, 0, h]); // north-south avenue crosses horizontal street
}

export default function RoadGrid() {
  return (
    <group>
      {/* Vertical roads (run along z-axis) */}
      {verticalRoads.map((r) => (
        <Road
          key={`vr-${r.x}`}
          position={[r.x, 0.015, 0]}
          length={HALF * 2}
          width={r.w}
          axis="z"
          emissive={r.color}
        />
      ))}
      {/* Horizontal roads (run along x-axis) */}
      {horizontalRoads.map((r) => (
        <Road
          key={`hr-${r.z}`}
          position={[0, 0.015, r.z]}
          length={HALF * 2}
          width={r.w}
          axis="x"
          emissive={r.color}
        />
      ))}

      {/* Sidewalks flanking main avenues */}
      <Sidewalk position={[ 2.4, 0.02, 0]} length={HALF * 2} width={1.2} axis="z" />
      <Sidewalk position={[-2.4, 0.02, 0]} length={HALF * 2} width={1.2} axis="z" />
      <Sidewalk position={[0, 0.02,  2.4]} length={HALF * 2} width={1.2} axis="x" />
      <Sidewalk position={[0, 0.02, -2.4]} length={HALF * 2} width={1.2} axis="x" />

      {/* Sidewalks flanking secondary streets */}
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

      {/* Crosswalks */}
      {crosswalks.map((p, i) => (
        <Crosswalk key={`cw-${i}`} position={p} />
      ))}

      {/* Streetlights at intersections */}
      {streetlights.map((p, i) => (
        <Streetlight key={`sl-${i}`} position={p} />
      ))}
    </group>
  );
}
